/**
 * import js/css files.
 *
 * @param mixed file
 * string one file.
 * array files.
 * @param function callback.
 * @param integer callID internel use only.
 */

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
// 路径写法和<script><link>中一样就行了
// 第一种 单个文件，带回调
// include("http://code.jquery.com/jquery.min.js", function() {
//     alert("i\'m callback!");
// });


//站点地址
var _site_path = "";
//请求的数据文件地址
var _weichuncai_path = "data.json";
var imagewidth = '240';
var imageheight = '240';
var talkself_user = [
    ["嘻嘻嘻嘻嘻嘻，主人的伪春菜可以自定义说什么话了。", "2"],
    ["喔耶～加油！加油！加油！加油！", "2"],
    ["有发现春菜有什么bug，请大家回馈呀。", "3"],
    ["这次有空的话，主人会添加伪春菜的透明度设定。^_^", "2"],
    ["主人现在老是弃旧迎新，朋友们都好伤心啊..", "3"],
    ["哇啊啊啊啊啊啊啊啊啊...", "3"],
    ["主人的3DS FC是：1676-3649-4781，加了记得留言跟他说啊。", "2"],
    ["现在博客已经搬到新的VPS主机了，速度应该不错吧？", "1"]
];

// 第二种 多个文件，带回调
// 多个文件以数组的形式书写，每个文件可以单独带回调，
// 最后一个回调将在最后一个文件加载完后调用
include([
    ["css/style.css"],
    ["http://code.jquery.com/jquery.min.js"],
    ["js/common_v2.js",
        function() {
            createFace("skin/default/face1.gif", "skin/default/face2.gif", "skin/default/face3.gif");
            //var talkself_arr = talkself_arr.concat(talkself_user);
        }
    ]
]);