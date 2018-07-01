# SpeakingForDisability
Utilize existing speech recognition to build a app that will allow delayed speech patterns (for ppl with speech impediments).

Goals:
* Create an single page application that has a setting for delayed speech patterns
  - regular pauses
  - will wait X seconds before commiting messages
  - will wait for keywor before commiting messages
* Allow users to type as well as speak to text
* Allow users to convert text to speech (for visually impaired)



Functionality
- Keywords: {
    delete: remove last word (e.g. if speech recognition writes incorrect word)
    start spell: initialize spelling of a word
    end spell: initialize end of spelling of a word and add to sentence
    (name): { //next word will initiate the following commands
      send: send email, maybe text as well (if text, maybe it'll be SMS or stored in the app)
    enlarge: display text in larger font
    
    }
}
