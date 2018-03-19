var github = require("octonode");
var aid, atoken;
var client;
var avaterImg;
var repoList = {};
var url;
function signOut() {
    warnIfCommitsNotOnRemote();
    switchToAuthenticatePanel();
    var doc = document.getElementById("avatar");
    doc.innerHTML = 'Sign in';
}
function signInHead(callback) {
    setCredentials(document.getElementById("Email1").value, document.getElementById("password").value);
    console.log('user has logged in successfully');
    getUserInfo(callback);
    document.getElementById("Email1").value = "";
    document.getElementById("Password1").value = "";
}
function signInPage(callback) {
    setCredentials(document.getElementById("username").value, document.getElementById("password").value);
    console.log('user has logged in successfully');
    getUserInfo(callback);
}
function setCredentials(username, password) {
    cred = Git.Cred.userpassPlaintextNew(username, password);
    client = github.client({
        username: username,
        password: password
    });
}
function getUserInfo(callback) {
    var ghme = client.me();
    ghme.info(function (err, data, head) {
        if (err) {
            displayModal(err);
        }
        else {
            avaterImg = Object.values(data)[2];
            var doc = document.getElementById("avatar");
            doc.innerHTML = 'Sign out';
            callback();
        }
    });
    ghme.repos(function (err, data, head) {
        if (err) {
            return;
        }
        else {
            console.log(data.length);
            for (var i = 0; i < data.length; i++) {
                var rep = Object.values(data)[i];
                console.log(rep['html_url']);
                var splitText = rep['html_url'].split(/\.|:|\//);
                rep['name'] = splitText[splitText.length - 2] + "/" + splitText[splitText.length - 1];
                displayBranch(rep['name'], "repo-dropdown", "selectRepo(this)");
                repoList[rep['name']] = rep['html_url'];
            }
        }
    });
}
function selectRepo(ele) {
    url = repoList[ele.innerHTML];
    var butt = document.getElementById("cloneButton");
    var splitText = ele.innerHTML.split(/\.|:|\//);
    butt.innerHTML = 'Clone ' + splitText[splitText.length - 1];
    butt.setAttribute('class', 'btn btn-primary');
    console.log(url + 'JJJJJJJJ' + ele.innerHTML);
}
function cloneRepo() {
    if (url === null) {
        updateModalText("Ops! Error occors");
        return;
    }
    var splitText = url.split(/\.|:|\//);
    var local;
    if (splitText.length >= 2) {
        local = splitText[splitText.length - 2];
    }
    downloadFunc(url, local);
    url = null;
    $('#repo-modal').modal('hide');
}
