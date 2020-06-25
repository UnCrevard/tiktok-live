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
exports.HlsTS = void 0;
const _fs = __importStar(require("fs"));
const _cp = __importStar(require("child_process"));
const module_net_1 = require("./module_net");
const module_log_1 = require("./module_log");
const module_utils_1 = require("./module_utils");
const P = __importStar(require("./module_fs"));
let currentConnections = 0;
function parsePlaylist(playlist, head, tail) {
    if (!playlist)
        throw "playlist empty";
    let lines = playlist.split("\n");
    if (lines.shift() != "#EXTM3U")
        throw "playlist invalid";
    let segments = [];
    let endlist = false;
    for (let line of lines) {
        if (line.length) {
            if (line.startsWith("#")) {
                let m = line.match(/#(EXT-X-|EXT)([A-Z0-9-]+)(?::(.*))?/);
                if (!m) {
                    module_log_1.error("error", line);
                }
                else {
                    switch (m[2]) {
                        case "ENDLIST":
                            endlist = true;
                            break;
                        case "M3U":
                        case "INF":
                        case "VERSION":
                        case "MEDIA-SEQUENCE":
                        case "TARGETDURATION":
                        case "PROGRAM-DATE-TIME":
                        case "INDEPENDENT-SEGMENTS":
                        case "START":
                        case "DISCONTINUITY-SEQUENCE":
                        case "DISCONTINUITY":
                        case "CUEPOINT":
                        case "DATERANGE":
                        case "ALLOW-CACHE:NO":
                        case "TWITCH-ELAPSED-SECS":
                        case "TWITCH-TOTAL-SECS":
                        case "TWITCH-PREFETCH":
                        case "SCTE35-OUT":
                            break;
                        case "#EXT-X-ALLOW-CACHE":
                            break;
                        case "DYNAMICALLY-GENERATED":
                            throw "EXT-X-DYNAMICALLY-GENERATED";
                        default:
                            module_log_1.debug("not supported", line);
                    }
                }
            }
            else {
                if (line.match(/.+:\/\/.+/)) {
                    segments.push(line);
                }
                else {
                    segments.push(head + "/" + line + tail);
                }
            }
        }
    }
    if (segments.length == 0)
        throw "playlist invalid";
    return { endlist: endlist, urls: segments };
}
class HlsTS {
    constructor(updateInterval, maxIdle, ffmpegOptions) {
        this.updateInterval = updateInterval;
        this.maxIdle = maxIdle;
        this.useFFMPEG = ffmpegOptions;
        module_log_1.info(`hls timeout ${this.updateInterval} maxIdle ${this.maxIdle} ffmpegOptions ${ffmpegOptions}`);
    }
    play(url, filename) {
        let exitCode = null;
        return new Promise(async (resolve, reject) => {
            if (!url)
                throw "bad url";
            let m3u8 = url.match(/(.+)\/.+\.m3u8(.+|)/i);
            if (!m3u8)
                throw "m3u8 url is invalid";
            this.stream = null;
            let oldSegments = {};
            let cache = [];
            let doneSegment = 0;
            let currentSegment = 0;
            let waitingSegment = 0;
            let hTimeout = null;
            let updated = false;
            let idle = 0;
            let queue = {};
            if (this.useFFMPEG) {
                let args = ["-i", "-", ...this.useFFMPEG.split(" "), filename];
                module_log_1.debug("ffmpeg", args);
                this.ffmpeg = _cp.spawn(global.system.ffmpegPath, args);
                this.stream = this.ffmpeg.stdin;
                this.ffmpeg.on("error", err => {
                    module_log_1.error(err);
                    exitCode = -1;
                });
                this.ffmpeg.on("close", code => {
                    module_log_1.debug("ffmpeg.exit", code);
                });
                this.ffmpeg.stderr.pipe(process.stdout);
                this.ffmpeg.stdin.on("error", module_utils_1.noop);
            }
            else {
                this.stream = _fs.createWriteStream(filename);
            }
            const updateSegments = async () => {
                if (exitCode !== null)
                    return;
                try {
                    let text = await module_net_1.getText(url);
                    let { endlist: endOfStream, urls: segments } = parsePlaylist(text, m3u8[1], m3u8[2]);
                    let fresh = 0;
                    for (let segment of segments) {
                        if (!(segment in oldSegments)) {
                            oldSegments[segment] = true;
                            cache.push(segment);
                            fresh++;
                        }
                    }
                    module_log_1.debug(`hls cache updated ${fresh}/${segments.length} cached ${cache.length} endlist ${exitCode} eos ${endOfStream} idle ${idle}`);
                    updated = true;
                    if (this.updateInterval) {
                        if (cache.length == 0 && waitingSegment == 0) {
                            idle++;
                            if (idle > this.maxIdle) {
                                exitCode = 0;
                                return;
                            }
                        }
                        else {
                            idle = 0;
                        }
                        hTimeout = setTimeout(updateSegments, this.updateInterval);
                    }
                }
                catch (err) {
                    module_log_1.error("updateSegments", err);
                    exitCode = 0;
                }
            };
            try {
                updateSegments();
                while (exitCode === null) {
                    while (waitingSegment < global.system.maxParallelDownload && cache.length && exitCode === null) {
                        let segmentUrl = cache.shift();
                        let request = {
                            idx: currentSegment,
                            url: segmentUrl,
                            retry: 0
                        };
                        waitingSegment++;
                        currentSegment++;
                        async function downloadSegment(request, stream) {
                            while (exitCode === null) {
                                let chunk;
                                try {
                                    chunk = await module_net_1.getBinary(request.url);
                                }
                                catch (err) {
                                    chunk = null;
                                    if (err == 403 || err == 404 || err == 503) {
                                        exitCode = -1;
                                    }
                                    else {
                                        module_log_1.error("get chunk fail", err);
                                    }
                                }
                                if (chunk) {
                                    waitingSegment--;
                                    if (doneSegment == request.idx) {
                                        if (exitCode === null)
                                            stream.write(chunk);
                                        do {
                                            doneSegment++;
                                            if (doneSegment in queue) {
                                                let chunk = queue[doneSegment];
                                                if (chunk && exitCode === null)
                                                    stream.write(chunk);
                                                delete queue[doneSegment];
                                            }
                                            else {
                                                break;
                                            }
                                        } while (exitCode === null);
                                        return;
                                    }
                                    else {
                                        queue[request.idx] = chunk;
                                        return;
                                    }
                                }
                                else {
                                    request.retry++;
                                    module_log_1.error("segment", request.idx, "fail", "retry", request.retry);
                                    if (request.retry >= 5) {
                                        queue[request.idx] = null;
                                        waitingSegment--;
                                        return;
                                    }
                                    else {
                                        await P.timeout(1000);
                                    }
                                }
                            }
                        }
                        downloadSegment(request, this.stream);
                    }
                    if (updated) {
                        if (waitingSegment == 0 && cache.length == 0 && this.updateInterval == 0) {
                            exitCode = 0;
                        }
                    }
                    await P.timeout(100);
                }
                if (hTimeout)
                    clearTimeout(hTimeout);
            }
            catch (err) {
                module_log_1.error("fatal", err);
                exitCode = -1;
            }
            if (this.stream) {
                this.stream.end();
            }
            if (cache.length && waitingSegment)
                module_log_1.error("not flushed", cache.length, waitingSegment);
            if (exitCode != 0 && exitCode != -2)
                module_log_1.error("RET_CODE", exitCode);
            resolve(exitCode === 0);
        });
    }
}
exports.HlsTS = HlsTS;
