var ghost = {
    action: [
        ['shownotice', '显示公告'],
        ['chatTochuncai', '聊&nbsp;&nbsp;&nbsp;&nbsp;天'],
        ['foods', '吃 零 食'],
        ['meetparents', '见我家长'],
        ['lifetimechuncai', '生存时间']
    ],

    data: {
        eattimes: 0, //吃了几次
        talkself_arr: [],
        WCC: {}
    },

    init: function(WCC) {
        this.data.WCC = WCC;
        var skin = "skin/" + this.data.WCC.data.ghost + "/";
        this.data.WCC.createFace(skin + "face1.gif", skin + "face2.gif", skin + "face3.gif");
    },

    /**
     * 事件列表
     */

    /**
     * 显示公告
     */
    shownotice: function() {
        this.getdata("getnotice");
        ghost.data.WCC.setFace(1);
        this.data.WCC.closeChuncaiMenu();
    },

    /**
     * 与春菜聊天
     */
    chatTochuncai: function() {
        talk_html = '';
        talk_html += '  <div class="addinput">';
        talk_html += '      <div class="inp_l">';
        talk_html += '          <input class="talk" type="text" name="mastersay" value=""/>';
        talk_html += '          <input id="talkto" class="talkto" name="talkto" onclick="ghost.talkto()" type="button" value=" " />';
        talk_html += '      </div>';
        talk_html += '      <div class="inp_r" onclick="ghost.inp_r()">X</div>';
        talk_html += '  </div>';

        jQuery(".wcc.smchuncai").append(talk_html);
        jQuery(".wcc.smchuncai .addinput input.talk").keypress(function(event) {
            if (event.which == 13) {
                ghost.talkto();
            }
        });
        this.showInput();
    },

    showInput: function() {
        this.data.WCC.closeChuncaiMenu();
        this.data.WCC.closeNotice();
        this.data.WCC.chuncaiSay("............?");
        //ghost.data.WCC.setFace(1);
        jQuery(".wcc .addinput").css("display", "block");
    },

    closeInput: function() {
        ghost.data.WCC.setFace(3);
        jQuery(".wcc .addinput").css("display", "none");
    },

    inp_r: function() {
        this.closeInput();
        this.data.WCC.chuncaiSay('不聊天了吗？(→_→)');
        ghost.data.WCC.setFace(3);
    },

    talkto: function() {
        this.getdata("talking");
    },

    clearInput: function() {
        $(".wcc.smchuncai .addinput input.talk").val('');
    },

    /**
     * 春菜喂食系统
     */
    foods: function() {
        this.data.WCC.closeChuncaiMenu();
        this.data.WCC.closeNotice();
        this.getdata("foods");
    },

    eatfood: function(obj, setCookie) {
        var gettimes = this.data.WCC.tools.getCookie("eattimes");
        if (parseInt(gettimes) > parseInt(9)) {
            this.data.WCC.chuncaiSay("主人是个大混蛋！！");
            ghost.data.WCC.setFace(3);
            this.closechuncai_evil();
        } else if (parseInt(gettimes) > parseInt(7)) {
            this.data.WCC.chuncaiSay(".....................肚子要炸了，死也不要再吃了～～！！！TAT");
            ghost.data.WCC.setFace(3);
        } else if (parseInt(gettimes) == parseInt(5)) {
            this.data.WCC.chuncaiSay("我已经吃饱了，不要再吃啦......");
            ghost.data.WCC.setFace(3);
        } else if (parseInt(gettimes) == parseInt(3)) {
            this.data.WCC.chuncaiSay("多谢款待，我吃饱啦～～～ ╰（￣▽￣）╭");
            ghost.data.WCC.setFace(2);
        } else {
            var id = obj.replace("f", '');
            this.getdata('eatsay', id);
        }
        this.data.eattimes++;
        this.data.WCC.tools.setCookie("eattimes", this.data.eattimes, 60 * 10 * 1000);
    },

    closechuncai_evil: function() {
        this.data.WCC.stopTalkSelf();
        jQuery(".wcc .showchuncaimenu").css("display", "none");
        setTimeout(function() {
            jQuery(".wcc.smchuncai").fadeOut(1200);
            jQuery(".wcc.callchuncai").css("display", "block");
        }, 2000);
    },


    /**
     * 见我家长
     */
    meetparents: function() {
        this.data.WCC.closeChuncaiMenu();
        this.data.WCC.closeNotice();
        //jQuery("#getmenu").css("display", "none");
        this.data.WCC.chuncaiSay("马上就跳转到我父母去了哦～～～");
        ghost.data.WCC.setFace(2);
        setTimeout(function() {
            window.open('http://www.lmyoaoa.com/inn/archives/4504/');
            //window.location.href = _site_path+'/wp-admin/';
        }, 2000);
    },

    /**
     * 生存时间
     */
    lifetimechuncai: function() {
        this.data.WCC.closeChuncaiMenu();
        this.data.WCC.closeNotice();
        ghost.data.WCC.setFace(2);
        this.getdata('showlifetime');
    },


    /**
     * 读取数据
     */
    getdata: function(el, id) {
        jQuery.ajax({
            type: 'GET',
            url: ghost.data.WCC.data._weichuncai_path,
            cache: 'false',
            dataType: 'html',
            contentType: 'application/json; charset=utf8',
            beforeSend: function() {
                //jQuery("#dialog_chat").fadeOut("normal");
                jQuery(".wcc .tempsaying").css('display', "none");
                jQuery(".wcc .dialog_chat_loading").fadeIn("normal");
            },
            success: function(data) {
                jQuery(".wcc .dialog_chat_loading").css('display', "none");
                //jQuery("#dialog_chat").fadeIn("normal");
                jQuery(".wcc .tempsaying").css('display', "");
                var dat = eval("(" + data + ")");
                if (el == 'defaultccs') {
                    ghost.data.WCC.chuncaiSay(dat.defaultccs);
                } else if (el == 'getnotice') {

                    //整合data里读取的自言自语
                    if( ghost.data.talkself_arr.length<1 ){
                        ghost.data.talkself_arr = ghost.data.WCC.data.talkself_arr;
                    }
                    ghost.data.WCC.data.talkself_arr = ghost.data.talkself_arr.concat(dat.talkself_user);

                    ghost.data.WCC.chuncaiSay(dat.notice);
                    ghost.data.WCC.setFace(1);

                } else if (el == 'showlifetime') {

                    var showlifetime = dat.showlifetime.replace(/\$time_str\$/, '许久');
                    if (!isNaN(parseInt(dat.lifetime[dat.defaultccs]))) {
                        var this_time = new Date();
                        var build_time = new Date(dat.lifetime[dat.defaultccs]);
                        var time_str = ghost.data.WCC.tools.dateDiff(build_time, this_time);

                        showlifetime = dat.showlifetime.replace(/\$time_str\$/, time_str);
                    }

                    ghost.data.WCC.chuncaiSay(showlifetime);

                } else if (el == 'talking') {

                    var talkcon = jQuery(".wcc .talk").val();
                    var i = ghost.data.WCC.tools.in_array(talkcon, dat.ques);
                    var types = typeof(i);
                    if (types != 'boolean') {
                        ghost.data.WCC.chuncaiSay(dat.ans[i]);
                        ghost.data.WCC.setFace(2);
                    } else {
                        ghost.data.WCC.chuncaiSay('.......................嗯？');
                        ghost.data.WCC.setFace(3);
                    }
                    ghost.clearInput();

                } else if (el == 'foods') {

                    var str = '';
                    var arr = dat.foods;
                    var preg = /function/;
                    for (var i in arr) {
                        if (arr[i] != '' && !preg.test(arr[i])) {
                            str += '<ul id="f' + i + '" class="eatfood" onclick="ghost.eatfood(this.id)">' + arr[i] + '</ul>';
                        }
                    }
                    ghost.data.WCC.chuncaiSay(str);

                } else if (el = "eatsay") {

                    var str = dat.eatsay[id];
                    ghost.data.WCC.chuncaiSay(str);
                    ghost.data.WCC.setFace(2);

                } else if (el = "talkself") {

                    var arr = dat.talkself;
                    return arr;

                }
            },
            error: function() {
                ghost.data.WCC.chuncaiSay('好像出错了，是什么错误呢...请联系管理猿');
            }
        });
    }
};