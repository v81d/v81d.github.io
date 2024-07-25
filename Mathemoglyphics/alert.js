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
      dialogboxhead.innerHTML = 'ⓘㅤ' + title;
    }

    dialogboxbody.innerHTML = message;
    dialogboxfoot.innerHTML = `
      <button class="pure-material-button-contained active" onclick="customAlert.ok()">OK</button>
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

    setTimeout(() => {
      dialogoverlay.style.display = 'none';
      dialogbox.style.display = 'none'; // Ensure the dialog box is hidden
    }, 450); // Match the duration of the animation
  }
}

let customAlert = new CustomAlert();
