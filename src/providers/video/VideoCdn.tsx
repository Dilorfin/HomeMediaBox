import shared from "../../shared";
import DetailsModel from "../../models/DetailsModel";
import VideoProvider, { VideoFileModel } from "../VideoProvider";

export default class VideoCdnProvider implements VideoProvider
{
	static api_token :string = "lyvhjadzMUnDErAS6l7zIAk0M2nMYpbb";
	private translations :string[] = [];

	constructor()
	{
		const url = `https://videocdn.tv/api/translations?api_token=${VideoCdnProvider.api_token}`;

		fetch(url, {
			headers: shared.headers
		})
		.then((response :Response)=>{
			return response.json();
		})
		.then((responseJson:{data:{id:number, smart_title:string}[]})=>{
			responseJson.data.forEach((tr:{id:number, smart_title:string})=>{
				this.translations[tr.id] = tr.smart_title;
			});
		})
	}

	public getProviderTitle() :string
	{
		return "VideoCdn";
	}

	public async getVideos(movieModel: DetailsModel) :Promise<VideoFileModel[]>
	{
		if (!movieModel.imdb_id)
		{
			throw this.getProviderTitle() + ": no imdb id for " + movieModel.title;
		}

		const url = `https://videocdn.tv/api/short?api_token=${VideoCdnProvider.api_token}&imdb_id=${movieModel.imdb_id}`;
		return await fetch(url, {
			headers: shared.headers
		})
		.then((response :Response)=>{
			return response.json();
		})
		.then((responseJson)=>{
			if (responseJson.data.length <= 0)
			{
				console.log(`videocdn has no imdb_id: ${movieModel.imdb_id}`);
			}
			return 'https:'+responseJson.data[0].iframe_src;
		})
		.then((iframe_url :string)=>{
			return fetch(iframe_url, {
				headers: shared.headers
			});
		})
		.then((response :Response)=>{
			return response.text();
		})
		.then((htmlText :string)=>{
			var matches :RegExpMatchArray = htmlText.match(/<input type=["']hidden["'] id=["']files["'] value=["'].*\}">/g);
			if(!matches || matches.length != 1)
			{
				throw `${movieModel.imdb_id} should be checked`;
			}

			return matches[0].replace(/<input type=["']hidden["'] id=["']files["'] value=["']/g, '')
				.replace(/["']>/g, '');
		})
		.then((encodedPlaylist :string)=>{
			var playlist = JSON.parse(VideoCdnProvider.decodeEntities(encodedPlaylist));

			// TODO: check performance of `Object.entries`
			for (const [key, value] of Object.entries(playlist)) {
				playlist[key] = VideoCdnProvider.tb(value as string);

				// TODO:
				// tt4052886 had untitled translation on 0 id
				/*
				const tr_key: number = parseInt(key);
				if(!this.translations[tr_key])
				{
					this.translations[tr_key] = key + "-untitled";
				}*/
			}

			return playlist;
		}).then((playlist :any)=>{
			// TODO: error on some videos https://cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/240.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/240.mp4,[480p]//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/360.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/360.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/240.mp4,[720p]//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/480.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/480.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/360.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/240.mp4,[1080p]//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/720.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/720.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/480.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/360.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/240.mp4
			var result :VideoFileModel[] = [];

			if(movieModel.media_type == 'tv')
			{
				for (const [key, value] of Object.entries(playlist))
				{
					const tr_id :number = parseInt(key);
					const obj = JSON.parse(value as string);

					if(obj[0].folder)
					{
						// array of seasons
						const e_temp = obj.map((s_model)=>{
							const season_id :number = s_model.id;
							return this.mapSeasonEpisodes(season_id, tr_id, s_model.folder);
						})

						// TODO: remake to deal with array of arrays without this crutch
						result = result.concat(e_temp).flat(2);
					}
					else
					{
						// array of episodes of the single season
						const season_id :number = 0;
						const e_temp = this.mapSeasonEpisodes(season_id, tr_id, obj);

						result = result.concat(e_temp);
					}
				}
			}
			else // movies
			{
				for (const [key, value] of Object.entries(playlist))
				{
					const tr_id :number = parseInt(key);
					const files = this.parseEpisodeFiles(value as string);

					result = result.concat(files.map((file)=>{
						return {
							voice_title: this.translations[tr_id],
							url: file.url,
							quality: file.quality
						}
					})).flat();
				}
			}
			return result;
		})
	}

	private parseEpisodeFiles(file :string)
	{
		return file.split(/\s+or\s+|\[\d+p\]\s*|,/g)
					.map((url :string)=>url.trim().replace(/\s+or\s+|\[\d+p\]|,/g, '').trim())
					.filter(s=>s)
					.map((url :string)=>"https:"+url)
					.map((url :string)=>{
						const matches = url.match(/\/\d+\.mp4/g)
							.map((name:string)=>{
								return parseInt(name.match(/\d{3,}/g)[0]);
							});
						if(!matches || matches.length != 1)
						{
							console.error(`${this.getProviderTitle()} can't parse quality from url: ${url}`);
						}
						return {quality:matches[0], url:url}
					});
	}

	private mapSeasonEpisodes(season_id, tr_id, obj)
	{
		return obj.map(e => {
			const id :number = parseInt(e.id.split('_')[1]);
			const files = this.parseEpisodeFiles(e.file);
			return { id, files };
		}).map(ep_model => {
			return ep_model.files.map((file)=>{
				return {
					voice_title: this.translations[tr_id],
					season_id: season_id,
					episode_id: ep_model.id,
					quality: file.quality,
					url: file.url
				}
			})
		}).flat(2)
	}

	private static tb(b :string) :string
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

	private static decodeEntities(encodedString :string) :string
	{
		const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
		const translate = {
			"nbsp": " ",
			"amp" : "&",
			"quot": "\"",
			"lt"  : "<",
			"gt"  : ">"
		};
		return encodedString.replace(translate_re, (match, entity) => {
			return translate[entity];
		}).replace(/&#(\d+);/gi, (match, numStr) => {
			var num = parseInt(numStr, 10);
			return String.fromCharCode(num);
		});
	}

};
