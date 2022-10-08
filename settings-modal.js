// Get the modal
const settingsModal = document.getElementById("settings-modal");
const settingsModalClose = settingsModal.getElementsByClassName("close")[0];
const settingsModalLoader = settingsModal.getElementsByClassName("loader")[0];
const settingsModalResponse = document.getElementById("setting-save-response");

// When the user clicks on the button, open the modal

function openSettings() {
    settingsModal.style.display = "block";
    settingsModalLoader.style.display = "none";
    settingsModalResponse.innerHTML = "";

    const access_key = Cookies.get('access_key');
    if (access_key != undefined) {
      document.getElementById("access-key").value = access_key;
    }
    const cfg_scale = Cookies.get('cfg_scale');
    if (cfg_scale != undefined) {
      document.getElementById("cfg_scale").value = cfg_scale;
    }
    const user_uc = Cookies.get('user_uc');
    if (user_uc != undefined) {
      document.getElementById("user_uc").value = user_uc;
    }
}

// When the user clicks on <span> (x), close the modal
settingsModalClose.onclick = function() {
    settingsModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == settingsModal) {
    settingsModal.style.display = "none";
  }
}

async function tryUpdateSettings(formObject) {
  settingsModalLoader.style.display = "inline-block";

  const access_key = formObject["access-key"].value;
  const key_result = await NovelAI_API.trySetAccessToken(access_key);
  settingsModalLoader.style.display = "none";
  
  if (key_result[0] === true) {
    settingsModalResponse.innerHTML = "<span class='success-message'>"+key_result[1]+"</span>";
    Cookies.set('access_key', access_key);
  } else {
    settingsModalResponse.innerHTML = "<span class='error-message'>"+key_result[1]+"</span>";
    return;
  }

  var cfgScale = formObject["cfg-scale"].value;
  if (cfgScale!=undefined) {
    if (cfgScale < 1.1) { cfgScale = 1.1; }

    Cookies.set('cfg_scale', cfgScale);
  } else {
    formObject["cfg-scale"].value = 11;
  }
  Cookies.set('user_uc', formObject["uc-user"].value);
}