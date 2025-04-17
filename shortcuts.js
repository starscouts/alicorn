let keyPressShortcut = false;
global.KeyboardShortcuts = {}

function KeyboardShortcutHandler(shortcut) {
    if (Object.keys(KeyboardShortcuts).includes(shortcut) && document.getElementById("debugging-options").classList.contains("hidden")) {
        KeyboardShortcuts[shortcut]();
    } else if (!document.getElementById("debugging-options").classList.contains("hidden")) {
        DebugMenu.processKey(shortcut);
    }
}

document.onkeyup = KeyboardEventHandler = (e) => {
    processKey = true;
    if (e.key === "Ctrl" || e.key === "Alt" || e.key === "Shift" || e.key === "Meta") {
        if (keyPressShortcut) {
            processKey = false;
            keyPressShortcut = (e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) || (!e.ctrlKey && e.altKey && !e.shiftKey && !e.metaKey) || (!e.ctrlKey && !e.altKey && e.shiftKey && !e.metaKey) || (!e.ctrlKey && !e.altKey && !e.shiftKey && e.metaKey);
        }
    } else {
        keyPressShortcut = e.ctrlKey || e.altKey || e.shiftKey || e.metaKey;
    }
    if (processKey) {
        shortcut = (e.ctrlKey ? "Control+" : "") + (e.altKey ? "Alt+" : "") + (e.shiftKey ? "Shift+" : "") + (e.metaKey ? "Meta+" : "") + e.key;
        console.log(shortcut);
        KeyboardShortcutHandler(shortcut);
    }
}

KeyboardShortcuts["Alt+Tab"] = () => {
    WindowManager.cycleForward();
}

KeyboardShortcuts["Alt+Shift+Tab"] = () => {
    WindowManager.cycleBackward();
}

KeyboardShortcuts["Meta+ArrowUp"] = KeyboardShortcuts["Alt+Shift+ArrowUp"] = () => {
    if (!WindowManager.stack[0].classList.contains("minimized")) WindowManager.maximize(WindowManager.stack[0]);
    if (WindowManager.stack[0].classList.contains("minimized")) WindowManager.unminimize(WindowManager.stack[0]);
}

KeyboardShortcuts["Meta+ArrowDown"] = KeyboardShortcuts["Alt+Shift+ArrowDown"] = () => {
    if (!WindowManager.stack[0].classList.contains("maximized")) WindowManager.minimize(WindowManager.stack[0]);
    if (WindowManager.stack[0].classList.contains("maximized")) WindowManager.restore(WindowManager.stack[0]);
}

KeyboardShortcuts["Meta+Q"] = KeyboardShortcuts["Alt+Shift+Q"] = KeyboardShortcuts["Alt+Shift+Ω"] = () => {
    WindowManager.close(WindowManager.stack[0]);
}

KeyboardShortcuts["Meta+ArrowLeft"] = KeyboardShortcuts["Alt+Shift+ArrowLeft"] = () => {
    if (WindowManager.stack[0].classList.contains("maximized")) WindowManager.restore(WindowManager.stack[0]);
    if (!WindowManager.stack[0].classList.contains("minimized")) WindowManager.paneLeft(WindowManager.stack[0]);
}

KeyboardShortcuts["Meta+ArrowRight"] = KeyboardShortcuts["Alt+Shift+ArrowRight"] = () => {
    if (WindowManager.stack[0].classList.contains("maximized")) WindowManager.restore(WindowManager.stack[0]);
    if (!WindowManager.stack[0].classList.contains("minimized")) WindowManager.paneRight(WindowManager.stack[0]);
}

KeyboardShortcuts["Control+Alt+Delete"] = KeyboardShortcuts["Control+Alt+Backspace"] = () => {
    DebugMenu.show();
}