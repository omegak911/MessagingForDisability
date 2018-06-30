import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
    }
  }

  componentDidMount() {
    this.generalRecognition();
  }

  generalRecognition = () => {
    let context = this;
    recognition.start();
    recognition.onresult = function(event) {
      let word = event.results[0][0].transcript
      console.log(word)
      let { wordsArray } = context.state;

      if (word === 'delete') {
        wordsArray.pop()
      } else if (word === 'line') {
        wordsArray.push('\n')
      } else {
        word = ' ' + word;
        wordsArray.push(word)
      }

      let sentence = wordsArray.join('');

      context.setState({ 
        liveSpeechView: sentence,
        wordsArray: [...wordsArray],
      })
      recognition.stop();
    }

    recognition.onend = () => {
      let textDisplay = document.getElementsByClassName('textDisplay')[0];
      textDisplay.scrollTop = textDisplay.scrollHeight;
      context.generalRecognition();
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
    const { typedSentence, wordsArray } = this.state;

    wordsArray.push(`\n${typedSentence}\n`);
    let liveSpeechView = wordsArray.join('');

    this.setState({ wordsArray: [...wordsArray], typedSentence: '', liveSpeechView });
  }

  render() {
    let { liveSpeechView, mode, typedSentence } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
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
