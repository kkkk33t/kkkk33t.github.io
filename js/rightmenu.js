// RightMenu 鼠标右键菜单
let rmf = {};

// 显示右键菜单
rmf.showRightMenu = function (isTrue, x = 0, y = 0) {
    let rightMenu = document.getElementById('rightMenu');
    rightMenu.style.top = x + 'px';
    rightMenu.style.left = y + 'px';

    if (isTrue) {
        rightMenu.style.display = 'block';
    } else {
        rightMenu.style.display = 'none';
    }
};

// 昼夜切换
rmf.switchDarkMode = function () {
    const nowMode =
        document.documentElement.getAttribute('data-theme') === 'dark'
            ? 'dark'
            : 'light';
    if (nowMode === 'light') {
        activateDarkMode();
        saveToLocal.set('theme', 'dark', 2);
        if (GLOBAL_CONFIG.Snackbar !== undefined) {
            btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night);
        }
    } else {
        activateLightMode();
        saveToLocal.set('theme', 'light', 2);
        if (GLOBAL_CONFIG.Snackbar !== undefined) {
            btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day);
        }
    }
    // handle some cases
    if (typeof utterancesTheme === 'function') {
        utterancesTheme();
    }
    if (typeof FB === 'object') {
        window.loadFBComment();
    }
    if (window.DISQUS && document.getElementById('disqus_thread').children.length) {
        setTimeout(() => window.disqusReset(), 200);
    }
};

// 阅读模式
rmf.switchReadMode = function () {
    const body = document.body;
    body.classList.add('read-mode');
    const newEle = document.createElement('button');
    newEle.type = 'button';
    newEle.className = 'fas fa-sign-out-alt exit-readmode';

    newEle.addEventListener('click', function clickFn() {
        body.classList.remove('read-mode');
        newEle.remove();
        newEle.removeEventListener('click', clickFn);
    });

    body.appendChild(newEle);
};

//复制选中文字
rmf.copySelect = function () {
    document.execCommand('Copy', false, null);
    //这里可以写点东西提示一下 已复制
};

//回到顶部
rmf.scrollToTop = function () {
    btf.scrollToDest(0, 500);
};

// 右键菜单事件
if (
    !navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
) {
    window.oncontextmenu = function (event) {
        let rightMenuGroupElements = document.getElementsByClassName(
            'rightMenu-group hide'
        );
        Array.prototype.forEach.call(rightMenuGroupElements, function (element) {
            element.style.display = 'none';
        });

        //如果有文字选中，则显示 文字选中相关的菜单项
        if (window.getSelection().toString()) {
            document.getElementById('menu-text').style.display = 'block';
        }

        let pageX = event.clientX + 10;
        let pageY = event.clientY;
        let rightMenu = document.getElementById('rightMenu');
        let rmWidth = rightMenu.offsetWidth;
        let rmHeight = rightMenu.offsetHeight;
        if (pageX + rmWidth > window.innerWidth) {
            pageX -= rmWidth + 10;
        }
        if (pageY + rmHeight > window.innerHeight) {
            pageY -= pageY + rmHeight - window.innerHeight;
        }

        rmf.showRightMenu(true, pageY, pageX);
        return false;
    };

    window.addEventListener('click', function () {
        rmf.showRightMenu(false);
    });
}