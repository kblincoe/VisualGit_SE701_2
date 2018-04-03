let issues = [];

const _MILLIS_IN_SECOND = 1000;
const _SECONDS_IN_MINUTE = 60;
const _MINUTES_IN_HOUR = 60;

function updateIssues() {
  if(!repoRemoteUrl) {
    return;
  }
  console.log("Updating issues");
  const repoPath = _getRepoPath(repoRemoteUrl);
    if (repoPath && repoPath.length == 0) {
      console.error("No remote repository");
    } else {
        let repo = client.repo(repoPath);
        return repo.issues(function(err, repoIssues, headers) {
            // Flush the old issues and add the new ones
            issues.splice(0);
            repoIssues.forEach(issue => {
                const formattedAssignees = _formatIssueAssignees(issue);
                const formattedAuthor = _formatUser(issue.user);
                const formattedLabels = _formatLabels(issue.labels);
                const timeString = _formatCreatedAt(issue.created_at);
                // Formatting comments needs to be called with callback because it requires async
                _formatComments(repoPath, issue, function(formattedComments) {
                    // Build the issue
                    let formattedIssue = {
                        author: formattedAuthor,
                        assignees: formattedAssignees,
                        body: issue.body,
                        created: timeString,
                        comments: formattedComments,
                        labels: formattedLabels,
                        locked: false,
                        title: issue.title,
                        issueNumber: issue.number,
                        newComment: ""
                    }
                    issues.push(formattedIssue);
                });
            });
        });
    }
}

function _formatIssueAssignees(issue) {
    let formattedAssignees = [];
    issue.assignees.forEach(assignee => {
        let formattedAssignee = {
            username: assignee.login,
            avatar_url: assignee.avatar_url
        }
        formattedAssignees.push(formattedAssignee);
    });
    return formattedAssignees;
}

function _formatUser(user) {
    let formattedAuthor = {
        username: user.login,
        avatar_url: user.avatar_url
    };
    return formattedAuthor;
}

function _formatLabels(labels) {
    let formattedLabels = [];
    labels.forEach(label => {
        let formattedLabel = {
            color: label.color,
            name: label.name
        }
        formattedLabels.push(formattedLabel);
    });
    return formattedLabels;
}

function _formatCreatedAt(createdAt) {
    const timeRegex = new RegExp('([0-9]{4})-([0-9]{2})-([0-9]{2}).([0-9]{2})');
    const timeExecResult = timeRegex.exec(createdAt);
    let timeString;
    let formattedCreated  = "";
    if(timeExecResult && timeExecResult.length > 4) {
        const createdDate = new Date(parseInt(timeExecResult[1])
            ,parseInt(timeExecResult[2])
            ,parseInt(timeExecResult[3])
            ,parseInt(timeExecResult[4]));
        const createdTimestamp = createdDate.getTime();
        const difference = Date.now() - createdTimestamp
        const hoursDifference = Math.floor(difference/_MILLIS_IN_SECOND/_SECONDS_IN_MINUTE/_MINUTES_IN_HOUR);
        if(hoursDifference > 12) {
            timeString = hoursDifference + " hours ago";
        } else {
            timeString = createdDate.getDate() + "/" + createdDate.getMonth() + "/" + createdDate.getFullYear();
        }
        formattedCreated = "created: " + timeString;
    }
    return formattedCreated;
}

function _formatComments(repoPath, issue, callback) {
    const ghIssue = client.issue(repoPath, issue.number);
    ghIssue.comments(function(commentsErr, comments, commentsHeaders) {
        let formattedComments = [];
        if(commentsErr) {
            console.error("Error retrieving issue's comments");
            console.error(commentsErr);
        }
        if(comments && comments.length > 0) {
            comments.forEach(comment => {
                const formattedCreated = _formatCreatedAt(comment.created_at);
                let formattedComment = {
                    author: comment.user.login,
                    authorAvatar: comment.user.avatar_url,
                    created: formattedCreated,
                    body: comment.body
                };
                formattedComments.push(formattedComment);
            });
        }
        callback && callback(formattedComments);
    });
}

function _getRepoPath(fullUrl) {
    let titleRegex = new RegExp('.*github.com\/(.+\/.+)');
    let result = titleRegex.exec(fullUrl);
    if(result && !result[1]) {
        console.error("repository path is not a valid github url");
        return "";
    }
    return result[1];
}

function commentOnIssue(comment, issue) {
    const repoPath = _getRepoPath(repoRemoteUrl);
    const ghissue = client.issue(repoPath, issue.issueNumber);
    issue.locked = true;
    ghissue.createComment({
        body: comment
    }, function(err) {
      if(err) {
        console.log("error posting comment");
        console.log(err);
      }
      console.log("Posted comment");
      updateIssues();
    });
}

function closeIssue(issue) {
  const repoPath = _getRepoPath(repoRemoteUrl);
  const ghissue = client.issue(repoPath, issue.issueNumber);
  issue.locked = true;
  ghissue.update({
    state: "closed"
  }, function(err) {
    if(err) {
      console.log("Error closing issue");
      console.log(err);
    }
    console.log("Closed issue")
    updateIssues();
  });
}

function createIssue(title, body, callback) {
  const repoPath = _getRepoPath(repoRemoteUrl);
  const repo = client.repo(repoPath);
    repo.issue({
      title,
      body
    }, function(err) {
      if(err) {
        console.log("Error creating issue");
        console.log(err);
      }
      console.log("Created Issue");
      updateIssues();
      callback && callback(err);
    });
}
