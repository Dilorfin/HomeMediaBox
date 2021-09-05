export default interface VideoFileModel
{
	voice_title :string,

	season_id ?:number,
	episode_id ?:number,

	quality :number,
	url :string
};
