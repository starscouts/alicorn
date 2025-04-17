global.lastKnownBattery = {
    name: "Unknown",
    description: "Unknown",
    time: ""
}

let getBatteryRemainingTime = async () => {
    let battery = await navigator.getBattery();

    let time = 0;
    if (battery.charging) {
        time = battery.chargingTime;
    } else {
        time = battery.dischargingTime;
    }

    if (time === Infinity) {
        return "Calculating...";
    } else {
        if (time > 60) {
            if (time > 60**2) {
                if (time > 60**3) {
                    return "About " + Math.round(time / 60**3) + " day" + (Math.round(time / 60**3) > 1 ? "s" : "") + (battery.charging ? " before charged" : " remaining");
                } else {
                    return "About " + Math.round(time / 60**2) + " hour" + (Math.round(time / 60**2) > 1 ? "s" : "") + (battery.charging ? " before charged" : " remaining");
                }
            } else {
                return "About " + Math.round(time / 60) + " minute" + (Math.round(time / 60) > 1 ? "s" : "") + (battery.charging ? " before charged" : " remaining");
            }
        } else {
            return "About " + Math.round(time) + " second" + (time > 1 ? "s" : "") + (battery.charging ? " before charged" : " remaining");
        }
    }
}

let updateBattery = async () => {
    let battery = await navigator.getBattery();

    global.lastKnownBattery.name = "Battery: " + Math.round(battery.level * 100) + "%";
    global.lastKnownBattery.time = await getBatteryRemainingTime();
    if (battery.level <= 0.01) {
        global.lastKnownBattery.description = "Critically low" + (battery.charging ? ", charging" : ", discharging");
        document.getElementById("statusbar-battery-icon").src = "./icons/battery-000-001" + (battery.charging ? "-charging" : "") + ".svg";
    } else if (battery.level > 0.01 && battery.level <= 0.1) {
        global.lastKnownBattery.description = "Very low" + (battery.charging ? ", charging" : ", discharging");
        document.getElementById("statusbar-battery-icon").src = "./icons/battery-001-010" + (battery.charging ? "-charging" : "") + ".svg";
    } else if (battery.level > 0.1 && battery.level <= 0.2) {
        global.lastKnownBattery.description = "Low battery" + (battery.charging ? ", charging" : ", discharging");
        document.getElementById("statusbar-battery-icon").src = "./icons/battery-010-020" + (battery.charging ? "-charging" : "") + ".svg";
    } else if (battery.level > 0.2 && battery.level <= 0.35) {
        global.lastKnownBattery.description = (battery.charging ? "Charging" : "Discharging");
        document.getElementById("statusbar-battery-icon").src = "./icons/battery-020-035" + (battery.charging ? "-charging" : "") + ".svg";
    } else if (battery.level > 0.35 && battery.level <= 0.5) {
        global.lastKnownBattery.description = (battery.charging ? "Charging" : "Discharging");
        document.getElementById("statusbar-battery-icon").src = "./icons/battery-035-050" + (battery.charging ? "-charging" : "") + ".svg";
    } else if (battery.level > 0.5 && battery.level <= 0.6) {
        global.lastKnownBattery.description = (battery.charging ? "Charging" : "Discharging");
        document.getElementById("statusbar-battery-icon").src = "./icons/battery-050-060" + (battery.charging ? "-charging" : "") + ".svg";
    } else if (battery.level > 0.6 && battery.level <= 0.8) {
        global.lastKnownBattery.description = (battery.charging ? "Charging" : "Discharging");
        document.getElementById("statusbar-battery-icon").src = "./icons/battery-060-080" + (battery.charging ? "-charging" : "") + ".svg";
    } else if (battery.level > 0.8 && battery.level <= 0.95) {
        global.lastKnownBattery.description = (battery.charging ? "Charging" : "Discharging");
        document.getElementById("statusbar-battery-icon").src = "./icons/battery-080-095" + (battery.charging ? "-charging" : "") + ".svg";
    } else if (battery.level > 0.95 && battery.level <= 1) {
        global.lastKnownBattery.description = (battery.charging ? "Charged" : "Discharging");
        document.getElementById("statusbar-battery-icon").src = "./icons/battery-095-100" + (battery.charging ? "-charging" : "") + ".svg";
    } else {
        global.lastKnownBattery.description = "Unknown";
        document.getElementById("statusbar-battery-icon").src = "./icons/battery-unknown.svg";
    }
}

(async () => {
    setInterval(updateBattery, 10000)
    await updateBattery();
})()