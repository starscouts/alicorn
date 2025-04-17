/*
<span class="statusbar-app" id="app-test">
    <img class="statusbar-app-icon" src="defaultapp.svg">
</span>
 */

WindowManager._.updateAppbar = () => {
    let apps = WindowManager.stack.map((w) => {
        let pkg = w.id.split("-app-")[1];
        if (fs.existsSync("./data/user/Applications/" + pkg + ".aap") && fs.existsSync("./data/user/Applications/" + pkg + ".aap/AlicornApp.yml")) {
            try {
                let app = YAML.parse(fs.readFileSync("./data/user/Applications/" + pkg + ".aap/AlicornApp.yml", "utf-8"));
                if (fs.existsSync("./data/user/Applications/" + pkg + ".aap/AlicornApp.svg")) {
                    return {
                        package: $('<div>').text(pkg).html(),
                        name: $('<div>').text(app.name).html(),
                        icon: "./data/user/Applications/" + $('<div>').text(pkg).html() + ".aap/AlicornApp.svg",
                        window: w
                    };
                } else if (fs.existsSync("./data/user/Applications/" + pkg + ".aap/AlicornApp.png")) {
                    return { package: $('<div>').text(pkg).html(), name: $('<div>').text(app.name).html(), icon: "./data/user/Applications/" + $('<div>').text(pkg).html() + ".aap/AlicornApp.png", window: w };
                } else {
                    return { package: $('<div>').text(pkg).html(), name: $('<div>').text(app.name).html(), icon: "./defaultapp.svg", window: w };
                }
            } catch (e) {
                return { package: $('<div>').text(pkg).html(), name: $('<div>').text(pkg).html(), icon: "./defaultapp.svg", window: w };
            }
        } else {
            return { package: $('<div>').text(pkg).html(), name: $('<div>').text(pkg).html(), icon: "./defaultapp.svg", window: w };
        }
    }).sort((a, b) => a.name.localeCompare(b.name));

    html = "";
    for (let app of apps) {
        classes = ["statusbar-app"];

        if (!app.window.classList.contains("unfocused")) {
            classes.push("focused");
        }

        if (app.window.classList.contains("minimized")) {
            classes.push("minimized");
        }

        html += `<span class="${classes.join(' ')}" id="app-${app.package}">
                    <img class="statusbar-app-icon" src="${app.icon}">
                </span>`
    }

    document.getElementById("statusbar-apps").innerHTML = html;

    for (let app of apps) {
        let item = document.getElementById(`app-${app.package}`);

        item.onclick = () => {
            if (item.classList.contains("minimized")) {
                WindowManager.unminimize(app.window);
                WindowManager.bringToFront(app.window);
            } else if (item.classList.contains("focused")) {
                WindowManager.minimize(app.window);
            } else {
                WindowManager.bringToFront(app.window);
            }
        }

        item.onmouseover = () => {
            if (app.window.classList.contains("loading")) {
                if (item.classList.contains("minimized")) {
                    WindowManager.showTooltip(item, app.name + "|Starting, minimized", true);
                } else {
                    WindowManager.showTooltip(item, app.name + "|Starting", true);
                }
            } else {
                if (item.classList.contains("minimized")) {
                    WindowManager.showTooltip(item, app.name + "|Minimized", true);
                } else {
                    WindowManager.showTooltip(item, app.name, true);
                }
            }
        }

        item.onmouseleave = () => {
            WindowManager.hideTooltip();
        }
    }
}

WindowManager._.updateAppbar();