let github = require("octonode");
let rememberMe;
let machineId = require("node-machine-id");
let fs = require('fs');
let aid, atoken;
let client;
let avaterImg;
let repoList = {};
let url;

function signInHead(callback) {
  setCredentials(document.getElementById("Email1").value, 
                 document.getElementById("password").value);
  
  console.log('user has logged in successfully');
  
  getUserInfo(callback);
  
  document.getElementById("Email1").value = "";
  document.getElementById("Password1").value = "";
}

function signInPage(callback) {
  setCredentials(document.getElementById("username").value, 
                document.getElementById("password").value);

  console.log('user has logged in successfully');
  rememberMe = document.getElementById("rememberme").checked;
  getUserInfo(callback);
}

function autoFillPassword(callback){
  fs.stat("login.json", function (err, stats) {
    if (err) {
      console.log(err);
    }
    else {
      let obj = JSON.parse(fs.readFileSync('login.json', 'utf8'));

      let crypto = require("crypto");
      let d1 = crypto.createDecipher('aes-256-cbc', 'secretpassword');
      let saltedPassword = d1.update(obj.loginInfo[0]["password"], 'hex', 'utf8');
      saltedPassword = saltedPassword + d1.final('utf8');
      let pw = saltedPassword.substring(0, saltedPassword.length-obj.loginInfo[0]["split"]);

      let d2 = crypto.createDecipher('aes-256-cbc', 'secrettime');
      let saltedTime = d2.update(obj.loginInfo[0]["lastLogin"], 'hex', 'utf8');
      saltedTime = saltedTime + d2.final('utf8');
      let lastLogin = saltedTime.substring(0, saltedTime.length-obj.loginInfo[0]["split"]);

      let machineId = require("node-machine-id");
      let uidSalt = saltedPassword.substring(pw.length, saltedPassword.length);
      let uidTime = saltedTime.substring(lastLogin.length, saltedTime.length);

      //login details are deleted it does not belong to the original computer the details were generated for or if login details is older than 7 days
      if ((machineId.machineIdSync() == uidSalt) && (uidSalt == uidTime) && ((new Date).getTime()-lastLogin < 604800)){
        document.getElementById("username").value = obj.loginInfo[0]["username"];
        document.getElementById("password").value = pw;
        document.getElementById("rememberme").checked = true;
      } else {
        deleteLoginDetails();
      }
    }
  });
}

function deleteLoginDetails(){
  fs.stat("login.json", function (err, stats) {
    if (err) {
      console.log(err);
    }
    else {
      fs.unlinkSync("login.json");
    }
  });
}

function saveLoginDetails(username, password){
  let uid = machineId.machineIdSync()

  let crypto = require("crypto");
  let c1 = crypto.createCipher('aes-256-cbc', 'secretpassword');
  let pw = c1.update(password + uid, 'utf8', 'hex') + c1.final('hex');

  let c2 = crypto.createCipher('aes-256-cbc', 'secrettime');
  let time = c2.update((new Date).getTime() + uid, 'utf8', 'hex') + c2.final('hex');

  let obj = {loginInfo: []};
  obj.loginInfo.push({username: username, password: pw, lastLogin: time, split: uid.length});
  let json = JSON.stringify(obj);
  fs.writeFile('login.json', json, 'utf8');
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
  ghme.info(function(err, data, head) {
    if (err) {
      displayModal(err);
    } else {
        if (rememberMe) {
          saveLoginDetails(document.getElementById("username").value, document.getElementById("password").value);
        }

      avaterImg = Object.values(data)[2]
      // let doc = document.getElementById("avater");
      // doc.innerHTML = "";
      // var elem = document.createElement("img");
      // elem.width = 40;
      // elem.height = 40;
      // elem.src = avaterImg;
      // doc.appendChild(elem);
      // doc = document.getElementById("log");
      // doc.innerHTML = 'sign out';
      let doc = document.getElementById("avatar");
      doc.innerHTML = 'Sign out';
      callback();
    }
  });

  ghme.repos(function(err, data, head) {
    if (err) {
      return;
    } else {
      console.log(data.length);
      for (let i = 0; i < data.length; i++) {
        let rep = Object.values(data)[i];
        console.log(rep['html_url']);
        let splitText = rep['html_url'].split(/\.|:|\//);
        rep['name'] = splitText[splitText.length-2] + "/" + splitText[splitText.length-1];
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
  let butt = document.getElementById("cloneButton");
  let splitText = ele.innerHTML.split(/\.|:|\//);
  butt.innerHTML = 'Clone ' + splitText[splitText.length-1];
  butt.setAttribute('class', 'btn btn-primary');
  console.log(url + 'JJJJJJJJ' + ele.innerHTML);
}

function cloneRepo() {
  if (url === null) {
    updateModalText("Ops! Error occors");
    return;
  }
  let splitText = url.split(/\.|:|\//);
  let local;
  if (splitText.length >= 2) {
    local = splitText[splitText.length - 2];
  }
  downloadFunc(url, local);
  url = null;
  $('#repo-modal').modal('hide');
}
