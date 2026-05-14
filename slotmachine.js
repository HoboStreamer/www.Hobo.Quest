'use strict';
var slotMachine = {
	stripHeight : 720,
	alignmentOffset : 86,
	firstReelStopTime : 667,
	secondReelStopTime : 575,
	thirdReelStopTime : 568,
	payoutStopTime : 700,
	reelSpeedDifference : 0,
	reelSpeed1Delta : 100,
	reelSpeed1Time : 0,
	reelSpeed2Delta : 100,
	positioningTime : 200,
	bounceHeight : 200,
	bounceTime : 1e3,
	winningsFormatPrefix : "",
	spinURL : "/slots/spin.php",
	curBet : minBet,
	soundEnabled : true,
	sounds : {},
	init : function() {
		$("#betSpinUp").click(function() {
			slotMachine.change_bet(1);
		});
		$("#betSpinDown").click(function() {
			slotMachine.change_bet(-1);
		});
		$("#spinButton").click(function() {
			slotMachine.spin();
		});
		$("#soundOffButton").click(function() {
			slotMachine.toggle_sound();
		});
		if (slotMachine.soundEnabled) {
			soundManager.setup({
				url : "/js/",
				onready : function() {
					slotMachine.sounds.payout = soundManager.createSound({
						id : "payout",
						url : "sounds/payout.mp3"
					});
					slotMachine.sounds.fastpayout = soundManager.createSound({
						id : "fastpayout",
						url : "sounds/fastpayout.mp3"
					});
					slotMachine.sounds.spinning = soundManager.createSound({
						id : "spinning",
						url : "sounds/spinning.mp3"
					});
				}
			});
		}
	},
	change_bet : function(actual_score) {
		slotMachine.curBet += actual_score;
		/** @type {number} */
		slotMachine.curBet = Math.min(Math.max(minBet, slotMachine.curBet), maxBet);
		slotMachine.show_won_state(false);
		$("#bet").html(slotMachine.curBet);
		$("#prizes_list .tdPayout").each(function() {
			var jQHeader = $(this);
			jQHeader.html((jQHeader.attr("data-payoutPrefix") || "") + parseInt(jQHeader.attr("data-basePayout"), 10) * slotMachine.curBet + (jQHeader.attr("data-payoutSuffix") || ""));
		});
	},
	toggle_sound : function() {
		if ($("#soundOffButton").hasClass("off")) {
			soundManager.unmute();
		} else {
			soundManager.mute();
		}
		$("#soundOffButton").toggleClass("off");
	},
	spin : function() {
		/** @type {number} */
		var likeCount = parseInt($("#credits").html(), 10);
		if ($("#spinButton").hasClass("disabled")) {
			return false;
		}
		slotMachine.show_won_state(false);
		$("#spinButton").addClass("disabled");
		$("#credits").html(likeCount - slotMachine.curBet);
		slotMachine._start_reel_spin(1, 0);
		slotMachine._start_reel_spin(2, slotMachine.secondReelStopTime);
		slotMachine._start_reel_spin(3, slotMachine.secondReelStopTime + slotMachine.thirdReelStopTime);
		try {
			slotMachine.sounds.spinning.play();
		} catch (a) {
		}
		/**
		 * @return {undefined}
		 */
		var cb = function() {
			/** @type {number} */
			var renewTokenIn = 0;
			window.setTimeout(function() {
				slotMachine._stop_reel_spin(1, self.reels[0]);
			}, renewTokenIn);
			renewTokenIn = renewTokenIn + slotMachine.secondReelStopTime;
			window.setTimeout(function() {
				slotMachine._stop_reel_spin(2, self.reels[1]);
			}, renewTokenIn);
			renewTokenIn = renewTokenIn + slotMachine.thirdReelStopTime;
			window.setTimeout(function() {
				slotMachine._stop_reel_spin(3, self.reels[2]);
			}, renewTokenIn);
			renewTokenIn = renewTokenIn + slotMachine.payoutStopTime;
			window.setTimeout(function() {
				slotMachine.end_spin(self);
			}, renewTokenIn);
		};
		/** @type {boolean} */
		var pending = false;
		/** @type {null} */
		var self = null;
		window.setTimeout(function() {
			/** @type {boolean} */
			pending = true;
			if (null != self) {
				cb();
			}
		}, slotMachine.firstReelStopTime);
		$.ajax({
			url : slotMachine.spinURL,
			type : "POST",
			data : {
				bet : slotMachine.curBet,
				windowID : windowID,
				machine_name : machineName
			},
			dataType : "json",
			timeout : 1e4,
			success : function(me) {
				return me.success ? (self = me, void(1 == pending && cb())) : (slotMachine.abort_spin_abruptly(), "loggedOut" == me.error ? $("#loggedOutMessage").show() : alert(me.error), false);
			},
			error : function() {
				slotMachine.abort_spin_abruptly();
				$("#failedRequestMessage").show();
			}
		});
	},
	show_won_state : function(a, b, status) {
		if (a) {
			if (status) {
				$("#PageContainer, #SlotsOuterContainer").addClass(status);
			} else {
				$("#PageContainer, #SlotsOuterContainer").addClass("won");
			}
			$("#trPrize_" + b).addClass("won");
		} else {
			$(".trPrize").removeClass("won");
			$("#PageContainer, #SlotsOuterContainer").removeClass();
			$("#lastWin").html("");
		}
	},
	end_spin : function(item) {
		if (null != item.prize) {
			slotMachine.show_won_state(true, item.prize.id, item.prize.winType);
			slotMachine._increment_payout_counter(item);
		} else {
			slotMachine._end_spin_after_payout(item);
		}
	},
	_format_winnings_number : function(a) {
		return a == Math.floor(a) ? a : a.toFixed(2);
	},
	_end_spin_after_payout : function(data) {
		if ("undefined" != typeof data.credits) {
			$("#credits").html(data.credits);
		}
		if ("undefined" != typeof data.dayWinnings) {
			$("#dayWinnings").html(slotMachine.winningsFormatPrefix + slotMachine._format_winnings_number(data.dayWinnings));
		}
		if ("undefined" != typeof data.lifetimeWinnings) {
			$("#lifetimeWinnings").html(slotMachine.winningsFormatPrefix + slotMachine._format_winnings_number(data.lifetimeWinnings));
		}
		if ("undefined" != typeof data.lastWin) {
			$("#lastWin").html(data.lastWin);
		}
		/** @type {number} */
		var whiteRating = parseInt($("#credits").html(), 10);
		if (whiteRating > 0) {
			$("#spinButton").removeClass("disabled");
		}
	},
	_increment_payout_counter : function(item) {
		var result = {
			credits : item.credits - item.prize.payoutCredits,
			dayWinnings : item.dayWinnings - item.prize.payoutWinnings,
			lifetimeWinnings : item.lifetimeWinnings - item.prize.payoutWinnings
		};
		/** @type {number} */
		var c = Math.max(item.credits - result.credits, item.dayWinnings - result.dayWinnings);
		/** @type {string} */
		var i = c > 80 ? "fastpayout" : "payout";
		/** @type {number} */
		var CLEAR_BUFFER_DELAY_MS = c > 80 ? 50 : 200;
		try {
			slotMachine.sounds[i].play({
				onfinish : function() {
					this.play();
				}
			});
		} catch (a) {
		}
		var slideshowtimer = window.setInterval(function() {
			/** @type {boolean} */
			var c = false;
			if ($.each(["credits", "dayWinnings", "lifetimeWinnings"], function(canCreateDiscussions, i) {
				if (result[i] < item[i]) {
					result[i] += 1;
					/** @type {number} */
					result[i] = Math.min(result[i], item[i]);
					if ("credits" != i) {
						$("#" + i).html(slotMachine.winningsFormatPrefix + slotMachine._format_winnings_number(result[i]));
					} else {
						$("#" + i).html(result[i]);
					}
					/** @type {boolean} */
					c = true;
				}
			}), !c) {
				window.clearInterval(slideshowtimer);
				try {
					slotMachine.sounds[i].stop();
				} catch (a) {
				}
				slotMachine._end_spin_after_payout(item);
			}
		}, CLEAR_BUFFER_DELAY_MS);
	},
	abort_spin_abruptly : function() {
		slotMachine._stop_reel_spin(1, null);
		slotMachine._stop_reel_spin(2, null);
		slotMachine._stop_reel_spin(3, null);
		try {
			slotMachine.sounds.spinning.stop();
		} catch (a) {
		}
	},
	_start_reel_spin : function(size, filters) {
		/** @type {number} */
		var tools_id = Date.now();
		var $element = $("#reel" + size);
		$element.css({
			top : -(Math.random() * slotMachine.stripHeight * 2)
		});
		/** @type {number} */
		var currentHeight = parseInt($element.css("top"), 10);
		/**
		 * @return {undefined}
		 */
		var f = function() {
			$element.css({
				top : currentHeight
			});
			currentHeight = currentHeight + (Date.now() < tools_id + slotMachine.reelSpeed1Time + filters ? slotMachine.reelSpeed1Delta : slotMachine.reelSpeed2Delta);
			currentHeight = currentHeight + size * slotMachine.reelSpeedDifference;
			if (currentHeight > 0) {
				/** @type {number} */
				currentHeight = 2 * -slotMachine.stripHeight;
			}
		};
		var fields = window.setInterval(f, 20);
		$element.data("spinTimer", fields);
	},
	_stop_reel_spin : function(a, be) {
		var c = $("#reel" + a);
		var slideshowtimer = c.data("spinTimer");
		if (window.clearInterval(slideshowtimer), c.data("spinTimer", null), null != be) {
			/** @type {number} */
			var e = slotMachine.stripHeight / window.numIconsPerReel;
			var top = -slotMachine.stripHeight - (be - 1) * e + slotMachine.alignmentOffset;
			c.css({
				top : top - slotMachine.stripHeight
			}).animate({
				top : top + slotMachine.bounceHeight
			}, slotMachine.positioningTime, "linear", function() {
				c.animate({
					top : top
				}, slotMachine.bounceTime, "easeOutElastic");
			});
		}
	}
};

slotMachine.init();
