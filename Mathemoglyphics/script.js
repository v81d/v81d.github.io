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
        try {
          return mathToEnglish[char.slice(1, -2)].toUpperCase() || char;
        } catch (err) {
          console.error("Translation/convert error: " + err);
          return mathToEnglish[char] || char;
        }
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
  const replacements = [
    { regex: /\{ /g, replacement: "" },
    { regex: / \}/g, replacement: "" },
    { regex: /\|/g, replacement: " " },
    { regex: /∠/g, replacement: "angle," },
    { regex: /\'1010\'/g, replacement: "binary," },
    { regex: /⌈𝑥⌉/g, replacement: "ceiling of X," },
    { regex: /𝑑\/𝑑𝑥/g, replacement: "derivative of X," },
    { regex: /2.718…/g, replacement: "Euler's number," },
    { regex: /φ/g, replacement: "phi," },
    { regex: /Γ\(𝑥\)/g, replacement: "gamma of X," },
    { regex: /'½'/g, replacement: "one half," },
    { regex: /√\(-1\)/g, replacement: "square root of negative one," },
    { regex: /⊷/g, replacement: "jump discontinuity," },
    { regex: /𝑘\(𝑥\)/g, replacement: "K of X," },
    { regex: /𝑙𝑖𝑚/g, replacement: "limit," },
    { regex: /Δ/g, replacement: "slope," },
    { regex: /ℕ/g, replacement: "set of natural numbers," },
    { regex: /π𝑟²/g, replacement: "pi R squared," },
    { regex: /π/g, replacement: "pi," },
    { regex: /𝑎𝑥² \+ 𝑏𝑥 \+ 𝑐/g, replacement: "quadratic," },
    { regex: /→/g, replacement: "ray," },
    { regex: /Σ/g, replacement: "sigma," },
    { regex: /τ/g, replacement: "tau," },
    { regex: /∪/g, replacement: "union," },
    { regex: /┋/g, replacement: "vertical line," },
    { regex: /𝑊\(𝑥\)/g, replacement: "Lambert W function," },
    { regex: /\'𝑥\'/g, replacement: "x," },
    { regex: /𝑚𝑥 \+ 𝑏/g, replacement: "M X plus B," },
    { regex: /   /g, replacement: " " },
    { regex: /　　/g, replacement: ". " },
    { regex: /\,\./g, replacement: ". "},
    { regex: /  /g, replacement: " "}
  ];
  
  let corrected = text;
  for (let i = 0; i < replacements.length; i++) {
    corrected = corrected.replace(replacements[i].regex, replacements[i].replacement);
  }
  
  corrected = corrected.replace(/\[(.*?)\]\^/g, function(match, p1) {
    return p1 + " caret,";
  });
  
  corrected = replaceLast(corrected, ",", ".");

  corrected = replaceLast(corrected, ". .", ".");

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

window.addEventListener('load', function () {
  document.getElementById("preloader").style.opacity = "0";
  setTimeout(function () {
    document.getElementById("preloader").style.display = "none";
  }, 800);
});

if (window.screen.height < 620 || window.screen.width < 305) {
  customAlert.alert("Your screen is too small to display this page. You will be redirected to your previous page in 10 seconds. Apologies for the inconvenience!", "Alert");
  setTimeout(function () {
    history.go(-1);
  }, 10000);
}

checkForInput();

console.log(
  '%cWhat in the realm of Alfred\'s mathematics are you doing in here? Return to your slumber party, you indentured servant!',
  "background-image: linear-gradient(to bottom, #ff931a, #ff999b); -webkit-background-clip: text; color: transparent; font-size: 18px;"
);
