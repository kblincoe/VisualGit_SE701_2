let Git = require("nodegit");
let $ = require('jquery');
let repoFullPath;
let repoLocalPath;
let repoRemoteUrl;
let bname = {};
let branchCommit = [];
let remoteName = {};
let localBranches = [];
let readFile = require("fs-sync");
let repoCurrentBranch = "master";
let modal;
let span;

function downloadRepository() {
  let cloneURL = document.getElementById("repoClone").value;
  let fullLocalPath = document.getElementById("repoSave").value;
  downloadFunc(cloneURL, fullLocalPath, "downloadRepository");
}

function downloadFunc(cloneURL, repoPath, callerFunction) {
  let options = {};
  let localPath;
  let fullLocalPath;

  if (cloneURL == "") {
    displayModal("Please input a valid URL");
    return;
  }

  if (callerFunction == "downloadRepository") {
    let splitText = cloneURL.split(/\.|:|\//);
    if (splitText.length >= 2) {
        localPath = splitText[splitText.length - 2];
    }
    fullLocalPath = repoPath;
  } else if (callerFunction == "cloneRepo") {
    localPath = repoPath;
    fullLocalPath = require("path").join(__dirname, localPath);
  } else {
    displayModal("Path not found");
    return;
  }

  displayModal("Cloning Repository...");

  options = {
    fetchOpts: {
      callbacks: {
        certificateCheck: function() { return 1; },
        credentials: function() {
          return cred;
        }
      }
    }
  };

  console.log("cloning into " + fullLocalPath);
  let repository = Git.Clone.clone(cloneURL, fullLocalPath, options)
  .then(function(repository) {
    console.log("Repo successfully cloned");
    updateModalText("Clone Successful, repository saved under: " + fullLocalPath);
    addCommand("git clone " + cloneURL);
    repoFullPath = fullLocalPath;
    repoLocalPath = localPath;
    refreshAll(repository);
  },
  function(err) {
    updateModalText("Clone Failed - " + err);
    console.log(err); // TODO show error on screen
  });
}

function setRepoPath() {
    document.getElementById("repoOpen").value = document.getElementById('openFolderExplorer').files[0].path;
}

function setSavePath() {
  document.getElementById("repoSave").value = document.getElementById('saveFolderExplorer').files[0].path;
}

function openRepository() {
  let fullLocalPath = document.getElementById('repoOpen').value;
  let localPath;

  let splitText = fullLocalPath.split(/\.|:|\/|\\/);
  if (splitText.length >= 2) {
      localPath = splitText[splitText.length - 1];
  }

  if (fullLocalPath.length <= 0) {
    updateModalText("Error opening repository. Location cannot be empty!");
    return;
  }

  console.log("Trying to open repository at " + fullLocalPath);
  displayModal("Opening Local Repository...");

  Git.Repository.open(fullLocalPath).then(function(repository) {
    repoFullPath = fullLocalPath;
    repoLocalPath = localPath;
    if (readFile.exists(repoFullPath + "/.git/MERGE_HEAD")) {
      let tid = readFile.read(repoFullPath + "/.git/MERGE_HEAD", null);
      console.log("theirComit: " + tid);
    }
    refreshAll(repository);
    console.log("Repo successfully opened");
    updateModalText("Repository successfully opened");
  },
  function(err) {
    updateModalText("Opening Failed - " + err);
    console.log(err); // TODO show error on screen
  });
}

function addBranchestoNode(thisB: string) {
  let elem = document.getElementById("otherBranches");
  elem.innerHTML = '';
  for (let i = 0; i < localBranches.length; i++) {
    if (localBranches[i] !== thisB) {
      console.log("lalalala   " + localBranches[i]);
      let li = document.createElement("li");
      let a = document.createElement("a");
      a.appendChild(document.createTextNode(localBranches[i]));
      a.setAttribute("tabindex", "0");
      a.setAttribute("href", "#");
      li.appendChild(a);
      elem.appendChild(li);
    }
  }
}

function refreshAll(repository) {
  let branch;
  bname = [];

  repository.getRemotes().then(remotes => {
    if (remotes.length > 0) {
      repository.getRemote(remotes[0])
      .then(remote => {
        repoRemoteUrl = remote.url();
      });
    }
  });

  repository.getCurrentBranch()
  .then(function(reference) {
    let branchParts = reference.name().split("/");
    console.log(branchParts + "OOOOOOOOOOO");
    branch = branchParts[branchParts.length - 1];
  },function(err) {
    console.log(err + "?????"); // TODO show error on screen
  })
  .then(function() {
    return repository.getReferences(Git.Reference.TYPE.LISTALL);
  })
  .then(function(branchList) {
    let count = 0;
    clearBranchElement();
    for (let i = 0; i < branchList.length; i++) {
      //console.log(branchList[i].name() + "!!!!");
      let bp = branchList[i].name().split("/");
      Git.Reference.nameToId(repository, branchList[i].name()).then(function(oid) {
        // Use oid
        //console.log(oid + "  TTTTTTTT");
        if (branchList[i].isRemote()) {
          remoteName[bp[bp.length-1]] = oid;
        } else {
          branchCommit.push(branchList[i]);
          console.log(bp[bp.length - 1] + "--------" + oid.tostrS());
          if (oid.tostrS() in bname) {
            bname[oid.tostrS()].push(branchList[i]);
          } else {
            bname[oid.tostrS()] = [branchList[i]];
          }
        }
      }, function(err) {
        console.log(err + "?????????");
      });
      if (branchList[i].isRemote()) {
        if (localBranches.indexOf(bp[bp.length - 1]) < 0) {
          displayBranch(bp[bp.length - 1], "branch-dropdown", "checkoutRemoteBranch(this)");
        }
      } else {
        localBranches.push(bp[bp.length - 1]);
        displayBranch(bp[bp.length - 1], "branch-dropdown", "checkoutLocalBranch(this)");
      }

    }
  })
  .then(function() {
    console.log("Updating the graph and the labels");
    updateIssues();
    drawGraph();
    document.getElementById("repo-name").innerHTML = repoLocalPath;
    document.getElementById("branch-name").innerHTML = branch + '<span class="caret"></span>';
  });
}

function getAllBranches() {
  let repos;
  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    repos = repo;
    return repo.getReferenceNames(Git.Reference.TYPE.LISTALL);
  })
  .then(function(branchList) {
    clearBranchElement();
    for (let i = 0; i < branchList.length; i++) {
      console.log(branchList[i] + "!!!!");
      let bp = branchList[i].split("/");
      if (bp[1] !== "remotes") {
        displayBranch(bp[bp.length - 1], "branch-dropdown", "checkoutLocalBranch(this)");
      }
      Git.Reference.nameToId(repos, branchList[i]).then(function(oid) {
        // Use oid
        console.log(oid + "  TTTTTTTT");
      });
    }
  });
}

function getOtherBranches() {
  let list;
  let repos;
  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    repos = repo;
    return repo.getReferenceNames(Git.Reference.TYPE.LISTALL);
  })
  .then(function(branchList) {
    clearMergeElement();
    list = branchList;
  })
  .then(function() {
    return repos.getCurrentBranch()
  })
  .then(function(ref) {
    let name = ref.name().split("/");
    console.log("&&&&&&&");
    clearBranchElement();
    for (let i = 0; i < list.length; i++) {
      let bp = list[i].split("/");
      if (bp[1] !== "remotes" && bp[bp.length - 1] !== name[name.length - 1]) {
        displayBranch(bp[bp.length - 1], "merge-dropdown", "mergeLocalBranches(this)");
      }
    }
  })

}

function clearMergeElement() {
  let ul = document.getElementById("merge-dropdown");
  ul.innerHTML = '';
}

function clearBranchElement() {
  let ul = document.getElementById("branch-dropdown");
  let li = document.getElementById("create-branch");
  ul.innerHTML = '';
  ul.appendChild(li);
}

function displayBranch(name, id, onclick, dblclick) {
  let ul = document.getElementById(id);
  let li = document.createElement("li");
  let a = document.createElement("a");
  a.setAttribute("href", "#");
  a.setAttribute("class", "list-group-item");
  a.setAttribute("onclick", onclick);
  a.setAttribute("ondblclick", dblclick);
  li.setAttribute("role", "presentation")
  a.appendChild(document.createTextNode(name));
  li.appendChild(a);
  ul.appendChild(li);
}

function checkoutLocalBranch(element) {
  var filesModified = false;
  checkModifiedFiles().then(
    function(res) {
      filesModified = res;
    }
  )
  .then(
    function() {
    if(filesModified) {
        return displayModal('Your local changes would be overwritten by checkout Please commit your changes or stash them before you switch branches');
    }
    let bn;
    console.log(typeof element + "UUUUUUUUU");
    if (typeof element === "string") {
      bn = element;
    } else {
      bn = element.innerHTML;
    }
    console.log(bn + ">>>>>>>>");
    Git.Repository.open(repoFullPath)
    .then(function(repo) {
      addCommand("git checkout " + bn);
      repo.checkoutBranch("refs/heads/" + bn)
      .then(function() {
        refreshAll(repo);
      }, function(err) {
        console.log(err + "<<<<<<<");
      });
    })
    }
  )
}

function checkoutRemoteBranch(element) {
  var filesModified = false;
    checkModifiedFiles().then(function (res) {
        filesModified = res;
    }).then(function(){
        if (filesModified) {
            return displayModal('Your local changes would be overwritten by checkout Please commit your changes or stash them before you switch branches');
        }
         var bn;
        if (typeof element === "string") {
            bn = element;
        }
        else {
            bn = element.innerHTML;
        }
        console.log("1.0  " + bn);
        var repos;
        Git.Repository.open(repoFullPath)
            .then(function (repo) {
            repos = repo;
            addCommand("git fetch");
            addCommand("git checkout -b " + bn);
            var cid = remoteName[bn];
            console.log("2.0  " + cid);
            return Git.Commit.lookup(repo, cid);
        })
            .then(function (commit) {
            console.log("3.0");
            return Git.Branch.create(repos, bn, commit, 0);
        })
            .then(function (code) {
            console.log(bn + "PPPPPPP");
            repos.mergeBranches(bn, "origin/" + bn)
                .then(function () {
                refreshAll(repos);
                console.log("Pull successful");
            });
        }, function (err) {
            console.log(err);
        });
    });
}

// function initModal() {
//   modal = document.getElementById("modal");
//   btn = document.getElementById("new-repo-button");
//   confirmBtn = document.getElementById("confirm-button");
//   span = document.getElementsByClassName("close")[0];
// }

// function handleModal() {
//   // When the user clicks on <span> (x), close the modal
//   span.onclick = function() {
//     modal.style.display = "none";
//   };
//
//   // When the user clicks anywhere outside of the modal, close it
//   window.onclick = function(event) {
//
//     if (event.target === modal) {
//       modal.style.display = "none";
//     }
//   };
// }

function displayModal(text) {
//  initModal();
//  handleModal();
  document.getElementById("modal-text-box").innerHTML = text;
  $('#modal').modal('show');
}

function updateModalText(text) {
  document.getElementById("modal-text-box").innerHTML = text;
  $('#modal').modal('show');
}

function showWarning() {
  document.getElementById("modal-warning-text").innerHTML = "You have uncommitted changes!<br>Are you sure you want to pull?";
  $('#modal-warning').modal('show');
}
function checkModifiedFiles() {
    var filesHaveBeenModified = false;
    console.log('repoFullPath', repoFullPath);
    return Git.Repository.open(repoFullPath)
        .then(function (repo) {
        return repo.getStatus().then(function (statuses) {
            filesHaveBeenModified = statuses.some(fileModified);
            return filesHaveBeenModified;
        });
    });
}

function fileModified(file) {
    if (file.isNew()) {
        return true;
    } else if (file.isModified()) {
        return true;
    } else if (file.isDeleted()) {
        return true;
    } else if (file.isTypechange()) {
        return true;
    } else if (file.isRenamed()) {
        return true;
    }
    else {
        return false;
    }
}

