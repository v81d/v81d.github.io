// Language & Code by 0201._

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
        return "(" + englishToMath[char.toLowerCase()] + ")*";
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
}

function translateToEnglish() {
  const mathText = document.getElementById("mathInput").value.split("　　");
  const englishText = mathText.map((symbol) => {
    const translatedWord = symbol.slice(2, -2).split(" | ").map((char) => {
      if (char.endsWith(")*") && /[a-zA-Z]/.test(mathToEnglish[char.slice(1, -2)])) {
        return mathToEnglish[char.slice(1, -2)].toUpperCase() || char;
      } else {
        return mathToEnglish[char] || char;
      }
    }).join("");
    return translatedWord;
  }).join(" ");
  document.getElementById("englishInput").value = englishText;
}

function handleEnglishInput() {
  if (document.getElementById("tmp-28").checked) {
    translateToMath();
  }
  responsiveVoice.cancel();
  document.querySelector("#en-g").style.fill = "#ccc";
  document.querySelector("#mg-g").style.fill = "#ccc";
  document.querySelector("#englishInputSpeak").style.pointerEvents = "auto";
  document.querySelector("#mathInputSpeak").style.pointerEvents = "auto";
  document.querySelector("#en-p").style.cursor = "pointer";
  document.querySelector("#mg-p").style.cursor = "pointer";
  localStorage.setItem("englishInput", document.getElementById("englishInput").value);
  localStorage.setItem("mathInput", document.getElementById("mathInput").value);
}

function handleMathInput() {
  if (document.getElementById("tmp-28").checked) {
    translateToEnglish();
  }
  responsiveVoice.cancel();
  document.querySelector("#en-g").style.fill = "#ccc";
  document.querySelector("#mg-g").style.fill = "#ccc";
  document.querySelector("#englishInputSpeak").style.pointerEvents = "auto";
  document.querySelector("#mathInputSpeak").style.pointerEvents = "auto";
  document.querySelector("#en-p").style.cursor = "pointer";
  document.querySelector("#mg-p").style.cursor = "pointer";
  localStorage.setItem("englishInput", document.getElementById("englishInput").value);
  localStorage.setItem("mathInput", document.getElementById("mathInput").value);
}

function checkForInput() {
  if (document.getElementById("englishInput").value.length == 0) {
    document.querySelector("#en-p").style.cursor = "not-allowed";
    document.getElementById("englishInputSpeak").classList.remove("speak-hover");
    document.getElementById("englishInputSpeak").style.pointerEvents = "none";
  } else {
    document.querySelector("#en-p").style.cursor = "pointer";
    document.getElementById("englishInputSpeak").classList.add("speak-hover");
    document.getElementById("englishInputSpeak").style.pointerEvents = "auto";
  }
  if (document.getElementById("mathInput").value.length == 0) {
    document.querySelector("#mg-p").style.cursor = "not-allowed";
    document.getElementById("mathInputSpeak").classList.remove("speak-hover");
    document.getElementById("mathInputSpeak").style.pointerEvents = "none";
  } else {
    document.querySelector("#mg-p").style.cursor = "pointer";
    document.getElementById("mathInputSpeak").classList.add("speak-hover");
    document.getElementById("mathInputSpeak").style.pointerEvents = "auto";
  }
}

document.getElementById("englishInput").addEventListener("input", checkForInput);
document.getElementById("mathInput").addEventListener("input", checkForInput);

function toggleAutoTranslate() {
  const autoTranslateEnabled = document.getElementById("tmp-28").checked;
  document.getElementById("translateToMathBtn").disabled = autoTranslateEnabled;
  document.getElementById("translateToEnglishBtn").disabled = autoTranslateEnabled;
}

let interval;

function startInterval() {
  interval = setInterval(checkForInput, 150);
}

function stopInterval() {
  clearInterval(interval);
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

function tts(btn, id) {
  text = document.getElementById(id).value;
  corrected = replaceLast(text.replace(/\{ /g, "").replace(/ \}/g, "").replace(/\|/g, " ").replace(/∠/g, "angle,").replace(/\'1010\'/g, "binary,").replace(/⌈𝑥⌉/g, "ceiling of X,").replace(/𝑑\/𝑑𝑥/g, "derivative of X,").replace(/2.718…/g, "Euler's number,").replace(/φ/g, "phi,").replace(/Γ\(𝑥\)/g, "gamma of X,").replace(/'½'/g, "one half,").replace(/√\(-1\)/g, "square root of negative one,").replace(/⊷/g, "jump discontinuity,").replace(/𝑘\(𝑥\)/g, "K of X,").replace(/𝑙𝑖𝑚/g, "limit,").replace(/Δ/g, "slope,").replace(/ℕ/g, "set of natural numbers,").replace(/π𝑟²/g, "pi R squared,").replace(/π/g, "pi,").replace(/𝑎𝑥² \+ 𝑏𝑥 \+ 𝑐/g, "quadratic,").replace(/→/g, "ray,").replace(/Σ/g, "sigma,").replace(/τ/g, "tau,").replace(/∪/g, "union,").replace(/┋/g, "vertical line,").replace(/𝑊\(𝑥\)/g, "Lambert W function,").replace(/\'𝑥\'/g, "x,").replace(/𝑚𝑥 \+ 𝑏/g, "M X plus B,").replace(/\'0\'/g, "zero,").replace(/   /g, " ").replace(/　　/g, ". ").replace(/\((.*?)\)\*/g, function(match, p1) {
    return p1.toUpperCase();
  }).replace(/0/g, "zero"), ",", ".");
  corrected = replaceLast(corrected, "  ", "").replace(/\,\./g, ".")
  console.warn("\"" + text + "\" is being pronounced phonetically as \"" + corrected + "\"");
  responsiveVoice.speak(corrected, "UK English Male", {
    onerror: function() {
      alert("Sorry! There was an error reading the text.");
      document.querySelector("#en-g").style.fill = "#ccc";
      document.querySelector("#mg-g").style.fill = "#ccc";
      document.querySelector("#englishInputSpeak").style.pointerEvents = "auto";
      document.querySelector("#mathInputSpeak").style.pointerEvents = "auto";
      document.querySelector("#en-p").style.cursor = "pointer";
      document.querySelector("#mg-p").style.cursor = "pointer";
      checkForInput();
    },
    onstart: function() {
      document.querySelector("#englishInputSpeak").style.pointerEvents = "none";
      document.querySelector("#mathInputSpeak").style.pointerEvents = "none";
      document.querySelector("#" + btn).style.fill = "#8f36f5";
      document.querySelector("#en-p").style.cursor = "not-allowed";
      document.querySelector("#mg-p").style.cursor = "not-allowed";
    },
    onend: function() {
      document.querySelector("#en-g").style.fill = "#ccc";
      document.querySelector("#mg-g").style.fill = "#ccc";
      document.querySelector("#englishInputSpeak").style.pointerEvents = "auto";
      document.querySelector("#mathInputSpeak").style.pointerEvents = "auto";
      document.querySelector("#en-p").style.cursor = "pointer";
      document.querySelector("#mg-p").style.cursor = "pointer";
      checkForInput();
    }
  });
}

document.getElementById("englishInput").value = localStorage.getItem("englishInput");
document.getElementById("mathInput").value = localStorage.getItem("mathInput");

checkForInput();

console.log(
  '%cMathemoglyphics is a joke language created by 0201._ that replaces all English letters with a mathematical term. Apparently, math wizards like Alfred speak this on a regular basis and like to hide the fact that it exists. Words are separated by "　　" (a wide space) and "letters" are separated by "\\\\" (two backslashes). Enjoy! ... Wait, why in the realm of mathematics are you here? Return to your slumber party, you indentured servant! 😡',
  "background-image: linear-gradient(to top, violet, indigo, blue, green, yellow, orange, red); -webkit-background-clip: text; color: transparent; font-size: 20px;"
);
