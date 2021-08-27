import defaults from "../../defaults";
import DetailsModel from "../../models/DetailsModel";

export default class VideoCdnProvider {
	static async getVideoUrl(movieModel:DetailsModel) :Promise<string>
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
				"nbsp":" ",
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

		const api_token = "lyvhjadzMUnDErAS6l7zIAk0M2nMYpbb";
		const url = `https://videocdn.tv/api/movies?api_token=${api_token}&field=imdb_id&query=${movieModel.imdb_id}`;
		return await fetch(url, {
			headers: defaults.headers
		}).then((response :Response)=>{
			return response.json();
		}).then((responseJson)=>{
			return "https:"+responseJson.data[0].media[0].qualities[0].url;
		}).then((playerUrl :string)=>{
			return fetch(playerUrl, {
				headers: defaults.headers
			});
		}).then((response :Response)=>{
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
		.then((decodedPlaylist :string)=>{
			var playlist = JSON.parse(decodeEntities(decodedPlaylist));

			for (const [key, value] of Object.entries(playlist)) {
				playlist[key] = tb(value);
			}
			return playlist;
		})
		.then((playlist)=>{
			return "https:" + playlist[Object.keys(playlist)[0]]
				.match(/\[1080p\]\/\/cloud.cdnland.in\/.*720.mp4/g)[0]
				.split(" or ")[0]
				.replace(/\[1080p\]/, '');
		});
	}
};