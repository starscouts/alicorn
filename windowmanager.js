function dragElement(elmnt) {
    console.log(elmnt.id);

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "-titlebar")) {
        document.getElementById(elmnt.id + "-titlebar").onmousedown = dragMouseDown;
        document.getElementById(elmnt.id + "-titlebar").addEventListener('click', WindowManager._.doubleClickTitlebar(elmnt), false);
    } else {
        elmnt.onmousedown = dragMouseDown;
        elmnt.addEventListener('click', WindowManager._.doubleClickTitlebar(elmnt), false);
    }

    function dragMouseDown(e) {
        elmnt.classList.add("dragging");
        elmnt.classList.remove("restored");
        elmnt.classList.remove("unminimized");
        e = e || window.event;
        e.preventDefault();
        if (e.target.parentElement.classList.contains("maximized") || e.target.classList.contains("window-action") || e.target.classList.contains("window-actions")) {
            return;
        }
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        elmnt.classList.remove("restored");
        elmnt.classList.remove("unminimized");
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        elmnt.classList.remove("dragging");
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function makeResizableDiv(div) {
    const element = document.querySelector(div);
    const resizers = document.querySelectorAll(div + ' .resizer')
    const minimum_size = 20;
    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    for (let i = 0;i < resizers.length; i++) {
        const currentResizer = resizers[i];
        currentResizer.addEventListener('mousedown', function(e) {
            e.preventDefault()
            original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
            original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
            original_x = element.getBoundingClientRect().left;
            original_y = element.getBoundingClientRect().top;
            original_mouse_x = e.pageX;
            original_mouse_y = e.pageY;
            window.addEventListener('mousemove', resize)
            window.addEventListener('mouseup', stopResize)
        })

        function resize(e) {
            element.classList.remove("restored");
            element.classList.remove("unminimized");
            if (currentResizer.classList.contains('bottom-right')) {
                const width = original_width + (e.pageX - original_mouse_x);
                const height = original_height + (e.pageY - original_mouse_y)
                if (width > minimum_size) {
                    element.style.width = width + 'px'
                }
                if (height > minimum_size) {
                    element.style.height = height + 'px'
                }
            }
            else if (currentResizer.classList.contains('bottom-left')) {
                const height = original_height + (e.pageY - original_mouse_y)
                const width = original_width - (e.pageX - original_mouse_x)
                if (height > minimum_size) {
                    element.style.height = height + 'px'
                }
                if (width > minimum_size) {
                    element.style.width = width + 'px'
                    element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
                }
            }
            else if (currentResizer.classList.contains('top-right')) {
                const width = original_width + (e.pageX - original_mouse_x)
                const height = original_height - (e.pageY - original_mouse_y)
                if (width > minimum_size) {
                    element.style.width = width + 'px'
                }
                if (height > minimum_size) {
                    element.style.height = height + 'px'
                    element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
                }
            }
            else {
                const width = original_width - (e.pageX - original_mouse_x)
                const height = original_height - (e.pageY - original_mouse_y)
                if (width > minimum_size) {
                    element.style.width = width + 'px'
                    element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
                }
                if (height > minimum_size) {
                    element.style.height = height + 'px'
                    element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
                }
            }
        }

        function stopResize() {
            window.removeEventListener('mousemove', resize)
        }
    }
}

WindowManager = {
    stack: [],
    windows: {},
    webContents: {},

    bringToFront: (w) => {
        if (w.classList.contains("minimized")) WindowManager.unminimize(w);
        WindowManager.stack.sort(function(x,y){ return x === w ? -1 : y === w ? 1 : 0; });
        WindowManager._.refreshStack();
        WindowManager._.updateAppbar();
        WindowManager._.updateWindowButtons();
    },
    maximize: (w) => {
        document.getElementById("appbar").classList.add("has-maximized");
        w.classList.add("maximized");
        w.classList.remove("restored");
        WindowManager._.updateAppbar();
        WindowManager._.updateWindowButtons();
    },
    restore: (w) => {
        w.classList.remove("maximized");
        w.classList.remove("maximized-left");
        w.classList.remove("maximized-right");
        w.classList.add("restored");
        hasMaximized = false;
        for (let win of Array.from(document.getElementsByClassName("window"))) {
            if (win.classList.contains("maximized")) {
                hasMaximized = true;
            }
        }
        if (!hasMaximized) document.getElementById("appbar").classList.remove("has-maximized");
        WindowManager._.updateAppbar();
        WindowManager._.updateWindowButtons();
    },
    minimize: (w) => {
        w.classList.add("minimized");
        w.classList.remove("unminimized");
        w.classList.remove("maximized");
        w.classList.remove("maximized-left");
        w.classList.remove("maximized-right");
        hasMaximized = false;
        for (let win of Array.from(document.getElementsByClassName("window"))) {
            if (win.classList.contains("maximized")) {
                hasMaximized = true;
            }
        }
        if (!hasMaximized) document.getElementById("appbar").classList.remove("has-maximized");
        WindowManager._.updateAppbar();
        WindowManager._.updateWindowButtons();
        WindowManager.hideTooltip();
        WindowManager.cycleForward();
    },
    unminimize: (w) => {
        w.classList.remove("minimized");
        w.classList.add("unminimized");
        WindowManager._.updateAppbar();
        WindowManager._.updateWindowButtons();
    },
    paneLeft: (w) => {
        WindowManager.maximize(w);
        w.classList.add("maximized-left");
        WindowManager._.updateAppbar();
        WindowManager._.updateWindowButtons();
    },
    paneRight: (w) => {
        WindowManager.maximize(w);
        w.classList.add("maximized-right");
        WindowManager._.updateAppbar();
        WindowManager._.updateWindowButtons();
    },
    close: (w, i) => {
        w.outerHTML = "";
        try {
            if (i) {
                WindowManager.stack[i].outerHTML = "";
            }
        } catch (e) {
            console.error(e);
        }
        WindowManager.stack = WindowManager.stack.filter(i => i !== w);
        if (WindowManager.stack.length > 0) WindowManager.bringToFront(WindowManager.stack[0]);
        WindowManager.hideTooltip();
        WindowManager._.updateAppbar();
        WindowManager._.updateWindowButtons();
    },
    closeAll: () => {
        for (let win of WindowManager.stack) {
            WindowManager.close(win);
        }
    },
    queueClose: (w) => {
        setTimeout(() => {
            WindowManager.close(w);
        }, 100)
    },
    hideTooltip: () => {
        document.getElementById("appbar-tooltip").classList.add("hidden");
    },
    cycleForward: () => {
        if (WindowManager.stack.length > 1) WindowManager.bringToFront(WindowManager.stack[1]);
    },
    cycleBackward: () => {
        if (WindowManager.stack.length > 1) WindowManager.bringToFront(WindowManager.stack[WindowManager.stack.length - 1]);
    },
    openApp: (app) => {
        if (fs.existsSync("./data/user/Applications/" + app + ".aap")) {
            if (fs.existsSync("./data/user/Applications/" + app + ".aap/AlicornApp.yml") && fs.existsSync("./data/user/Applications/" + app + ".aap/index.html")) {
                let windowId = uuid.v4();
                let data = YAML.parse(fs.readFileSync("./data/user/Applications/" + app + ".aap/AlicornApp.yml", "utf-8"));
                let icon;

                if (fs.existsSync("./data/user/Applications/" + app + ".aap/AlicornApp.svg")) {
                    icon = "./data/user/Applications/" + app + ".aap/AlicornApp.svg";
                } else if (fs.existsSync("./data/user/Applications/" + app + ".aap/AlicornApp.png")) {
                    icon = "./data/user/Applications/" + app + ".aap/AlicornApp.png";
                } else {
                    icon = "./defaultapp.svg";
                }

                let startPosX = (window.innerWidth / 2) - (data.width / 2);
                let startPosY = (window.innerHeight / 2) - (data.height / 2);

                let div = document.createElement("div");
                div.innerHTML = `
<div style="width:${data.width}px;height:${data.height}px;position: absolute;left:${startPosX}px;top:${startPosY}px;z-index:2;" id="window-${windowId}-app-${data.package}" class="window resizable loading unfocused">
    <div class='resizers'>
        <div style="height:24px;width:100%;" id="window-${windowId}-app-${data.package}-titlebar" class="window-titlebar">
            <span class="window-actions">
                <img src="icons/window-close.svg" onmouseenter="WindowManager.showTooltip(document.getElementById('window-${windowId}-app-${data.package}-close'), 'Close', null, true)" onmouseleave="document.getElementById('appbar-tooltip').classList.add('hidden');" onclick="WindowManager.close(WindowManager.stack[WindowManager.windows['${windowId}']], WindowManager.windows['${windowId}']);" id="window-${windowId}-app-${data.package}-close" class="window-action window-action-close"><img src="icons/window-maximize.svg"  onmouseenter="WindowManager.showTooltip(document.getElementById('window-${windowId}-app-${data.package}-maximize'), WindowManager.stack[WindowManager.windows['${windowId}']].classList.contains('maximized') ? 'Restore' : 'Maximize', null, true)" onmouseleave="document.getElementById('appbar-tooltip').classList.add('hidden');" onclick="WindowManager.stack[WindowManager.windows['${windowId}']].classList.contains('maximized') ? WindowManager.restore(WindowManager.stack[WindowManager.windows['${windowId}']]) : WindowManager.maximize(WindowManager.stack[WindowManager.windows['${windowId}']])" id="window-${windowId}-app-${data.package}-maximize" class="window-action window-action-maximize">
            </span>
            <span class="window-title">${data.name}</span>
        </div>
        <div class="window-content" id="window-${windowId}-app-${data.package}-content">
            <webview src="./data/user/Applications/${data.package}.aap/index.html" preload="./sdk/main.js" id="window-${windowId}-app-${data.package}-sandbox" class="window-sandbox"></webview>
        </div>
        <div class="window-loader" id="window-${windowId}-app-${data.package}-loader">
            <div>
                <img src="./data/user/Applications/${data.package}.aap/AlicornApp.svg" class="window-loader-icon" alt="Loading..."><br>
                <img src="loader.svg" class="window-loader-spinner" alt="Loading...">
            </div>
        </div>
    </div>
</div>
`
                document.getElementById("tracked-windows").appendChild(div);
                let win = document.getElementById(`window-${windowId}-app-${data.package}`);
                WindowManager.stack.unshift(win);
                win.addEventListener('click', () => {
                    WindowManager.bringToFront(win);
                })
                win.addEventListener('mousedown', () => {
                    WindowManager.bringToFront(win);
                })
                dragElement(win);
                WindowManager._.refreshStack()
                WindowManager._.updateAppbar()
                WindowManager._.updateWindowButtons()
            }
        }
    },
    _: {
        updateWindowButtons: () => {
            for (let win of WindowManager.stack) {
                if (win.classList.contains("maximized")) {
                    document.getElementById(win.id + "-maximize").src = "icons/window-restore.svg";
                } else {
                    document.getElementById(win.id + "-maximize").src = "icons/window-maximize.svg";
                }
            }
        },
        refreshStack: () => {
            index = 0;
            WindowManager.windows = {};
            for (let win of WindowManager.stack) {
                win.style.zIndex = "" + (WindowManager.stack.length - index);
                if (index === 0) {
                    win.classList.remove("unfocused");
                } else {
                    win.classList.add("unfocused");
                }
                WindowManager.windows[win.id.substring(7).split("-app-")[0]] = index;
                WindowManager.webContents[win.id.substring(7).split("-app-")[0]] = -1;
                document.getElementById(win.id + "-sandbox").addEventListener('dom-ready', () => {
                    WindowManager.webContents[win.id.substring(7).split("-app-")[0]] = document.getElementById(win.id + "-sandbox").getWebContentsId()
                    document.getElementById(win.id + "-sandbox").send("window-id", win.id.substring(7).split("-app-")[0]);
                })
                document.getElementById(win.id + "-sandbox").focus();
                index++;
            }
        },
        doubleClickTitlebar: (w) => {
            let clicks = 0, timeout;
            return function() {
                clicks++;
                if (clicks === 1) {
                    timeout = setTimeout(function() { clicks = 0; }, 400);
                } else {
                    timeout && clearTimeout(timeout);
                    if (w.classList.contains("maximized")) {
                        WindowManager.restore(w);
                    } else {
                        WindowManager.maximize(w);
                    }
                    clicks = 0;
                }
            };
        }
    }
}

for (let win of Array.from(document.getElementsByClassName("window"))) {
    WindowManager.stack.push(win);
    win.addEventListener('click', () => {
        WindowManager.bringToFront(win);
    })
    win.addEventListener('mousedown', () => {
        WindowManager.bringToFront(win);
    })
    dragElement(win);
    WindowManager._.refreshStack();
}