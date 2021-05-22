// refer to InternetExplorerFucker.js
"use strict";

if (window.ActiveXObject || "ActiveXObject" in window) {
    location.href = "/assets/nomoreinternetexplorer.html";
};

Date.prototype.format = function(fmt){
  let o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };

  if(/(y+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
        
  for(var k in o){
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(
        RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
    }       
  }

  return fmt;
}

window.addEventListener("DOMContentLoaded", function(e){
let now = new Date();
let date = now.format("MM.dd");
switch (date) {
case "5.22":
doucment.documentElement.style.filter = "greyscale(1)";
break;
}
});
