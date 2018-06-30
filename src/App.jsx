import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

const siriRecognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
siriRecognition.grammars = speechRecognitionList;
siriRecognition.continuous = true;
siriRecognition.lang = 'en-US';
siriRecognition.interimResults = false;
siriRecognition.maxAlternatives = 1;

const recognition = new SpeechRecognition();
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentSiriIndex: 0,
      currentTranscriptIndex: 0,
      liveSpeechView: '',
    }
  }

  componentDidMount() {
    this.siri();
  }

  generalRecognition = () => {
    let context = this;
    let transcript = '';
    recognition.start();
    recognition.onresult = function(event) {
      console.log('general results')
      let index = context.state.currentTranscriptIndex;
      let allWordsHolder = event.results
      let word = event.results[index][0].transcript
      console.log(word)

      if (word === ' Siri') { //we can also change this back to includes
        context.siri();
        recognition.stop();
      }

      context.setState({ 
        currentTranscriptIndex: context.state.currentTranscriptIndex + 1,
        liveSpeechView: context.state.liveSpeechView + word,
      })
    }

    recognition.onspeechend = function(event) {
      context.setState({ currentcurrentTranscriptIndex: 0 })
      console.log('recognition stopped')
    }
    
    recognition.onnomatch = function(event) {
      console.log('recognition no match')
    }
    
    recognition.onerror = function(event) {
      console.log('recognition error')
    }
  }

  siri = () => {
    let context = this;
    let transcript = '';
    siriRecognition.start();
    siriRecognition.onresult = function(event) {
      console.log('siri results')
      let index = context.state.currentSiriIndex;
      let allWordsHolder = event.results;
      let word = event.results[index][0].transcript
      console.log(word)

      context.setState({
        currentSiriIndex: context.state.currentSiriIndex + 1,
      })

      if (word === ' activate') {
        context.generalRecognition();
        siriRecognition.stop();
      }
    }
    
    siriRecognition.onspeechend = function(event) {
      context.setState({ currentSiriIndex: 0 })
      console.log('siri stopped')
    }
    
    siriRecognition.onnomatch = function(event) {
      console.log('recognition no match')
    }
    
    siriRecognition.onerror = function(event) {
      console.log('recognition error')
    }
  }

  render() {

    let { liveSpeechView } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          {liveSpeechView}
        </p>

      </div>
    );
  }
}

export default App;
