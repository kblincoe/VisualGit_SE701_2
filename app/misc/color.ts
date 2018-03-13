let cs = require('color-scheme');
let before = 'default';;
function changeColor(color) {
  // let scheme = new cs;
  // scheme.from_hue(0)
  //     .scheme('mono')
  //     .variation('soft');
  // let colors = scheme.colors();
  // for (let i = 0; i < colors.length; i++) {
  //   console.log(colors[i]);
  // }
  console.log(color + '   ' + (color === 'white'));
  let head = document.getElementsByClassName('navbar');
  let headButton = document.getElementsByClassName('navbar-btn');
  let fa = document.getElementsByClassName('fa');
  let fp = document.getElementById('file-panel');
  let p = document.getElementsByTagName('p');
  let h1 = document.getElementsByTagName('h1');
  let diffp = document.getElementById('diff-panel-body');
  let network = document.getElementById('my-network');
  let footer = document.getElementById('footer');
  let arp = document.getElementById('add-repository-panel');
  let auth = document.getElementById('authenticate');
  let ddl = document.getElementById('color-dropdown');

  if (color === 'white') {
    for (let i = 0; i < head.length; i++) {
      head[i].className = 'navbar navbar-white';
    }
    for (var i = 0; i < headButton.length; i++) {
      if (before === 'default') {
        headButton[i].classList.remove('btn-inverse');
      }
      headButton[i].classList.add('btn-default');
    }
    for (let i = 0; i < fa.length; i++) {
      fa[i].setAttribute('style', 'color:#a8abaf');
    }

    fp.setAttribute('style', 'background-color:#E3E3E3');

    for (let i = 0; i < p.length; i++) {
      p[i].style.color = 'black';
    }
    for (let i = 0; i < h1.length; i++) {
      h1[i].style.color = '#5E5E5E';
    }

    diffp.style.color = '#D2D3D4';
    diffp.style.backgroundColor = '#616161';
    diffp.style.outlineColor = '#181818';
    network.style.backgroundColor = '#D6D6D6';
    footer.style.backgroundColor = '#E3E3E3';
    footer.style.borderTopColor = '#181818';
    arp.style.backgroundColor = '#D1D1D1';
    auth.style.backgroundColor = '#D6D6D6';
    ddl.style.backgroundColor = '#D6D6D6';
    ddl.style.color = '#FFFFFF';
    before = 'white';
  } else if (color === 'default') {
    for (let i = 0; i < head.length; i++) {
      head[i].className = 'navbar navbar-inverse';
    }
    for (var i = 0; i < headButton.length; i++) {
      if (before === 'default') {
        headButton[i].classList.remove('btn-default');
      }
      headButton[i].classList.add('btn-inverse');
    }    
    for (let i = 0; i < fa.length; i++) {
      fa[i].setAttribute('style', 'color:white');
    }

    fp.setAttribute('style', 'background-color:#282828');

    for (let i = 0; i < p.length; i++) {
      p[i].style.color = '#ccc';
    }
    for (let i = 0; i < h1.length; i++) {
      h1[i].style.color = '#ccc';
    }

    diffp.style.color = '#fff';
    diffp.style.backgroundColor = '#282828';
    diffp.style.outlineColor = '#181818';
    network.style.backgroundColor = '#181818';
    footer.style.backgroundColor = '#282828';
    footer.style.borderTopColor = '#181818';
    arp.style.backgroundColor = '#282828';
    auth.style.backgroundColor = '#282828';
    ddl.style.backgroundColor = '#282828';
    ddl.style.color = '#FFFFFF';
    before = 'default';
  } else if (color === 'green') {
    for (let i = 0; i < head.length; i++) {
      head[i].className = 'navbar navbar-green';
    }
    for (var i = 0; i < headButton.length; i++) {
      if (before === 'default') {
        headButton[i].classList.remove('btn-inverse');
      }
      headButton[i].classList.add('btn-default');
    }    
    for (let i = 0; i < fa.length; i++) {
      fa[i].setAttribute('style', 'color:#a8abaf');
    }

    fp.setAttribute('style', 'background-color:#e6ffcc');
    for (let i = 0; i < p.length; i++) {
      p[i].style.color = 'black';
    }
    for (let i = 0; i < h1.length; i++) {
      h1[i].style.color = '#5E5E5E';
    }

    diffp.style.color = '#D2D3D4';
    diffp.style.backgroundColor = '#616161';
    diffp.style.outlineColor = '#ceff99';
    network.style.backgroundColor = '#e6ffcc';
    footer.style.backgroundColor = '#e6ffcc';
    footer.style.borderTopColor = '#CEFF99';
    arp.style.backgroundColor = '#e6ffcc';
    auth.style.backgroundColor = '#e6ffcc';
    ddl.style.backgroundColor = '#e6ffcc';
    ddl.style.color = '#181818';
    before = 'green';
  } else if (color === 'blue') {
    for (let i = 0; i < head.length; i++) {
      head[i].className = 'navbar navbar-blue';
    }
    for (var i = 0; i < headButton.length; i++) {
      if (before === 'default') {
        headButton[i].classList.remove('btn-inverse');
      }
      headButton[i].classList.add('btn-default');
    }    
    for (let i = 0; i < fa.length; i++) {
      fa[i].setAttribute('style', 'color:#a8abaf');
    }

    fp.setAttribute('style', 'background-color:#e6f2ff');

    for (let i = 0; i < p.length; i++) {
      p[i].style.color = 'black';
    }
    for (let i = 0; i < h1.length; i++) {
      h1[i].style.color = '#5E5E5E';
    }

    diffp.style.color = '#D2D3D4';
    diffp.style.backgroundColor = '#616161';
    diffp.style.outlineColor = '#cce5ff';
    network.style.backgroundColor = '#e6f2ff';
    footer.style.backgroundColor = '#e6f2ff';
    footer.style.borderTopColor = '#cce5ff';
    arp.style.backgroundColor = '#e6f2ff';
    auth.style.backgroundColor = '#e6f2ff';
    ddl.style.backgroundColor = '#e6f2ff';
    ddl.style.color = '#181818';
    before = 'blue';
  }
}