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
exports.ffmpeg = void 0;
const _stream = __importStar(require("stream"));
const _cp = __importStar(require("child_process"));
const module_log_1 = require("../__shared__/module_log");
function ffmpeg(inpfile, outfile, options) {
    let writable = new _stream.Writable();
    let args = ["-i", inpfile[0], ...options, outfile];
    module_log_1.debug("ffmpeg args", args);
    let ffmpeg = _cp.spawn(global.system.ffmpegPath || "ffmpeg", args);
    writable._write = function (chunk, encoding, cb) {
        ffmpeg.stdin.write(chunk);
        cb();
    };
    writable._final(() => {
        module_log_1.debug("writable._final");
        writable.end();
    });
    ffmpeg.on("error", err => {
        writable.emit("error", err);
    });
    ffmpeg.on("exit", err => {
        module_log_1.debug("ffmpeg exit", err);
        writable.end();
    });
    ffmpeg.stderr.on("data", err => {
        module_log_1.error(err.toString());
    });
    return writable;
}
exports.ffmpeg = ffmpeg;
