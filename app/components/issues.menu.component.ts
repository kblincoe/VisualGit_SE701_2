import { Component } from "@angular/core";

@Component({
  selector: "issues-menu",
    template: `
  <div *ngIf="myIssues.length === 0" class="no-issues">
    <!-- Spinner taken from spinkit: http://tobiasahlin.com/spinkit/ -->
    <div class="sk-circle">
      <div class="sk-circle1 sk-child"></div>
      <div class="sk-circle2 sk-child"></div>
      <div class="sk-circle3 sk-child"></div>
      <div class="sk-circle4 sk-child"></div>
      <div class="sk-circle5 sk-child"></div>
      <div class="sk-circle6 sk-child"></div>
      <div class="sk-circle7 sk-child"></div>
      <div class="sk-circle8 sk-child"></div>
      <div class="sk-circle9 sk-child"></div>
      <div class="sk-circle10 sk-child"></div>
      <div class="sk-circle11 sk-child"></div>
      <div class="sk-circle12 sk-child"></div>
    </div>
    <span class="loading-text">Loading issues...</span>
    <span class="no-issues-text">maybe there are none</span>
  </div>
  <div class="create-wrapper">
    <h2 class="create-title">Create an Issue</h2>
    <div class="input-zone">
      <label for="issue-title-input" class="create-issue-label">Title</label>
      <input [(ngModel)]="newIssueTitle" type="text" id="issue-title-input" placeholder="Issue Title"/>
    </div>
    <div class="input-zone">
      <label for="issue-description-input" class="create-issue-label">Description</label>
      <textarea [(ngModel)]="newIssueDescription" id="issue-description-input" rows="6" cols="30" placeholder="Issue Description..."></textarea>
    </div>
    <button class="btn btn-circle issue-create" (click)="createNewIssue()">Create</button>
  </div>
  <div *ngIf="myIssues.length !== 0" class="issues-present-wrapper">
    <div class="issues-header">
      <h2 class="issues-title">Issues</h2>
      <h4>({{myIssues.length}})</h4>
    </div>
    <ul class="issues-list">
      <li class="issue-element" *ngFor="let issue of myIssues">
        <div class="text-large issue-title">{{issue.title}}</div>
        <div class="text-medium issue-header">
          <img class="icon-medium" src="{{issue.author.avatar_url}}"/>
          <span class="username">{{issue.author.username}}</span>
          <span class="text-medium created-at">{{issue.created}}</span>
        </div>
        <div class="issue-more-info">
          <div class="text-medium issue-assignees-title">Assignees:</div>
          <div class="text-medium"*ngIf="issue.assignees.length === 0">No Assignees</div>
          <ul class="issue-assignees">
            <li class="issue-assignee" *ngFor="let assignee of issue.assignees">
              <img class="icon-medium" src="{{assignee.avatar_url}}"/>
              <span class="text-medium issue-assignee-name">{{assignee.username}}</span>
            </li>
          </ul>
          <div class="issue-description">
            <span class="no-body" *ngIf="issue.body.length === 0">This issue has no description</span>
            <span class="issue-body">{{issue.body}}</span>
          </div>
          <div class="issue-comments">
              <div class="text-medium">Comments:</div>
              <div class="issue-comment" *ngFor="let comment of issue.comments">
                  <div class="issue-comment-username">
                    <img class="icon-medium" src="{{comment.authorAvatar}}"/>
                    <span class="text-medium">{{comment.author}}</span>
                  </div>
                  <div class="text-medium issue-comment-body">{{comment.body}}</div>
                  <div class="text-medium created-at">{{comment.created}}</div>
              </div>
              <div class="issue-add-comment">
                <div class="textarea-wrapper">
                  <textarea [(ngModel)]="issue.newComment" class="text-medium issue-comment-input" rows="4" cols="30" placeholder="Leave a comment..."></textarea>
                </div>
                <button *ngIf="!issue.locked" class="btn btn-circle issue-submit-comment" (click)="submitComment(issue.newComment, issue, this)">Add</button>
                <button *ngIf="issue.locked" class="btn btn-disabled btn-circle issue-submit-comment" disabled>Add</button>
              </div>
          </div>
          <div class="actions">
            <button *ngIf="!issue.locked" class="btn btn-circle btn-red  issue-close" (click)="closeIssue(issue)">Close</button>
            <button *ngIf="issue.locked" class="btn btn-disabled btn-circle btn-red  issue-close" disabled>Close</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
  `,
  directives: []
})

export class IssuesMenu implements OnInit {

  myIssues: Object[] = []
  newIssueTitle: String  = ""
  newIssueDescription: String = ""

  submitComment(comment, issue): void {
    commentOnIssue(comment, issue);
  }

  closeIssue(issue): void {
    closeIssue(issue);
  }

  createNewIssue(): void {
    console.log(this.newIssueTitle);
    console.log(this.newIssueDescription);
    if(!repoRemoteUrl) {
        console.error("No remote repository exists");
    } else {
        createIssue(this.newIssueTitle, this.newIssueDescription, () => {
          this.newIssueTitle = "";
          this.newIssueDescription = "";
        });
    }
  }

  ngOnInit(): void {
    // Load the issues for the current repository
    const self = this;
    window.setInterval(function() {
      updateIssues();
    }, 60000);
    window.setInterval(function() {
      console.log(self.myIssues)
    }, 3000);
  }
};
