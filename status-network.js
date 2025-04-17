global.lastKnownNetwork = {
    name: "Wired connection",
    description: "Connected"
}

let updateNetwork = async () => {
    let connections = await wifi.getCurrentConnections()

    if (connections.length > 0) {
        let connection = connections[0];

        if (connection.quality <= 20) {
            global.lastKnownNetwork.name = connection.ssid;
            global.lastKnownNetwork.description = "Connected, unstable";
            document.getElementById("statusbar-network-icon").src = "./icons/network-wifi-0.svg";
        } else if (connection.quality <= 40) {
            global.lastKnownNetwork.name = connection.ssid;
            global.lastKnownNetwork.description = "Connected, poor";
            document.getElementById("statusbar-network-icon").src = "./icons/network-wifi-1.svg";
        } else if (connection.quality <= 60) {
            global.lastKnownNetwork.name = connection.ssid;
            global.lastKnownNetwork.description = "Connected, usable";
            document.getElementById("statusbar-network-icon").src = "./icons/network-wifi-2.svg";
        } else if (connection.quality <= 80) {
            global.lastKnownNetwork.name = connection.ssid;
            global.lastKnownNetwork.description = "Connected, good";
            document.getElementById("statusbar-network-icon").src = "./icons/network-wifi-3.svg";
        } else {
            global.lastKnownNetwork.name = connection.ssid;
            global.lastKnownNetwork.description = "Connected, perfect";
            document.getElementById("statusbar-network-icon").src = "./icons/network-wifi-4.svg";
        }
    } else {
        global.lastKnownNetwork.name = "Wired connection";
        global.lastKnownNetwork.description = "Connected";
        document.getElementById("statusbar-network-icon").src = "./icons/network-wired.svg";
    }
}

(async () => {
    setInterval(updateNetwork, 10000)
    await updateNetwork();
})()