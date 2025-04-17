setInterval(async () => {
    mem = await process.getProcessMemoryInfo();
    document.getElementById("debug-info").innerText = "Electron " + process.versions.electron + "\nChromium " + process.versions.chrome + "\nNodeJS " + process.versions.node + "\n\nCPU: " + process.getCPUUsage().percentCPUUsage.toFixed(2) + "%\nCore: " + mem.shared + "K\nGUI: " + mem.private + "K\n\n" + WindowManager.stack.map((w) => { return w.id.substring(7).split("-app-")[0] }).join("\n");
}, 1000)