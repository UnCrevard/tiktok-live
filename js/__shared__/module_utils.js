"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonDeepSearch = exports.isLatin = exports.isANSI = exports.removeNonANSIChar = exports.cleanHTML = exports.cleanFilename = exports.formatDateTime = exports.formatTime = exports.formatDate = exports.promisify = exports.prettify = exports.noop = void 0;
function noop() { }
exports.noop = noop;
function prettify(obj) {
    return JSON.stringify(obj, null, "\t");
}
exports.prettify = prettify;
function promisify(func) {
    return new Promise(func);
}
exports.promisify = promisify;
function formatDate(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '.' + (m < 10 ? '0' + m : m) + '.' + (d < 10 ? '0' + d : d);
}
exports.formatDate = formatDate;
function formatTime(date) {
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    return `${(h < 10 ? "0" + h : h)}-${(m < 10 ? "0" + m : m)}-${(s < 10 ? "0" + s : s)}`;
}
exports.formatTime = formatTime;
function formatDateTime(date) {
    return formatDate(date) + "_" + formatTime(date);
}
exports.formatDateTime = formatDateTime;
function cleanFilename(filename) {
    return filename.replace(/[\x00-\x1f"#<>|&*?:/\\~]/gi, "_").slice(0);
}
exports.cleanFilename = cleanFilename;
function cleanHTML(html) {
    return html.replace(/&#(\d+);/g, (x, y) => String.fromCharCode(y));
}
exports.cleanHTML = cleanHTML;
function removeNonANSIChar(str) {
    return str.replace(/[^\x20-\xFF]/g, "");
}
exports.removeNonANSIChar = removeNonANSIChar;
exports.isANSI = (str) => !str.match(/[^\x00 -\xff]/gi);
function isLatin(str) {
    let m = str.match(/[\u0400-\u1fff\u2c00-\ud7ff]/);
    if (m) {
        for (let c of str) {
            let code = c.charCodeAt(0);
            if (code > 255)
                console.error(c, "=", code.toString(16));
        }
        return false;
    }
    else {
        return true;
    }
}
exports.isLatin = isLatin;
function jsonDeepSearch(key, data) {
    let results = [];
    if (data !== null && typeof data === "object") {
        if (key in data)
            results.push(data[key]);
        else
            for (let i in data) {
                results = results.concat(jsonDeepSearch(key, data[i]));
            }
    }
    return results;
}
exports.jsonDeepSearch = jsonDeepSearch;
String.prototype.capitalizeFirstLetter = function () { return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase(); };
