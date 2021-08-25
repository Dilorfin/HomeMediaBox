import React, { Component } from 'react';
import { WebView, Linking, Platform, Image, ImageBackground } from 'react-native';

export default class TempScreen extends Component
{
	url:string;
	constructor(inProp)
	{
		super(inProp);

		this.url = inProp.route.params.url
		
	}
	

	render(){
		return (
			<WebView
				ref={(ref) => { this.webview = ref; }}
				source={{ this.uri }}
				onNavigationStateChange={(event) => {
			  		if (event.url !== uri) {
						this.webview.stopLoading();
						Linking.openURL(event.url);
			  		}
				}}
		  	/>
			
		);
	}
}