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

    // Ensure the dialog box is visible
    dialogbox.classList.add('slit-in-vertical');
    dialogbox.style.display = 'block';

    // Show the overlay with opacity transition
    dialogoverlay.style.display = 'block';
    setTimeout(() => {
      dialogoverlay.style.opacity = '1'; // Trigger opacity transition
    }, 10); // Small delay to ensure transition takes effect

    // Set dialog box content
    const dialogboxhead = document.getElementById('dialogboxhead');
    const dialogboxbody = document.getElementById('dialogboxbody');
    const dialogboxfoot = document.getElementById('dialogboxfoot');

    if (typeof title === 'undefined') {
      dialogboxhead.style.display = 'none';
    } else {
      dialogboxhead.style.display = 'block';
      dialogboxhead.innerHTML = 'ⓘ\xA0' + title;
    }

    dialogboxbody.innerHTML = message;
    dialogboxfoot.innerHTML = `
      <button class="pure-material-button-contained active" onclick="customAlert.ok()">OK</button>
    `;
  }

  this.ok = function() {
    const dialogoverlay = document.getElementById('dialogoverlay');
    const dialogbox = document.getElementById('dialogbox');

    dialogoverlay.style.opacity = '0'; // Start opacity transition
    dialogoverlay.classList.remove('slit-in-vertical'); // Start opacity transition

    setTimeout(() => {
      dialogoverlay.style.display = 'none';
      dialogbox.style.display = 'none';
    }, 450); // Match the duration of the opacity transition
  }
}

let customAlert = new CustomAlert();
