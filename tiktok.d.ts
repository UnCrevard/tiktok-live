declare namespace Tiktok
{
	const enum StatusCode
	{
		OK=0,
		INVALID_PARAMS=5
	}

	// live

	const enum LiveStatusCode
	{
		LiveIsRunning=2,
		LiveIsOver=4
	}

	interface WebLive
	{
		"/share/live/:id":LiveStream
	}

	interface LiveStream
	{
		statusCode: number // 0 = ok
		$isMobile: boolean
		$isIOS: null,
		$isAndroid: boolean
		$origin: "https://m.tiktok.com",
		$pageUrl: string
		$region: string // FR
		$language: string // fr
		$originalLanguage: string // fr
		$os: string // windows
		$reflowType: "m",
		$appId: 1233
		$botType: "others",
		$appType: "m",
		$downloadLink: {
			amazon: {
				visible: true,
				normal: string
			},
			google: {
				visible: true,
				normal: string
			},
			apple: {
				visible: true,
				normal: string
			}
		},
		$config: {
			covidBanner: {
				open: true,
				url: "https://www.tiktok.com/safety/resources/covid-19",
				background: "rgba(125,136,227,1)"
			},
			bytedanceLink: {
				linkVisible: true,
				overrideUrl: ""
			}
		},
		$baseURL: "m.tiktok.com"
		pageState: {
			regionAppId: 1233,
			os: "windows",
			region: "FR",
			baseURL: "m.tiktok.com",
			appType: "m",
			fullUrl: string
		},
		liveData: {
			RoomId: int
			Status: int
			Title: string
			LiveUrl: string // "http://*/playlist.m3u8",
			OwnerInfo:
			{
				Id: string
				ShortId: string
				UniqueId: string
				Nickname: string
				AvatarThumb: {
					Uri: string
					UrlList: [
						string
					]
				},
				AvatarMedium: {
					Uri: string
					UrlList: [
						string
					]
				},
				AvatarLarger: {
					Uri: string
					UrlList: [
						string
					]
				},
				Signature: string
				CreateTime: int
				Verified: false,
				SecUid: string
				Secret: false,
				Ftc: false,
				Relation: 0,
				OpenFavorite: false
			},
			LiveRoomStats: {
				UserCount: 1,
				EnterCount: 2,
				DiggCount: 0
			},
			coverUrl: {
				Uri: string
				UrlList: [
					string
				]
			}
		},
		shareUser: {
			secUid: "",
			userId: "",
			uniqueId: "",
			nickName: "",
			signature: "",
			covers: [],
			coversMedium: [],
			coversLarger: [],
			isSecret: false,
			relation: -1
		},
		shareMeta: {
			title: string
			desc: string
		}
	}

	// https://www.tiktok.com/node/share/user/@username

	interface UserInfo
	{
		"body":
		{
			"pageState":
			{
				"regionAppId": 1233,
				"os": "windows",
				"region": "FR",
				"baseURL": "m.tiktok.com",
				"appType": "t",
				"fullUrl": "https://www.tiktok.com/node/share/user/@username"
			},
			"userData":
			{
				"secUid": string
				"userId": int
				"isSecret": false,
				"uniqueId": string
				"nickName": dirtyString
				"signature": dirtyString
				"covers": [string],
				"coversMedium": [string],
				"following": number
				"fans": number
				"heart": "0",
				"video": number
				"verified": boolean
				"digg": number
				"ftc": false,
				"relation": -1,
				"openFavorite": false
			},
			"shareUser":
			{
				"secUid": "",
				"userId": "",
				"uniqueId": "",
				"nickName": "",
				"signature": "",
				"covers": [],
				"coversMedium": [],
				"coversLarger": [],
				"isSecret": false,
				"relation": -1
			},
			"shareMeta":
			{
				title: dirtyString
				desc: dirtyString
			},
			"statusCode": number
			"langList":
			[
				{
					"value": "id",
					"alias": "id-ID",
					"label": "Bahasa Indonesia",
					"children": [
					{
						"value": "default",
						"label": ""
					}]
				}
			],
			"metaParams":
			{
				"title": dirtyString
				"keywords": dirtyString
				"description": dirtyString
				"robotsContent": "index, follow",
				"canonicalHref": string
				"alternateHref": null,
				"amphtmlHref": null,
				"applicableDevice": "pc, mobile"
			},
			"itemList": [],
			"descVideo":
			{}
		},
		"statusCode": 0,
		"errMsg": null
	}
}
