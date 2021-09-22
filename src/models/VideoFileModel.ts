export default interface VideoFileModel
{
	voice_title :string,

	season ?:string,
	episode_id ?:number,

	quality :number,
	url :string
};
