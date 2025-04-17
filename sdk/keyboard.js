document.addEventListener('keyup', (e) => {
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
        alicorn.keyboard(shortcut);
    }
})