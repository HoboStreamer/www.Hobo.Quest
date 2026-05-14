'use strict';
/**
 * @param {?} canCreateDiscussions
 * @return {undefined}
 */
function ScratchCardsBalanceChange(canCreateDiscussions) {
	
}
/**
 * @param {!Object} options
 * @return {?}
 */
function buttonPressedFromEvent(options) {
	return void 0 === options.buttons ? options.which : options.buttons;
}

var ScratchCards = {
	balance : window.remaining_balance,
	config : {
		actionURL : "ScratchCard",
		balanceNameSingular : "credit",
		balanceNamePlural : "credits",
		scratchLineWidth : 18,
		cellCompletePercentage : .33,
		cellBorderTolerance : .08
	}
};
/**
 * @param {!Object} elem
 * @return {undefined}
 */
var ScratchCard = function(elem) {
	var details = elem.data("game-settings");
	var gameState = elem.data("game-state");
	var options = this;
	this.gameSettings = details;
	this.gameState = gameState;
	this.gameType = details.id;
	/** @type {null} */
	this.gameId = null;
	/** @type {boolean} */
	this.started = null != gameState;
	/** @type {!Array} */
	this.cells = [];
	/** @type {number} */
	this.numCellsToOpen = parseInt(details.cells_to_open, 10);
	this.elScratchCard = elem[0];
	this.$elDialogs = elem.find(".scratch_card_dialog");
	this.elDialogOverlay = elem.find(".scratch_card_dialog_overlay")[0];
	this.elStartGameDialog = elem.find(".scratch_card_start_game_dialog")[0];
	this.elEndGameNoPrizeDialog = elem.find(".scratch_card_end_game_no_prize_dialog")[0];
	this.elEndGameWithPrizeDialog = elem.find(".scratch_card_end_game_with_prize_dialog")[0];
	this.elNoBalanceDialog = elem.find(".scratch_card_no_balance_dialog")[0];
	this.elErrorLoggedOutDialog = elem.find(".scratch_card_logged_out_dialog")[0];
	this.elErrorServerErrorDialog = elem.find(".scratch_card_server_error_dialog")[0];
	this.elErrorFailedRequestDialog = elem.find(".scratch_card_failed_request_dialog")[0];
	/** @type {boolean} */
	this.scratching = false;
	/** @type {number} */
	this.scratchSteps = 0;
	/** @type {number} */
	var xmlContentType = 0;
	elem.find(".scratch_card_cell").each(function() {
		options.cells.push(new ScratchCardCell(options, xmlContentType, $(this)));
		xmlContentType++;
	});
	
	elem.mousemove(function(data) {
		options.mousemove(data);
	});
	
	elem.mouseleave(function(evt) {
		options.mouseleave(evt);
	});
	
	elem.mouseup(function(event) {
		options.mouseup(event);
	});
	
	this.elScratchCard.addEventListener("touchmove", this.touchmove.bind(this), false);
	this.elScratchCard.addEventListener("touchend", this.touchend.bind(this), false);
	this.elScratchCard.addEventListener("touchcancel", this.touchcancel.bind(this), false);
	
	elem.find(".scratch_card_dialog_button").click(function() {
		options.$elDialogs.hide();
		$(options.elDialogOverlay).hide();
	});
	
	elem.find(".scratch_card_dialog_button_play_now").click(function() {
		console.log('clickedd');
		options.start();
	});
	
	elem.find(".scratch_card_dialog_button_play_again").click(function() {
		//console.log('clickedd');
		//options.start();
		document.body.removeChild(elem[0].parentNode.parentNode);
		options = undefined;
		delete options;
	});
	
	elem.find(".scratch_card_dialog_button_refresh").click(function() {
		window.location.reload();
	});
	
	elem.find(".scratch_card_dialog_button_collect_prize").click(function() {
		window.location.href = $(this).data("url");
	});
	
	if (this.started) {
		this.processGameState();
	} else {
		this.showStartGameDialog();
	}
};

ScratchCard.prototype.processGameState = function() {
	var undelete_backup = this;
	var data = this.gameState;
	this.gameId = data.game_id;
	$.each(this.cells, function(row, privMethods) {
		var clojIsReversed = data.assigned_cells ? data.assigned_cells[row] : null;
		if (clojIsReversed) {
			privMethods.assignIcon(clojIsReversed);
		}
	});
	if (data.opened_cells) {
		$.each(data.opened_cells, function() {
			var i = this;
			undelete_backup.cells[i].markOpened();
		});
	}
	if (this.started && data.ended && this.completedCells().length >= this.numCellsToOpen && !this.scratching) {
		undelete_backup.handleEndGame();
	}
};

ScratchCard.prototype.showDialog = function(text) {
	$(text).show();
	$(this.elDialogOverlay).show();
};

ScratchCard.prototype.showStartGameDialog = function() {
	this.showDialog(this.elStartGameDialog);
};

ScratchCard.prototype.showEndGameNoPrizeDialog = function() {
	this.showDialog(this.elEndGameNoPrizeDialog);
};

ScratchCard.prototype.showEndGameWithPrizeDialog = function(n, val) {
	var c = $(this.elEndGameWithPrizeDialog);
	if (c.find(".scratch_card_dialog_body").html(n), c.find(".scratch_card_dialog_button").hide(), val) {
		var e = c.find(".scratch_card_dialog_button_collect_prize");
		e.data("url", val);
		e.show();
	} else {
		c.find(".scratch_card_dialog_button_play_again").show();
	}
	this.showDialog(c);
};

ScratchCard.prototype.checkBalance = function(limit) {
	return !(ScratchCards.balance < limit) || (this.showDialog(this.elNoBalanceDialog), false);
};

ScratchCard.prototype.start = function(from) {
	var self = this;
	if (from || (from = this.gameSettings.cost), !this.checkBalance(from)) {
		return false;
	}
	console.log('start');
	var params = {
		action : "start",
		game_type : this.gameType,
		bet : from
	};
	this.makeRequest(ScratchCards.config.actionURL, params, function(state) {
		console.log('doing reset');
		/** @type {boolean} */
		self.started = true;
		/** @type {!Object} */
		console.log(state);
		self.gameState = state;
		$.each(self.cells, function() {
			this.reset();
		});
		self.processGameState();
		ScratchCardsBalanceChange(ScratchCards.balance);
	});
};

ScratchCard.prototype.openCell = function(location) {
	var client = this;
	var params = {
		action : "open",
		game_type : this.gameType,
		game_id : this.gameId,
		client_open_cells : this.openedCells().length,
		cell_num : location
	};
	this.makeRequest(ScratchCards.config.actionURL, params, function(state) {
		/** @type {!Object} */
		client.gameState = state;
		client.processGameState();
	});
};

ScratchCard.prototype.handleEndGame = function() {
	var i = this.gameState.prize;
	/** @type {number} */
	var p = parseFloat(this.gameState.pay_out, 10);
	if (i) {
		var n = this.generatePrizeText(i, p);
		this.showEndGameWithPrizeDialog(n, i.win_redirect_url);
		ScratchcardSounds.playSound("win");
	} else {
		this.showEndGameNoPrizeDialog();
	}
	ScratchCardsBalanceChange(ScratchCards.balance);
	/** @type {boolean} */
	this.started = false;
};

ScratchCard.prototype.generatePrizeText = function(rank, element) {
	return rank.prize_name ? "You won " + rank.prize_name : "You won " + this.formatPayout(element);
};

ScratchCard.prototype.formatPayout = function(suppressDisabledCheck) {
	return 1 == suppressDisabledCheck ? suppressDisabledCheck + " " + ScratchCards.config.balanceNameSingular : suppressDisabledCheck + " " + ScratchCards.config.balanceNamePlural;
};

let totalScratch = 0;
ScratchCard.prototype.makeRequest = function(remote, callback, error) {
	/*
	var $scope = this;
	$.ajax({
		url : remote,
		type : "POST",
		data : JSON.stringify(callback),
		dataType : "json",
		contentType:"application/json",
		timeout : 1E4,
		success : function(data) {
			if (!data.success) {
				return $scope.handleServerError(data);
			}
			ScratchCards.balance = data.balance;
			error(data.game_state);
		},
		error : function() {
			return $scope.handleServerError({});
		}
	});
	*/
	totalScratch += 1;
	let id = _G.lastTick + '-' + totalScratch;

	try {
		_G.gameServer.send(
			JSON.stringify({
				id: id,
				type: remote,
				data: callback
			})
		);
	} catch(e) { }
	
	_G.ScratchCards[id] = function(data) {
		if (!data.success) {
			return $scope.handleServerError(data);
		}
		ScratchCards.balance = data.balance;
		error(data.game_state);
	}
};

ScratchCard.prototype.handleServerError = function(response) {
	if (response.error) {
		if ("loggedOut" == response.error) {
			this.showDialog(this.elErrorLoggedOutDialog);
		} else {
			var a = $(this.elErrorServerErrorDialog);
			a.find(".scratch_card_dialog_body").html(response.error);
			this.showDialog(a);
		}
	} else {
		this.showDialog(this.elErrorFailedRequestDialog);
	}
	return false;
};

ScratchCard.prototype.mousemove = function(event) {
	if (1 != buttonPressedFromEvent(event)) {
		this.endScratch();
	}
};

ScratchCard.prototype.mouseleave = function(evt) {
	this.endScratch();
};

ScratchCard.prototype.mouseup = function(event) {
	this.endScratch();
};

ScratchCard.prototype.touchend = function(event) {
	this.endScratch();
};

ScratchCard.prototype.touchcancel = function(event) {
	this.endScratch();
};

ScratchCard.prototype.touchmove = function(event) {
	var spv = this;
	var pxcoord = event.touches[0];
	if (pxcoord) {
		if (this.scratching) {
			event.preventDefault();
		}
		var editorPosition = $(this.elScratchCard).offset();
		var r = {
			x : pxcoord.pageX - editorPosition.left,
			y : pxcoord.pageY - editorPosition.top
		};
		$.each(this.cells, function(canCreateDiscussions, target) {
			if (spv.pointWithinCell(r, target)) {
				var event = {
					offsetX : r.x - target.rect.left,
					offsetY : r.y - target.rect.top,
					buttons : 1,
					preventDefault : function() {
					}
				};
				target.mousemove(event);
				event.preventDefault();
			} else {
				target.mouseleave();
			}
		});
	}
};

ScratchCard.prototype.pointWithinCell = function(rect, obj) {
	var r = obj.rect;
	return rect.x > r.left && rect.x < r.right && rect.y > r.top && rect.y < r.bottom;
};

ScratchCard.prototype.startScratch = function() {
	/** @type {boolean} */
	this.scratching = true;
	$(this.elScratchCard).addClass("scratching");
};

ScratchCard.prototype.endScratch = function() {
	/** @type {number} */
	this.scratchSteps = 0;
	/** @type {boolean} */
	this.scratching = false;
	$(this.elScratchCard).removeClass("scratching");
	this.processGameState();
};

ScratchCard.prototype.openedCells = function() {
	/** @type {!Array} */
	var newNodeLists = [];
	return $.each(this.cells, function() {
		if (this.opened) {
			newNodeLists.push(this);
		}
	}), newNodeLists;
};

ScratchCard.prototype.completedCells = function() {
	/** @type {!Array} */
	var newNodeLists = [];
	return $.each(this.cells, function() {
		if (this.complete) {
			newNodeLists.push(this);
		}
	}), newNodeLists;
};

ScratchCard.prototype.cellCompleted = function(event) {
	this.processGameState();
};
/**
 * @param {!Object} distributedAttr
 * @param {?} adjustBySize
 * @param {!Object} c
 * @return {undefined}
 */
var ScratchCardCell = function(distributedAttr, adjustBySize, c) {
	var $scope = this;
	this.cellNum = adjustBySize;
	/** @type {!Object} */
	this.scratchCard = distributedAttr;
	this.elCell = c[0];
	this.elIcon = c.find(".scratch_card_cell_icon")[0];
	this.cnvScratch = c.find(".cnv_scratch")[0];
	this.rect = this.findCellRectInScratchCard();
	$(this.cnvScratch).mousemove(function(data) {
		$scope.mousemove(data);
	}).mouseleave(function(evt) {
		$scope.mouseleave(evt);
	});
	this.reset();
};
ScratchCardCell.prototype.reset = function() {
	$(this.elCell).removeClass().addClass("scratch_card_cell");
	$(this.elIcon).removeClass().addClass("scratch_card_cell_icon");
	/** @type {null} */
	this.lastPoint = null;
	/** @type {boolean} */
	this.opened = false;
	/** @type {boolean} */
	this.complete = false;
	/** @type {null} */
	this.assignedIcon = null;
	/** @type {boolean} */
	this.canvasFinishedInit = false;
	this.initScratchCanvas();
};

ScratchCardCell.prototype.initScratchCanvas = function() {
	var scaledHint = this;
	this.cnvScratch.width = this.elCell.clientWidth;
	this.cnvScratch.height = this.elCell.clientHeight;
	this.cnvScratchContext = this.cnvScratch.getContext("2d");
	var imageToAdd = $(this.scratchCard.elScratchCard).find(".scratch_card_scratch_area_image");
	var src = imageToAdd.css("background-image");
	src = src.replace("url(", "").replace(")", "").replace('"', "").replace('"', "");
	/** @type {!Image} */
	var faviconImage = new Image;
	/**
	 * @return {undefined}
	 */
	faviconImage.onload = function() {
		scaledHint.cnvScratchContext.drawImage(faviconImage, 0, 0, imageToAdd.width(), imageToAdd.height(), 0, 0, scaledHint.cnvScratch.width, scaledHint.cnvScratch.height);
		/** @type {boolean} */
		scaledHint.canvasFinishedInit = true;
		scaledHint.showAssignedIcon();
	};
	faviconImage.src = src;
};

ScratchCardCell.prototype.mousemove = function(t) {
	var p = {
		x : t.offsetX,
		y : t.offsetY
	};
	var textWas = buttonPressedFromEvent(t);
	if (this.scratchCard.started) {
		if (1 == textWas) {
			if (!this.opened && this.scratchCard.openedCells().length >= this.scratchCard.numCellsToOpen) {
				this.markDenied();
			} else {
				if (this.pointWithinUsefulRect(p)) {
					this.open();
				}
				if (this.lastPoint) {
					this.scratchLine(this.lastPoint, p);
				}
				if (this.percentageScratched() > ScratchCards.config.cellCompletePercentage) {
					this.markComplete();
				}
				this.lastPoint = p;
				this.scratchCard.startScratch();
			}
		} else {
			/** @type {null} */
			this.lastPoint = null;
		}
	}
};

ScratchCardCell.prototype.mouseleave = function(evt) {
	/** @type {null} */
	this.lastPoint = null;
};

ScratchCardCell.prototype.findCellRectInScratchCard = function() {
	var elpos = $(this.cnvScratch).offset();
	var cpos = $(this.scratchCard.elScratchCard).offset();
	/** @type {number} */
	var areaOffsetLeft = elpos.left - cpos.left;
	/** @type {number} */
	var clippedTop = elpos.top - cpos.top;
	return {
		left : areaOffsetLeft,
		top : clippedTop,
		right : areaOffsetLeft + $(this.cnvScratch).width(),
		bottom : clippedTop + $(this.cnvScratch).height()
	};
};

ScratchCardCell.prototype.pointWithinUsefulRect = function(page) {
	var time = ScratchCards.config.cellBorderTolerance;
	var rect = {
		left : this.cnvScratch.width * time,
		right : this.cnvScratch.width * (1 - time),
		top : this.cnvScratch.height * time,
		bottom : this.cnvScratch.height * (1 - time)
	};
	return page.x > rect.left && page.x < rect.right && page.y > rect.top && page.y < rect.bottom;
};

ScratchCardCell.prototype.assignIcon = function(isSlidingUp) {
	/** @type {!Object} */
	this.assignedIcon = isSlidingUp;
	this.showAssignedIcon();
};

ScratchCardCell.prototype.showAssignedIcon = function() {
	if (this.assignedIcon && this.canvasFinishedInit) {
		$(this.elIcon).addClass("icon_" + this.assignedIcon);
	}
};

ScratchCardCell.prototype.open = function(footerButtons) {
	if (!this.opened) {
		this.scratchCard.openCell(this.cellNum);
		this.markOpened();
	}
};

ScratchCardCell.prototype.markOpened = function(canCreateDiscussions) {
	/** @type {boolean} */
	this.opened = true;
	$(this.elCell).addClass("opened");
};

ScratchCardCell.prototype.markComplete = function(component) {
	if (!this.complete) {
		/** @type {boolean} */
		this.complete = true;
		$(this.elCell).addClass("complete");
		this.scratchCard.cellCompleted(this.cellNum);
		ScratchcardSounds.playSound("cell_ready");
	}
};

ScratchCardCell.prototype.markDenied = function(canCreateDiscussions) {
	$(this.elCell).addClass("denied");
};

ScratchCardCell.prototype.scratchLine = function(me, e) {
	var newOperators = this.cnvScratchContext;
	/** @type {number} */
	var dx = e.x - me.x;
	/** @type {number} */
	var dy = e.y - me.y;
	/** @type {number} */
	var draggedPage = Math.sqrt(dx * dx + dy * dy);
	/** @type {number} */
	var m_total_iterations = Math.ceil(draggedPage);
	/** @type {number} */
	var m_iterations_done = 0;
	for (; m_iterations_done < m_total_iterations; m_iterations_done++) {
		this.scratchCard.scratchSteps += 1;
		/** @type {number} */
		var offset = m_iterations_done / m_total_iterations;
		var adjust_pos = {
			x : me.x + dx * offset,
			y : me.y + dy * offset
		};
		var textureSize = ScratchCards.config.scratchLineWidth;
		if (this.scratchCard.scratchSteps < 100) {
			/** @type {number} */
			textureSize = textureSize * (this.scratchCard.scratchSteps / 100);
		}
		if (this.scratchCard.scratchSteps > 1E3) {
			/** @type {number} */
			this.scratchCard.scratchSteps = 0;
		}
		this.scratchRect(newOperators, adjust_pos, textureSize);
	}
	ScratchcardSounds.playScratchSound();
};

ScratchCardCell.prototype.scratchRect = function(ctx, pos, height) {
	if (pos = {
		x : Math.floor(pos.x),
		y : Math.floor(pos.y)
	}, !((height = Math.floor(height)) < 2)) {
		/** @type {number} */
		var w = Math.floor(height / 2);
		var result = ctx.getImageData(pos.x - w, pos.y - w, height, height);
		var arr = result.data;
		/** @type {number} */
		var i = 3;
		/** @type {number} */
		var width = 0;
		for (; width < height; width++) {
			/** @type {number} */
			var h = 0;
			for (; h < height; h++) {
				/** @type {number} */
				var availW = Math.abs(w - Math.max(h, width));
				/** @type {number} */
				var n = Math.floor(availW / w * 255);
				/** @type {number} */
				arr[i] = Math.min(arr[i], n);
				/** @type {number} */
				i = i + 4;
			}
		}
		ctx.putImageData(result, pos.x - w, pos.y - w);
	}
};

ScratchCardCell.prototype.percentageScratched = function() {
	var o = this.cnvScratchContext.getImageData(0, 0, this.cnvScratch.width, this.cnvScratch.height).data;
	var a = o.length;
	/** @type {number} */
	var N = a / 4;
	/** @type {number} */
	var delta = 0;
	/** @type {number} */
	var b = 0;
	for (; b < a; b = b + 4) {
		if (o[b + 3] < 90) {
			delta++;
		}
	}
	return delta / N;
};

var ScratchcardSounds = {
	sounds : {},
	init : function() {
		soundManager.setup({
			url : "js/",
			debugMode : false,
			onready : function() {
				ScratchcardSounds.sounds.scratch = soundManager.createSound({
					id : "scratch",
					url : "/assets/sound/scratch_long.mp3",
					loops : 9999,
					autoLoad : true
				});
				ScratchcardSounds.sounds.scratch.setVolume(19);
				
				ScratchcardSounds.sounds.cell_ready = soundManager.createSound({
					id : "cell_ready",
					url : "/assets/sound/cell_ready.mp3",
					autoLoad : true
				});
				ScratchcardSounds.sounds.cell_ready.setVolume(15);
				
				ScratchcardSounds.sounds.win = soundManager.createSound({
					id : "win",
					url : "/assets/sound/win.mp3",
					autoLoad : true
				});
				ScratchcardSounds.sounds.win.setVolume(12);
			}
		});
	},
	playSound : function(id) {
		ScratchcardSounds.sounds[id].play();
	},
	pauseScratchTimer : null,
	stopScratchTimer : null,
	scratchSoundPlaying : false,
	playScratchSound : function() {
		if (!ScratchcardSounds.scratchSoundPlaying) {
			ScratchcardSounds.sounds.scratch.play();
			/** @type {boolean} */
			ScratchcardSounds.scratchSoundPlaying = true;
		}
		
		window.clearTimeout(ScratchcardSounds.pauseScratchTimer);
		window.clearTimeout(ScratchcardSounds.stopScratchTimer);
		
		ScratchcardSounds.pauseScratchTimer = window.setTimeout(ScratchcardSounds.pauseScratchSound, 100);
		ScratchcardSounds.stopScratchTimer = window.setTimeout(ScratchcardSounds.stopScratchSound, 1E3);
	},
	pauseScratchSound : function() {
		ScratchcardSounds.sounds.scratch.pause();
		/** @type {boolean} */
		ScratchcardSounds.scratchSoundPlaying = false;
	},
	stopScratchSound : function() {
		ScratchcardSounds.sounds.scratch.stop();
		/** @type {boolean} */
		ScratchcardSounds.scratchSoundPlaying = false;
	}
};

_G.Scratchers = {};

function createScratcher(game_id, theme, cells, state) {
	if (typeof _G.Scratchers[game_id] !== 'undefined') {
		_G.Scratchers[game_id].gameState = state;
		_G.Scratchers[game_id].processGameState();
		return;
	}
	
	let gamePanel = document.createElement('div');
	gamePanel.className = 'game_panel';
	gamePanel.id = 'game_panel_1';
	document.body.appendChild(gamePanel);
	
	let gameTheme = document.createElement('div');
	gameTheme.className = 'theme theme_' + theme;
	gamePanel.appendChild(gameTheme);
	
	let scratcher = document.createElement('div');
	scratcher.className = 'scratch_card scratch_card_cells' + cells;
	
	scratcher.setAttribute('data-game-settings', JSON.stringify({
		"id":"step1_scratch_3_of_3",
		"total_cells":cells,
		"cells_to_open":cells,
		"cost":"0.000000",
		"autostart":"0"
	}));
	
	let assigned_cells = [];
	for (var i=0; i < cells; i++) {
		assigned_cells.push(1);
	}
	scratcher.setAttribute('data-game-state', JSON.stringify({
		"game_id":"1",
		"pay_in":1,
		"assigned_cells":{},
		"opened_cells":null,
		"ended":"0"
	}));
	gameTheme.appendChild(scratcher);

	let cellCont = document.createElement('div');
	cellCont.className = 'scratch_card_cells_container';
	for (var i=0; i < cells; i++) {
		let cell = document.createElement('div');
		cell.className = 'scratch_card_cell';
		
		let cellIco = document.createElement('div');
		cellIco.className = 'scratch_card_cell_icon';
		cell.appendChild(cellIco);
		
		let cellCanv = document.createElement('canvas');
		cellCanv.className = 'cnv_scratch';
		cell.appendChild(cellCanv);
		
		cellCont.appendChild(cell);
	}
	
	scratcher.appendChild(cellCont);
	
	let clearer = document.createElement('div');
	clearer.className = 'clearer';
	scratcher.appendChild(clearer);
	
	let scratchArea = document.createElement('div');
	scratchArea.className = 'scratch_card_scratch_area_image';
	scratcher.appendChild(scratchArea);
	
	let scratchDialog = document.createElement('div');
	scratchDialog.className = 'scratch_card_dialog_overlay';
	scratcher.appendChild(scratchDialog);
	
	let startDialog = document.createElement('div');
	startDialog.className = 'scratch_card_start_game_dialog scratch_card_dialog';
	
	let startH1 = document.createElement('h1');
	startH1.innerText = 'Pirate Scratcher ' + (cells === 9 ? '3x3' : '3x1');
	startH1.className = 'scratch_card_dialog_title';
	startDialog.appendChild(startH1);
	
	if (state.name) {
		startH1.innerText = state.name;
	}
	
	let startP = document.createElement('p');
	startP.innerText = 'Scratch off the cells, find a match, and win! Click and drag your mouse, or use your finger to scratch the cells until they become green.';
	startDialog.appendChild(startP);
	
	let startButs = document.createElement('div');
	startButs.className = 'scratch_card_dialog_buttons';
	
	let startBut = document.createElement('p');
	startBut.className = 'scratch_card_dialog_button scratch_card_dialog_button_play_now';
	startBut.innerText = 'Play Now!';
	startButs.appendChild(startBut);
	
	startDialog.appendChild(startButs);
	
	scratcher.appendChild(startDialog);
	
	let lostScreen = document.createElement('div');
	lostScreen.className = 'scratch_card_end_game_no_prize_dialog scratch_card_dialog';
	lostScreen.style.display = 'none';
	lostScreen.innerHTML = '<h1 class="scratch_card_dialog_title">You Lost!</h1>\
		<p>Sorry, your scratcher didn\'t have a match :(<br />Better luck next time!</p>\
		<div class="scratch_card_dialog_buttons">\
			<p class="scratch_card_dialog_button scratch_card_dialog_button_play_again">\
				Close\
			</p>\
		</div>';
	scratcher.appendChild(lostScreen);
	
	let winScreen = document.createElement('div');
	winScreen.className = 'scratch_card_end_game_with_prize_dialog scratch_card_dialog';
	winScreen.style.display = 'none';
	winScreen.innerHTML = '<h1 class="scratch_card_dialog_title">You win!</h1>\
		<p class="scratch_card_dialog_body"></p>\
		<div class="scratch_card_dialog_buttons">\
			<p class="scratch_card_dialog_button scratch_card_dialog_button_collect_prize">\
				Collect your prize!\
			</p>\
			<p class="scratch_card_dialog_button scratch_card_dialog_button_play_again">\
				Close\
			</p>\
		</div>';
	scratcher.appendChild(winScreen);
	
	let offScreen = document.createElement('div');
	offScreen.className = 'scratch_card_logged_out_dialog scratch_card_dialog';
	offScreen.style.display = 'none';
	offScreen.innerHTML = '<h1 class="scratch_card_dialog_title">Sorry, you have been logged off</h1>\
		<p><b>No action</b> has been taken on your game, because you\'re not logged in anymore.<p>\
		<p>Please refresh and try again.</p>\
		<div class="scratch_card_dialog_buttons">\
			<p class="scratch_card_dialog_button scratch_card_dialog_button_refresh">\
				Refresh\
			</p>\
		</div>';
	scratcher.appendChild(offScreen);
	
	let balanceScreen = document.createElement('div');
	balanceScreen.className = 'scratch_card_no_balance_dialog scratch_card_dialog';
	balanceScreen.style.display = 'none';
	balanceScreen.innerHTML = '<h1 class="scratch_card_dialog_title">Not enough balance</h1>\
		<p>Sorry, you don\'t have enough balance to play this game.</p>\
		<p>Click on the button below to load more balance on your account and try again.</p>\
		<div class="scratch_card_dialog_buttons">\
			<a href="/load_balance.php" class="scratch_card_dialog_button scratch_card_dialog_button_load_balance">\
				Load Balance\
			</a>\
		</div>';
	scratcher.appendChild(balanceScreen);
	
	let errScreen = document.createElement('div');
	errScreen.className = 'scratch_card_failed_request_dialog scratch_card_dialog';
	errScreen.style.display = 'none';
	errScreen.innerHTML = '<h1 class="scratch_card_dialog_title">Unexpected error</h1>\
		<p>Sorry, we\'re unable to display your scratchcard because your connection to our server was lost.<br />\
			Rest assured that your action was not wasted.</p>\
		<p>Please check your connection and refresh to try again.</p>\
		<div class="scratch_card_dialog_buttons">\
			<p class="scratch_card_dialog_button scratch_card_dialog_button_refresh">\
				Refresh\
			</p>\
		</div>';
	scratcher.appendChild(errScreen);
	
	
	let errScreen2 = document.createElement('div');
	errScreen2.className = 'scratch_card_server_error_dialog scratch_card_dialog';
	errScreen2.style.display = 'none';
	errScreen2.innerHTML = '<h1 class="scratch_card_dialog_title">Game Error</h1>\
		<p class="scratch_card_dialog_body"></p>\
		<div class="scratch_card_dialog_buttons">\
			<p class="scratch_card_dialog_button scratch_card_dialog_button_refresh">\
				Refresh\
			</p>\
		</div>';
	scratcher.appendChild(errScreen2);
	
	_G.Scratchers[game_id] = new ScratchCard($(scratcher));
	
	return _G.Scratchers[game_id];
}

_G.createScratcher = createScratcher;

$(window).on("load", function() {
	ScratchcardSounds.init();
	$(".scratch_card").each(function() {
		new ScratchCard($(this));
	});
});