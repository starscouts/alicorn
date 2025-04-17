let updateTime = () => {
    document.getElementById("statusbar-time").innerText = new Date().getHours() + ":" + (new Date().getMinutes() > 9 ? new Date().getMinutes() : "0" + new Date().getMinutes());
}

setInterval(updateTime, 1000)
updateTime()