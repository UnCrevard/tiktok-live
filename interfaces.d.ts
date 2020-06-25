type int=number|string
type dirtyString=string

declare module NodeJS
{
	interface Global
	{
		settings:
		{
			pathDownload:string
			videoFormat:string
			useFFMPEG:string|null
			filenameTemplate:string|null
			version:string
			thumbnail:boolean
			json:boolean
		}
	}
}
