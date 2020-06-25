"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postJSON = exports.head = exports.getText = exports.getBinary = exports.getJSON = exports.getResponse = exports.extractDomainFromHostname = exports.getChromeUserAgent = exports.getFirefoxUserAgent = exports.DEFAULT_HEADERS = void 0;
const module_log_1 = require("./module_log");
const P = __importStar(require("./module_fs"));
if (typeof fetch === "undefined")
    global["fetch"] = require("node-fetch");
exports.DEFAULT_HEADERS = {
    "User-Agent": getFirefoxUserAgent(),
    "Accept-Language": "en-US,en;q=0.5"
};
function getFirefoxUserAgent() {
    let date = new Date();
    let version = ((date.getFullYear() - 2018) * 4 + Math.floor(date.getMonth() / 4) + 58) + ".0";
    return `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${version} Gecko/20100101 Firefox/${version}`;
}
exports.getFirefoxUserAgent = getFirefoxUserAgent;
function getChromeUserAgent() {
    return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.22 Safari/537.36`;
}
exports.getChromeUserAgent = getChromeUserAgent;
function extractDomainFromHostname(hostname) {
    return hostname.split(".").reverse()[1];
}
exports.extractDomainFromHostname = extractDomainFromHostname;
const isOk = (res) => {
    if (res.ok) {
        return res;
    }
    else {
        throw res.status;
    }
};
async function doFetch(url, options) {
    if (!url)
        throw "fetch url is invalid";
    while (true) {
        try {
            let res = await fetch(url, options);
            return res;
        }
        catch (err) {
            module_log_1.error("fetch", err.errno, err.message);
            switch (err.errno) {
                case "ENOTFOUND":
                    await P.timeout(60000);
                    break;
                default:
                    await P.timeout(10000);
            }
        }
    }
}
function getResponse(url, headers = {}) {
    let options = { headers: Object.assign({}, exports.DEFAULT_HEADERS, { 'Content-Type': 'application/json' }, headers) };
    return doFetch(url, options).then(isOk);
}
exports.getResponse = getResponse;
function getJSON(url, headers = {}) {
    let options = { headers: Object.assign({}, exports.DEFAULT_HEADERS, { 'Content-Type': 'application/json' }, headers) };
    return doFetch(url, options).then(isOk).then(res => res.json());
}
exports.getJSON = getJSON;
async function getBinary(url, headers = {}) {
    let options = { headers: Object.assign({}, exports.DEFAULT_HEADERS, headers) };
    return doFetch(url, options).then(res => res.arrayBuffer()).then(arrayBuffer => Buffer.from(arrayBuffer));
}
exports.getBinary = getBinary;
function getText(url, headers = {}) {
    let options = { headers: Object.assign({}, exports.DEFAULT_HEADERS, headers) };
    return doFetch(url, options).then(isOk).then(res => res.text());
}
exports.getText = getText;
function head(url, headers = {}) {
    return doFetch(url, {
        method: "head",
        headers: Object.assign({}, exports.DEFAULT_HEADERS, headers)
    });
}
exports.head = head;
function postJSON(url, headers, json) {
    let options = {
        method: "post",
        headers: Object.assign({}, exports.DEFAULT_HEADERS, { 'Content-Type': 'application/json' }, headers),
        body: JSON.stringify(json)
    };
    return doFetch(url, options).then(isOk).then(res => res.json());
}
exports.postJSON = postJSON;
