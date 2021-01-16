/*

	tiktok-live : record live stream from tiktok via a link

	v0.0.0 202005xx
	v1.0.0 20200625 release npm & github
	v1.0.1 20210116 fix

*/

const pkg: NPM.Package = require("../package.json")

const FFMPEG_DEFAULT = "-hide_banner -loglevel error -c copy -video_track_timescale 0"

global.system =
{
	maxParallelDownload: 5,
	maxRetry: 2,
	verbosity: 0,
	ffmpegPath: "ffmpeg"
}

// default values

global.settings =
{
	pathDownload: ".",
	useFFMPEG: null,
	filenameTemplate: null,
	videoFormat: "ts",
	version: pkg.version,
	json: false,
	thumbnail: false
}

import { log, debug, info, error } from "./__shared__/module_log"
import { getText } from "./__shared__/module_net"
import * as P from "./__shared__/module_fs"
import { prettify, cleanFilename, formatDateTime } from "./__shared__/module_utils"
import * as Path from "path"
import { HlsTS } from "./__shared__/module_hls"
import { Command } from "commander"


function createFilename(broadcast: Tiktok.LiveStream)
{

	return Path.join(global.settings.pathDownload, cleanFilename(global.settings.filenameTemplate
		.replace("service", "Tiktok")
		.replace("username", broadcast.liveData.OwnerInfo.UniqueId)
		.replace("title", broadcast.liveData.Title)
		.replace("date", formatDateTime(new Date(new Date())))
		.replace("type", "live")
	))
}

async function main()
{
	let cmd = new Command()

	cmd
		.version(global.settings.version)
		.usage(`options link`)
		.option("-v, --verbose", "verbosity level (-v -vv -vvv)", ((x, v) => v + 1), 0)
		.option("--dl <path>", "download path (default current dir)", global.settings.pathDownload)
		.option("--ffmpeg <arguments>", "use ffmpeg (must be in your path) to parse and write the video stream (advanced)", false)
		.option("--fmt <format>", "change the output format (FFMPEG will be enabled)", global.settings.videoFormat)
		.option("--json", "save stream informations (advanced)", global.settings.json)
		// .option("--thumb", "save stream thumbnail", global.settings.thumbnail)
		.option("--filename <template>", "filename template", "service_username_date_title_type")

	cmd.parse()

	global.system.verbosity = cmd["verbose"]
	global.settings.pathDownload = cmd["dl"]
	global.settings.videoFormat = cmd["fmt"]
	global.settings.useFFMPEG = cmd["ffmpeg"]
	global.settings.thumbnail = cmd["thumb"]
	global.settings.json = cmd["json"]
	global.settings.filenameTemplate = cmd["filename"]

	debug(prettify(global.system))
	debug(prettify(global.settings))

	try
	{

		if (cmd.args.length == 0)
		{
			cmd.help()
			return
		}

		if (cmd.args.length != 1) log("multiple link ?")

		log(pkg.name, "scraping web page")

		let text = await getText(cmd.args[0])

		// I HATE DAT !!!

		let re = /(__INIT_PROPS__.=.)(.+?)(<\/script>)/

		let m = text.match(re)

		if (m)
		{
			let live: Tiktok.WebLive = JSON.parse(m[2])

			let stream = live["/share/live/:id"]

			// write json (non fatal if fail)

			if (global.settings.json) P.writeFile(createFilename(stream) + ".json", prettify(stream)).catch(error)

			// write thumbnail

			// handle status

			if (stream.liveData.Status == Tiktok.LiveStatusCode.LiveIsOver) throw "live is over"
			if (stream.liveData.Status != Tiktok.LiveStatusCode.LiveIsRunning) throw "unknown live status " + stream.liveData.Status

			// download live

			let filename = createFilename(stream) + "." + global.settings.videoFormat

			let url = stream.liveData.LiveUrl

			info("LiveUrl", url)

			/*

			tiktok live stream infos :

				url per m3u : ?

			*/

			// pool every 3s with a 30s timeout

			log("recording live...")

			await new HlsTS(1000, 10, null).play(url, filename)
		}
		else
		{
			error("live not found or parsing fail")
		}
	}
	catch (e)
	{
		error(`${pkg.name} fail with "${e}"`)
	}
}

main()
