// InternetExplorerFucker.js
"use strict";

if (document.cookie.indexOf("ignoreInternetExplorerWarning") === -1 && (window.ActiveXObject || "ActiveXObject" in window)) {
    location.href = "/nomoreinternetexplorer";
};