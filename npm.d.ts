declare namespace NPM
{
	interface Package
	{
		"name": string
		"version": string // x.y.z
		"description": string
		"main": string
		"bin": Record<string,string>
		"scripts": Record<string,string>
		"keywords": [
			"younow"
		],
		"author": string
		"license": string
		"repository": {
			"url": string
			"type": string
		},
		"dependencies": Record<string,string>
		"devDependencies": Record<string,string>
		"engines": {
			"node": string
		},
		"changelog":Record<string,string>
	}
}
