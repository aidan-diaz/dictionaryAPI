//allow user to enter a word
//when they click the button, display the word, parts of speech, and definition of that word
//SPECIFICS
//display word
//display definitions for each part of speech
//display phonetic pronunciation
//possibly add audio pronunciation

//NEED TO ADD A LIST FOR EACH PART OF SPEECH DEFINITION
//NEED TO DISPLAY ALL DEFINITIONS FOR THAT PART OF SPEECH
//CONSIDER WRITING FUNCTION TO CREATE MULTIPLE ULS - AMOUNT DEPENDENT ON HOW MANY ELEMENTS ARE IN MEANINGS ARRAY

//FIX FOR US PRONUNCIATIONS

document.querySelector('#button').addEventListener('click', getWordInfo)
const definitionSection = document.querySelector('#definitionSection')


function getWordInfo() {

    const userWord = document.querySelector('#input').value
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${userWord}`

    fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data)
    
        //clear previous definitions + part of speech before displaying any info
        clearDefinitionsAndPartOfSpeech()
        showUserWord(data)
        showPronunciation(data)
        addAudioPronunciation(data)
        //updated so that showPartOfSpeech function is now being called inside of showDefinitions function
        //now puts part of speech at top of ul before adding definitions to ul
        showDefinitions(data)

    })
    .catch(err => {
        console.log(`error ${err}`)
    })
}



//HELPER FUNCTIONS


function showUserWord(data) {
    document.querySelector('#userWord').innerText = data[0].word
}

function showPronunciation(data) {
    const pronunciation = document.querySelector('#pronunciation')
    //check to see if phonetic property exists in first data array
    if(data[0].phonetic) {
        pronunciation.innerText = `Pronunciation: ${data[0].phonetic}`
    //if not, try to pull from phonetics property instead
    }else if(data[0].phonetics[1]){
        pronunciation.innerText = `Pronunciation: ${data[0].phonetics[1].text}`
        //if no phonetics exist, just change text to say no pronunciation
    }else {
        pronunciation.innerText = '(Pronunciation not available)'
    }  
}

function addAudioPronunciation(data) {


    const audioFile = data[0].phonetics
    console.log(audioFile.length)

    //add spot that says audio file not available by default - if one IS available, the loop will overwrite this text.
    document.querySelector('#audio').innerHTML = '<span>(audio pronunciation not available)</span>'

    //LOOP THROUGH EACH PHONETICS ARRAY
    //check to see if phonetics array has anything inside
    //if it does, try to pull US pronunciation from it
    for(let i = 0; i < audioFile.length; i++) {

        //variable to store where 'us' portion would be in audio link, make sure case is ignored
        let audioString = audioFile[i].audio.substring(audioFile[i].audio.length - 6).toLowerCase()
        console.log(audioString)
        //IF LAST 6 CHARS OF URL CONTAIN US - ADD THAT URL TO THE AUDIO SRC
        //ADD THE AUDIO TAG TO THE AUDIO DIV
        if(audioString.includes('us')) {
            document.querySelector('#audio').innerHTML = `<audio controls src="${audioFile[i].audio}" type="audio/mpeg" id="audio"></audio>` 
        }

    }
}

function showPartOfSpeech(meaningArray, ul) {
    const partOfSpeechContainer = document.createElement('li')
    const partOfSpeech = `(${meaningArray.partOfSpeech})`
    partOfSpeechContainer.innerText = partOfSpeech
    //add part of speech li to DOM
    ul.appendChild(partOfSpeechContainer)
}


function showDefinitions(data) {
    //store definitions array in a variable to use later
    const meaningsArray = data[0].meanings
    
        meaningsArray.forEach(meaningArray => {
            //create a ul for each meaning array and add it to meanings section
            const ul = document.createElement('ul')
            definitionSection.appendChild(ul)
            // console.log(meaningArray.definitions)

            //PASS IN MEANING TO PART OF SPEECH FUNCTION SO IT CAN ACCESS IT
            //add part of speech to top of list before adding definitions 
            showPartOfSpeech(meaningArray, ul)

            //add list of meanings to each newly created ul and append to ul
            meaningArray.definitions.forEach(element => {
                const li = document.createElement('li')
                //add each definition from array to created list
                li.innerText = element.definition
                ul.appendChild(li)
            })
    })
}



// must clear any previously displayed definitions and parts of speech before displaying new ones
//remove everything from section with info
function clearDefinitionsAndPartOfSpeech() {
    definitionSection.innerHTML = ''
}




