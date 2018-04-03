import { Component } from "@angular/core";

@Component({
    selector: "file-texteditor",
    template: `
    <div id="texteditor-panel" class="texteditor-panel">
        <div class="saveandclose-button-banner" id="saveandclose-button-banner">
        </div>
        <div class="texteditor-panel-body" id="texteditor-panel-body">
            <textarea class="texteditor-content" id="texteditor-content"></textarea>
        </div>
    </div>
    `
})

export class FileTexteditorComponent {

}