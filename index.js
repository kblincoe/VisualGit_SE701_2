'use strict';
const electron = require('electron');
const app = electron.app;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		backgroundColor: "#000"
	});

	win.maximize();

	win.setTitle(require('./package.json').name);
	win.loadURL(`file://${__dirname}/index.html`);

	win.on('closed', onClosed);

	return win;
}


app.on('window-all-closed', () => {

	if (process.platform !== 'darwin') {
		app.quit();
	}

});

app.on('activate', () => {

	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
	createToolbar();
});


function createToolbar() {

	const customTemplate = [

		{
			label: 'File',
			submenu: [
				{
					label: 'Reload',
					accelerator: process.platform === 'darwin' ? 'Alt+Command+R' : 'Ctrl+Shift+R',
					click(menuItem, focusedWindow) {
						focusedWindow.reload();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Exit',
					click() {
						app.quit();
					}
				},
			]
		},

		{
			label: 'Edit',
			submenu: [
				{
					role: 'undo'
				},
				{
					role: 'redo'
				},
				{
					type: 'separator'
				},
				{
					role: 'cut'
				},
				{
					role: 'copy'
				},
				{
					role: 'paste'
				},
				{
					role: 'delete'
				},
				{
					role: 'selectall'
				},
			]
		},


		{
			label: 'View',
			submenu: [
				{
					role: 'togglefullscreen'
				},
				{
					type: 'separator'
				},
				{
					label: 'Developer Tools',
					accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
					click(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.webContents.toggleDevTools();
						}
					}
				},
			]
		},


		{
			label: 'Function',
			submenu: [
				{

					label: 'Push',
					accelerator: process.platform === 'darwin' ? 'Alt+Command+H' : 'Ctrl+Shift+H',
					click() {
						mainWindow.webContents.send('push');
					}
				},
				{
					label: 'Pull',
					accelerator: process.platform === 'darwin' ? 'Alt+Command+L' : 'Ctrl+Shift+L',
					click() {
						mainWindow.webContents.send('pull');
					}
				},
				{
					label: 'Commit',
					accelerator: process.platform === 'darwin' ? 'Alt+Command+T' : 'Ctrl+Shift+T',
					click() {
						mainWindow.webContents.send('commit');
					}
				},
				{
					label: 'Clean',
					accelerator: process.platform === 'darwin' ? 'Alt+Command+N' : 'Ctrl+Shift+N',
					click() {
						mainWindow.webContents.send('clean');
					}
				},
			]
		},

		{
			label: 'Settings',
			submenu: [
				{
					label: 'Change Theme',
					submenu: [

						{
							label: 'White',
							click() {
								mainWindow.webContents.send('color', 'white');
							},
						},
				
						{
							label: 'Green',
							click() {
								mainWindow.webContents.send('color', 'green');
							},
						},
						
						{
							label: 'Blue',
							click() {
								mainWindow.webContents.send('color', 'blue');
							},
						},

						{
							label: 'Default',
							click() {
								mainWindow.webContents.send('color', 'default');
							},
						}

					],
				},
				{
					label: 'Sign Out',
					click() {
						mainWindow.webContents.send('sign-out');
					}
				},
			]
		},

		{
			role: 'help',
			submenu: [
				{
					label: 'About',
					click() {
						require('electron').shell.openExternal(
							'https://github.com/ElliotWhiley/VisualGit');
					}
				},
			]
		},
	];

	const menu = electron.Menu.buildFromTemplate(customTemplate);
	electron.Menu.setApplicationMenu(menu);
}