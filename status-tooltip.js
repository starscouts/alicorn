document.getElementById("menubtn").onmouseover = () => {
    WindowManager.showTooltip(document.getElementById("menubtn"), "Alicorn Application Launcher|Start and manage apps on the system");
}

document.getElementById("statusbar-network").onmouseover = () => {
    WindowManager.showTooltip(document.getElementById("statusbar-network"), lastKnownNetwork.name + "|" + lastKnownNetwork.description);
}

document.getElementById("statusbar-sound").onmouseover = () => {
    WindowManager.showTooltip(document.getElementById("statusbar-sound"), "Volume: " + lastKnownAudio);
}

document.getElementById("statusbar-battery").onmouseover = () => {
    WindowManager.showTooltip(document.getElementById("statusbar-battery"), lastKnownBattery.name + "|" + lastKnownBattery.description + "\n" + lastKnownBattery.time);
}

document.getElementById("statusbar-time").onmouseover = () => {
    a = new Date().toString().split(":")[0].split(" "); a.pop();
    WindowManager.showTooltip(document.getElementById("statusbar-time"), a.join(" ") + "|" + new Date().toTimeString().split("(")[1].split(")")[0]);
}

document.getElementById("statusbar-time").onmouseleave = document.getElementById("statusbar-battery").onmouseleave = document.getElementById("statusbar-sound").onmouseleave = document.getElementById("statusbar-network").onmouseleave = document.getElementById("menubtn").onmouseleave = () => {
    WindowManager.hideTooltip();
}

WindowManager.showTooltip = (element, message, _appIcon, floating) => {
    document.getElementById("appbar-tooltip").classList.remove("hidden");

    message = $('<div>').text(message).html().replaceAll("\n", "<br>")
    if (message.split("|").length > 1) {
        document.getElementById("appbar-tooltip").innerHTML = message.split("|")[0] + "<br><span style='opacity:.5;'>" + message.split("|")[1] + "</span>";
    } else {
        document.getElementById("appbar-tooltip").innerHTML = message.split("|")[0];
    }
    let position = element.getBoundingClientRect();
    let left = position.left;
    let top = position.top;

    if (left <= 50) {
        document.getElementById("appbar-tooltip").style.left = "3px";
    } else if (left >= (window.innerWidth - (document.getElementById("appbar-tooltip").clientWidth / 2) - 3)) {
        document.getElementById("appbar-tooltip").style.left = (window.innerWidth - document.getElementById("appbar-tooltip").clientWidth - 5) + "px";
    } else {
        document.getElementById("appbar-tooltip").style.left = (left - (document.getElementById("appbar-tooltip").clientWidth / 2) + 12) + "px";
    }

    if (floating) {
        if (top <= 10) {
            document.getElementById("appbar-tooltip").style.top = "20px";
        } else if (top >= (window.innerHeight - (document.getElementById("appbar-tooltip").clientHeight / 2) - 3)) {
            document.getElementById("appbar-tooltip").style.top = ((window.innerHeight - document.getElementById("appbar-tooltip").clientHeight - 5) - 25) + "px";
        } else {
            document.getElementById("appbar-tooltip").style.top = ((top - (document.getElementById("appbar-tooltip").clientHeight / 2) + 12) - 25) + "px";
        }
    } else {
        document.getElementById("appbar-tooltip").style.top = "";
    }
}