import VideoFileModel from "src/models/VideoFileModel";
import DetailsModel from "../../models/DetailsModel";
import VideoProvider from "../VideoProvider";

export default class VideoCdnProvider implements VideoProvider
{
	static api_token: string = "7WK0ouTGfe2s9BCIGhHs73ythAab09sg";
	private translations: Promise<string[]>;

	private headers: HeadersInit = {
		'Accept': '*/*',
		'Connection': 'keep-alive',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0'
	};

	constructor()
	{
		const url = `https://videocdn.tv/api/translations?api_token=${VideoCdnProvider.api_token}`;
		this.translations = fetch(url, { headers: this.headers })
			.then((response: Response) => response.json())
			.then((responseJson: { data: { id: number, smart_title: string }[] }) =>
			{
				var result:string[] = [];
				responseJson.data.forEach((tr: { id: number, smart_title: string }) =>
				{
					result[tr.id] = tr.smart_title;
				});
				return result;
			});
	}

	public getProviderTitle(): string
	{
		return "VideoCdn";
	}

	public async getVideos(movieModel: DetailsModel): Promise<VideoFileModel[]>
	{
		if (!movieModel.imdb_id)
		{
			console.log(`${this.getProviderTitle()}: no imdb id for ${movieModel.title}`);
			return [];
		}

		const url = `https://videocdn.tv/api/short?api_token=${VideoCdnProvider.api_token}&imdb_id=${movieModel.imdb_id}`;
		return await fetch(url, { headers: this.headers })
			.then((response: Response) => response.json())
			.then((responseJson) =>
			{
				if (responseJson.data.length <= 0)
				{
					throw `videocdn has no imdb_id: ${movieModel.imdb_id}`;
				}
				return `https:${responseJson.data[0].iframe_src}`;
			})
			.then((iframe_url: string) =>
			{
				return fetch(iframe_url, { headers: this.headers });
			})
			.then((response: Response) => response.text())
			.then((htmlText: string) =>
			{
				var matches: RegExpMatchArray = htmlText.match(/<input type=["']hidden["'] id=["']files["'] value=["'].*\}">/g);
				if (!matches || matches.length != 1)
				{
					throw `${movieModel.imdb_id} should be checked`;
				}
				var filesString:string = matches[0].replace(/<input type=["']hidden["'] id=["']files["'] value=["']/g, '')
					.replace(/["']>/g, '');

				matches = htmlText.match(/userKey\s*=\s*["'].*["']/g);
				const userKey:string = matches[0].replace(/userKey\s*=\s*/, '').replaceAll('"', '');

				return filesString.replaceAll(userKey, '.mp4');
			})
			.then((encodedPlaylist: string) =>
			{
				var playlist = JSON.parse(VideoCdnProvider.decodeEntities(encodedPlaylist));

				// TODO: check performance of `Object.entries`
				for (const [key, value] of Object.entries(playlist))
				{
					playlist[key] = VideoCdnProvider.tb(value as string);
				}

				return playlist;
			}).then(async (playlist: any) =>
			{
				// TODO: 404 error on some videos
				var result: VideoFileModel[] = [];

				if (movieModel.media_type == 'tv')
				{
					for (const [key, value] of Object.entries(playlist))
					{
						const tr_title: string = await this.getTranslationTitle(parseInt(key));
						const obj = JSON.parse(value as string);

						if (obj[0].folder) // array of seasons
						{
							const e_temp: VideoFileModel[] = obj.map((s_model) =>
							{
								return this.mapSeasonEpisodes(s_model.id, tr_title, s_model.folder);
							})

							// TODO: remake to deal with array of arrays without this crutch
							result = result.concat(e_temp).flat(2);
						}
						else // array of episodes of the single season
						{
							const season: number = 0;
							const e_temp = this.mapSeasonEpisodes(season, tr_title, obj);

							result = result.concat(e_temp);
						}
					}
				}
				else // movies
				{
					for (const [key, value] of Object.entries(playlist))
					{
						const tr_title: string = await this.getTranslationTitle(parseInt(key));
						const files = this.parseEpisodeFiles(value as string);

						result = result.concat(files.map((file) =>
						{
							return {
								voice_title: tr_title,
								url: file.url,
								quality: file.quality,
								watched: false
							}
						})).flat();
					}
				}

				result = result.filterUnique((el: VideoFileModel) => `${el.voice_title}${el.url}`);

				return result;
			})
			.catch((reason) =>
			{
				console.log(reason);
				return [];
			});
	}

	private parseEpisodeFiles(file: string): { quality: number, url: string }[]
	{
		return file.split(/\s+or\s+|\[\d+p\]\s*|,/g)
			.map((url: string) => url.trim().replace(/\s+or\s+|\[\d+p\]|,/g, '').trim())
			.filter(s => s)
			.map((url: string) => `https:${url}`)
			.map((url: string) =>
			{
				const matches: number[] = url.match(/\/\d+\.mp4/g)
					.map((name: string) =>
					{
						return parseInt(name.match(/\d{3,}/g)[0]);
					});
				if (!matches || matches.length != 1)
				{
					console.error(`${this.getProviderTitle()} can't parse quality from url: ${url}`);
				}
				return { quality: matches[0], url: url };
			});
	}

	private mapSeasonEpisodes(season, tr_title, obj): VideoFileModel
	{
		return obj.map(e =>
		{
			const id: number = parseInt(e.id.split('_')[1]);
			const files = this.parseEpisodeFiles(e.file);
			return { id, files };
		}).map(ep_model =>
		{
			return ep_model.files.map((file) =>
			{
				return {
					voice_title: tr_title,
					season: season,
					episode_id: ep_model.id,
					quality: file.quality,
					url: file.url
				}
			})
		}).flat(2);
	}

	private async getTranslationTitle(tr_id: number): Promise<string>
	{
		return this.translations
			.then(translations => translations[tr_id] || `${tr_id}-untitled`);
	}

	private static tb(b: string): string
	{
		if (b.indexOf(".") != -1)
			return b;

		b = b.substr(1);
		var s2 = "";
		for (var j = 0; j < b.length; j += 3)
			s2 += "%u0" + b.slice(j, j + 3);
		b = unescape(s2);
		return b;
	}

	private static decodeEntities(encodedString: string): string
	{
		const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
		const translate = {
			"nbsp": " ",
			"amp": "&",
			"quot": "\"",
			"lt": "<",
			"gt": ">"
		};
		return encodedString.replace(translate_re,
			(_match, entity) => translate[entity]
		).replace(/&#(\d+);/gi, (_match, numStr) =>
		{
			var num = parseInt(numStr, 10);
			return String.fromCharCode(num);
		});
	}
};
