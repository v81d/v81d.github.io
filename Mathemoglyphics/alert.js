function CustomAlert() {
  this.alert = function(message, title) {
    // Check if the overlay and dialog box already exist
    let dialogoverlay = document.getElementById('dialogoverlay');
    let dialogbox = document.getElementById('dialogbox');

    if (!dialogoverlay) {
      // Create overlay
      dialogoverlay = document.createElement('div');
      dialogoverlay.id = 'dialogoverlay';
      dialogoverlay.className = 'opacity-animation';
      document.body.appendChild(dialogoverlay);
    }

    if (!dialogbox) {
      // Create dialog box
      dialogbox = document.createElement('div');
      dialogbox.id = 'dialogbox';
      dialogbox.className = 'slit-in-vertical'; // Add animation class

      // Add content structure
      dialogbox.innerHTML = `
        <div>
          <div id="dialogboxhead"></div>
          <div id="dialogboxbody"></div>
          <div id="dialogboxfoot"></div>
        </div>
      `;
      document.body.appendChild(dialogbox);
    }

    // Show the overlay and dialog box
    dialogoverlay.style.display = 'block';
    setTimeout(() => {
      dialogoverlay.style.opacity = '1'; // Trigger opacity transition
    }, 10);

    // Ensure dialog box is visible and plays the animation
    dialogbox.style.display = 'block';
    dialogbox.classList.remove('slit-out-vertical'); // Ensure no reverse animation class
    dialogbox.classList.add('slit-in-vertical'); // Add the slit-in animation

    // Set dialog box content
    const dialogboxhead = document.getElementById('dialogboxhead');
    const dialogboxbody = document.getElementById('dialogboxbody');
    const dialogboxfoot = document.getElementById('dialogboxfoot');

    if (typeof title === 'undefined') {
      dialogboxhead.style.display = 'none';
    } else {
      dialogboxhead.style.display = 'block';
      dialogboxhead.innerHTML = '<svg style="vertical-align: middle; align-items: middle; display: inline;" width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.20164 18.4695L10.1643 4.00506C10.9021 2.66498 13.0979 2.66498 13.8357 4.00506L21.7984 18.4695C22.4443 19.6428 21.4598 21 19.9627 21H4.0373C2.54022 21 1.55571 19.6428 2.20164 18.4695Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 9V13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 17.0195V17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' + '<span style="vertical-align: middle; margin-left: 8px;"><strong>' + title + "</strong></span>";
    }

    dialogboxbody.innerHTML = message;
    dialogboxfoot.innerHTML = `
      <button class="pure-material-button-contained active ripple" onclick="customAlert.ok()">OK</button>
    `;
  }

  this.ok = function() {
    const dialogoverlay = document.getElementById('dialogoverlay');
    const dialogbox = document.getElementById('dialogbox');

    // Play reverse animation
    dialogbox.classList.remove('slit-in-vertical');
    dialogbox.classList.add('slit-out-vertical');
    
    // Hide overlay and dialog box after animation ends
    dialogoverlay.style.opacity = '0'; // Start opacity transition

    setTimeout(function () {
      dialogoverlay.style.display = 'none';
      dialogbox.style.display = 'none'; // Ensure the dialog box is hidden
    }, 450); // Match the duration of the animation
  }
}

let customAlert = new CustomAlert();

document.getElementById("info").addEventListener("click", function () {
  customAlert.alert("The Mathemoglyphics pseudolanguage and its respective translator are created merely as a joke, so please don't take it seriously. Uppercase letters are translated to its corresponding Mathemoglyphics symbol surrounded by brackets, which are then followed by a caret (\"^\"). Each translated word is surrounded by curly brackets, while all translated letters within that word are separated by a pipe, which is surrounded by spaces (\" | \").", "Information");
  document.getElementById("info").style.fill = "#8f36f5";
  setTimeout(function () {
    document.getElementById("info").style.fill = "#ccc";
  }, 1000);
});
