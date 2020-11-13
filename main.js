let voiced_button = null;
let voiceless_button = null;
let IPA_button = null;
let IPA_vowels = null;

window.onload = function() {
  const entry = document.getElementById("entry");
  entry.addEventListener(`click`, recognize, true);

  const button_group = document.getElementById(`place-controls`);
  button_group.addEventListener(`click`, ShowPosition, true);
  button_group.addEventListener(`click`, ShowPosition, true);

  const pronounce_group = document.querySelectorAll(".pronounce");
  for(const pronounce of pronounce_group) {
    pronounce.addEventListener(`click`, speak);
  }

  IPA_vowels = document.getElementById(`IPA-vowels`);
  IPA_button = document.getElementById(`IPA-button`);
  IPA_button.addEventListener(`click`, ToggleIPA, true);
};

const pronunciation_lookup = {
  "p": {
    "sound" : "/pə/",
    "place" : "bilabial",
    "voice" : "voiceless"
  },
  "b" : {
    "sound" : "/bə/",
    "place" : "bilabial",
    "voice" : "voiced"
  }, 
  "m" : {
    "sound" : "/mə/",
    "place" : "bilabial",
    "voice" : "voiced"
  },
  "f" : {
    "sound" : "/fə/",
    "place" : "labiodental",
    "voice" : "voiceless"
  },
  "v" : {
    "sound" : "vuh",
    "place" : "labiodental",
    "voice" : "voiced"
  },
  "th1" : {
    "sound" : "thuh",
    "place" : "dental",
    "voice" : "voiceless"
  }, 
  "th2" : {
    "sound" : "/ðə/",
    "place" : "dental",
    "voice" : "voiced"
  }, 
  "t" : {
    "sound" : "/tə/",
    "place" : "dental",
    "voice" : "voiceless"
  }, 
  "s" : {
    "sound" : "/sə/",
    "place" : "dental",
    "voice" : "voiceless"
  }, 
  "d" : {
    "sound" : "duh",
    "place" : "dental",
    "voice" : "voiced"
  }, 
  "z" : {
    "sound" : "/zə/",
    "place" : "dental",
    "voice" : "voiced"
  },
  "n" : {
    "sound" : "/nə/",
    "place" : "dental",
    "voice" : "voiced"
  }, 
  "l" : {
    "sound" : "ull",
    "place" : "dental",
    "voice" : "voiced"
  }, 
  "r" : {
    "sound" : "/ər/",
    "place" : "dental",
    "voice" : "voiced"
  }, 
  "sh" : {
    "sound" : "shuh",
    "place" : "postalveolar",
    "voice" : "voiceless"
  }, 
  "ch" : {
    "sound" : "chuh",
    "place" : "postalveolar",
    "voice" : "voiceless"
  }, 
  "dg" : {
    "sound" : "/ʒə/",
    "place" : "postalveolar",
    "voice" : "voiced"
  }, 
  "y" : {
    "sound" : "yuh",
    "place" : "palatal",
    "voice" : "voiced"
  }, 
  "k" : {
    "sound" : "/kə/",
    "place" : "velar",
    "voice" : "voiceless"
  }, 
  "g" : {
    "sound" : "guh",
    "place" : "velar",
    "voice" : "voiced"
  }, 
  "w" : {
    "sound" : "wuh",
    "place" : "velar",
    "voice" : "voiced"
  }, 
  "ng" : {
    "sound" : "ing",
    "place" : "velar",
    "voice" : "voiced"
  }, 
  "uh" : {
    "sound" : "uh",
    "place" : "glottal",
    "voice" : "voiceless"
  },
  "h" : {
    "sound" : "/hə/",
    "place" : "glottal",
    "voice" : "voiceless"
  }
};

const consonantMaps = {
  "c" : {
    "sound": "/kə/",
    "place" : "glottal",
    "voice" : "voiceless"
  },
  "q" : {
    "sound" : "/kwə/",
    "place" : "glottal",
    "voice" : "voiceless"
  },
  "j" : {
    "sound" : "juh", 
    "place" : "postalveolar", 
    "voice" : "voiced"
  },
  "x" : {
    "sound" : "iks", 
    "place" : "glottal", 
    "voice" : "voiceless"
  }
}

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

function recognize (event) {
  recognition.start();
}
  
recognition.onresult = function(event) {
  var result = event.results[0][0].transcript;
  console.log("recognized " + result);
  var lower = result.toLowerCase();
  var consonants = lower.split(/[aeiou]/);
  for(let i = 0; i < consonants.length; i++) {
    if(consonants[i].length > 1) {
      if(consonants[i].charAt(0) === consonants[i].charAt(1)) {
        consonants[i] = consonants[i].charAt(0);
      } else if(consonants[i] === "th") consonants[i] += "1";
    }
  }
  pronounce(consonants);
}

var synth = window.speechSynthesis;

function speak(event) {
  const target = event.target;
  const key = target.id.replace("-button", "");
  const pronounce = pronunciation_lookup[key];
  const sound = pronounce.sound;
  say(sound);
}

function say(sound) {
  var utterance = new SpeechSynthesisUtterance(sound);
  utterance.pitch = 1;
  utterance.rate = 1;
  synth.speak(utterance);
}
 
function ToggleIPA (evt) {
  var button = evt.target.parentNode;
  button.classList.toggle(`active`);
  IPA_vowels.classList.toggle(`show`);
};

function pronounce (consonants) {
  console.log("pronounce " + consonants);
  consonants.forEach((consonant) => {
    console.log(consonant);
    let soundObject = pronunciation_lookup[consonant];
    if(!soundObject) {
      soundObject = consonantMaps[consonant];
    }
    console.log("sound object", soundObject);
    const sound = soundObject.sound;
    const place = soundObject.place;
    const voice = soundObject.voice;
    animateAll();
    window.setTimeout(say(sound), 100);
    window.setTimeout(animateSound(place, voice), 2000);
  });
};

function ShowPosition (evt) {
  var button = evt.target.parentNode;
  let place = button.dataset.place;
  let voice = button.dataset.voice;
  animateSound(place, voice);
};

var nextPath = null;
var animationRounds = 0;
function animateAll(place, voice) {
  // console.log(place + " " + voice);
  //animationRounds++;
  //console.log("animation rounds", animationRounds);
  var changed = false;
  articulators = ["jaw", "palate", "tongue", "vocalfolds", "cartilage"];
  //articulators = ["vocalfolds"];
  articulators.forEach((articulator) => {
    console.log(articulator);
    var articulator_el = document.getElementById(articulator);
    // console.log(articulator, articulator_el);
    var currentPath = articulator_el.getAttribute("d");
    // console.log("currentPath " + currentPath);
    
    let articulatorObject = articulatorLookup[articulator];
    let placeObject = articulatorObject;
    if(articulator === "vocalfolds" || articulator === "cartilage") {
      placeObject = articulatorObject[voice];
    } else {
      placeObject = articulatorObject[place];
    }
    if(!placeObject) {
      placeObject = articulatorObject["rest"];
    }

    console.log("place object",placeObject);
    nextPath = placeObject.path;
    if(nextPath) {
      nextPath = nextPath.replace(/,/g, " ").trim();
      currentPath = currentPath.replace(/,/g, " ").trim();

      if (nextPath != currentPath) {

        var currentNumberArray = currentPath.split(/\W+/);
        var newNumberArray = nextPath.split(/\W+/);
        for (var n = 0; currentNumberArray.length > n; n++) {
          if (currentNumberArray[n]) {
            command = currentNumberArray[n].match(/\D/);
            eachCurrentNum = Number(currentNumberArray[n].match(/\d+/));
            eachNewNum = Number(newNumberArray[n].match(/\d+/));

            if ("Z" == command) {
              eachCurrentNum = "";
            } else if (eachNewNum > eachCurrentNum) {
              eachCurrentNum++;
              changed = true;
            } else if (eachCurrentNum > eachNewNum) {
              eachCurrentNum--;
              changed = true;
            }

            currentNumberArray[n] = command + eachCurrentNum;
          }
        }
        var tempPath = currentNumberArray.join(" ").trim();
        articulator_el.setAttribute("d", tempPath);
      }
    }
  });

  if (changed) {
    window.setTimeout(animateAll(place, voice), 0);
  }
} 

function animateSound (place, voice) {
  animateAll(place, voice);
  // var vocalFoldsDesc = vocalFoldsArray[voice];
  // newVocalFolds = vocalFoldsDesc;

  // var cartilageDesc = cartilageArray[voice];
  // newCartilage = cartilageDesc;

  // AnimateVocalFolds();
  // AnimateCartilage();

  // var jawPosition = place;
  // if (!jawArray[place]) {
  //   jawPosition = "rest";
  // }
  // var jawDesc = jawArray[jawPosition];

  // var palatePosition = place;
  // if (!palateArray[place]) {
  //   palatePosition = "pharyngeal";
  // }
  // var palateDesc = palateArray[palatePosition];

  // var tonguePosition = place;
  // if (!tongueArray[place]) {
  //   tonguePosition = "rest";
  // }
  // var tongueDesc = tongueArray[tonguePosition];

  // newTongue = tongueDesc;
  // AnimateTongue();

  // newJaw = jawDesc;
  // AnimateJaw();
  // newpalate = palateDesc;
  // Animatepalate();
};
 
const articulatorLookup = {
  "tongue" : {
      "rest": {
        "path":"M159,283 C179,254 128,235 91,243 S59,264 86,280", 
        "desc":"The tongue is at a place of rest near the front of the mouth."
      },
      "dental": {
        "path":"M159,283 C174,244 130,236 79,250 S67,259 86,280",
        "desc":"The tongue is positioned between the teeth."
      },
      "alveolar": {
        "path":"M159,283 C174,244 131,254 87,242 S68,254 86,280",
        "desc":"The tongue is positioned to touch the alveolar ridge, located behind the teeth on the roof of the mouth."
      },
      "postalveolar": {
        "path":"M159,283 C145,247 91,206 74,246 S103,224 86,280",
        "desc":"The tongue is bunched near the middle of the mouth, behind the alveolar ridge."
      },
      "palatal": {
        "path":"M159,283 C177,213 113,214 87,248 S107,247 86,280",
        "desc":"The tongue is bunched near the back of the mouth, at the hard palate."
      },
      "velar": {
        "path":"M159,283 C158,162 126,236 88,249 S93,261 86,280",
        "desc":"The tongue is positioned far in the back of the mouth, touching the velum."
      }
      // "uvular": {
      //   "path":"M159,283 C183,177 147,230 94,249 S93,261 86,280",
      //   "desc":""
      // }
      // "pharyngeal": {
      //   "path":"M159,283 C204,257 196,219 120,246 S109,261 86,280",
      //   "desc":""
      // }
  },
  "jaw" : {
      "rest": {
        "path":"M175,418 C152,370 155,346 177,305 S172,299 163,298 C183,273 161,277 159,282 Q117,264 86,280 Q69,283 64,270 T61,283 C49,279 54,259 38,267 S44,285 39,301 C27,352 55,341 101,340 S131,364 136,375 Q143,399 140,420",
        "desc":"The jaw is in a place of rest."
      },
      "bilabial": {
        "path":"M175,418 C152,370 155,346 177,305 S172,299 163,298 C183,273 161,277 159,282 Q117,264 86,280 Q69,278 64,262 T60,274 C47,273 53,251 37,256 S41,268 37,291 C26,342 55,332 101,340 S131,364 136,375 Q143,399 140,420",
        "desc":"The jaw is positioned to allow the lips to touch."
      },
      "labiodental": {
        "path":"M175,418 C152,370 155,346 177,305 S172,299 163,298 C183,273 161,277 159,282 Q117,264 86,280 Q69,278 64,262 T60,274 C47,273 70,262 49,254 S47,267 37,291 C26,342 55,332 101,340 S131,364 136,375 Q143,399 140,420",
        "desc":"The jaw is positioned to allow the upper teeth to touch the lower lip."
      }
      // "pharyngeal": {
      //   "path":"M175,418 C152,370 155,346 177,305 S172,299 163,298 C183,273 161,277 159,282 Q117,264 88,278 Q70,298 63,280 T60,290 C48,288 54,268 38,276 S44,294 39,310 C27,361 55,350 99,349 S131,364 136,375 Q143,399 140,420",
      //   "desc":""
      // }
  },
  
  "palate" : {
  
      "rest": {
        "path":"M30,221 C119,224 140,201 166,207 C177,223 173,245 163,228 S144,220 90,228 Q76,238 63,240 C55,243 58,261 55,256 S51,247 48,236 C44,243 48,258 34,254 S37,238 29,221",
        "desc":"The palate is in a place of rest."
      },
      // "glottal": {
      //   "path":"M30,221 C119,224 140,201 166,207 C177,223 173,245 163,228 S144,220 90,228 Q76,238 63,240 C55,243 58,261 55,256 S51,247 48,236 C44,243 48,258 34,254 S37,238 29,221",
      //   "desc":"The palate is in a place of rest."
      // },
      "bilabial": {
        "path":"M30,221 C118,220 140,199 175,211 C182,232 182,254 170,230 S126,225 90,228 Q76,238 63,240 C55,243 58,261 55,256 S51,247 48,236 C43,241 48,258 34,255 S36,241 29,221",
        "desc":"The soft palate (velum) is lowered, allowing airflow through the nasal cavity."
      },
      "labiodental": {
        "path":"M30,221 C118,220 138,193 170,203 C179,221 178,245 165,222 S126,225 90,228 Q76,238 63,240 C55,243 58,261 55,256 S51,247 48,236 C43,229 48,258 33,250 S37,238 29,221",
        "desc":"The soft palate (velum) is raised, sealing off the nasal cavity and preventing airflow."
      }
      // "pharyngeal": {
      //   "path":"M30,221 C118,220 138,193 170,203 C179,221 178,245 165,222 S126,225 90,228 Q76,238 63,240 C55,243 58,261 55,256 S51,247 48,236 C44,243 48,258 34,254 S37,238 29,221",
      //   "desc":""
      // }
  },
  
  "vocalfolds" : {
  
      "voiceless": {
        "path":"M270,309 Q281,334 284,364 L295,360 Q291,324 275,301 H265 Q249,324 245,360 L256,364 Q259,334 270,309",
        "desc":"The vocal folds are open to allow air to flow freely throughout the vocal tract."
      },
      "voiced": {
        "path":"M270,309 Q271,334 271,371 L283,364 Q285,324 275,301 H265 Q254,324 257,364 L269,371 Q269,334 270,309",
        "desc":"The vocal cords are closed to allow for vibration."
      }
  },
  
  "cartilage" : {
      "voiceless": {
        "path":"M225,322 L230,339 Q243,347 250,359 262,364 270,371 279,364 290,359 298,347 310,339 L314,322 320,326 315,339 Q310,354 298,364 288,378 270,374 252,378 242,364 230,354 225,339 L219,326 Z",
        "desc":"The cuneiform cartilage is supporting the open vocal cords to produce voiceless sound. "
      },
      "voiced": {
        "path":"M225,322 L230,339 Q246,351 250,359 263,359 270,371 278,359 290,359 295,351 310,339 L314,322 320,326 315,339 Q309,360 298,364 288,379 270,374  252,379 242,364 231,360 225,339 L219,326 Z",
        "desc":"The cuneiform cartilage is supporting the closed vocal cords to produce voiced sound."
      }
  }
};