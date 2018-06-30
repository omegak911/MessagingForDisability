import React, { Component } from 'react';
import io from 'socket.io-client/dist/socket.io';

import './App.css';
import { location, secretID } from './config';

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

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      liveSpeechView: '',
      typedSentence:  '',
      wordsArray: [],
      socket: null
    }
  }

  componentDidMount() {
    this.voiceRecognition();

    this.socket = io(`http://${location}:3777`, {
      query: {
        roomId: secretID
      }
    })
    
    this.socket.on('server.enter', ({ msg }) => {
      console.log(msg)
    })

    this.socket.on('server.sentMsg', ({ sentence }) => {
      const { wordsArray } = this.state;
      wordsArray.push(`${sentence}\n`);
      let liveSpeechView = wordsArray.join('');
      this.setState({ wordsArray: [...wordsArray],liveSpeechView });
    })

    this.setState({ socket: this.socket })
  }

  sendMsg = (sentence) => {
    const { socket } = this.state;
    socket.emit('client.sentMsg', { sentence });
  }

  voiceRecognition = () => {
    let context = this;
    recognition.start();
    recognition.onresult = function(event) {
      let sentence = event.results[0][0].transcript

      // if (word === 'delete') {
      //   wordsArray.pop()
      // } else {
      // }

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
      console.log('recognition error')
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
    let { liveSpeechView, mode, typedSentence } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h3 className="App-title">
            {`Verbal Commands
              "delete": removes last word/sentence added
              "line": writes next word/sentence on next line
            `}
          </h3>
        </header>
          <div id="chat">
            <div className="textContainer">
              <div className="textDisplay">
                {liveSpeechView}
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
