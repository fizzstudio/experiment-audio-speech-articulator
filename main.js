let Tongue = null;
let palate = null;
let Jaw = null;
let VocalFolds = null;
let Cartilage = null;
let voiced_button = null;
let voiceless_button = null;
let IPA_button = null;
let IPA_vowels = null;

window.onload = function() {
  Tongue = document.getElementById("tongue");
  palate = document.getElementById("palate");
  Jaw = document.getElementById("jaw");
  VocalFolds = document.getElementById("vocalFolds");
  Cartilage = document.getElementById("CuneiformCorniculateCartilage");

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
    "sound" : "juh",
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
  var consonants = result.split(/[aeiou]/);
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
    const sound = soundObject.sound;
    const place = soundObject.place;
    const voice = soundObject.voice;
    //animateAll();
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

// Abstracted function in order to just have one animation loop
// figure out when changed is T/F inside for each loop - if any are changed you have to call animate all 
// compare each articulator to itself to check if it still needs to be changed using d attribute (current state vs end state)
// if end state 
var newAnim = null;
function animateAll(place, voice) {
  console.log(place + " " + voice);
  var changed = false;
  articulators = ["jaw", "palate", "tongue", "vocalfolds", "cartilage"];
  articulators.forEach((articulator) => {
    console.log(articulator);
    var articulator_el = document.getElementById(articulator);
    console.log(articulator_el);
    var current = articulator_el.getAttribute("d");
    console.log("current " + current);
    // TODO: figure out how to access place without causing error 
    let articulatorObject = articulatorLookup[articulator];
    if(!articulatorObject[place]) {
      newAnim = articulator["rest"];
    }
    console.log(articulatorObject);
    newAnim = articulatorObject[place];
    

    // if(!articulatorLookup[articulator][place]) {
    //   if(articulator === "jaw" || articulator === "tongue") place = "rest";
    //   else if(articulator === "palate") place = "pharyngeal";
    //   console.log("testing");
    // }

    console.log(newAnim);
    newAnim = newAnim.replace(/,/g, " ");
    current = current.replace(/,/g, " ");

    if (newAnim != current) {

      var numberArray = current.split(/\W+/);
      var newArray = newAnim.split(/\W+/);
      for (var n = 0; numberArray.length > n; n++) {
        if (numberArray[n]) {
          command = numberArray[n].match(/\D/);
          eachDescNum = Number(numberArray[n].match(/\d+/));
          eachNewNum = Number(newArray[n].match(/\d+/));

          if ("Z" == command) {
            eachDescNum = "";
          } else if (eachNewNum > eachDescNum) {
            eachDescNum++;
            changed = true;
          } else if (eachDescNum > eachNewNum) {
            eachDescNum--;
            changed = true;
          }
          // TODO: changed has to be false at some point (otherwise we have infinite loop)

          // if(changed) break; ?? Because if just one is true then we need to call animateAll
          // if(current != newAnim)
          numberArray[n] = command + eachDescNum;
        }
      }

      var tempDesc = numberArray.join(" ");
      articulator_el.setAttribute("d", tempDesc);
    }
  });
  if (changed) {
    window.setTimeout(animateAll());
  }
} 

async function animateSound (place, voice) {
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

// async function AnimateMouth(mouthPart, currentPos, newPos) {
//   var currentPos = mouthPart.getAttribute("d");
//   newPos = newPos.replace(/,/g, " ");
//   currentPos = currentPos.replace(/,/g, " ");

//   if (newPos != currentPos) {
//     var changed = false;

//     var currentArray = currentPos.split(/\W+/);
//     var newArray = newPos.split(/\W+/);
//     for (var n = 0; currentArray.length > n; n++) {
//       if (currentArray[n]) {
//         command = currentArray[n].match(/\D/);
//         eachCurrentNum = Number(currentArray[n].match(/\d+/));
//         eachNewNum = Number(newArray[n].match(/\d+/));

//         if (eachNewNum > eachCurrentNum) {
//           eachCurrentNum++;
//           changed = true;
//         } else if (eachCurrentNum > eachNewNum) {
//           eachCurrentNum--;
//           changed = true;
//         }
//         currentArray[n] = command + eachCurrentNum;
//       }
//     }

//     var currentPos = currentArray.join(" ");
//     mouthPart.setAttribute("d", currentPos);

//     if (changed) {
//       window.setTimeout(AnimateMouth(mouthPart, currentPos, newPos), 1000000);
//     }
//   }
// };

var newTongue = null;
async function AnimateTongue() {
  var currentTongue = Tongue.getAttribute("d");
  console.log(currentTongue);
  // Getting rid of delimiters
  newTongue = newTongue.replace(/,/g, " ");
  currentTongue = currentTongue.replace(/,/g, " ");

  if (newTongue != currentTongue) {
    var changed = false;

    var numberArray = currentTongue.split(/\W+/);
    var newArray = newTongue.split(/\W+/);
    for (var n = 0; numberArray.length > n; n++) {
      if (numberArray[n]) {
        // Taking out command and getting the actual numbers from array 
        command = numberArray[n].match(/\D/);
        eachDescNum = Number(numberArray[n].match(/\d+/));
        eachNewNum = Number(newArray[n].match(/\d+/));

        if (eachNewNum > eachDescNum) {
          eachDescNum++;
          changed = true;
        } else if (eachDescNum > eachNewNum) {
          eachDescNum--;
          changed = true;
        }
        numberArray[n] = command + eachDescNum;
      }
    }

    var tempDesc = numberArray.join(" ");
    Tongue.setAttribute("d", tempDesc);

    if (changed) {
      window.setTimeout("AnimateTongue()", 1);
    }
  }
};

var newJaw = null;
async function AnimateJaw() {
  var currentJaw = Jaw.getAttribute("d");
  newJaw = newJaw.replace(/,/g, " ");
  currentJaw = currentJaw.replace(/,/g, " ");

  if (newJaw != currentJaw) {
    var changed = false;

    var numberArray = currentJaw.split(/\W+/);
    var newArray = newJaw.split(/\W+/);
    for (var n = 0; numberArray.length > n; n++) {
      if (numberArray[n]) {
        command = numberArray[n].match(/\D/);
        eachDescNum = Number(numberArray[n].match(/\d+/));
        eachNewNum = Number(newArray[n].match(/\d+/));

        if (eachNewNum > eachDescNum) {
          eachDescNum++;
          changed = true;
        } else if (eachDescNum > eachNewNum) {
          eachDescNum--;
          changed = true;
        }
        numberArray[n] = command + eachDescNum;
      }
    }

    var tempDesc = numberArray.join(" ");
    Jaw.setAttribute("d", tempDesc);

    if (changed) {
      window.setTimeout("AnimateJaw()", 1);
    }
  }
};

var newpalate = null;
async function Animatepalate() {
  var currentpalate = palate.getAttribute("d");
  newpalate = newpalate.replace(/,/g, " ");
  currentpalate = currentpalate.replace(/,/g, " ");

  if (newpalate != currentpalate) {
    var changed = false;

    var numberArray = currentpalate.split(/\W+/);
    var newArray = newpalate.split(/\W+/);
    for (var n = 0; numberArray.length > n; n++) {
      if (numberArray[n]) {
        command = numberArray[n].match(/\D/);
        eachDescNum = Number(numberArray[n].match(/\d+/));
        eachNewNum = Number(newArray[n].match(/\d+/));

        if (eachNewNum > eachDescNum) {
          eachDescNum++;
          changed = true;
        } else if (eachDescNum > eachNewNum) {
          eachDescNum--;
          changed = true;
        }
        numberArray[n] = command + eachDescNum;
      }
    }

    var tempDesc = numberArray.join(" ");
    palate.setAttribute("d", tempDesc);

    if (changed) {
      window.setTimeout("Animatepalate()", 0);
    }
  }
};

var newVocalFolds = null;
async function AnimateVocalFolds() {
  var currentVocalFolds = VocalFolds.getAttribute("d");
  newVocalFolds = newVocalFolds.replace(/,/g, " ");
  currentVocalFolds = currentVocalFolds.replace(/,/g, " ");

  if (newVocalFolds != currentVocalFolds) {
    var changed = false;

    var numberArray = currentVocalFolds.split(/\W+/);
    var newArray = newVocalFolds.split(/\W+/);
    for (var n = 0; numberArray.length > n; n++) {
      if (numberArray[n]) {
        command = numberArray[n].match(/\D/);
        eachDescNum = Number(numberArray[n].match(/\d+/));
        eachNewNum = Number(newArray[n].match(/\d+/));

        if (eachNewNum > eachDescNum) {
          eachDescNum++;
          changed = true;
        } else if (eachDescNum > eachNewNum) {
          eachDescNum--;
          changed = true;
        }
        numberArray[n] = command + eachDescNum;
      }
    }

    var tempDesc = numberArray.join(" ");
    VocalFolds.setAttribute("d", tempDesc);

    if (changed) {
      window.setTimeout("AnimateVocalFolds()", 0);
    }
  }
};

var newCartilage = null;
async function AnimateCartilage() {
  var currentCartilage = Cartilage.getAttribute("d");
  newCartilage = newCartilage.replace(/,/g, " ");
  currentCartilage = currentCartilage.replace(/,/g, " ");

  if (newCartilage != currentCartilage) {
    var changed = false;

    var numberArray = currentCartilage.split(/\W+/);
    var newArray = newCartilage.split(/\W+/);
    for (var n = 0; numberArray.length > n; n++) {
      if (numberArray[n]) {
        //console.log(numberArray[n])
        command = numberArray[n].match(/\D/);
        eachDescNum = Number(numberArray[n].match(/\d+/));
        eachNewNum = Number(newArray[n].match(/\d+/));

        // Checking for close command (close path, takes no numbers)
        if ("Z" == command) {
          eachDescNum = "";
        } else if (eachNewNum > eachDescNum) {
          eachDescNum++;
          changed = true;
        } else if (eachDescNum > eachNewNum) {
          eachDescNum--;
          changed = true;
        }
        numberArray[n] = command + eachDescNum;
      }
    }

    var tempDesc = numberArray.join(" ");
    Cartilage.setAttribute("d", tempDesc);

    if (changed) {
      window.setTimeout("AnimateCartilage()", 0);
    }
  }
};
 
const articulatorLookup = {
  "tongue" : {
      "rest": {
        "path":"M159,283 C179,254 128,235 91,243 S59,264 86,280", 
        "desc":"The tongue is at a place of rest near the front of the mouth."
      },
      // "dental": {
      //   "path":"M159,283 C173,248 129,246 85,241 S58,259 86,280",
      //   "desc":""
      // },
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
      "glottal": {
        "path":"M30,221 C119,224 140,201 166,207 C177,223 173,245 163,228 S144,220 90,228 Q76,238 63,240 C55,243 58,261 55,256 S51,247 48,236 C44,243 48,258 34,254 S37,238 29,221",
        "desc":"The palate is in a place of rest."
      },
      "bilabial": {
        "path":"M30,221 C118,220 140,199 175,211 C182,232 182,254 170,230 S126,225 90,228 Q76,238 63,240 C55,243 58,261 55,256 S51,247 48,236 C43,241 48,258 34,255 S36,241 29,221",
        "desc":"The palate and velum are lowered."
      },
      "labiodental": {
        "path":"M30,221 C118,220 138,193 170,203 C179,221 178,245 165,222 S126,225 90,228 Q76,238 63,240 C55,243 58,261 55,256 S51,247 48,236 C43,229 48,258 33,250 S37,238 29,221",
        "desc":"The palate and velum are raised."
      }
      // "pharyngeal": {
      //   "path":"M30,221 C118,220 138,193 170,203 C179,221 178,245 165,222 S126,225 90,228 Q76,238 63,240 C55,243 58,261 55,256 S51,247 48,236 C44,243 48,258 34,254 S37,238 29,221",
      //   "desc":""
      // }
  },
  
  "vocalFolds" : {
  
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
        "desc":""
      },
      "voiced": {
        "path":"M225,322 L230,339 Q246,351 250,359 263,359 270,371 278,359 290,359 295,351 310,339 L314,322 320,326 315,339 Q309,360 298,364 288,379 270,374  252,379 242,364 231,360 225,339 L219,326 Z",
        "desc":""
      }
  }
};



// var tongueArray = new Array();
// // Each should have its own object containing path position and text description 
// // Use text description to be accessed by screen reader 
// tongueArray["rest"] = "M159,283 C179,254 128,235 91,243 S59,264 86,280 ";
// tongueArray["dental"] = "M159,283 C173,248 129,246 85,241 S58,259 86,280";
// tongueArray["dental"] = "M159,283 C174,244 130,236 79,250 S67,259 86,280";
// tongueArray["alveolar"] = "M159,283 C174,244 131,254 87,242 S68,254 86,280";
// tongueArray["postalveolar"] = "M159,283 C145,247 91,206 74,246 S103,224 86,280";
// tongueArray["palatal"] = "M159,283 C177,213 113,214 87,248 S107,247 86,280";
// tongueArray["velar"] = "M159,283 C158,162 126,236 88,249 S93,261 86,280";
// tongueArray["uvular"] = "M159,283 C183,177 147,230 94,249 S93,261 86,280";
// tongueArray["pharyngeal"] = "M159,283 C204,257 196,219 120,246 S109,261 86,280";

// var jawArray = new Array();
// jawArray["rest"] = "M175,418 C152,370 155,346 177,305 S172,299 163,298 C183,273 161,277 159,282 Q117,264 86,280 Q69,283 64,270 T61,283 C49,279 54,259 38,267 S44,285 39,301 C27,352 55,341 101,340 S131,364 136,375 Q143,399 140,420";
// jawArray["bilabial"] = "M175,418 C152,370 155,346 177,305 S172,299 163,298 C183,273 161,277 159,282 Q117,264 86,280 Q69,278 64,262 T60,274 C47,273 53,251 37,256 S41,268 37,291 C26,342 55,332 101,340 S131,364 136,375 Q143,399 140,420";
// jawArray["labiodental"] = "M175,418 C152,370 155,346 177,305 S172,299 163,298 C183,273 161,277 159,282 Q117,264 86,280 Q69,278 64,262 T60,274 C47,273 70,262 49,254 S47,267 37,291 C26,342 55,332 101,340 S131,364 136,375 Q143,399 140,420";
// jawArray["pharyngeal"] = "M175,418 C152,370 155,346 177,305 S172,299 163,298 C183,273 161,277 159,282 Q117,264 88,278 Q70,298 63,280 T60,290 C48,288 54,268 38,276 S44,294 39,310 C27,361 55,350 99,349 S131,364 136,375 Q143,399 140,420";

// var palateArray = new Array();
// palateArray["rest"] = "M30,221 C119,224 140,201 166,207 C177,223 173,245 163,228 S144,220 90,228 Q76,238 63,240 C55,243 58,261 55,256 S51,247 48,236 C44,243 48,258 34,254 S37,238 29,221";
// palateArray["glottal"] = "M30,221 C119,224 140,201 166,207 C177,223 173,245 163,228 S144,220 90,228 Q76,238 63,240 C55,243 58,261 55,256 S51,247 48,236 C44,243 48,258 34,254 S37,238 29,221";
// palateArray["bilabial"] = "M30,221 C118,220 140,199 175,211 C182,232 182,254 170,230 S126,225 90,228 Q76,238 63,240 C55,243 58,261 55,256 S51,247 48,236 C43,241 48,258 34,255 S36,241 29,221";
// palateArray["labiodental"] = "M30,221 C118,220 138,193 170,203 C179,221 178,245 165,222 S126,225 90,228 Q76,238 63,240 C55,243 58,261 55,256 S51,247 48,236 C43,229 48,258 33,250 S37,238 29,221";
// palateArray["pharyngeal"] = "M30,221 C118,220 138,193 170,203 C179,221 178,245 165,222 S126,225 90,228 Q76,238 63,240 C55,243 58,261 55,256 S51,247 48,236 C44,243 48,258 34,254 S37,238 29,221";

// var vocalFoldsArray = new Array();
// vocalFoldsArray["voiceless"] = "M270,309 Q281,334 284,364 L295,360 Q291,324 275,301 H265 Q249,324 245,360 L256,364 Q259,334 270,309";
// vocalFoldsArray["voiced"] = "M270,309 Q271,334 271,371 L283,364 Q285,324 275,301 H265 Q254,324 257,364 L269,371 Q269,334 270,309";

// var cartilageArray = new Array();
// cartilageArray["voiceless"] = "M225,322 L230,339 Q243,347 250,359 262,364 270,371 279,364 290,359 298,347 310,339 L314,322 320,326 315,339 Q310,354 298,364 288,378 270,374 252,378 242,364 230,354 225,339 L219,326 Z";
// cartilageArray["voiced"] = "M225,322 L230,339 Q246,351 250,359 263,359 270,371 278,359 290,359 295,351 310,339 L314,322 320,326 315,339 Q309,360 298,364 288,379 270,374  252,379 242,364 231,360 225,339 L219,326 Z";
