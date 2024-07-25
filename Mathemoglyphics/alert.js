function CustomAlert() {
  this.alert = function(message, title) {
    // Check if the overlay and dialog box already exist
    let dialogoverlay = document.getElementById('dialogoverlay');
    let dialogbox = document.getElementById('dialogbox');

    if (!dialogoverlay) {
      // Create overlay
      dialogoverlay = document.createElement('div');
      dialogoverlay.id = 'dialogoverlay';
      dialogoverlay.className = 'slit-in-vertical';
      document.body.appendChild(dialogoverlay);
    }

    if (!dialogbox) {
      // Create dialog box
      dialogbox = document.createElement('div');
      dialogbox.id = 'dialogbox';
      dialogbox.className = 'slit-in-vertical';

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
    dialogoverlay.style.display = "block";
    dialogbox.style.display = "block";

    // Set dialog box content
    if (title === undefined) {
      document.getElementById('dialogboxhead').style.display = 'none';
    } else {
      document.getElementById('dialogboxhead').style.display = 'block';
      document.getElementById('dialogboxhead').innerHTML = 'ⓘ\xA0' + title;
    }

    document.getElementById('dialogboxbody').innerHTML = message;
    document.getElementById('dialogboxfoot').innerHTML = `
      <button class="pure-material-button-contained active" onclick="customAlert.ok()">OK</button>
    `;
  }

  this.ok = function() {
    let dialogoverlay = document.getElementById('dialogoverlay');
    let dialogbox = document.getElementById('dialogbox');
    
    dialogbox.style.display = "none";
    dialogoverlay.style.display = "none";
  }
}

let customAlert = new CustomAlert();
