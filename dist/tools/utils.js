"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 判断是否是非法的url
 * @param url
 */
function isIllegalUrl(url) {
    var reg = /^http(s):\/\//;
    if (reg.test(url)) {
        return true;
    }
    else {
        return false;
    }
}
exports.isIllegalUrl = isIllegalUrl;
