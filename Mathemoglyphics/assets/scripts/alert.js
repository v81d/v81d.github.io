function CustomAlert() {
    this.alert = function (message, title) {
        let dialogoverlay = document.getElementById("dialogoverlay");
        let dialogbox = document.getElementById("dialogbox");

        if (!dialogoverlay) {
            dialogoverlay = document.createElement("div");
            dialogoverlay.id = "dialogoverlay";
            dialogoverlay.className = "opacity-animation";
            document.body.appendChild(dialogoverlay);
        }

        if (!dialogbox) {
            dialogbox = document.createElement("div");
            dialogbox.id = "dialogbox";
            dialogbox.className = "slit-in-vertical";
            dialogbox.innerHTML = `
        <div>
          <div id="dialogboxhead"></div>
          <div id="dialogboxbody"></div>
          <div id="dialogboxfoot"></div>
        </div>
      `;
            document.body.appendChild(dialogbox);
        }

        dialogoverlay.style.display = "block";
        setTimeout(() => {
            dialogoverlay.style.opacity = "1";
        }, 10);

        dialogbox.style.display = "block";
        dialogbox.classList.remove("slit-out-vertical");
        dialogbox.classList.add("slit-in-vertical");

        const dialogboxhead = document.getElementById("dialogboxhead");
        const dialogboxbody = document.getElementById("dialogboxbody");
        const dialogboxfoot = document.getElementById("dialogboxfoot");

        if (typeof title === "undefined") {
            dialogboxhead.style.display = "none";
        } else {
            dialogboxhead.style.display = "block";
            dialogboxhead.innerHTML = "<svg style='vertical-align: middle; align-items: middle; display: inline;' width='19' height='19' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M2.20164 18.4695L10.1643 4.00506C10.9021 2.66498 13.0979 2.66498 13.8357 4.00506L21.7984 18.4695C22.4443 19.6428 21.4598 21 19.9627 21H4.0373C2.54022 21 1.55571 19.6428 2.20164 18.4695Z' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><path d='M12 9V13' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><path d='M12 17.0195V17' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>" + "<span style='vertical-align: middle; margin-left: 8px;'><strong>" + title + "</strong></span>";
        }

        dialogboxbody.innerHTML = message;
        dialogboxfoot.innerHTML = `
      <button class="pure-material-button-contained active ripple" onclick="customAlert.ok()">OK</button>
    `;
    }

    this.ok = function () {
        const dialogoverlay = document.getElementById("dialogoverlay");
        const dialogbox = document.getElementById("dialogbox");

        dialogbox.classList.remove("slit-in-vertical");
        dialogbox.classList.add("slit-out-vertical");

        dialogoverlay.style.opacity = "0";

        setTimeout(function () {
            dialogoverlay.style.display = "none";
            dialogbox.style.display = "none";
        }, 450);
    }
}

let customAlert = new CustomAlert();

document.getElementById("info").addEventListener("click", function () {
    customAlert.alert("In the Mathemoglyphics pseudolanguage, uppercase letters are translated to its corresponding Mathemoglyphics symbol surrounded by brackets altogether preceding a caret (\"^\"). Each translated word is bordered by curly brackets, while its subcomponents (letters, or Mathemoglyphics symbols) are disjoined by pipes (\" | \").", "Information");
    document.getElementById("info").style.fill = "#8f36f5";
    setTimeout(function () {
        document.getElementById("info").style.fill = "#ccc";
    }, 1000);
});
