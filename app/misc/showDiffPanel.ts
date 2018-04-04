let repo;

function showDiffPanel(fileElement, status) {
  let filePath = status.path;
  let doc = document.getElementById("diff-panel");

  let editdoc = document.getElementById("texteditor-panel");

  /* if the file text editor is open, ignore the click on the file so the only way a user can
    leave the editor is through clicking the 'Close editor' button */
  if (!(editdoc.style.width === '0px' || editdoc.style.width === '')) {
    return;
  }

  displayDiffPanel();
  document.getElementById("diff-panel-body").innerHTML = "";
  if (fileElement.className === "file file-created") {
    printNewFile(filePath);
  } else {
    printFileDiff(filePath);
    /* set up the event handlers on all the buttons in the difference panel and in the file
       text editor panel. */
    document.getElementById("editfile-button").onclick = () => {
      displayFileTexteditor();
      document.getElementById("texteditor-content").value = getFileContent(filePath);
      // set save changes button to disabled until the user has made changes to the file
      document.getElementById("savechanges-button").disabled = true;
      document.getElementById("texteditor-content").onkeyup = () => {
        document.getElementById("savechanges-button").disabled = false;
      }
      document.getElementById("closeeditor-button").onclick = () => {
        /* close the text editor panel and reopen the differences panel using the same method
           so that the panel can update to reflect the changes made in the text editor. */
        hideFileTexteditor();
        showOrHideDiffPanel(fileElement, status)
      }
      document.getElementById("savechanges-button").onclick = () => {
        writeContentToFile(filePath, document.getElementById("texteditor-content").value)
      }
    }
  }
}

function getFileContent(filePath) {
  let fileLocation = require("path").join(repoFullPath, filePath);
  let fs = require('fs');
  return fs.readFileSync(fileLocation);
}
function writeContentToFile(filePath, content) {
  let fileLocation = require("path").join(repoFullPath, filePath);
  let fs = require('fs');
  fs.writeFile(fileLocation, content, function (err, data) {
    document.getElementById("savechanges-button").disabled = true;
  });
}

function printNewFile(filePath) {
  let fileLocation = require("path").join(repoFullPath, filePath);
  let lineReader = require("readline").createInterface({
    input: fs.createReadStream(fileLocation)
  });

  lineReader.on("line", function (line) {
    formatNewFileLine(line);
  });
}

function printFileDiff(filePath) {
  console.debug(filePath); // debug
  Git.Repository.open(repoFullPath).then(repoResult => {
    repo = repoResult;
    repo.getHeadCommit().then(function (commit) {
      getCurrentDiff(commit, filePath, function (line) {
        console.debug(line); // debug
        formatLine(line);
      });
    });
  });
}

function formatLine(line) {
  let element = document.createElement("div");

  if (line.charAt(0) === "+") {
    element.style.backgroundColor = "#84db00";
    line = line.slice(1, line.length);
  } else if (line.charAt(0) === "-") {
    element.style.backgroundColor = "#ff2448";
    line = line.slice(1, line.length);
  }

  element.innerText = line;
  document.getElementById("diff-panel-body").appendChild(element);
}

function formatNewFileLine(text) {
  let element = document.createElement("div");
  element.style.backgroundColor = green;
  element.innerHTML = text;
  document.getElementById("diff-panel-body").appendChild(element);
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