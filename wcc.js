/**
 * import js/css files.
 *
 * @param mixed file
 * string one file.
 * array files.
 * @param function callback.
 * @param integer callID internel use only.
 */

//来自：http://www.im87.cn/blog/252

function include(file, callback, callID) {
    var f = arguments.callee;

    f.head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    if (typeof f.queue === "undefined") {
        // Scan exist scripts.
        f.queue = (function() {
            var queue = {},
                scripts = document.getElementsByTagName("script"),
                styles = document.getElementsByTagName("link");
            for (var i = 0, l = scripts.length; i < l; i++) {
                scripts[i].src ? queue[scripts[i].src] = true : null;
            }
            for (var i = 0, l = styles.length; i < l; i++) {
                styles[i].href ? queue[styles[i].href] = true : null;
            }
            return queue;
        })();
    }
    // Include single file.
    if (typeof file === "string") {
        var elem, src, type = file.split(".").pop();
        if (type === "js") {
            elem = document.createElement("script");
            elem.setAttribute("type", "text/javascript");
            elem.setAttribute("async", "async");
            elem.setAttribute("src", file);
        } else {
            elem = document.createElement("link");
            elem.setAttribute("rel", "stylesheet");
            elem.setAttribute("type", "text/css");
            elem.setAttribute("href", file);
        }
        src = type === "js" ? elem.src : elem.href;
        if (typeof f.queue[src] === "undefined") {
            f.queue[src] = false;
        }
        // File is loaded, just run callback.
        if (f.queue[src] === true) {
            elem = null;
            f.recall[callID] && f.recall[callID].isNotLoad--;
            callback && callback();
            return;
        } else {
            elem.onload = elem.onreadystatechange = function() {
                if (!elem.readyState || /loaded|complete/.test(elem.readyState)) {
                    f.queue[src] = true;
                    f.recall[callID].isNotLoad--;
                    // Handle memory leak in IE
                    elem.onload = elem.onreadystatechange = null;
                    // Dereference the script
                    elem = undefined;
                    callback && callback();
                    if (!f.recall[callID].isNotLoad) {
                        f.recall[callID].callback && f.recall[callID].callback();
                    }
                }
            };
        }
        f.head.appendChild(elem);
    } else {
        if (typeof f.ID === "undefined") {
            f.ID = 0;
            f.recall = {};
        }
        f.ID++;
        // Include array files.
        f.recall[f.ID] = {
            callback: callback,
            isNotLoad: file.length
        };
        for (var i = 0, l = file.length; i < l; i++) {
            var _file = typeof file[i] === "string" ? file[i] : file[i][0],
                _call = typeof file[i] === "string" ? function() {} : file[i][1];
            arguments.callee(_file, _call, f.ID);
        }
    }
}

//串行加载函数
//http://blog.sina.com.cn/s/blog_68693f9801016zo6.html
function seriesLoadScripts(scripts, callback) {
    if (typeof(scripts) != "object") var scripts = [scripts];
    var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement;
    var s = new Array(),
        last = scripts.length - 1,
        recursiveLoad = function(i) { //递归
            s[i] = document.createElement("script");
            s[i].setAttribute("type", "text/javascript");
            s[i].onload = s[i].onreadystatechange = function() { //Attach handlers for all browsers
                if (!0 || this.readyState == "loaded" || this.readyState == "complete") {
                    this.onload = this.onreadystatechange = null;
                    this.parentNode.removeChild(this);
                    if (i != last) recursiveLoad(i + 1);
                    else if (typeof(callback) == "function") callback();
                }
            }
            s[i].setAttribute("src", scripts[i]);
            HEAD.appendChild(s[i]);
        };
    recursiveLoad(0);
}

//并行加载函数
//http://blog.sina.com.cn/s/blog_68693f9801016zo6.html
function parallelLoadScripts(scripts, callback) {
    if (typeof(scripts) != "object") var scripts = [scripts];
    var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement,
        s = new Array(),
        loaded = 0;
    for (var i = 0; i < scripts.length; i++) {
        s[i] = document.createElement("script");
        s[i].setAttribute("type", "text/javascript");
        s[i].onload = s[i].onreadystatechange = function() { //Attach handlers for all browsers
            if (!0 || this.readyState == "loaded" || this.readyState == "complete") {
                loaded++;
                this.onload = this.onreadystatechange = null;
                this.parentNode.removeChild(this);
                if (loaded == scripts.length && typeof(callback) == "function") callback();
            }
        };
        s[i].setAttribute("src", scripts[i]);
        HEAD.appendChild(s[i]);
    }
}

// 路径写法和<script><link>中一样就行了
// 第一种 单个文件，带回调
// include("http://code.jquery.com/jquery.min.js", function() {
//     alert("i\'m callback!");
// });
// 

// 第二种 多个文件，带回调
// 多个文件以数组的形式书写，每个文件可以单独带回调，
// 最后一个回调将在最后一个文件加载完后调用
include([
    ["css/style.css"],
    ["http://code.jquery.com/jquery.min.js"],
    ["js/common.js",
        function() {
            //createFace("skin/default/face1.gif", "skin/default/face2.gif", "skin/default/face3.gif");
            WCC.init({
                '_site_path': "", //站点地址
                '_weichuncai_path': "data.json", //请求的数据文件地址
                'imagewidth': "240",
                'imageheight': "240",
                'ghost': "default",
                'talkself_user': [
                    ["嘻嘻嘻嘻嘻嘻，主人的伪春菜可以自定义说什么话了。", "2"],
                    ["喔耶～加油！加油！加油！加油！", "2"],
                    ["有发现春菜有什么bug，请大家回馈呀。", "3"],
                    ["这次有空的话，主人会添加伪春菜的透明度设定。^_^", "2"],
                    ["主人现在老是弃旧迎新，朋友们都好伤心啊..", "3"],
                    ["哇啊啊啊啊啊啊啊啊啊...", "3"]
                ]
            });
            //var talkself_arr = talkself_arr.concat(talkself_user);
        }
    ]
]);