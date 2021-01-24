const heyplay = {};
heyplay.uuid = function uuid(len, radix) {
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

heyplay.log = function () {
	let output = "";
	[...arguments].forEach(arg => {
		switch (typeof arg) {
			case "string":
				output += arg;
				break;
			default:
				let objectID = heyplay.uuid(8);
				output += `[${objectID}]`;
				console.log(`[HeyPlay] ${objectID}>`, arg);
				break;
		}
	});
	console.info("[HeyPlay]", output);
}

heyplay.onDOMTreeLoaded = function () {
	heyplay.log("DOM 树 加载完毕");

	if (typeof Pjax!=="undefined") {
		heyplay.pjax = new Pjax({
			selectors: [
				"head", 
				"#content"
			]
		});
		heyplay.log("创建了 pjax 的对象 heyplay.pjax");
	} else {
		heyplay.log("PJAX 取消，Pjax 对象不存在");
	};
	
	heyplay.log("发起 hitokoto 的请求...");
	fetch("https://v1.hitokoto.cn/?encode=json&charset=utf-8")
		.then(response => {
			heyplay.log("hitokoto 加载完毕，解析 JSON 为对象...");
			return response.json();
		})
		.then(hitokoto => {
			heyplay.log("hitokoto 解析完毕，正在应用到 DOM 树");
			let hitokotoContainer;
			try {
				hitokotoContainer = document.getElementById("hitokoto");
			} catch (error) {
				heyplay.log("找不到 hitokoto 的容器", error);
			};
			hitokotoContainer.innerHTML = 
				`<span id="hitokoto-${hitokoto.id}" title="${
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
						}，${hitokoto.created_at} 时 添加\n` + 
					`该 hitotoko 有 ${hitokoto.length}(${hitokoto.hitokoto.length}) 个字长，ID 为 ${hitokoto.id}，UUID 为 ${hitokoto.uuid}，审核员标识为 ${hitokoto.reviewer}`
				}" onclick="mdui.alert(document.getElementById('hitokoto-${hitokoto.id}').title.replace(/\\n/g, '<br>'))">${hitokoto.hitokoto}</span>`;

		});

	window.removeEventListener("DOMContentLoaded", heyplay.onDOMTreeLoaded);
	heyplay.log("DOM 树 加载完成函数 执行完毕，已移除 事件侦听器");
};
heyplay.onLoaded = function () {
	heyplay.log("Docuemnt 加载完毕")

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
		heyplay.log("Go To Top 按钮完毕")
	} else {
		heyplay.log("Go To Top 按钮加载失败，mdui 对象不存在");
	};

	window.removeEventListener("load", heyplay.onLoaded);
	heyplay.log("Document 加载完成函数 执行完毕，已移除 事件侦听器");
};

window.addEventListener("DOMContentLoaded", heyplay.onDOMTreeLoaded);
window.addEventListener("load", heyplay.onLoaded);
heyplay.log("添加了对 DOM 树加载完成 以及 Document加载完成 事件的侦听器")
