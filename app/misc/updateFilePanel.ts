function displayModifiedFiles() {
  Git.Repository.open(repoFullPath).then(function (repo) {
    repo.getStatus().then(function (statuses) {
      let fileElements = document.getElementsByClassName('file');
      let statusList = [];
      statuses.forEach(status => {
        let inIndex = status.inIndex();
        let inWorkingTree = status.inWorkingTree();
        let path = status.path();
        if (inIndex && inWorkingTree) {
          statusList.push({
            inIndex: 0,
            inWorkingTree,
            path
          });
          statusList.push({
            inIndex,
            inWorkingTree: 0,
            path
          });
        } else {
          statusList.push({
            inIndex,
            inWorkingTree,
            path
          });
        }
      });
      updateFilePanel(statusList, fileElements);
    });
  });
}

function updateFilePanel(statuses, fileElements) {
  try {
    removeStaleFileChanges(statuses, fileElements);
    addNewFileChanges(statuses, fileElements);
  } catch (err) {
    console.error(err); // error
  }
}

function removeStaleFileChanges(statuses, fileElements) {
  Array.prototype.forEach.call(fileElements, fileElement => {
    let isStale = true;
    statuses.forEach(status => {
      if (equals(fileElement, status)) {
        isStale = false;
      }
    });
    if (isStale) {
      removeElement(fileElement);
    }
  });
}

function equals(fileElement, status) {
  let isStaged;
  if (fileElement.parentNode.id === "files-changed" && status.inWorkingTree) {
    isStaged = false;
  } else if (fileElement.parentNode.id === "staged-files-changed" && status.inIndex) {
    isStaged = true;
  } else {
    return false;
  }
  return (equalsPath(fileElement, status) && equalsModification(fileElement, status, isStaged));
}

function equalsPath(fileElement, status) {
  let filePaths = fileElement.getElementsByClassName("file-path"); // expecting only one
  return Array.prototype.some.call(filePaths, filePathElement => {
    let statusPath = status.path;
    let filePath = filePathElement.innerHTML;
    return (filePath === statusPath);
  });
}

function equalsModification(fileElement, status, isStaged) {
  let modifications = fileElement.getElementsByClassName("mod");
  return Array.prototype.some.call(modifications, mod => {
    return (
      (
        mod.className === "mod file-created" && isNew2(status, isStaged)
      ) || (
        mod.className === "mod file-deleted" && isDeleted2(status, isStaged)
      ) || (
        mod.className === "mod file-modified" && isModified2(status, isStaged)
      )
    );
  });
}

function removeElement(element) {
  element.parentNode.removeChild(element);
}

function addNewFileChanges(statuses, fileElements) {
  Array.prototype.forEach.call(statuses, status => {
    let isNew = true;
    Array.prototype.forEach.call(fileElements, fileElement => {
      if (equals(fileElement, status)) {
        isNew = false;
      }
    });
    if (isNew) {
      addFileElement(status);
    }
  });
}

function addFileElement(status) {
  /* A single status may represent file changes in both the working tree and index so two file elements may need to be created. */
  if (status.inIndex {
    let isStaged = true;
    addFileElement2(status, isStaged);
  }
  if (status.inWorkingTree {
    let isStaged = false;
    addFileElement2(status, isStaged);
  }
}

function createFilePathElement(status) {
  let filePath = document.createElement("p");
  filePath.className = "file-path";
  filePath.innerHTML = status.path;

  return filePath;
}

function createFileElement(status, isStaged, children) {
  let fileElement = document.createElement("div");
  fileElement.className = "file";
  Array.prototype.forEach.call(children, child => {
    fileElement.appendChild(child);
  })
  fileElement.onclick = () => {
    showDiffPanel(fileElement, status);
  }

  return fileElement;
}

function createModificationElement(status, isStaged) {
  let modification = document.createElement("div");
  setModification(modification, status, isStaged);

  return modification;
}

function createStageUnstageButton(status, isStaged) {
  let button = document.createElement("button");
  if (isStaged) {
    button.className = "unstage-button";
    button.innerHTML = "-";
    button.onclick = () => {
      let filePath = status.path;
      unstageFiles([filePath]);
    };
  } else {
    button.className = "stage-button";
    button.innerHTML = "+";
    button.onclick = () => {
      let filePath = status.path;
      stageFiles([filePath]);
    };
  }

  return button;
}

function addFileElement2(status, isStaged) {
  let filePath = createFilePathElement(status);
  let modification = createModificationElement(status, isStaged);
  let button = createStageUnstageButton(status, isStaged);

  let fileElement = createFileElement(status, isStaged, [modification, filePath, button]);

  let division;
  if (isStaged) {
    division = "staged-files-changed";
  } else {
    division = "files-changed";
  }
  document.getElementById(division).appendChild(fileElement);
}

function setModification(modification, status, isStaged) {
  let className;
  let inner;
  
  if (isNew2(status, isStaged)) {
    className = "mod file-created";
    inner = "A";
  } else if (isModified2(status, isStaged)) {
    className = "mod file-modified";
    inner = "M";
  } else if (isDeleted2(status, isStaged)) {
    className = "mod file-deleted";
    inner = "D";
  } else {
    className = "mod file-changed"
    inner = "?";
  }

  modification.className = className;
  modification.innerHTML = inner;
}

function isNew2(status, isStaged) {
  return (
    (
      isStaged && status.inIndex === Git.Status.STATUS.INDEX_NEW
    ) || (
      !isStaged && status.inWorkingTree === Git.Status.STATUS.WT_NEW
    )
  );
}

function isModified2(status, isStaged) {
  return (
    (
      isStaged && status.inIndex === Git.Status.STATUS.INDEX_MODIFIED
    ) || (
      !isStaged && status.inWorkingTree === Git.Status.STATUS.WT_MODIFIED
    )
  );
}

function isDeleted2(status, isStaged) {
  return (
    (
      isStaged && status.inIndex === Git.Status.STATUS.INDEX_DELETED
    ) || (
      !isStaged && status.inWorkingTree === Git.Status.STATUS.WT_DELETED
    )
  );
}