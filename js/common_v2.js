var smjq = jQuery;

var ghost = {
	action: [
		['shownotice', '显示公告'],
		['chatTochuncai', '聊&nbsp;&nbsp;&nbsp;&nbsp;天'],
		['foods', '吃 零 食'],
		['meetparents', '见我家长'],
		['lifetimechuncai', '生存时间']
	],

	data: {
		_weichuncai_path: 'data.json'

	}

	init: function(data) {
		if (data._weichuncai_path) {
			this.data._weichuncai_path = data._weichuncai_path;
		}

		this.createFace();
	}

	shownotice: function(closeChuncaiMenu) {
		this.getdata("getnotice");
		this.setFace(1);
		closeChuncaiMenu();
	},

	chatTochuncai: function() {
		talk_html = '';
		talk_html += '	<div id="addinput">';
		talk_html += '		<div id="inp_l">';
		talk_html += '			<input id="talk" type="text" name="mastersay" value="" onkeypress="if(event.keyCode==13) {talkto.click();return false;}" />';
		talk_html += '			<input id="talkto" name="talkto" type="button" value=" " />';
		talk_html += '		</div>';
		talk_html += '		<div id="inp_r">X</div>';
		talk_html += '	</div>';

		smjq("#smchuncai").append(talk_html);
		this.showInput();
	},

	foods: function(closeChuncaiMenu, closeNotice) {
		closeChuncaiMenu();
		closeNotice();
		this.getdata("foods");
	}

	meetparents: function(closeChuncaiMenu, closeNotice) {
		closeChuncaiMenu();
		closeNotice();
		//smjq("#getmenu").css("display", "none");
		this.chuncaiSay("马上就跳转到我父母去了哦～～～");
		this.setFace(2);
		setTimeout(function() {
			window.open('http://www.lmyoaoa.com/inn/archives/4504/');
			//window.location.href = _site_path+'/wp-admin/';
		}, 2000);
	},

	lifetimechuncai: function(closeChuncaiMenu, closeNotice) {
		closeChuncaiMenu();
		closeNotice();
		this.setFace(2);
		this.getdata('showlifetime');
	},

	getdata: function(el, id) {
		smjq.ajax({
			type: 'GET',
			url: this.data._weichuncai_path,
			cache: 'false',
			dataType: 'html',
			contentType: 'application/json; charset=utf8',
			beforeSend: function() {
				//smjq("#dialog_chat").fadeOut("normal");
				smjq("#tempsaying").css('display', "none");
				smjq("#dialog_chat_loading").fadeIn("normal");
			},
			success: function(data) {
				smjq("#dialog_chat_loading").css('display', "none");
				//smjq("#dialog_chat").fadeIn("normal");
				smjq("#tempsaying").css('display', "");
				var dat = eval("(" + data + ")");
				if (el == 'defaultccs') {
					chuncaiSay(dat.defaultccs);
				} else if (el == 'getnotice') {
					chuncaiSay(dat.notice);
					this.setFace(1);
				} else if (el == 'showlifetime') {

					var showlifetime = dat.showlifetime.replace(/\$time_str\$/, '许久');
					if (!isNaN(parseInt(dat.lifetime[dat.defaultccs]))) {
						var this_time = new Date();
						var build_time = new Date(dat.lifetime[dat.defaultccs]);
						var time_str = this.tools.dateDiff(build_time, this_time);

						showlifetime = dat.showlifetime.replace(/\$time_str\$/, time_str);
					}

					chuncaiSay(showlifetime);
				} else if (el == 'talking') {
					var talkcon = smjq("#talk").val();
					var i = this.tools.in_array(talkcon, dat.ques);
					var types = typeof(i);
					if (types != 'boolean') {
						chuncaiSay(dat.ans[i]);
						this.setFace(2);
					} else {
						chuncaiSay('.......................嗯？');
						this.setFace(3);
					}
					clearInput();
				} else if (el == 'foods') {
					var str = '';
					var arr = dat.foods;
					var preg = /function/;
					for (var i in arr) {
						if (arr[i] != '' && !preg.test(arr[i])) {
							str += '<ul id="f' + i + '" class="eatfood" onclick="eatfood(this.id)">' + arr[i] + '</ul>';
						}
					}
					chuncaiSay(str);
				} else if (el = "eatsay") {
					var str = dat.eatsay[id];
					chuncaiSay(str);
					this.setFace(2);
				} else if (el = "talkself") {
					var arr = dat.talkself;
					return arr;
				}
			},
			error: function() {
				chuncaiSay('好像出错了，是什么错误呢...请联系管理猿');
			}
		});
	},

	showInput: function(closeChuncaiMenu, closeNotice) {
		closeChuncaiMenu();
		closeNotice();
		this.chuncaiSay("............?");
		//this.setFace(1);
		smjq("#addinput").css("display", "block");
	},

	closeInput: function() {
		this.setFace(3);
		smjq("#addinput").css("display", "none");
	},

	inp_r: function() {
		this.closeInput();
		this.chuncaiSay('不聊天了吗？(→_→)');
		this.setFace(3);
	},

	talkto: function() {
		this.getdata("talking");
	},

	clearInput: function() {
		document.getElementById("talk").value = '';
	},

	createFace: function(a, b, c) {
		smjq("head").append('<div id="hiddenfaces"><img id="hf1" src="' + a + '" /><img id="hf2" src="' + b + '" /><img id="hf3" src="' + c + '" /></div>');
		this.setFace(1);
	},

	setFace: function(num) {
		//obj = document.getElementById("hf" + num).src;
		obj = smjq('#hf' + num).attr('src');
		smjq("#chuncaiface").attr("style", "background:url(" + obj + ") no-repeat scroll 50% 0% transparent; width:" + imagewidth + "px;height:" + imageheight + "px;");
	},

	chuncaiMenu: function() {
		//smjq("#showchuncaimenu").slideDown('fast').show();
		this.clearChuncaiSay();
		this.closeInput();
		this.chuncaiSay("准备做什么呢？");
		smjq("#showchuncaimenu").css("display", "block");
		smjq("#getmenu").css("display", "none");
		smjq("#chuncaisaying").css("display", "none");
	},

	closeChuncaiMenu: function() {
		this.clearChuncaiSay();
		smjq("#showchuncaimenu").css("display", "none");
		//smjq("#chuncaisaying").css("display", "block");
		this.showNotice();
		smjq("#getmenu").css("display", "block");
	},

	showNotice: function() {
		smjq("#chuncaisaying").css("display", "block");
	},

	chuncaiSay: function(s, typeWords) {
		this.clearChuncaiSay();
		smjq("#tempsaying").append(s);
		smjq("#tempsaying").css("display", "block");
		weichuncai_text = s;
		typeWords();
	},

	clearChuncaiSay: function() {
		smjq("#tempsaying").html('');
	},

	closeNotice: function() {
		smjq("#chuncaisaying").css("display", "none");
	},

	eatfood: function(obj, setCookie) {
		var gettimes = getCookie("eattimes");
		if (parseInt(gettimes) > parseInt(9)) {
			this.chuncaiSay("主人是个大混蛋！！");
			this.setFace(3);
			this.closechuncai_evil();
		} else if (parseInt(gettimes) > parseInt(7)) {
			this.chuncaiSay(".....................肚子要炸了，死也不要再吃了～～！！！TAT");
			this.setFace(3);
		} else if (parseInt(gettimes) == parseInt(5)) {
			this.chuncaiSay("我已经吃饱了，不要再吃啦......");
			this.setFace(3);
		} else if (parseInt(gettimes) == parseInt(3)) {
			this.chuncaiSay("多谢款待，我吃饱啦～～～ ╰（￣▽￣）╭");
			this.setFace(2);
		} else {
			var id = obj.replace("f", '');
			this.getdata('eatsay', id);
		}
		eattimes++;
		setCookie("eattimes", eattimes, 60 * 10 * 1000);
	},

	closechuncai_evil: function(stopTalkSelf) {
		stopTalkSelf();
		smjq("#showchuncaimenu").css("display", "none");
		setTimeout(function() {
			smjq("#smchuncai").fadeOut(1200);
			smjq("#callchuncai").css("display", "block");
		}, 2000);
	},
};

var WCC = {

	data: {
		talktime: 0,
		talkself: 60, //设置自言自语频率（单位：秒）
		talkobj: {},
		tsi: 0,
		eattimes: 0, //吃了几次
		timenum: 0,
		tol: 0,
		//10分钟后页面没有响应就停止活动
		goal: 10 * 60,
		_typei: 0,
		weichuncai_text: '',

		_weichuncai_path: "data.json", //请求的数据文件地址
		imagewidth: '240', //伪春菜的大小
		imageheight: '240', //伪春菜的大小

		ghost: "default",

		talkself_arr: [
			//话语，脸部的表情
			["白日依山尽，黄河入海流，欲穷千里目，更上.....一层楼？", "1"],
			["我看见主人熊猫眼又加重了！", "3"],
			["我是不是很厉害呀～～？", "2"],
			["5555...昨天有个小孩子跟我抢棒棒糖吃.....", "3"],
			["昨天我好像看见主人又在众人之前卖萌了哦～", "2"]
		]
	},

	init: function(data) {

		this.data = this.tools.composition(this.data, data);
		if (this.data.talkself_user) {
			this.data.talkself_arr = this.data.talkself_arr.concat(this.data.talkself_user);
			delete this.data.talkself_user;
		}

		var getwidth = this.tools.getCookie("historywidth");
		var getheight = this.tools.getCookie("historyheight");
		if (getwidth != null && getheight != null) {
			var width = getwidth;
			var height = getheight;
		} else {
			var width = document.documentElement.clientWidth - 200 - imagewidth;
			var height = document.documentElement.clientHeight - 180 - imageheight;
		}

		var cwidth = document.documentElement.clientWidth - 100;
		var cheight = document.documentElement.clientHeight - 20;
		//var height = document.body.clientHeight-200;
		var moveX = 0;
		var moveY = 0;
		var moveTop = 0;
		var moveLeft = 0;
		var moveable = false;
		var docMouseMoveEvent = document.onmousemove;
		var docMouseUpEvent = document.onmouseup;

		var wcc_html = '';
		wcc_html += '<div id="smchuncai" onfocus="this.blur();" style="color:#626262;z-index:999;">';
		wcc_html += '	<div id="chuncaiface"></div>';
		wcc_html += '	<div id="dialog_chat">';
		wcc_html += '		<div id="chat_top"></div>';
		wcc_html += '		<div id="dialog_chat_contents">';
		wcc_html += '			<div id="dialog_chat_loading"></div>';
		wcc_html += '			<div id="tempsaying"></div>';
		wcc_html += '			<div id="showchuncaimenu">';

		for (var i = ghost.action.length - 1; i >= 0; i--) {
			wcc_html += '				<ul class="wcc_mlist" id="' + ghost.action[i][0] + '">' + ghost.action[i][1] + '</ul>';
		};

		// '				<ul class="wcc_mlist" id="shownotice">显示公告</ul>'+
		// '				<ul class="wcc_mlist" id="chatTochuncai">聊&nbsp;&nbsp;&nbsp;&nbsp;天</ul>'+
		// '				<ul class="wcc_mlist" id="foods">吃 零 食</ul>'+
		// '				<ul class="wcc_mlist" id="blogmanage">见我家长</ul>'+
		// '				<ul class="wcc_mlist" id="lifetimechuncai">生存时间</ul>'+
		wcc_html += '				<ul class="wcc_mlist" id="closechuncai">关闭春菜</ul>' +
			wcc_html += '			</div>';
		wcc_html += '			<div>';
		wcc_html += '				<ul id="chuncaisaying"></ul>';
		wcc_html += '			</div>';
		wcc_html += '			<div id="getmenu"></div>';
		wcc_html += '		</div>';
		wcc_html += '		<div id="chat_bottom"></div>';
		wcc_html += '	</div>';

		wcc_html += '</div>';
		wcc_html += '<div id="callchuncai">召唤春菜</div>';

		return;

		smjq("body").append(wcc_html);
		//判断春菜是否处于隐藏状态
		var is_closechuncai = this.tools.getCookie("is_closechuncai");
		if (is_closechuncai == 'close') {
			closechuncai_init();
		}
		//设置初始状态
		getdata("getnotice");
		setFace(1);

		smjq("#smchuncai").css('left', width + 'px');
		smjq("#smchuncai").css('top', height + 'px');
		smjq("#smchuncai").css('width', imagewidth + 'px');
		smjq("#smchuncai").css('height', imageheight + 'px');
		smjq("#callchuncai").attr("style", "top:" + cheight + "px; left:" + cwidth + "px; text-align:center;");

		smcc = document.getElementById("smchuncai");
		smcc.onmousedown = function() {
			var ent = getEvent();
			moveable = true;
			moveX = ent.clientX;
			moveY = ent.clientY;
			var obj = document.getElementById("smchuncai");
			moveTop = parseInt(obj.style.top);
			moveLeft = parseInt(obj.style.left);
			if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {
				window.getSelection().removeAllRanges();
			}
			document.onmousemove = function() {
				if (moveable) {
					var ent = getEvent();
					var x = moveLeft + ent.clientX - moveX;
					var y = moveTop + ent.clientY - moveY;
					var w = 200;
					var h = 200; //w,h为浮层宽高
					obj.style.left = x + "px";
					obj.style.top = y + "px";
				}
			};
			document.onmouseup = function() {
				if (moveable) {
					var historywidth = obj.style.left;
					var historyheight = obj.style.top;
					historywidth = historywidth.replace('px', '');
					historyheight = historyheight.replace('px', '');
					this.tools.setCookie("historywidth", historywidth, 60 * 60 * 24 * 30 * 1000);
					this.tools.setCookie("historyheight", historyheight, 60 * 60 * 24 * 30 * 1000);
					document.onmousemove = docMouseMoveEvent;
					document.onmouseup = docMouseUpEvent;
					moveable = false;
					moveX = 0;
					moveY = 0;
					moveTop = 0;
					moveLeft = 0;
				}
			}
		};
		smjq("#getmenu").click(function() {
			chuncaiMenu();
			setFace(1);
		});
		smjq("#closechuncai").click(function() {
			setFace(3);
			closechuncai();
		});
		smjq("#callchuncai").click(function() {
			setFace(2);
			callchuncai();
			this.tools.setCookie("is_closechuncai", '', 60 * 60 * 24 * 30 * 1000);
		});

		document.onmousemove = function() {
			stoptime();
			tol = 0;
			setTime();
			//chuncaiSay("啊，野生的主人出现了！ ～～～O口O");
		}
		talkSelf(talktime);
		document.getElementById("smchuncai").onmouseover = function() {
			if (talkobj) {
				clearTimeout(talkobj);
			}
			talktime = 0;
			talkSelf(talktime);
		}
	},

	talkSelf: function(talktime) {
		talktime++;
		var tslen = talkself_arr.length;
		/*	if(parseInt(tsi) >= parseInt(tslen)){
					tsi = 0;
				}*/
		var yushu = talktime % talkself;
		if (parseInt(yushu) == parseInt(9)) {
			closeChuncaiMenu();
			closeNotice();
			closeInput();
			tsi = Math.floor(Math.random() * talkself_arr.length + 1) - 1;
			chuncaiSay(talkself_arr[tsi][0]);
			setFace(talkself_arr[tsi][1]);
		}
		talkobj = window.setTimeout("talkSelf(" + talktime + ")", 1000);
	},

	stopTalkSelf: function() {
		if (talkobj) {
			clearTimeout(talkobj);
		}
	},

	arrayShuffle: function(arr) {
		var result = [],
			len = arr.length;
		while (len--) {
			result[result.length] = arr.splice(Math.floor(Math.random() * (len + 1)), 1);
		}
		return result;
	},


	typeWords: function() {
		var p = 1;
		var str = weichuncai_text.substr(0, _typei);
		var w = weichuncai_text.substr(_typei, 1);
		if (w == "<") {
			str += weichuncai_text.substr(_typei, weichuncai_text.substr(_typei).indexOf(">") + 1);
			p = weichuncai_text.substr(_typei).indexOf(">") + 1;
		}
		_typei += p;
		//document.getElementById("tempsaying").innerHTML = str;
		smjq('#tempsaying').html(str);
		txtst = setTimeout("typeWords()", 20);
		if (_typei > weichuncai_text.length) {
			clearTimeout(txtst);
			_typei = 0;
		}
	},

	getEvent: function() {
		return window.event || arguments.callee.caller.arguments[0];
	},




	closechuncai: function() {
		stopTalkSelf();
		chuncaiSay("记得再叫我出来哦...");
		smjq("#showchuncaimenu").css("display", "none");
		setTimeout(function() {
			smjq("#smchuncai").fadeOut(1200);
			smjq("#callchuncai").css("display", "block");
		}, 2000);
		//保存关闭状态的春菜
		this.tools.setCookie("is_closechuncai", 'close', 60 * 60 * 24 * 30 * 1000);
	},

	
	closechuncai_init: function() {
		stopTalkSelf();
		smjq("#showchuncaimenu").css("display", "none");
		setTimeout(function() {
			smjq("#smchuncai").css("display", "none");
			smjq("#callchuncai").css("display", "block");
		}, 30);
	},

	callchuncai: function() {
		talkSelf(talktime);
		smjq("#smchuncai").fadeIn('normal');
		smjq("#callchuncai").css("display", "none");
		closeChuncaiMenu();
		closeNotice();
		chuncaiSay("我回来啦～");
		this.tools.setCookie("is_closechuncai", '', 60 * 60 * 24 * 30 * 1000);
	},

	setTime: function() {
		tol++;
		//document.body.innerHTML(tol);
		timenum = window.setTimeout("setTime('" + tol + "')", 1000);
		if (parseInt(tol) == parseInt(goal)) {
			stopTalkSelf();
			closeChuncaiMenu();
			closeNotice();
			closeInput();
			chuncaiSay("主人跑到哪里去了呢....");
			setFace(3);
			stoptime();
		}
	},

	stoptime: function() {
		if (timenum) {
			clearTimeout(timenum);
		}
	},

	tools: {
		in_array: function(str, arr) {
			for (var i in arr) {
				if (arr[i] == str) {
					return i;
				}
			}
			return false;
		},

		dateDiff: function(date1, date2) {
			var date3 = date2.getTime() - date1.getTime(); //时间差的毫秒数
			//计算出相差天数
			var days = Math.floor(date3 / (24 * 3600 * 1000));
			//注:Math.floor(float) 这个方法的用法是: 传递一个小数,返回一个最接近当前小数的整数,

			//计算出小时数
			var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
			var hours = Math.floor(leave1 / (3600 * 1000));
			//计算相差分钟数
			var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
			var minutes = Math.floor(leave2 / (60 * 1000));

			//计算相差秒数
			var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
			var seconds = Math.round(leave3 / 1000);

			var str = '';
			if (days > 0) str += ' <font color="red">' + days + "</font> 天";
			if (hours > 0) str += ' <font color="red">' + hours + "</font> 小时";
			if (minutes > 0) str += ' <font color="red">' + minutes + "</font> 分钟";
			if (seconds > 0) str += ' <font color="red">' + seconds + "</font> 分钟";
			return str;
		},

		//合并两个对象
		composition: function(target, source) {
			var desc = Object.getOwnPropertyDescriptor;
			var prop = Object.getOwnPropertyNames;
			var def_prop = Object.defineProperty;

			prop(source).forEach(function(key) {
				def_prop(target, key, desc(source, key))
			})
			return target;
		},

		getCookie: function(name) {
			var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
			if (arr != null) return unescape(arr[2]);
			return null;
		},

		setCookie: function(name, val, ex) {
			var times = new Date();
			times.setTime(times.getTime() + ex);
			if (ex == 0) {
				document.cookie = name + "=" + val + ";";
			} else {
				document.cookie = name + "=" + val + "; expires=" + times.toGMTString();
			}
		}
	}
}