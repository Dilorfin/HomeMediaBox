import VideoFileModel from "src/models/VideoFileModel";
import DetailsModel from "../../models/DetailsModel";
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

	public async getVideos(movieModel: DetailsModel): Promise<VideoFileModel[]>
	{
		return await this.requestForEngJpTitle(movieModel).then((title) =>
		{
			const url = `https://api.anilibria.tv/v2/searchTitles?search=${title}`;
			return fetch(url, { headers: this.headers })
				.then((response: Response) => response.json())
				.then((responseJson) =>
				{
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
	}

	private requestForEngJpTitle(movieModel: DetailsModel): Promise<string>
	{
		const kitsu_url: string = `https://kitsu.io/api/edge/anime?filter[text]=${movieModel.original_title}`;
		return fetch(kitsu_url, { headers: this.headers })
			.then((response: Response) => response.json())
			.then((responseJson) =>
			{
				const animes = responseJson.data.filter(d => d.type == 'anime');
				return animes[0].attributes.canonicalTitle;
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
			season_id: item.names.ru,
			quality: quality_number,
			url: `https://${item.player.host}${series.hls[quality]}`,
		};
	}
};
