import { Component } from "@angular/core";

@Component({
  selector: "add-repository-panel",
  template: `
    <div class="add-repository-panel" id="add-repository-panel">
      <img src="./assets/Back.svg" (click)="returnToMainPanel()" class="back-button">

      <div class="add-repository-body">
        <div class="title">
          <h1 class="clone-title">Clone from Internet</h1>
        </div>

        <div class="block">
          <div class="left">
            <p>URL to clone from</p>
          </div>
          <div class="right">
          <input type="text" name="repositoryRemote" size="50" id="repoClone" placeholder="https://github.com/user/repository.git"/>
          </div>
        </div>

        <div class="block">
          <div class="left">
            <p>File location to save to</p>
          </div>
          <div class="right">
            <input type="text" name="repositoryLocal" size="50" id="repoSave" readonly/>
            <input type="button" id="button-browse-save" value="Browse" onclick="document.getElementById('saveFolderExplorer').click()"/>
            <input type="file" style="display:none;" name="saveFolderExplorer" id="saveFolderExplorer" webkitdirectory onchange="setSavePath()"/>
            <button class="button-clone" (click)="addRepository()">Clone</button>
          </div>
        </div>


        <div class="title">
          <h1 class="open-local-repo">Open Local Repository</h1>
        </div>

        <div class="block">
          <div class="left">
            <p>Location of existing repository</p>
          </div>
          <div class="right">
            <input type="text" name="repositoryLocal" size="50" id="repoOpen" readonly/>
            <input type="button" id="button-browse-open" value="Browse" onclick="document.getElementById('openFolderExplorer').click()"/>
            <input type="file" style="display:none;" name="openFolderExplorer" id="openFolderExplorer" webkitdirectory onchange="setRepoPath()"/>
            <button class="button-open" (click)="openRepository()">Open</button>
          </div>
        </div>
      </div>
    </div>
  `
})

export class AddRepositoryComponent {

  addRepository(): void {
    downloadRepository();
    switchToMainPanel();
  }

  openRepository(): void {
    openRepository();
    switchToMainPanel();
  }

  returnToMainPanel(): void {
    switchToMainPanel();
  }
}
