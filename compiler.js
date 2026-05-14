const fs = require('fs');
const path = require('path');
const minify = require('@node-minify/core');
const uglifyJS = require('@node-minify/uglify-js');

let isCompiling = false,
	isWatching = false,
	waitCompile = false;

function onCodeChange(eventType, filename) {
	console.log('Code change detected: ' + eventType + ' on ' + filename);
	if (eventType === 'change') {
		if (waitCompile) {
			clearTimeout(waitCompile);
		}
		waitCompile = setTimeout(function() {
			waitCompile = false;
			compileCode();
		}, 100);
	}
}

function watchCode() {
	console.log('Watching shared.js for changes');
	if (typeof isWatching === 'object' && typeof isWatching.close === 'function') {
		try {
			isWatching.close();
		} catch(e) { }
	}
	
	isWatching = fs.watch(path.join(__dirname + '/shared.js'), onCodeChange);
}

function compileCode(onFinish) {
	if (isCompiling) {
		return;
	}
	
	isCompiling = true;
	console.log('Compiling server.js and client.js');
	
	fs.readFile(path.join(__dirname, '/shared.js'), 'utf8', function(err, data) {
		if (err) {
			console.error(err);
			return;
		}
		data = data.replace(/(include\(\')((.|\n|\r|\r\n)*?)(\'\))/g, (match, $1, $2) => {
		   return fs.readFileSync(__dirname + '/' + $2, 'utf8');
		});
		
		try {
			fs.unlinkSync(__dirname + '/client.js');
		} catch(e) { }

		let serverCode = data.replace(/(\/\*IF\_CLIENT\*\/)((.|\n|\r|\r\n)*?)(\/\*IF\_END\*\/)/g, ' ').replace(/(\/\*IF\_SERVER\*\/)((.|\n|\r|\r\n)*?)(\/\*IF\_END\*\/)/g, ' $2 '),
			clientCode = data.replace(/(\/\*IF\_SERVER\*\/)((.|\n|\r|\r\n)*?)(\/\*IF\_END\*\/)/g, ' ').replace(/(\/\*IF\_CLIENT\*\/)((.|\n|\r|\r\n)*?)(\/\*IF\_END\*\/)/g, ' $2 ');
			
		console.log('Writing server.js and client.js');
		
		fs.writeFileSync(__dirname + '/client-b.js', clientCode);
		
		fs.copyFileSync(__dirname + '/client-b.js', __dirname + '/public/client.js');
			
		fs.writeFileSync(__dirname + '/server.js', serverCode);
		
		minifyClient(onFinish);
	});
}

function minifyClient(onFinish) {
	// Check if md5 of client.js changed, if so minify again with mangle options
	if (!fs.existsSync(path.join(__dirname, '/client.md5')) || fs.readFileSync(path.join(__dirname, '/client.md5'), 'utf8') !== require('crypto').createHash('md5').update(fs.readFileSync(path.join(__dirname, '/client-b.js'))).digest('hex')) {
		console.log('client-b.js has changed since last minify. Minifying again with mangle options...');
		minify({
			compressor: uglifyJS,
			input: path.join(__dirname, '/client-b.js'),
			output: path.join(__dirname, '/client.js'),
			callback: function (err, min) {
				watchCode();
				isCompiling = false;
				if (err) {
					console.log(err);
				} else {
					console.log('Minified client.js')
					fs.copyFileSync(path.join(__dirname, '/client.js'), path.join(__dirname, '/public/client.js'));
					if (typeof onFinish === 'function') {
						onFinish();
					}
				}
			}
		});
		fs.writeFileSync(path.join(__dirname, '/client.md5'), require('crypto').createHash('md5').update(fs.readFileSync(path.join(__dirname, '/client-b.js'))).digest('hex'));
	} else {
		console.log('client-b.js has not changed since last minify. Skipping minify.');
		fs.copyFileSync(path.join(__dirname, '/client-b.js'), path.join(__dirname, '/client.js'));
		fs.copyFileSync(path.join(__dirname, '/client.js'), path.join(__dirname, '/public/client.js'));
		isCompiling = false;
		if (typeof onFinish === 'function') {
			onFinish();
		}
	}

	/*
	console.log('Minifying client.js')

	minify({
	  compressor: uglifyJS,
	  input: path.join(__dirname, '/client-b.js'),
	  output: path.join(__dirname, '/client.js'),
	  callback: function (err, min) {
		watchCode();
		
		isCompiling = false;
		if (err) {
			console.log(err);
		} else {
			console.log('Minified client.js')
			fs.copyFileSync(path.join(__dirname, '/client.js'), path.join(__dirname, '/public/client.js'));
			if (typeof onFinish === 'function') {
				onFinish();
			}
		}
	  }
	});
	*/

}

(function() {
	watchCode();

	// Check if the client.js and server.js files exist. If not, compile them.
	if (!fs.existsSync(path.join(__dirname, '/client.js')) || !fs.existsSync(path.join(__dirname, '/server.js'))) {
		compileCode(function() {
			process.send('Ready');
		});
	}

	// Check if md5 of shared.js changed since last run
	if (!fs.existsSync(path.join(__dirname, '/shared.md5')) || fs.readFileSync(path.join(__dirname, '/shared.md5'), 'utf8') !== require('crypto').createHash('md5').update(fs.readFileSync(path.join(__dirname, '/shared.js'))).digest('hex')) {
		console.log('shared.js has changed since last compile. Compiling...');
		compileCode(function() {
			fs.writeFileSync(path.join(__dirname, '/shared.md5'), require('crypto').createHash('md5').update(fs.readFileSync(path.join(__dirname, '/shared.js'))).digest('hex'));
			process.send('Ready');
		});
	} else {
		console.log('shared.js has not changed since last compile. Skipping compile.');
		process.send('Ready');
	}
})();