import shared from "../../shared";
import DetailsModel from "../../models/DetailsModel";
import VideoProvider, { MovieModel, SeriesModel } from "../VideoProvider";

export default class VideoCdnProvider implements VideoProvider 
{
	static api_token:string = "lyvhjadzMUnDErAS6l7zIAk0M2nMYpbb";
	private translations:{id:number, title:string}[];

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
			this.translations = responseJson.data.map(({id, smart_title})=>{
				return {id:id, title:smart_title};
			})
		})
	}

	getProviderTitle() :string
	{
		return "VideoCdn";
	}

	private parseSeason(model) :SeriesModel
	{
		var voices:any[] = [];
		
		for (const [key, value] of Object.entries(model)) 
		{
			var episodes = JSON.parse(value as string)
				.map((temp :{id :string, file :string})=>{
					const id :number = parseInt(temp.id.split('_')[1]);
					const files = temp.file.split(/\s+or\s+|\[\d+p\]\s*|,/g)
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
					return { id, files };
				});

			voices.push({
				title: this.translations[key],
				episodes: episodes
			});
		}

		return { seasons:[{voices: voices}] };
	}

	async getVideoModel(movieModel: DetailsModel) :Promise<MovieModel | SeriesModel>
	{
		function tb(b) {
			if (b.indexOf(".") == -1) {
				b = b.substr(1);
				var s2 = "";
				for (var j = 0; j < b.length; j += 3)
					s2 += "%u0" + b.slice(j, j + 3);
				b = unescape(s2)
			}
			return b
		}
		function decodeEntities(encodedString :string) {
			var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
			var translate = {
				"nbsp": " ",
				"amp" : "&",
				"quot": "\"",
				"lt"  : "<",
				"gt"  : ">"
			};
			return encodedString.replace(translate_re, function(match, entity) {
				return translate[entity];
			}).replace(/&#(\d+);/gi, function(match, numStr) {
				var num = parseInt(numStr, 10);
				return String.fromCharCode(num);
			});
		}

		const url = `https://videocdn.tv/api/short?api_token=${VideoCdnProvider.api_token}&imdb_id=${movieModel.imdb_id}`
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
			var playlist = JSON.parse(decodeEntities(encodedPlaylist));

			for (const [key, value] of Object.entries(playlist)) {
				playlist[key] = tb(value);
			}

			return playlist;
		})
		.then((playlist :any)=>{
			// check for error https://cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/240.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/240.mp4,[480p]//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/360.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/360.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/240.mp4,[720p]//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/480.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/480.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/360.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/240.mp4,[1080p]//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/720.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/720.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/480.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/360.mp4%20or%20//cloud.cdnland.in/tvseries/5e20363c611a52e737b0891d5c038799f474b4ef/b1b24c3a2dd248037f6344a52ad4b507:2021082921/240.mp4
			if(movieModel.media_type == 'tv')
			{
				if(Array.isArray(playlist))
				{

				}
				else
				{
					return this.parseSeason(playlist);
				}
			}
			else 
			{

			}
			return playlist
		})
	}
};
