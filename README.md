# Welcome

An easy-to-use, visually-oriented desktop client for Git aimed at helping students learn the standard Git workflow.
You can get a summary of our project by reading our [cool poster](https://github.com/ElliotWhiley/VisualGit/raw/resources/visualgit-poster.pdf)   :)

# Installation

### Prerequisites

npm (Node Package Manager) is used to manage VisualGit's dependencies, therefore it is required to install and run VisualGit.
Follow the installation instructions below:

#### CentOS-based systems
````
sudo yum install npm
````

#### Debian-based systems
````
sudo apt-get install npm
````

#### Mac
If you have Homebrew installed:
````
brew install npm
````
Otherwise download and install the latest version of [Node.js](https://nodejs.org/en/) (v6.2.1 or later)

#### Windows
Download and install the latest version of  [Node.js](https://nodejs.org/en/) (v6.2.1 or later)

### Setup
Clone with either HTTPS or SSH:

#### SSH
````
git clone git@github.com:ElliotWhiley/VisualGit.git
````

#### HTTPS
````
git clone https://github.com/ElliotWhiley/VisualGit.git
````

### Installing the app
Run [Install.sh](Install.sh)

### Running the app
Run [Run.sh](Run.sh)

### ssh-agent
As VisualGit utilises SSH for user authentication, ensure you [generate a SSH key for your GitHub account](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/). If you are not running on a Mac, you will also need to set up and run an ssh-agent to access your SSH key at run time without providing your credentials each time.

# Development

### TypeScript
[TypeScript](https://www.typescriptlang.org/) is a statically-typed superset of JavaScript that compiles into JavaScript. Most of our source files are written in TypeScript (.ts files), therefore you will need to run a TypeScript compiler to compile your source code to JavaScript (.js files) as you make changes, e.g. [typescript-compiler](https://www.npmjs.com/package/typescript-compiler) for Node.

### Compiling TypeScript
Run [Compile.sh](Compile.sh)

### Sass
[Sass](http://sass-lang.com/) (Syntactically Awesome Style Sheets) is a CSS preprocessor with some handy extra features. All of our Style Sheets are written in Sass (.scss files), which compile into CSS (.css files). Therefore, you will need to a run a Sass-compiler to compile your .scss files into .css files as you make changes, e.g. [node-sass](https://www.npmjs.com/package/node-sass) for Node.

# Features

### Opening / Cloning repositories
Repositories can be added by two methods; either by cloning the remotely hosted repository or opening it from the local file system. This is achieved using the add repository button in the top left which will update the screen to the add repository view.

#### Clone
Cloning with SSH is recommended as there is not yet any method for entering user credentials in VisualGit. This means that if you clone using HTTPS, you will still be able to see local changes and commit locally but not push.

#### Open local repository
Currently, when you clone a repository, it is saved to a directory under `./VisualGit/`. This means that when you open a repository which is saved locally, you can simply enter the name of the directory relative to the VisualGit directory. Other save locations are not currently supported but it is planned in future work.

### Adding & Committing
When changes are made in a repository which is open, the interface will update by showing each file which has uncommitted changes. These changes will be displayed as a traffic light scheme:
 - Green: Added file
 - Orange: Modified file
 - Red: Deleted file

This is used to allow users to see the different types of changes easily and once they click on the files, the file differences will be shown. The file differences are shown line by line with green lines representing added lines and red representing deleted lines. Any other parts of the file are unchanged.

### Pushing & Pulling from remote
The pulling and pushing currently works for changes which are made on master and origin/master by syncing these up. When the pull button is clicked, any changes on the remote repository will be added to the local repository and the graph will be updated. When pushing, the same process applies. The changes on master will be pushed to the remote repository.


# Contributing
We are open to pull requests with new features or improvements.

# Help
VisualGit utilises a range of libraries and frameworks, more information on them can be found below:

 - [Electron](http://electron.atom.io/)
 - [Node.js](https://nodejs.org/en/about/)
 - [AngularJS](https://angular.io/)
 - [nodegit](http://www.nodegit.org/)
 - [Vis.js](http://visjs.org/docs/network/)
 - [TypeScript](https://www.typescriptlang.org/)
 - [Sass](http://sass-lang.com/)
