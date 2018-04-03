let cred;

function collpaseSignPanel() {
  $('#nav-collapse1').collapse('hide');
}

function showSignPanel() {

  $('#nav-collapse1').collapse('show');

}

function toggleSignPanel() {
  $('#nav-collapse1').collapse('toggle');
}

function switchToAuthenticatePanel() {

  displayAuthenticatePanel();

  hideAddRepositoryPanel();
  hideFilePanel();
  hideGraphPanel();
  
}

function switchToMainPanel() {
  hideAuthenticatePanel();
  hideAddRepositoryPanel();
  displayFilePanel();
  displayGraphPanel();
}

function switchToAddRepositoryPanel() {
  console.log("1111111");
  hideAuthenticatePanel();
  hideFilePanel();
  hideGraphPanel();
  displayAddRepositoryPanel();
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

function displayFilePanel() {
  document.getElementById("file-panel").style.zIndex = "10";
}

function displayGraphPanel() {
  document.getElementById("graph-panel").style.zIndex = "10";
}

function displayAddRepositoryPanel() {
  document.getElementById("add-repository-panel").style.zIndex = "10";
}

function hideFilePanel() {
  document.getElementById("file-panel").style.zIndex = "-10";
}

function hideGraphPanel() {
  document.getElementById("graph-panel").style.zIndex = "-10";
}

function hideAddRepositoryPanel() {
  document.getElementById("add-repository-panel").style.zIndex = "-10";
}

/* Until the panel is opened, the inner HTML of button banners in both the differences panel 
   and the text editor panel is kept empty. This is to avoid the buttons appearing in the body
   when the panels are not open. Then when the panel is closed, the inner HTML needs to be set
   to empty again.
   Panels are opened and closed by adjusting the widths of the element. */
function displayDiffPanel() {
  document.getElementById("edit-button-banner").innerHTML = `<button class="edit-button" id="editfile-button">Edit file</button>`;
  document.getElementById("graph-panel").style.width = "60%";
  document.getElementById("diff-panel").style.width = "40%";
}

function hideDiffPanel() {
  document.getElementById("edit-button-banner").innerHTML = "";
  document.getElementById("diff-panel").style.width = "0";
  document.getElementById("graph-panel").style.width = "100%";
}

function displayFileTexteditor() {
  document.getElementById("edit-button-banner").innerHTML = "";
  document.getElementById("saveandclose-button-banner").innerHTML = `<button class="savechanges-button" id="savechanges-button">Save changes</button>
  <button class="closeeditor-button" id="closeeditor-button">Close editor</button>`;
  // opening the text editor panel involves closing the differences panel
  document.getElementById("diff-panel").style.width = "0";
  document.getElementById("graph-panel").style.width = "60%";
  document.getElementById("texteditor-panel").style.width = "40%";
}

function hideFileTexteditor() {
  document.getElementById("saveandclose-button-banner").innerHTML = "";
  document.getElementById("graph-panel").style.width = "60%";
  document.getElementById("texteditor-panel").style.width = "0";
}

function hideAuthenticatePanel() {
  document.getElementById("authenticate").style.zIndex = "-20";
}

function displayAuthenticatePanel() {
  document.getElementById("authenticate").style.zIndex = "20";
}
