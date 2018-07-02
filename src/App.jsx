import React, { Component } from 'react';
import io from 'socket.io-client/dist/socket.io';

import './App.css';
import { location, secretID } from './config';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      typedSentence:  '',
      wordsArray: [],
      socket: null
    }
  }

  componentDidMount() {

    this.voiceRecognition();

    this.socket = io(`http://localhost:3777`, {
      query: {
        roomId: secretID
      }
    })
    
    this.socket.on('server.enter', ({ msg }) => {
      console.log(msg)
    })

    this.socket.on('server.sentMsg', ({ sentence }) => {
      const { wordsArray } = this.state;

      if (sentence === 'delete') {
        wordsArray.pop();
      } else {
        wordsArray.push(`${sentence}\n`);
      }

      this.setState({ wordsArray: [...wordsArray] });
    })

    this.setState({ socket: this.socket })
  }

  sendMsg = (sentence) => {
    const { socket } = this.state;
    socket.emit('client.sentMsg', { sentence });
  }

  voiceRecognition = () => {
    if (!('webkitSpeechRecognition') in window) {
      console.log('hey you do not have the speech recognition');
    }


    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
    const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    recognition.grammars = speechRecognitionList;
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    let context = this;
    recognition.start();
    recognition.onresult = function(event) {
      let sentence = event.results[0][0].transcript

      context.sendMsg(sentence)
      recognition.stop();
    }

    recognition.onend = () => {
      let textDisplay = document.getElementsByClassName('textDisplay')[0];
      textDisplay.scrollTop = textDisplay.scrollHeight;
      context.voiceRecognition();
    }
    
    recognition.onnomatch = (event) => {
      console.log('recognition no match')
    }
    
    recognition.onerror = (event) => {
      console.log('recognition error: ', event.error)
    }
  }

  transcriptSentence = (e) => {
    let typedSentence = e.target.value;
    this.setState({ typedSentence })
  }

  updateChat = (e) => {
    e.preventDefault();
    const { typedSentence } = this.state;
    this.sendMsg(typedSentence);


    this.setState({ typedSentence: '' });
  }

  render() {
    let { mode, typedSentence, wordsArray } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h3 className="App-title">
            {`Singular Verbal Commands
              "delete": removes last word/sentence added
              hello
            `}
          </h3>
        </header>
          <div id="chat">
            <div className="textContainer">
              <div className="textDisplay">
                {wordsArray.map((word, index) =>
                  <span key={index}>
                    {word}
                  </span>
                )}
              </div>
            </div>
            <div>
              <form onSubmit={this.updateChat} onChange={this.transcriptSentence}>
                <input value={typedSentence} />
              </form>
            </div>
          </div>
      </div>
    );
  }
}

export default App;
