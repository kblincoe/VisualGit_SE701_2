import { Component } from "@angular/core";
import { IssuesMenu } from "./issues.menu.component"

@Component({
  selector: "repository-menu",
  template: `
    <div class="repo-menu-panel">
      <issues-menu class="issues-menu-panel repo-panel-member" id="issues-menu"></issues-menu>
    </div>
  `,
  directives: [IssuesMenu]
})

export class RepositoryMenu {}
