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

	constructor() { }

	public getProviderTitle(): string
	{
		return "Anilibria";
	}

	public async getVideos(movieModel: DetailsModel): Promise<VideoFileModel[]>
	{
		const kitsu_url: string = `https://kitsu.io/api/edge/anime?filter[text]=${movieModel.original_title}`;

		return await fetch(kitsu_url, {
			headers: this.headers
		})
			.then((response: Response) =>
			{
				return response.json();
			})
			.then((responseJson) =>
			{
				return responseJson.data.filter(d => d.type == 'anime')[0].attributes.canonicalTitle;
			}).then((title) =>
			{
				const url = `https://api.anilibria.tv/v2/searchTitles?search=${title}`;
				return fetch(url, {
					headers: this.headers
				})
					.then((response: Response) =>
					{
						return response.json();
					})
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
									videos.push({
										voice_title: item.team.voice.join(", "),
										episode_id: Number(ser.serie),
										season_id: item.names.ru,
										quality: 1080,
										url: `https://${item.player.host}${ser.hls.fhd}`,
									});
								}

								if (ser.hls.hd)
								{
									videos.push({
										voice_title: item.team.voice.join(", "),
										episode_id: Number(ser.serie),
										season_id: item.names.ru,
										quality: 720,
										url: `https://${item.player.host}${ser.hls.hd}`,
									});
								}

								if (ser.hls.sd)
								{
									videos.push({
										voice_title: item.team.voice.join(", "),
										episode_id: Number(ser.serie),
										season_id: item.names.ru,
										quality: 480,
										url: `https://${item.player.host}${ser.hls.sd}`,
									});
								}
							}
						}

						return videos;
					});
			});
	}
};
