import { Component } from "@angular/core";

@Component({
  selector: "file-panel",
  template: `
  <div class="file-panel" id="file-panel">

    <div class="files-changed" id="staged-files-changed"><p>Staged Changes</p>
    </div>

    <div class="files-changed" id="files-changed"><p>Changes</p>
    </div>

    <div class="commit-panel" id="commit-panel">
      <textarea placeholder="Describe your changes here..." class="commit-message-input" id="commit-message-input"></textarea>
      <button class="commit-button" id="commit-button">Commit</button>
    </div>

    <div class="clean-panel" id="clean-panel">
      <button class="clean-button" id="clean-button">Clean</button>
    </div>

  </div>
  `
})

export class FilePanelComponent {

}
