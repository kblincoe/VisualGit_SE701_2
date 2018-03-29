const receiver = require('electron').ipcRenderer;

/*
Receives messages from the external GUI toolbar to execute
functions on the internal window 
*/

receiver.on('color', (event, message) => {
    changeColor(message);
});

receiver.on('sign-out', (event) => {
    signOut();
});


receiver.on('push', (event) => {
    pushToRemote();
});


receiver.on('pull', (event) => {
    pullFromRemote();
});


receiver.on('commit', (event) => {
    addAndCommit();
});

receiver.on('clean', (event) => {
    cleanCurrentRepo();
});