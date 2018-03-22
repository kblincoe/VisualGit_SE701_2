var github = require("octonode");
var rememberMe;
var machineId = require("node-machine-id");
var fs = require('fs');
var aid, atoken;
var client;
var avaterImg;
var repoList = {};
var url;
function signOut() {
    warnIfCommitsNotOnRemote();
    switchToAuthenticatePanel();
    clearCredentials();
    deleteLoginDetails();
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("rememberme").checked = false;
    var doc = document.getElementById("avatar");
    doc.innerHTML = 'Sign in';
}
function signInHead(callback) {
    setCredentials(document.getElementById("Email1").value, document.getElementById("Password1").value);
    console.log('user has logged in successfully');
    getUserInfo(callback);
    document.getElementById("Email1").value = "";
    document.getElementById("Password1").value = "";
}
function signInPage(callback) {
    setCredentials(document.getElementById("username").value, document.getElementById("password").value);
    console.log('user has logged in successfully');
    rememberMe = document.getElementById("rememberme").checked;
    getUserInfo(callback);
}
function autoFillPassword(callback) {
    fs.stat("login.json", function (err, stats) {
        if (err) {
            console.log(err);
        }
        else {
            var obj = JSON.parse(fs.readFileSync('login.json', 'utf8'));
            var crypto_1 = require("crypto");
            var d1 = crypto_1.createDecipher('aes-256-cbc', 'secretpassword');
            var saltedPassword = d1.update(obj.loginInfo[0]["password"], 'hex', 'utf8');
            saltedPassword = saltedPassword + d1.final('utf8');
            var pw = saltedPassword.substring(0, saltedPassword.length - obj.loginInfo[0]["split"]);
            var d2 = crypto_1.createDecipher('aes-256-cbc', 'secrettime');
            var saltedTime = d2.update(obj.loginInfo[0]["lastLogin"], 'hex', 'utf8');
            saltedTime = saltedTime + d2.final('utf8');
            var lastLogin = saltedTime.substring(0, saltedTime.length - obj.loginInfo[0]["split"]);
            var machineId_1 = require("node-machine-id");
            var uidSalt = saltedPassword.substring(pw.length, saltedPassword.length);
            var uidTime = saltedTime.substring(lastLogin.length, saltedTime.length);
            //login details are deleted it does not belong to the original computer the details were generated for or if login details is older than 7 days
            if ((machineId_1.machineIdSync() == uidSalt) && (uidSalt == uidTime) && ((new Date).getTime() - lastLogin < 604800)) {
                document.getElementById("username").value = obj.loginInfo[0]["username"];
                document.getElementById("password").value = pw;
                document.getElementById("rememberme").checked = true;
            }
            else {
                deleteLoginDetails();
            }
        }
    });
}
function deleteLoginDetails() {
    fs.stat("login.json", function (err, stats) {
        if (err) {
            console.log(err);
        }
        else {
            fs.unlinkSync("login.json");
        }
    });
}
function saveLoginDetails(username, password) {
    var uid = machineId.machineIdSync();
    var crypto = require("crypto");
    var c1 = crypto.createCipher('aes-256-cbc', 'secretpassword');
    var pw = c1.update(password + uid, 'utf8', 'hex') + c1.final('hex');
    var c2 = crypto.createCipher('aes-256-cbc', 'secrettime');
    var time = c2.update((new Date).getTime() + uid, 'utf8', 'hex') + c2.final('hex');
    var obj = { loginInfo: [] };
    obj.loginInfo.push({ username: username, password: pw, lastLogin: time, split: uid.length });
    var json = JSON.stringify(obj);
    fs.writeFile('login.json', json, 'utf8');
}
function setCredentials(username, password) {
    cred = Git.Cred.userpassPlaintextNew(username, password);
    client = github.client({
        username: username,
        password: password
    });
}
function clearCredentials() {
    /*
    Instantiating the credential objects with null, undefined
    or empty string objects as the username/password parameters leads
    to errors and unwanted behaviour.
    aka setCredentials(null, null);
    
    Setting cred and client as undefined gives authorisation errors
    from GitHub as expected. Achieves sign out functionality.
    */
    cred = undefined;
    client = undefined;
}
function getUserInfo(callback) {
    var ghme = client.me();
    ghme.info(function (err, data, head) {
        if (err) {
            displayModal(err);
        }
        else {
            if (rememberMe) {
                saveLoginDetails(document.getElementById("username").value, document.getElementById("password").value);
            }
            else {
                deleteLoginDetails();
                document.getElementById("username").value = "";
                document.getElementById("password").value = "";
                document.getElementById("rememberme").checked = false;
            }
            avaterImg = Object.values(data)[2];
            // let doc = document.getElementById("avater");
            // doc.innerHTML = "";
            // var elem = document.createElement("img");
            // elem.width = 40;
            // elem.height = 40;
            // elem.src = avaterImg;
            // doc.appendChild(elem);
            // doc = document.getElementById("log");
            // doc.innerHTML = 'sign out';
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
    // let scopes = {
    //   'add_scopes': ['user', 'repo', 'gist'],
    //   'note': 'admin script'
    // };
    //
    // github.auth.config({
    //   username: username,
    //   password: password
    // }).login(scopes, function (err, id, token) {
    //   if (err !== null) {
    //     console.log("login fail -- " + err);
    //   }
    //   aid = id;
    //   atoken = token;
    //   console.log(id, token);
    // });
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
        local = splitText[splitText.length - 1];
    }
    downloadFunc(url, local);
    url = null;
    $('#repo-modal').modal('hide');
}
