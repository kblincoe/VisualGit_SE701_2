import * as nodegit from "git";
import NodeGit, { Status, Repository, StatusFile } from "nodegit";
export = {}; // DO NOT REMOVE - OR GRAPHS WILL BREAK
let opn = require('opn');
let $ = require("jquery");
let Git = require("nodegit");
let fs = require("fs");
let async = require("async");
let readFile = require("fs-sync");
let green = "#84db00";
let repo, index, oid, remote, commitMessage;
let filesToAdd = [];
let theirCommit = null;
let modifiedFiles;
let hasChangedFiles: boolean;
const { remote } = require('electron')
const { dialog } = remote
const simpleGit = require("simple-git");
let sign;


function warnIfCommitsNotOnRemote() {

  // Could not find a way to get the log of commits that are not on remotes with nodegit, so using simple-git instead
  const path = repoFullPath;

  if (path == null || path == "") {
    return;
  }

  simpleGit(path).raw(
    [
      "log",
      "--branches",
      "--not",
      "--remotes"
    ], (err, result) => {

      console.debug(result);
      displayModal("WARNING: You have unsaved commits!");

    });

}

function commit() {
  let repository;

  Git.Repository.open(repoFullPath)
    .then(function (repoResult) {
      repository = repoResult;
      console.log("1.0");
      return repository.refreshIndex();
    })

    .then(function (indexResult) {
      console.log("2.0");
      index = indexResult;
      let filesToStage = [];
      filesToAdd = [];
      let fileElements = document.getElementsByClassName('file');
      for (let i = 0; i < fileElements.length; i++) {
        let fileElementChildren = fileElements[i].childNodes;
        if (fileElementChildren[1].checked === true) {
          filesToStage.push(fileElementChildren[0].innerHTML);
          filesToAdd.push(fileElementChildren[0].innerHTML);
        }
      }
      console.log("2.1");
      // return index.addAll(filesToStage);
    })

    .then(function () {
      console.log("3.0");
      return index.write();
    })

    .then(function () {
      console.log("4.0");
      return index.writeTree();
    })

    .then(function (oidResult) {
      console.log("5.0");
      oid = oidResult;
      return Git.Reference.nameToId(repository, "HEAD");
    })

    .then(function (head) {
      console.log("6.0");
      return repository.getCommit(head);
    })

    .then(function (parent) {
      console.log("7.0");
      if (sign == undefined) {
        sign = Git.Signature.default(repository);
      }
      commitMessage = document.getElementById('commit-message-input').value;
      //console.log(sign.toString());
      if (readFile.exists(repoFullPath + "/.git/MERGE_HEAD")) {
        let tid = readFile.read(repoFullPath + "/.git/MERGE_HEAD", null);
        console.log("theirComit: " + tid);
        console.log("ourCommit: " + parent.id.toString());
        return repository.createCommit("HEAD", sign, sign, commitMessage, oid, [parent.id().toString(), tid.trim()]);
      } else {
        console.log('no other commit');
        return repository.createCommit("HEAD", sign, sign, commitMessage, oid, [parent]);
      }
    })
    .then(function (oid) {
      theirCommit = null;
      console.log("8.0");
      console.log("Commit successful: " + oid.tostrS());

      hideDiffPanel();
      //clearModifiedFilesList();
      clearCommitMessage();
      for (let i = 0; i < filesToAdd.length; i++) {
        addCommand("git add " + filesToAdd[i]);
      }
      addCommand('git commit -m "' + commitMessage + '"');

      hasChangedFiles = false;
      refreshAll(repository);
    }, function (err) {
      console.log(err);
      updateModalText("Oops, error occours! If u haven't login, please login and try again.");
    });
}

// Clear all modified files from the left file panel
function clearModifiedFilesList() {
  let filePanel = document.getElementById("files-changed");
  while (filePanel.firstChild) {
    filePanel.removeChild(filePanel.firstChild);
  }
  let filesChangedMessage = document.createElement("p");
  filesChangedMessage.className = "modified-files-message";
  filesChangedMessage.id = "modified-files-message";
  filesChangedMessage.innerHTML = "Your modified files will appear here";
  filePanel.appendChild(filesChangedMessage);


}
function clearStaleFiles(repoPath, fileName) {
  let fullLocalPath = repoPath + "/" + fileName.parentNode.innerText;
  if (!fs.existsSync(fullLocalPath)) {
    fileName.parentNode.remove();
  }
}
function clearCommitMessage() {
  document.getElementById('commit-message-input').value = "";
}

function getAllCommits(callback) {
  // Git.Repository.open(repoFullPath)
  // .then(function(repo) {
  //   return repo.getHeadCommit();
  // })
  // .then(function(firstCommitOnMaster){
  //   let history = firstCommitOnMaster.history(Git.Revwalk.SORT.Time);
  //
  //   history.on("end", function(commits) {
  //     callback(commits);
  //   });
  //
  //   history.start();
  // });
  let repos;
  let allCommits = [];
  let aclist = [];
  console.log("1.0");
  Git.Repository.open(repoFullPath)
    .then(function (repo) {
      repos = repo;
      console.log("2.0");
      return repo.getReferences(Git.Reference.TYPE.LISTALL);
    })
    .then(function (refs) {
      let count = 0;
      console.log("3.0    " + refs.length);
      async.whilst(
        function () {
          return count < refs.length;
        },

        function (cb) {
          if (!refs[count].isRemote()) {
            console.log("4.0");
            repos.getReferenceCommit(refs[count])
              .then(function (commit) {
                let history = commit.history(Git.Revwalk.SORT.Time);
                history.on("end", function (commits) {
                  for (let i = 0; i < commits.length; i++) {
                    if (aclist.indexOf(commits[i].toString()) < 0) {
                      allCommits.push(commits[i]);
                      aclist.push(commits[i].toString());
                    }
                  }
                  count++;
                  console.log(count + "-------" + allCommits.length);
                  cb();
                });

                history.start();
              });
          } else {
            console.log('lalalalalalala');
            count++;
            cb();
          }
        },

        function (err) {
          console.log(err);
          callback(allCommits);
        });
    });
}

function pullFromRemote() {

  if (hasChangedFiles) {
    showWarning();
  }
  else {
    let repository;
    let branch = document.getElementById("branch-name").innerText;
    // if (modifiedFiles.length > 0) {
    //   updateModalText("Please commit before pulling from remote!");
    // }
    Git.Repository.open(repoFullPath)
      .then(function (repo) {
        repository = repo;
        console.log("Pulling changes from remote...");
        addCommand("git pull");
        displayModal("Pulling new changes from the remote repository");
        hasChangedFiles = false;

        return repository.fetchAll({
          callbacks: {
            credentials: function () {
              return cred;
            },
            certificateCheck: function () {
              return 1;
            }
          }
        });
      })
      // Now that we're finished fetching, go ahead and merge our local branch
      // with the new one
      .then(function () {
        return Git.Reference.nameToId(repository, "refs/remotes/origin/" + branch);
      })
      .then(function (oid) {
        console.log("3.0  " + oid);
        return Git.AnnotatedCommit.lookup(repository, oid);
      }, function (err) {
        console.log(err);
      })
      .then(function (annotated) {
        console.log("4.0  " + annotated);
        Git.Merge.merge(repository, annotated, null, {
          checkoutStrategy: Git.Checkout.STRATEGY.FORCE,
        });
        theirCommit = annotated;
      })
      .then(function () {
        if (fs.existsSync(repoFullPath + "/.git/MERGE_MSG")) {
          updateModalText("Conflicts exists! Please check files list on right side and solve conflicts before you commit again!");
          refreshAll(repository);
        } else {
          updateModalText("Successfully pulled from remote branch " + branch + "!");
          hasChangedFiles = false;
          refreshAll(repository);
        }
      });
  }
  //   .then(function(updatedRepository) {
  //     refreshAll(updatedRepository);

  // });
}

function pushToRemote() {
  let branch = document.getElementById("branch-name").innerText;
  Git.Repository.open(repoFullPath)
    .then(function (repo) {
      console.log("Pushing changes to remote")
      displayModal("Pushing changes to remote...");
      addCommand("git push -u origin " + branch);
      repo.getRemotes()
        .then(function (remotes) {
          repo.getRemote(remotes[0])
            .then(function (remote) {
              return remote.push(
                ["refs/heads/" + branch + ":refs/heads/" + branch],
                {
                  callbacks: {
                    credentials: function () {
                      return cred;
                    }
                  }
                }
              );
            })
            .then(function () {
              console.log("Push successful");
              updateModalText("Push successful");
              refreshAll(repo);
            });
        });
    });
}

function createBranch() {

  let branchName = document.getElementById("branchName").value;
  let repos;
  console.log(branchName + "!!!!!!");
  Git.Repository.open(repoFullPath)
    .then(function (repo) {
      // Create a new branch on head
      repos = repo;
      addCommand("git branch " + branchName);
      return repo.getHeadCommit()
        .then(function (commit) {
          return repo.createBranch(
            branchName,
            commit,
            0,
            repo.defaultSignature(),
            "Created new-branch on HEAD");
        }, function (err) {
          console.log(err + "LLLLLL");
        });
    }).done(function () {
      refreshAll(repos);
      console.log("All done!");
    });
}

function mergeLocalBranches(element) {
  let bn = element.innerHTML;
  let fromBranch;
  let repos;
  Git.Repository.open(repoFullPath)
    .then(function (repo) {
      repos = repo;
    })
    .then(function () {
      addCommand("git merge " + bn);
      return repos.getBranch("refs/heads/" + bn);
    })
    .then(function (branch) {
      console.log(branch.name());
      fromBranch = branch;
      return repos.getCurrentBranch();
    })
    .then(function (toBranch) {
      console.log(toBranch.name());
      return repos.mergeBranches(toBranch,
        fromBranch,
        repos.defaultSignature(),
        Git.Merge.PREFERENCE.NONE,
        null);
    })
    .then(function (index) {
      let text;
      console.log(index);
      if (index instanceof Git.Index) {
        text = "Conflicts Exist";
      } else {
        text = "Merge Successfully";
      }
      console.log(text);
      updateModalText(text);
      refreshAll(repos);
    });
}

function mergeCommits(from) {
  let repos;
  let index;
  Git.Repository.open(repoFullPath)
    .then(function (repo) {
      repos = repo;
      //return repos.getCommit(fromSha);
      addCommand("git merge " + from);
      return Git.Reference.nameToId(repos, 'refs/heads/' + from);
    })
    .then(function (oid) {
      console.log("3.0  " + oid);
      return Git.AnnotatedCommit.lookup(repos, oid);
    })
    .then(function (annotated) {
      console.log("4.0  " + annotated);
      Git.Merge.merge(repos, annotated, null, {
        checkoutStrategy: Git.Checkout.STRATEGY.FORCE,
      });
      theirCommit = annotated;
    })
    .then(function () {
      if (fs.existsSync(repoFullPath + "/.git/MERGE_MSG")) {
        updateModalText("Conflicts exists! Please check files list on right side and solve conflicts before you commit again!");
        refreshAll(repos);
      } else {
        updateModalText("Successfully Merged!");
        refreshAll(repos);
      }
    });
}

function rebaseCommits(from: string, to: string) {
  let repos;
  let index;
  let branch;
  Git.Repository.open(repoFullPath)
    .then(function (repo) {
      repos = repo;
      //return repos.getCommit(fromSha);
      addCommand("git rebase " + to);
      return Git.Reference.nameToId(repos, 'refs/heads/' + from);
    })
    .then(function (oid) {
      console.log("3.0  " + oid);
      return Git.AnnotatedCommit.lookup(repos, oid);
    })
    .then(function (annotated) {
      console.log("4.0  " + annotated);
      branch = annotated;
      return Git.Reference.nameToId(repos, 'refs/heads/' + to);
    })
    .then(function (oid) {
      console.log("5.0  " + oid);
      return Git.AnnotatedCommit.lookup(repos, oid);
    })
    .then(function (annotated) {
      console.log("6.0");
      return Git.Rebase.init(repos, branch, annotated, null, null);
    })
    .then(function (rebase) {
      console.log("7.0");
      return rebase.next();
    })
    .then(function (operation) {
      refreshAll(repos);
    });
}

function rebaseInMenu(from: string, to: string) {
  let p1 = document.getElementById("fromRebase");
  let p2 = document.getElementById("toRebase");
  let p3 = document.getElementById("rebaseModalBody");
  p1.innerHTML = from;
  p2.innerHTML = to;
  p3.innerHTML = "Do you want to rebase branch " + from + " to " + to + " ?";
  $("#rebaseModal").modal('show');
}

function mergeInMenu(from: string) {
  let p1 = document.getElementById("fromMerge");
  let p3 = document.getElementById("mergeModalBody");
  p1.innerHTML = from;
  p3.innerHTML = "Do you want to merge branch " + from + " to HEAD ?";
  $("#mergeModal").modal('show');
}

function resetCommit(name: string) {

  let repos;
  Git.Repository.open(repoFullPath)
    .then(function (repo) {
      repos = repo;
      addCommand("git reset --hard");
      return Git.Reference.nameToId(repo, name);
    })
    .then(function (id) {
      console.log('2.0' + id);
      return Git.AnnotatedCommit.lookup(repos, id);
    })
    .then(function (commit) {
      let checkoutOptions = new Git.CheckoutOptions();
      return Git.Reset.fromAnnotated(repos, commit, Git.Reset.TYPE.HARD, checkoutOptions);
    })
    .then(function (number) {
      console.log(number);
      if (number !== 0) {
        updateModalText("Reset failed, please check if you have pushed the commit.");
      } else {
        updateModalText("Reset successfully.");
      }
      refreshAll(repos);
    }, function (err) {
      updateModalText(err);
    });
}

function revertCommit(name: string, commitId: string) {
  let repos;
  Git.Repository.open(repoFullPath)
    .then(function (repo) {
      repos = repo;
      console.log(1.0);

      if (commitId) {
        addCommand("git revert " + commitId);
        return Git.Commit.lookup(repos, commitId);
      }

      addCommand("git revert " + name + "~1");
      return Git.Reference.nameToId(repo, name);
    })
    .then(function (id) {
      console.log('2.0' + id);
      return Git.Commit.lookup(repos, id);
    })
    .then(function (commit) {
      let revertOptions = new Git.RevertOptions();
      if (commit.parents().length > 1) {
        revertOptions.mainline = 1;
      }
      return Git.Revert.revert(repos, commit, revertOptions);
    })
    .then(function (number) {
      console.log(number);
      if (number === -1) {
        updateModalText("Revert failed, please check if you have pushed the commit.");
      } else {
        updateModalText("Revert successfully.");
      }
      refreshAll(repos);
    }, function (err) {
      updateModalText(err);
    });
}

function getCurrentDiff(commit, filePath, callback) {
  commit.getTree().then(function (tree) {
    Git.Diff.treeToWorkdir(repo, tree, null).then(function (diff) {
      processDiff(diff, filePath, callback);
    });
  });
}

function getStagedDiff(commit, filePath, callback) {
  commit.getTree().then(function (tree) {
    Git.Diff.treeToIndex(repo, tree, null).then(function (diff) {
      processDiff(diff, filePath, callback);
    });
  });
}

function processDiff(diff, filePath, callback) {
  diff.patches().then(function (patches) {
    patches.forEach(function (patch) {
      patch.hunks().then(function (hunks) {
        hunks.forEach(function (hunk) {
          hunk.lines().then(function (lines) {
            let oldFilePath = patch.oldFile().path();
            let newFilePath = patch.newFile().path();
            if (newFilePath === filePath) {
              lines.forEach(function (line) {
                callback(String.fromCharCode(line.origin()) + line.content());
              });
            }
          });
        });
      });
    });
  });
}

function pull() {
  hasChangedFiles = false;
  pullFromRemote();
}

function cleanCurrentRepo() {
  Git.Repository.open(repoFullPath)
    .then(cleanRepo)
    .then(function (repository: Repository) {
      addCommand('git clean -f');
      refreshAll(repository);
      displayModifiedFiles();
    });
}

function cleanRepo(repository: Repository) {
  repository.getStatus()
    .then(function (arrayStatusFile: StatusFile[]) {
      removeUntrackedFiles(arrayStatusFile);
    });

  return repository;
}

function removeUntrackedFiles(arrayStatusFile: StatusFile[]) {
  let filesToClean: String[] = [];

  arrayStatusFile.forEach(function (statusFile: StatusFile) {

    // Files marked as new are untracked, hence should be removed
    // Files removed with fs as nodegit does not have implementation of git clean
    if (statusFile.isNew()) {
      filesToClean.push(<string>statusFile.path());
      let filePath: string = <string>statusFile.path()

      removeFileFromRepo(statusFile);
    }

  });
}

function removeFileFromRepo(statusFile: StatusFile) {
  fs.unlink(repoFullPath + '\\' + statusFile.path(), function (err) {
    if (err) {
      addCommand('git clean failed: ' + err);
    }
  });
}

function stageFiles(fileNames) {
  simpleGit(repoFullPath).add(fileNames, displayModifiedFiles);
}

function unstageFiles(fileNames) {
  simpleGit(repoFullPath).raw([
    'reset',
    '--',
    ...fileNames
  ], displayModifiedFiles);
}

window.addEventListener('beforeunload', evt => {
  if (!hasChangedFiles) return

  evt.returnValue = false

  setTimeout(() => {
    let result = dialog.showMessageBox(
      {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: 'You have uncommitted changes.\nAre you sure you still want to exit?'
      }
    )

    if (result == 0) {
      hasChangedFiles = false;
      remote.getCurrentWindow().close()
    }
  })
})

