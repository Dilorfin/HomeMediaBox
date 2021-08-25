
import React, {useState, useEffect} from 'react';
import Voice from '@react-native-voice/voice';
import { Button, Text, View } from 'react-native';

const Dict = () => {
	const [isRecord, setIsRecord] = useState<boolean>(false);
	const [text, setText] = useState<string>('');
	const buttonLabel = isRecord ? 'Stop' : 'Start';
	const voiceLabel = text
		? text
		: isRecord
		? 'Say something...'
		: 'press Start button';

	const _onSpeechStart = () => {
		console.log('onSpeechStart');
		setText('');
	};
	const _onSpeechEnd = () => {
		console.log('onSpeechEnd');
	};
	const _onSpeechResults = (event) => {
		console.log('onSpeechResults');
		setText(event.value[0]);
	};
	const _onSpeechError = (event) => {
		console.log('_onSpeechError');
		console.log(event.error);
	};

	const _onRecordVoice = () => {
		if (isRecord) {
			Voice.stop();
		} else {
			//Voice.start('en-US');
			Voice.start('ru-RU');
		}
		setIsRecord(!isRecord);
	};

	useEffect(() => {
		Voice.onSpeechStart = _onSpeechStart;
		Voice.onSpeechEnd = _onSpeechEnd;
		Voice.onSpeechResults = _onSpeechResults;
		Voice.onSpeechError = _onSpeechError;

		return () => {
			Voice.destroy().then(Voice.removeAllListeners);
		};
	}, []);
	return (
		<View>
			<Text>{voiceLabel}</Text>
			<Button onPress={_onRecordVoice} title={buttonLabel} />
		</View>
	);
};

export default Dict;