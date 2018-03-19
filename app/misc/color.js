var cs = require('color-scheme');
var before = 'default';
;
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
    var ddlCollection = document.getElementsByClassName('dropdown-menu');
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
        for (var i_5 = 0; i_5 < ddlCollection.length; i_5++) {
            var ddl = ddlCollection[i_5];
            ddl.setAttribute('style', 'background-color:#D6D6D6; color:#FFFFFF');
        }
        before = 'white';
    }
    else if (color === 'default') {
        for (var i_6 = 0; i_6 < head.length; i_6++) {
            head[i_6].className = 'navbar navbar-inverse';
        }
        for (var i = 0; i < headButton.length; i++) {
            if (before === 'default') {
                headButton[i].classList.remove('btn-default');
            }
            headButton[i].classList.add('btn-inverse');
        }
        for (var i_7 = 0; i_7 < fa.length; i_7++) {
            fa[i_7].setAttribute('style', 'color:white');
        }
        fp.setAttribute('style', 'background-color:#282828');
        for (var i_8 = 0; i_8 < p.length; i_8++) {
            p[i_8].style.color = '#ccc';
        }
        for (var i_9 = 0; i_9 < h1.length; i_9++) {
            h1[i_9].style.color = '#ccc';
        }
        diffp.style.color = '#fff';
        diffp.style.backgroundColor = '#282828';
        diffp.style.outlineColor = '#181818';
        network.style.backgroundColor = '#181818';
        footer.style.backgroundColor = '#282828';
        footer.style.borderTopColor = '#181818';
        arp.style.backgroundColor = '#282828';
        auth.style.backgroundColor = '#282828';
        for (var i_10 = 0; i_10 < ddlCollection.length; i_10++) {
            var ddl = ddlCollection[i_10];
            ddl.setAttribute('style', 'background-color:#282828; color:#FFFFFF');
        }
        before = 'default';
    }
    else if (color === 'green') {
        for (var i_11 = 0; i_11 < head.length; i_11++) {
            head[i_11].className = 'navbar navbar-green';
        }
        for (var i = 0; i < headButton.length; i++) {
            if (before === 'default') {
                headButton[i].classList.remove('btn-inverse');
            }
            headButton[i].classList.add('btn-default');
        }
        for (var i_12 = 0; i_12 < fa.length; i_12++) {
            fa[i_12].setAttribute('style', 'color:#a8abaf');
        }
        fp.setAttribute('style', 'background-color:#e6ffcc');
        for (var i_13 = 0; i_13 < p.length; i_13++) {
            p[i_13].style.color = 'black';
        }
        for (var i_14 = 0; i_14 < h1.length; i_14++) {
            h1[i_14].style.color = '#5E5E5E';
        }
        diffp.style.color = '#D2D3D4';
        diffp.style.backgroundColor = '#616161';
        diffp.style.outlineColor = '#ceff99';
        network.style.backgroundColor = '#e6ffcc';
        footer.style.backgroundColor = '#e6ffcc';
        footer.style.borderTopColor = '#CEFF99';
        arp.style.backgroundColor = '#e6ffcc';
        auth.style.backgroundColor = '#e6ffcc';
        for (var i_15 = 0; i_15 < ddlCollection.length; i_15++) {
            var ddl = ddlCollection[i_15];
            ddl.setAttribute('style', 'background-color:#e6ffcc; color:#181818');
        }
        before = 'green';
    }
    else if (color === 'blue') {
        for (var i_16 = 0; i_16 < head.length; i_16++) {
            head[i_16].className = 'navbar navbar-blue';
        }
        for (var i = 0; i < headButton.length; i++) {
            if (before === 'default') {
                headButton[i].classList.remove('btn-inverse');
            }
            headButton[i].classList.add('btn-default');
        }
        for (var i_17 = 0; i_17 < fa.length; i_17++) {
            fa[i_17].setAttribute('style', 'color:#a8abaf');
        }
        fp.setAttribute('style', 'background-color:#e6f2ff');
        for (var i_18 = 0; i_18 < p.length; i_18++) {
            p[i_18].style.color = 'black';
        }
        for (var i_19 = 0; i_19 < h1.length; i_19++) {
            h1[i_19].style.color = '#5E5E5E';
        }
        diffp.style.color = '#D2D3D4';
        diffp.style.backgroundColor = '#616161';
        diffp.style.outlineColor = '#cce5ff';
        network.style.backgroundColor = '#e6f2ff';
        footer.style.backgroundColor = '#e6f2ff';
        footer.style.borderTopColor = '#cce5ff';
        arp.style.backgroundColor = '#e6f2ff';
        auth.style.backgroundColor = '#e6f2ff';
        for (var i_20 = 0; i_20 < ddlCollection.length; i_20++) {
            var ddl = ddlCollection[i_20];
            ddl.setAttribute('style', 'background-color:#e6f2ff; color:#181818');
        }
        before = 'blue';
    }
}
