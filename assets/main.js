"use strict";
console.log("%c警告！", "background: red; color: yellow; font-size: 40px;");
console.log("%c使用此控制台可能会给攻击者可乘之机，让其利用 Self-XSS（自跨站脚本）攻击来冒充您并窃取您的信息。\n请确保您知道你在做什么，请勿输入或粘贴来历不明的代码。", "font-size: 20px;");

console.log("%cWarning!", "background: red; color: yellow; font-size: 40px;");
console.log("%cUsing this console may give the attacker an opportunity, allowed them to impersonate you and steal your information by Self-XSS.\nPlease make sure you know what you're doing, do not enter or paste unknown code.", "font-size: 20px;");


const heykero = {};

heykero.uuid = function uuid(len, radix) {
    let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
	let uuid = [],
		i;
    	radix = radix || chars.length;
 
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      // rfc4122, version 4 form
      let r;
 
      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
      uuid[14] = "4";
 
      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
 
	return uuid.join("");
};

heykero.log = function () {
	heykero.console("log", ...arguments);
};

heykero.console = function () {
	let time = new Date();
	console[arguments[0] || "log"](
		"%c[HeyKero] " + `%c[${time.getFullYear()}.${time.getMonth()+1}.${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]`,
			"font-family: Roboto, Noto, Helvetica, Arial, sans-serif; color: #03a9f4; font-weight: 700",
			"color:grey",
		...[...arguments].slice(1)
	);
};

heykero.hitokoto = function () {
	heykero.log("发起 hitokoto 的请求...");
	fetch("https://v1.hitokoto.cn/?encode=json&charset=utf-8")
		.then(response => {
			heykero.log("hitokoto 加载完毕，解析 JSON 为对象...");
			return response.json();
		})
		.then(hitokoto => {
			heykero.log("hitokoto 解析完毕，正在应用到 DOM 树");
			let hitokotoContainer;
			try {
				hitokotoContainer = document.getElementById("hitokoto");
			} catch (error) {
				heykero.log("找不到 hitokoto 的容器", error);
			};
			hitokotoContainer.innerHTML = 
				`<span title="${
					`出自 ${hitokoto.from}${hitokoto.from_who ? `(${hitokoto.from_who})` :""} ，这是一个 ${
						{
							"a": "动画",
							"b": "漫画",
							"c": "游戏",
							"d": "文学",
							"e": "原创",
							"f": "来自网络",
							"g": "其他",
							"h": "影视",
							"i": "诗词",
							"j": "网易云",
							"k": "哲学",
							"l": "抖机灵"
						}[hitokoto.type] ||
							hitokoto.type
						} 的 hitokoto\n` +
					`由 ${hitokoto.creator} (uid:${hitokoto.creator_uid}) 在 ${
						{
							"web":"网页端"
						}[hitokoto.commit_from] |
							hitokoto.commit_from
						} 端，${hitokoto.created_at} 时 添加\n` + 
					`该 hitokoto 有 ${hitokoto.length}${hitokoto.hitokoto.length===hitokoto.length?"":`(${hitokoto.hitokoto.length})`} 个字长，ID 为 ${hitokoto.id}，UUID 为 ${hitokoto.uuid}，审核员标识为 ${hitokoto.reviewer}`
				}" onclick='mdui.dialog({"title":"Hitokoto 详细信息","content":this.title.replace(/\\n/g,"<br>"),"buttons":[{"text":"换一个","onClick":heykero.hitokoto.load},{"text": "关闭"}]});'>${hitokoto.hitokoto}</span>`;
			heykero.log("hitokoto 完毕");
		});
}

heykero.onDOMTreeLoaded = function () {
	heykero.log("[Event]", "DOM 树 加载完毕");

	if (typeof Pjax!=="undefined") {
		heykero.pjax = new Pjax({
			elements: "a[href]",
			selectors: [
				"title",
				"meta[name=\"description\"]",
				"meta[property=\"og:type\"]",
				"meta[property=\"og:title\"]",
				"meta[property=\"og:url\"]",
				"meta[property=\"og:description\"]",
				"meta[property=\"og:locate\"]",
				"meta[property=\"article:author\"]",
				"meta[name=\"keywords\"]",
				"meta[name=\"msapplication-starturl\"]",
				"link[rel=\"canonical\"]",
				"#content"
			],
			cacheBust: false
		});
		heykero.log("创建了 pjax 的对象 heykero.pjax");
	} else {
		heykero.log("PJAX 取消，Pjax 对象不存在");
	};

	//heykero.developerTool.detector();

	heykero.hitokoto();

	window.removeEventListener("DOMContentLoaded", heykero.onDOMTreeLoaded);
	heykero.log("DOM 树 加载完成函数 执行完毕，已移除 事件侦听器");
};

heykero.developerTool={};

heykero.developerTool.shortcutKeyDetector = function (e) {
	if (
		(e.key === "F12" || e.code === "F12" || e.keyCode === 123) ||
		(
			(e.key === "I" || e.code === "KeyI" || e.keyCode === 73) &&
			e.shiftKey && e.ctrlKey
		)
	) {
		heykero.developerTool.whenOpened();
	};
};

heykero.developerTool.whenOpened = function () {
	window.removeEventListener("keydown", heykero.developerTool.shortcutKeyDetector);
	mdui.dialog({
		"title": "开发者工具已启用",
		"content": "水平有限，代码写得很垃圾，希望不会被嘲笑，呼呼"
	});
};

heykero.onLoaded = function () {
	heykero.log("[Event]", "Docuemnt 加载完毕")

	if (typeof mdui!=="undefined") {
		mdui.$(function() {
			mdui.$(window).on("scroll", function (e) {
				var scrollTop = document.documentElement.scrollTop || 
				document.body.scrollTop;
				if (scrollTop !== 0) {
					mdui.$("#gotop").removeClass("mdui-fab-hide");
				} else {
					mdui.$("#gotop").addClass("mdui-fab-hide");
				};
			});
			mdui.$("#gotop").on("click", function (e) { 
				(function animateScroll() {
					var scrollTop = document.documentElement.scrollTop || 
					document.body.scrollTop; if (scrollTop !== 0) {
						window.requestAnimationFrame(animateScroll); 
						window.scrollTo(0, scrollTop - (scrollTop / 5));
					};
				})();
			});
		});
		heykero.log("[Component]", "Go To Top 按钮完毕")
	} else {
		heykero.log("Go To Top 按钮加载失败，mdui 对象不存在");
	};
	/*(function () {
		let copiedAlert = mdui.alert;
		mdui.alert = function () {
			copiedAlert(...arguments);
			heykero.log("mdui.alert 被调用");
		};
	})();*/
	

	window.removeEventListener("load", heykero.onLoaded);
	heykero.log("Document 加载完成函数 执行完毕，已移除 事件侦听器");
};

window.addEventListener("DOMContentLoaded", heykero.onDOMTreeLoaded);
window.addEventListener("load", heykero.onLoaded);
window.addEventListener("keydown", heykero.developerTool.shortcutKeyDetector);
heykero.log("添加了事件侦听器")
