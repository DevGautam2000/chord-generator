const NOTES = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];

const getFormula = (MODE) => {
  MODE = MODE.split("");
  let formula = [];
  for (let i = 0; i < MODE.length - 2; i++) {
    const note2 = NOTES.indexOf(MODE[i + 1]);
    const note1 = NOTES.indexOf(MODE[i]);

    const distanceBetweenNotesIsEven = (note2 - note1) % 2 === 0 ? true : false;

    if (distanceBetweenNotesIsEven) formula.push("w");
    else formula.push("h");
  }

  return formula;
};

const MODES = {
  IONIAN: getFormula("cdefgabc"),
  PHRYGIAN: getFormula("defgabcd"),
  DORIAN: getFormula("efgabcde"),
  LYDIAN: getFormula("fgabcdef"),
  MIXOLYDIAN: getFormula("gabcdefg"),
  AEOLIAN: getFormula("abcdefga"),
  LOCRIAN: getFormula("bcdefgab"),
};

MODES.MAJOR = MODES.IONIAN;
MODES.MINOR = MODES.AEOLIAN;

const MODAL_CHORDNAME = ["", "m", "m", "", "", "m", "dim"];

var inpMode;
var inpKey;
const button = document.querySelector("button");

let generatedScale;
let generatedChords;

let result = document.getElementById("result");


function onInit(){
  inpMode = document.getElementById("modes");
  inpKey =  document.getElementById("keys");
  NOTES.forEach(note => inpKey.innerHTML += `<option value="${note}">${note}</option>`)

  const modes = Object.keys(MODES).filter((_,index) => index < 7)
  modes.forEach((mode,index) => {

      if(index === 0)
      return inpMode.innerHTML += `<option value="${mode}">${mode}(MAJOR)</option>`

      if(index === 5)
      return inpMode.innerHTML += `<option value="${mode}">${mode}(MINOR)</option>`

      return inpMode.innerHTML += `<option value="${mode}">${mode}</option>`
    })

}





// console.log(MODES);

const getScale = ({ mode, key }) => {
  const STEPS = {
    w: 2,
    h: 1,
  };

  let stepCounter = NOTES.indexOf(key);
  let builtScale = key + " ";

  MODES[mode]?.forEach((tone, index) => {
    stepCounter += STEPS[tone];
    builtScale += NOTES[stepCounter % NOTES.length] + " ";
  });

  return builtScale;
};

const getChords = ({ scale }) => {
  scale = scale.slice(0, scale.length - 1).split(" ");
  const chords = [];
  for (let i = 0; i < scale.length; i++) {
    let chord =
      scale[i] +
      " " +
      scale[(i + 2) % scale.length] +
      " " +
      scale[(i + 4) % scale.length];
    chords.push(chord.toUpperCase());
  }

  return chords;
};

button?.addEventListener('click', () => {
  inpMode = document.getElementById("modes").value;
  inpKey = document.getElementById("keys").value;

  if (["select key"].includes(inpKey) || ["select scale or mode"].includes(inpMode))
    return

  generate()
})


const getChordNames = () => {
  const startIndex = Object.keys(MODES).indexOf(inpMode);
  generatedChords = getChords({ scale: generatedScale });
  for (let i = 0; i < generatedChords.length; i++) {
    result.innerHTML +=
      "<div>" +
      generatedChords[i] +
      " - " +
      generatedChords[i].split(" ")[0] +
      MODAL_CHORDNAME[(startIndex + i) % MODAL_CHORDNAME.length] +
      "</div>";
  }
};

function generate() {
  result.innerHTML = ""

  generatedScale = getScale({
    mode: inpMode.toUpperCase(),
    key: inpKey.toLowerCase(),
  });

  result.innerHTML +=
    "<div>The scale in the key of " + inpKey + " " + inpMode + " is: </div>";
  result.innerHTML += "<div>" + generatedScale.toUpperCase() + "</div></br>";

  result.innerHTML +=
    "<div>The chords in the key of " +
    inpKey +
    " " +
    inpMode +
    " are: </div></br>";
  getChordNames();
}


onInit()
