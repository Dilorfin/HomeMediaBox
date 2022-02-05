import VideoFileModel from "src/models/VideoFileModel";
import FullMovieModel from "../../models/FullMovieModel";
import VideoProvider from "../VideoProvider";

export default class AnilibriaProvider implements VideoProvider
{
	private headers: HeadersInit = {
		'Accept': '*/*',
		'Connection': 'keep-alive',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0'
	};

	public getProviderTitle(): string
	{
		return "Anilibria";
	}

	public getVideos(movieModel: FullMovieModel): Promise<VideoFileModel[]>
	{
		return this.requestForEngJpTitle(movieModel).then((titles:string[]) =>
		{
			if (!titles || titles.length <= 0)
			{
				return [];
			}
			
			const promises = titles.map((title: string) =>
			{
				const urlTitle = encodeURIComponent(title)
					.replace(/%26|&/, ' '); // ???

				const url = `https://api.anilibria.tv/v2/searchTitles?search=${urlTitle}`;
				return fetch(url, { headers: this.headers })
					.then((response: Response) => response.json())
					.then((responseJson) =>
					{
						if (responseJson.error)
						{
							console.log(`${responseJson.error.code} - ${responseJson.error.message}`);
							return [];
						}

						var videos: VideoFileModel[] = [];

						for (const item of responseJson)
						{
							for (const key in item.player.playlist)
							{
								const ser = item.player.playlist[key];

								if (ser.hls.fhd)
								{
									videos.push(this.createVideoFileModel(item, ser, 'fhd'));
								}

								if (ser.hls.hd)
								{
									videos.push(this.createVideoFileModel(item, ser, 'hd'));
								}

								if (ser.hls.sd)
								{
									videos.push(this.createVideoFileModel(item, ser, 'sd'));
								}
							}
						}

						return videos;
					});
			});

			return Promise.all(promises).then((values:VideoFileModel[][]) =>{
				return values.flat().filterUnique((v:VideoFileModel) => `${v.episode_id}${v.season}${v.voice_title}`);
			}).then(v => {
				console.log(v);
				return v;
			});
		});
	}

	private requestForEngJpTitle(movieModel: FullMovieModel): Promise<string[]>
	{
		const kitsu_url: string = `https://kitsu.io/api/edge/anime?filter[text]=${movieModel.original_title}`;

		return fetch(kitsu_url, { headers: this.headers })
			.then((response: Response) => response.json())
			.then((responseJson) =>
			{
				const anime = responseJson.data.filter(d => d.type == 'anime');
				if (anime.length <= 0)
				{
					console.log(`${movieModel.title} wasn't found at kitsu db (Anilibria.tv)`);
					return null;
				}

				const lowOriginalTitle = movieModel.original_title.toLowerCase();

				const english = movieModel.translations.filter(tr => tr.iso_639_1 === "en")[0];
				const lowEnglishTitle = english.data.title.toLowerCase();
				for(var i = 0; i < anime.length; i++)
				{
					var titles:string[] = Object.values(anime[i].attributes.titles);
					const result = titles
						.filter((t:string) => t)
						.map((t:string) => t.toLowerCase())
						.find((v:string)=> v == lowOriginalTitle || v == lowEnglishTitle);
					if (result)
					{
						titles.push(anime[i].attributes.slug);
						return titles;
					}
				}

				return null;
			});
	}

	private createVideoFileModel(item, series, quality: 'fhd' | 'hd' | 'sd'): VideoFileModel
	{
		let quality_number = 240;
		if (quality == 'hd')
		{
			quality_number = 720;
		}
		else if (quality == 'fhd')
		{
			quality_number = 1080;
		}

		return {
			voice_title: item.team.voice.join(", "),
			episode_id: Number(series.serie),
			season: item.names.ru,
			quality: quality_number,
			url: `https://${item.player.host}${series.hls[quality]}`,
			watched: false
		};
	}
};
