const DebugMenu = {
    show: () => {
        document.getElementById('debugging-options').classList.remove('hidden');
        document.getElementById('debugging-options').focus();
    },
    processKey: (key) => {
        if (key === "Escape" || key === "Enter") document.getElementById("debugging-option-close").click();
        if (key === "q") document.getElementById("debugging-option-forcequit").click();
        if (key === "d") document.getElementById("debugging-option-debug").click();
        if (key === "c") document.getElementById("debugging-option-closeall").click();
        if (key === "r") document.getElementById("debugging-option-reload").click();
    },
    hide: () => {
        document.getElementById('debugging-options').classList.add('hidden');
        document.getElementById('debugging-options').blur();
        WindowManager._.refreshStack();
    }
}