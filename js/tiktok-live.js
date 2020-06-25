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
const pkg = require("../package.json");
const FFMPEG_DEFAULT = "-hide_banner -loglevel error -c copy -video_track_timescale 0";
global.system =
    {
        maxParallelDownload: 5,
        maxRetry: 2,
        verbosity: 0,
        ffmpegPath: "ffmpeg"
    };
global.settings =
    {
        pathDownload: ".",
        useFFMPEG: null,
        filenameTemplate: null,
        videoFormat: "ts",
        version: pkg.version,
        json: false,
        thumbnail: false
    };
const module_log_1 = require("./__shared__/module_log");
const module_net_1 = require("./__shared__/module_net");
const P = __importStar(require("./__shared__/module_fs"));
const module_utils_1 = require("./__shared__/module_utils");
const Path = __importStar(require("path"));
const module_hls_1 = require("./__shared__/module_hls");
const commander_1 = require("commander");
function createFilename(broadcast) {
    return Path.join(global.settings.pathDownload, module_utils_1.cleanFilename(global.settings.filenameTemplate
        .replace("service", "Tiktok")
        .replace("username", broadcast.liveData.OwnerInfo.UniqueId)
        .replace("title", broadcast.liveData.Title)
        .replace("date", module_utils_1.formatDateTime(new Date(new Date())))
        .replace("type", "live")));
}
async function main() {
    let cmd = new commander_1.Command();
    cmd
        .version(global.settings.version)
        .usage(`options link`)
        .option("-v, --verbose", "verbosity level (-v -vv -vvv)", ((x, v) => v + 1), 0)
        .option("--dl <path>", "download path (default current dir)", global.settings.pathDownload)
        .option("--ffmpeg <arguments>", "use ffmpeg (must be in your path) to parse and write the video stream (advanced)", false)
        .option("--fmt <format>", "change the output format (FFMPEG will be enabled)", global.settings.videoFormat)
        .option("--json", "save stream informations (advanced)", global.settings.json)
        .option("--filename <template>", "filename template", "service_username_date_title_type");
    cmd.parse();
    global.system.verbosity = cmd["verbose"];
    global.settings.pathDownload = cmd["dl"];
    global.settings.videoFormat = cmd["fmt"];
    global.settings.useFFMPEG = cmd["ffmpeg"];
    global.settings.thumbnail = cmd["thumb"];
    global.settings.json = cmd["json"];
    global.settings.filenameTemplate = cmd["filename"];
    module_log_1.debug(module_utils_1.prettify(global.system));
    module_log_1.debug(module_utils_1.prettify(global.settings));
    try {
        if (cmd.args.length == 0) {
            cmd.help();
            return;
        }
        if (cmd.args.length != 1)
            module_log_1.log("multiple link ?");
        module_log_1.log(pkg.name, "scraping web page");
        let text = await module_net_1.getText(cmd.args[0]);
        let re = /(__INIT_PROPS__.=.)(.+)(<\/script>)/;
        let m = text.match(re);
        if (m) {
            let live = JSON.parse(m[2]);
            let stream = live["/share/live/:id"];
            if (global.settings.json)
                P.writeFile(createFilename(stream) + ".json", module_utils_1.prettify(stream)).catch(module_log_1.error);
            if (stream.liveData.Status == 4)
                throw "live is over";
            if (stream.liveData.Status != 2)
                throw "unknown live status " + stream.liveData.Status;
            let filename = createFilename(stream) + "." + global.settings.videoFormat;
            let url = stream.liveData.LiveUrl;
            module_log_1.info("LiveUrl", url);
            module_log_1.log("recording live...");
            await new module_hls_1.HlsTS(3000, 10, null).play(url, filename);
        }
        else {
            module_log_1.error("live not found or parsing fail");
        }
    }
    catch (e) {
        module_log_1.error(`${pkg.name} fail with "${e}"`);
    }
}
main();
