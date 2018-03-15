var cs = require('color-scheme');
var before = 'default';
;
function changeColor(color) {
    console.log(color + '   ' + (color === 'white'));
    var head = document.getElementsByClassName('navbar');
    var headButton = document.getElementsByClassName('navbar-btn');
    var fa = document.getElementsByClassName('fa');
    var fp = document.getElementById('file-panel');
    var p = document.getElementsByTagName('p');
    var h1 = document.getElementsByTagName('h1');
    var diffp = document.getElementById('diff-panel-body');
    var network = document.getElementById('my-network');
    var footer = document.getElementById('footer');
    var arp = document.getElementById('add-repository-panel');
    var auth = document.getElementById('authenticate');
    var ddl = document.getElementById('color-dropdown');
    if (color === 'white') {
        for (var i_1 = 0; i_1 < head.length; i_1++) {
            head[i_1].className = 'navbar navbar-white';
        }
        for (var i = 0; i < headButton.length; i++) {
            if (before === 'default') {
                headButton[i].classList.remove('btn-inverse');
            }
            headButton[i].classList.add('btn-default');
        }
        for (var i_2 = 0; i_2 < fa.length; i_2++) {
            fa[i_2].setAttribute('style', 'color:#a8abaf');
        }
        fp.setAttribute('style', 'background-color:#E3E3E3');
        for (var i_3 = 0; i_3 < p.length; i_3++) {
            p[i_3].style.color = 'black';
        }
        for (var i_4 = 0; i_4 < h1.length; i_4++) {
            h1[i_4].style.color = '#5E5E5E';
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
    }
    else if (color === 'default') {
        for (var i_5 = 0; i_5 < head.length; i_5++) {
            head[i_5].className = 'navbar navbar-inverse';
        }
        for (var i = 0; i < headButton.length; i++) {
            if (before === 'default') {
                headButton[i].classList.remove('btn-default');
            }
            headButton[i].classList.add('btn-inverse');
        }
        for (var i_6 = 0; i_6 < fa.length; i_6++) {
            fa[i_6].setAttribute('style', 'color:white');
        }
        fp.setAttribute('style', 'background-color:#282828');
        for (var i_7 = 0; i_7 < p.length; i_7++) {
            p[i_7].style.color = '#ccc';
        }
        for (var i_8 = 0; i_8 < h1.length; i_8++) {
            h1[i_8].style.color = '#ccc';
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
    }
    else if (color === 'green') {
        for (var i_9 = 0; i_9 < head.length; i_9++) {
            head[i_9].className = 'navbar navbar-green';
        }
        for (var i = 0; i < headButton.length; i++) {
            if (before === 'default') {
                headButton[i].classList.remove('btn-inverse');
            }
            headButton[i].classList.add('btn-default');
        }
        for (var i_10 = 0; i_10 < fa.length; i_10++) {
            fa[i_10].setAttribute('style', 'color:#a8abaf');
        }
        fp.setAttribute('style', 'background-color:#e6ffcc');
        for (var i_11 = 0; i_11 < p.length; i_11++) {
            p[i_11].style.color = 'black';
        }
        for (var i_12 = 0; i_12 < h1.length; i_12++) {
            h1[i_12].style.color = '#5E5E5E';
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
    }
    else if (color === 'blue') {
        for (var i_13 = 0; i_13 < head.length; i_13++) {
            head[i_13].className = 'navbar navbar-blue';
        }
        for (var i = 0; i < headButton.length; i++) {
            if (before === 'default') {
                headButton[i].classList.remove('btn-inverse');
            }
            headButton[i].classList.add('btn-default');
        }
        for (var i_14 = 0; i_14 < fa.length; i_14++) {
            fa[i_14].setAttribute('style', 'color:#a8abaf');
        }
        fp.setAttribute('style', 'background-color:#e6f2ff');
        for (var i_15 = 0; i_15 < p.length; i_15++) {
            p[i_15].style.color = 'black';
        }
        for (var i_16 = 0; i_16 < h1.length; i_16++) {
            h1[i_16].style.color = '#5E5E5E';
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
