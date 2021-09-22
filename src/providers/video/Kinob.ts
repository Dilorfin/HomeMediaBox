import VideoFileModel from "src/models/VideoFileModel";
import DetailsModel from "../../models/DetailsModel";
import VideoProvider from "../VideoProvider";

export default class KinobProvider implements VideoProvider
{
	private headers: HeadersInit = {
		'Accept': '*/*',
		'Connection': 'keep-alive',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0'
	};

    getProviderTitle(): string 
    {
        return "Kinob";
    }

    getVideos(movieModel: DetailsModel): Promise<VideoFileModel[]> 
    {
        return fetch(`https://kinob.net/search?query=${encodeURIComponent(movieModel.title)}`, 
        {
             headers: this.headers
        })
            .then(res => res.text())
            .then(function(text)
            {
                var parser = new DOMParser();
                var doc = parser.parseFromString(text, `text/html`);
                var films = doc.getElementsByClassName(`col-xs-2 item`);
                if(films.length == 0)
                    console.error(`Kinob has no film with title ${movieModel.title} `);
                if(films.length > 1)
                    console.error(`AAAAAAAA too much films with title ${movieModel.title}, i dont know how to deal with it`);
                
                var href = films[0].getElementsByTagName(`a`)[0].getAttribute(`href`);
            })
    }

}