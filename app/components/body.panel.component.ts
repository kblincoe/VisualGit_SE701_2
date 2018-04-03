import { Component } from "@angular/core";
import { DiffPanelComponent } from "./diff.panel.component";
import { GraphPanelComponent } from "./graph.panel.component";
import { FileTexteditorComponent } from "./file.texteditor.component";

@Component({
  selector: "body-panel",
  template: `
  <div class="body-panel" id="body-panel">
    <diff-panel></diff-panel>
    <graph-panel></graph-panel>
    <file-texteditor></file-texteditor>
  </div>
  `,
  directives: [DiffPanelComponent, GraphPanelComponent, FileTexteditorComponent]
})

export class BodyPanelComponent {

}
