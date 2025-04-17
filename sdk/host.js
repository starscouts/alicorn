AlicornSDK = {};
AlicornSDKInternal = {};

class AlicornSDKError extends Error {
    constructor(props) {
        super(props);
    }
}

AlicornSDKInternal["checkWindow"] = (w) => {
    if (w === null) {
        throw new AlicornSDKError("Cannot make SDK call before window is initialized");
    }
}

AlicornSDKInternal["resolveWindow"] = (w) => {
    let wr = null
    wr = WindowManager.stack.filter(i => i.id.substring(7).split("-app-")[0] === w)[0]

    return wr;
}

AlicornSDK["close"] = (_window) => {
    AlicornSDKInternal.checkWindow(_window);
    let w = AlicornSDKInternal.resolveWindow(_window);

    WindowManager.queueClose(w);
}

AlicornSDK["ready"] = (_window) => {
    AlicornSDKInternal.checkWindow(_window);
    let w = AlicornSDKInternal.resolveWindow(_window);

    w.classList.remove("loading");
}

AlicornSDK["keyboard"] = (_window, data) => {
    AlicornSDKInternal.checkWindow(_window);
    let w = AlicornSDKInternal.resolveWindow(_window);

    KeyboardShortcutHandler(data);
}