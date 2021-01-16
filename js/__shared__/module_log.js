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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dumpError = exports.error = exports.info = exports.debug = exports.trace = exports.cbError = exports.Verbosity = exports.assert = exports.warn = exports.log = void 0;
const _os = __importStar(require("os"));
const _path = __importStar(require("path"));
const _fs = __importStar(require("fs"));
const module_utils_1 = require("./module_utils");
exports.log = console.log;
exports.warn = console.warn;
exports.assert = console.assert;
const TRACE_FILE = _path.join(_os.tmpdir(), "trace.log");
var Verbosity;
(function (Verbosity) {
    Verbosity[Verbosity["LOG"] = 0] = "LOG";
    Verbosity[Verbosity["INFO"] = 1] = "INFO";
    Verbosity[Verbosity["DEBUG"] = 2] = "DEBUG";
})(Verbosity = exports.Verbosity || (exports.Verbosity = {}));
function cbError(err) {
    err && error(err);
    return null;
}
exports.cbError = cbError;
function trace(...args) {
    try {
        let output = args.map(arg => {
            return typeof arg === "object" ? module_utils_1.prettify(arg) : arg;
        }).join(", ");
        _fs.appendFile(TRACE_FILE, output + "\n", err => err && error(err));
        debug(output);
    }
    catch (err) {
        error("trace catch for", err);
    }
}
exports.trace = trace;
function debug(...args) {
    if (global.system.verbosity >= Verbosity.DEBUG)
        console.debug.apply(null, args);
}
exports.debug = debug;
function info(...args) {
    if (global.system.verbosity >= Verbosity.INFO)
        console.info.apply(null, args);
}
exports.info = info;
function error(...args) {
    process.stdout.write("\x1b[31m");
    console.error.apply(null, args);
    process.stdout.write("\x1b[39m");
}
exports.error = error;
function dumpError(err) {
    error("typeof", typeof err, module_utils_1.prettify(err));
    return err;
}
exports.dumpError = dumpError;
