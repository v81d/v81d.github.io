// Language & Code by 0201._

function checkForInput() {
  if (document.getElementById("englishInput").value.length == 0) {
    document.querySelector("#en-p").style.cursor = "not-allowed";
    document.getElementById("en-p").classList.remove("speak-hover");
    document.getElementById("englishInputSpeak").style.pointerEvents = "none";
    document.querySelector("#en-c").style.cursor = "not-allowed";
    document.getElementById("en-c").classList.remove("speak-hover");
    document.getElementById("englishInputCopy").style.pointerEvents = "none";
  } else {
    document.querySelector("#en-p").style.cursor = "pointer";
    document.getElementById("en-p").classList.add("speak-hover");
    document.getElementById("englishInputSpeak").style.pointerEvents = "auto";
    document.querySelector("#en-c").style.cursor = "pointer";
    document.getElementById("en-c").classList.add("speak-hover");
    document.getElementById("englishInputCopy").style.pointerEvents = "auto";
  }
  if (document.getElementById("mathInput").value.length == 0) {
    document.querySelector("#mg-p").style.cursor = "not-allowed";
    document.getElementById("mg-p").classList.remove("speak-hover");
    document.getElementById("mathInputSpeak").style.pointerEvents = "none";
    document.querySelector("#mg-c").style.cursor = "not-allowed";
    document.getElementById("mg-c").classList.remove("speak-hover");
    document.getElementById("mathInputCopy").style.pointerEvents = "none";
  } else {
    document.querySelector("#mg-p").style.cursor = "pointer";
    document.getElementById("mg-p").classList.add("speak-hover");
    document.getElementById("mathInputSpeak").style.pointerEvents = "auto";
    document.querySelector("#mg-c").style.cursor = "pointer";
    document.getElementById("mg-c").classList.add("speak-hover");
    document.getElementById("mathInputCopy").style.pointerEvents = "auto";
  }
  localStorage.setItem("englishInput", document.getElementById("englishInput").value);
  localStorage.setItem("mathInput", document.getElementById("mathInput").value);
}

var originalXHR = window.XMLHttpRequest;

// Override the XMLHttpRequest object
window.XMLHttpRequest = function() {
  customAlert.alert("A processing error occurred while trying to synthesize the speech. Apologies for the inconvenience!", "Alert");
  console.error("A processing error occurred while trying to synthesize the speech. (XMLHttpRequest)");
  
  // Run the "onend" code
  document.querySelector("#en-g").style.fill = "#ccc";
  document.querySelector("#mg-g").style.fill = "#ccc";
  checkForInput();
  
  // Call the original XMLHttpRequest object
  return new originalXHR();
};

const englishToMath = {
  a: "∠",
  b: "'1010'",
  c: "⌈𝑥⌉",
  d: "𝑑/𝑑𝑥",
  e: "2.718…",
  f: "φ",
  g: "Γ(𝑥)",
  h: "'½'",
  i: "√(-1)",
  j: "⊷",
  k: "𝑘(𝑥)",
  l: "𝑙𝑖𝑚",
  m: "Δ",
  n: "ℕ",
  o: "π𝑟²",
  p: "π",
  q: "𝑎𝑥² + 𝑏𝑥 + 𝑐",
  r: "→",
  s: "Σ",
  t: "τ",
  u: "∪",
  v: "┋",
  w: "𝑊(𝑥)",
  x: "'𝑥'",
  y: "𝑚𝑥 + 𝑏",
  z: "'0'",
  " ": "　　"
};

const mathToEnglish = Object.fromEntries(Object.entries(englishToMath).map(([k, v]) => [v, k]));

function translateToMath() {
  const englishText = document.getElementById("englishInput").value;
  const words = englishText.split(" ");
  const mathText = words.map(word => {
    const translatedWord = word.split("").map((char) => {
      if (char === char.toUpperCase() && /[a-zA-Z]/.test(char)) {
        return "[" + englishToMath[char.toLowerCase()] + "]^";
      } else {
        return englishToMath[char] || char;
      }
    }).join(" | ");
    return "{ " + translatedWord + " }";
  }).join("　　");
  if (document.getElementById("englishInput").value.length == 0) {
    document.getElementById("mathInput").value = "";
  } else {
    document.getElementById("mathInput").value = mathText;
  }
  localStorage.setItem("englishInput", document.getElementById("englishInput").value);
  localStorage.setItem("mathInput", document.getElementById("mathInput").value);
}

function translateToEnglish() {
  const mathText = document.getElementById("mathInput").value.split("　　");
  const englishText = mathText.map((symbol) => {
    const translatedWord = symbol.slice(2, -2).split(" | ").map((char) => {
      if (char.endsWith("]^") && /[a-zA-Z]/.test(mathToEnglish[char.slice(1, -2)])) {
        return mathToEnglish[char.slice(1, -2)].toUpperCase() || char;
      } else {
        return mathToEnglish[char] || char;
      }
    }).join("");
    return translatedWord;
  }).join(" ");
  document.getElementById("englishInput").value = englishText;
  localStorage.setItem("englishInput", document.getElementById("englishInput").value);
  localStorage.setItem("mathInput", document.getElementById("mathInput").value);
}

function handleEnglishInput() {
  if (document.getElementById("tmp-28").checked) {
    translateToMath();
  }
  responsiveVoice.cancel();
  document.querySelector("#en-g").style.fill = "#ccc";
  document.querySelector("#mg-g").style.fill = "#ccc";
  document.querySelector("#en-cg").style.fill = "#ccc";
  document.querySelector("#mg-cg").style.fill = "#ccc";
  checkForInput();
}

function handleMathInput() {
  if (document.getElementById("tmp-28").checked) {
    translateToEnglish();
  }
  responsiveVoice.cancel();
  document.querySelector("#en-g").style.fill = "#ccc";
  document.querySelector("#mg-g").style.fill = "#ccc";
  document.querySelector("#en-cg").style.fill = "#ccc";
  document.querySelector("#mg-cg").style.fill = "#ccc";
  checkForInput();
}

function toggleAutoTranslate() {
  const autoTranslateEnabled = document.getElementById("tmp-28").checked;
  document.getElementById("translateToMathBtn").disabled = autoTranslateEnabled;
  document.getElementById("translateToEnglishBtn").disabled = autoTranslateEnabled;
}

const replaceLast = (str, pattern, replacement) => {
  const match =
    typeof pattern === 'string' ?
    pattern :
    (str.match(new RegExp(pattern.source, 'g')) || []).slice(-1)[0];
  if (!match) return str;
  const last = str.lastIndexOf(match);
  return last !== -1 ?
    `${str.slice(0, last)}${replacement}${str.slice(last + match.length)}` :
    str;
};

function copy(id, g) {
  var text = document.getElementById(id);
  text.select();
  text.setSelectionRange(0, 99999);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
  document.activeElement.blur();
  document.getElementById(g).style.fill = "#8f36f5";
  document.getElementById("englishInputCopy").style.pointerEvents = "none";
  document.getElementById("mathInputCopy").style.pointerEvents = "none";
  document.querySelector("#en-c").style.cursor = "not-allowed";
  document.querySelector("#mg-c").style.cursor = "not-allowed";
  document.querySelector("#en-c").classList.remove("speak-hover");
  document.querySelector("#mg-c").classList.remove("speak-hover");
  setTimeout(function () {
    document.getElementById("en-cg").style.fill = "#ccc";
    document.getElementById("mg-cg").style.fill = "#ccc";
    checkForInput();
  }, 1000);
}

function tts(btn, id) {
  text = document.getElementById(id).value;
  corrected = replaceLast(text.replace(/\{ /g, "").replace(/ \}/g, "").replace(/\|/g, " ").replace(/∠/g, "angle,").replace(/\'1010\'/g, "binary,").replace(/⌈𝑥⌉/g, "ceiling of X,").replace(/𝑑\/𝑑𝑥/g, "derivative of X,").replace(/2.718…/g, "Euler's number,").replace(/φ/g, "phi,").replace(/Γ\(𝑥\)/g, "gamma of X,").replace(/'½'/g, "one half,").replace(/√\(-1\)/g, "square root of negative one,").replace(/⊷/g, "jump discontinuity,").replace(/𝑘\(𝑥\)/g, "K of X,").replace(/𝑙𝑖𝑚/g, "limit,").replace(/Δ/g, "slope,").replace(/ℕ/g, "set of natural numbers,").replace(/π𝑟²/g, "pi R squared,").replace(/π/g, "pi,").replace(/𝑎𝑥² \+ 𝑏𝑥 \+ 𝑐/g, "quadratic,").replace(/→/g, "ray,").replace(/Σ/g, "sigma,").replace(/τ/g, "tau,").replace(/∪/g, "union,").replace(/┋/g, "vertical line,").replace(/𝑊\(𝑥\)/g, "Lambert W function,").replace(/\'𝑥\'/g, "x,").replace(/𝑚𝑥 \+ 𝑏/g, "M X plus B,").replace(/   /g, " ").replace(/　　/g, ". ").replace(/\((.*?)\)\*/g, function(match, p1) {
    return p1.toUpperCase();
  }), ",", ".");
  corrected = replaceLast(corrected, "  ", "").replace(/\,\./g, ".")
  console.warn("\"" + text + "\" is being pronounced phonetically as \"" + corrected + "\"");
  if (window.navigator.userAgent.includes("Edg")) {
    // Use SpeechSynthesis for Microsoft Edge
    const utterance = new SpeechSynthesisUtterance(corrected);
    utterance.lang = "en-US";

    // Event handler when speech synthesis starts
    utterance.onstart = function() {
      document.querySelector("#englishInputSpeak").style.pointerEvents = "none";
      document.querySelector("#mathInputSpeak").style.pointerEvents = "none";
      document.querySelector("#" + btn).style.fill = "#8f36f5";
      document.querySelector("#en-p").style.cursor = "not-allowed";
      document.querySelector("#mg-p").style.cursor = "not-allowed";
      document.querySelector("#en-p").classList.remove("speak-hover");
      document.querySelector("#mg-p").classList.remove("speak-hover");
      console.log("Speech synthesis started. (" + window.navigator.userAgent + ")");
    };

    // Event handler when speech synthesis ends
    utterance.onend = function() {
      document.querySelector("#en-g").style.fill = "#ccc";
      document.querySelector("#mg-g").style.fill = "#ccc";
      checkForInput();
      console.log("Speech synthesis ended. (" + window.navigator.userAgent + ")");
    };

    speechSynthesis.speak(utterance);
  } else {
    // Use ResponsiveVoice for other browsers
    responsiveVoice.speak(corrected, "UK English Male", {
      onstart: function() {
        document.querySelector("#englishInputSpeak").style.pointerEvents = "none";
        document.querySelector("#mathInputSpeak").style.pointerEvents = "none";
        document.querySelector("#" + btn).style.fill = "#8f36f5";
        document.querySelector("#en-p").style.cursor = "not-allowed";
        document.querySelector("#mg-p").style.cursor = "not-allowed";
        document.querySelector("#en-p").classList.remove("speak-hover");
        document.querySelector("#mg-p").classList.remove("speak-hover");
      },
      onerror: function() {
        console.error("An unknown error occurred while trying to synthesize the speech.");
        document.querySelector("#en-g").style.fill = "#ccc";
        document.querySelector("#mg-g").style.fill = "#ccc";
        checkForInput();
      },
      onend: function() {
        document.querySelector("#en-g").style.fill = "#ccc";
        document.querySelector("#mg-g").style.fill = "#ccc";
        checkForInput();
      }
    });
  }
}

if ("browserChecked" in localStorage) {
  // Browser has previously been checked; user has already received an alert
  console.log("Browser has already been checked for ResponsiveVoice compatibility.");
} else {
  // Browser has not previously been checked; send an alert now
  if (window.navigator.userAgent.includes("Edge") || window.navigator.userAgent.includes("Edg")) {
    customAlert.alert("Your browser (" + window.navigator.userAgent + ") has some compatibility issues with the ResponsiveVoice server. The Read Aloud service will instead use the system speech synthesis service. Apologies for the inconvenience!", "Alert");
  }
  localStorage.setItem("browserChecked", "true");
}

document.getElementById("translateToMathBtn").addEventListener("click", checkForInput);
document.getElementById("translateToEnglishBtn").addEventListener("click", checkForInput);

document.getElementById("englishInput").value = localStorage.getItem("englishInput");
document.getElementById("mathInput").value = localStorage.getItem("mathInput");

checkForInput();

console.log(
  '%cMathemoglyphics is a joke language created by 0201._ that replaces all English letters with a mathematical term. Apparently, math wizards like Alfred speak this on a regular basis and like to hide the fact that it exists. Words are separated by "　　" (two wide spaces) and "letters" are separated by " | " (a vertical line). Enjoy! ... Wait, why in the realm of mathematics are you here? Return to your slumber party, you indentured servant! 😡',
  "background-image: linear-gradient(to bottom, #ff931a, #ff999b); -webkit-background-clip: text; color: transparent; font-size: 18px;"
);
