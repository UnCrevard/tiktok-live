# tiktok-live

## Installation

1st you need to install  [NodeJS](https://nodejs.org/en/download/current/) download and install the LTS or Current.

Then launch your terminal (cmd.exe on windows) and install tiktok-live with NPM :

	npm install -g tiktok-live

The command **tiktok-live** will be available in your console (cmd.exe or powershell.exe or bash)

To update tiktok-live just type :

	npm update -g

### Change log

20200625/1.0.0

	first release

## Summary

download live streams via shared link.

## How To

tiktok-live options link

## Options

### --dl <path>

Change default download folder (current path is the default)

### -v --verbose

Increase verbosity level (all commands)

-v basic messages (in blue)
-vv debug messages (in green) network
-vvv dump json requests

### --fmt videoformat (not working WIP)

Set the video output format (use FFMPEG)

	tiktok-live --fmt mp4 url
	tiktok-live --fmt mkv url

MP4 will add "-bsf:a aac_adtstoasc" for compatibility

default FFMPEG args are :

-hide_banner // no banner
-loglevel error // silence
-c copy // copy stream without reencoding
-video_track_timescale 0 // some broadcasters need this (corrupted videos)

**FFMPEG MUST BE IN YOUR PATH (on Windows) OR INSTALLED (on Linux)**

### --ffmpeg commandLine (not working WIP)

Use ffmpeg to encode the video.

	tiktok-live --fmt mkv --ffmpeg "-s 320x240 -r 30 -an" url
	tiktok-live --fmt avi --ffmpeg "-vcodec libxvid -acodec libmp3lame" url

**FFMPEG MUST BE IN YOUR PATH (on Windows) OR INSTALLED (on Linux)**

### --json

	save belong the video a json file with some infos about the stream.

### -h --help

Guess what ?

## Comments

**As an open source project use it at your own risk. Tiktok can break it down at any time.**

Report any bug or missing feature at your will.

If you like this software, please consider a Bitcoin donation to bitcoin://14bpqrNgreKaFtLaK85ArtcUKyAxuKpwJM

# Enjoy !
