global.lastKnownAudio = "Muted";

let updateAudio = async () => {
    let volume = await loudness.getVolume()
    let muted = await loudness.getMuted()

    if (!muted) {
        global.lastKnownAudio = volume + "%";

        if (volume <= 0) {
            document.getElementById("statusbar-sound-icon").src = "./icons/volume-0.svg";
        } else if (volume <= 33) {
            document.getElementById("statusbar-sound-icon").src = "./icons/volume-1.svg";
        } else if (volume <= 66) {
            document.getElementById("statusbar-sound-icon").src = "./icons/volume-2.svg";
        } else {
            document.getElementById("statusbar-sound-icon").src = "./icons/volume-3.svg";
        }
    } else {
        global.lastKnownAudio = "Muted";
        document.getElementById("statusbar-sound-icon").src = "./icons/volume-0.svg";
    }
}

(async () => {
    setInterval(updateAudio, 10000)
    await updateAudio();
})()