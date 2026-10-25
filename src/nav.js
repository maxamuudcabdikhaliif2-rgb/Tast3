const navToggle = document.getElementById("navToggle");
    const siteNav = document.getElementById("siteNav");

    navToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            siteNav.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
    // evc
     const $ = id => document.getElementById(id);

    let balance = 100;
    let lastSent = "Weli lacag lama dirin.";
    let lastReceived = "Weli lacag lama helin.";
    let blockedNumbers = [];
    let transactions = [];

    const services = [
        "Itus haraaga",
        "Kaarka hadalka ku shubo",
        "Lacag dirid",
        "Internet ku shubo",
        "Bixi biil (Postpaid)",
        "Lacagta ugu dambeysay ee dirtay",
        "Lacagta ugu dambeysay ee heshay",
        "Lacag soo celin",
        "Lacag iska celin",
        "Lacag dhigasho",
        "Lacag la bixid",
        "Lacag u dir ganacsi (Merchant)",
        "Account u dirid",
        "Maareynta akoonka",
        "Ka bax"
    ];

    function show(id) {
        ["start", "pinSection", "menuSection", "serviceSection"]
            .forEach(section => $(section).classList.add("hidden"));

        $(id).classList.remove("hidden");
    }

    function message(text, error = false) {
        $("result").innerHTML = "";
        const p = document.createElement("p");
        p.className = error ? "message error" : "message";
        p.textContent = text;
        $("result").appendChild(p);
    }

    function checkCode() {
        if ($("evc").value.trim() === "*770#") {
            $("startMsg").textContent = "";
            show("pinSection");
            $("pin").focus();
        } else {
            $("startMsg").textContent = "Fadlan geli *770# si sax ah.";
            $("startMsg").className = "message error";
        }
    }

    function login() {
        if ($("pin").value === "8989") {
            $("pinMsg").textContent = "";
            $("pin").value = "";
            buildMenu();
            showMenu();
        } else {
            $("pinMsg").textContent = "PIN-ka aad gelisay waa khalad!";
            $("pinMsg").className = "message error";
            $("pin").value = "";
        }
    }

    function buildMenu() {
        $("menu").innerHTML = "";

        services.forEach((service, index) => {
            const btn = document.createElement("button");
            btn.textContent = `${index + 1}. ${service}`;
            btn.onclick = () => openService(index + 1);
            $("menu").appendChild(btn);
        });
    }

    function showMenu() {
        show("menuSection");
    }

    function openService(number) {
        if (number === 15) {
            show("start");
            $("evc").value = "";
            $("startMsg").textContent = "Waad ka baxday EVC Plus Demo.";
            return;
        }

        show("serviceSection");
        $("serviceTitle").textContent =
            number + ". " + services[number - 1];

        $("serviceContent").innerHTML = "";
        $("result").innerHTML = "";

        if (number === 1) {
            message("Haraaga akoonkaaga demo waa $" +
                balance.toFixed(2));
            return;
        }

        if (number === 6) {
            message("Lacagtii ugu dambeysay ee aad dirtay: " + lastSent);
            return;
        }

        if (number === 7) {
            message("Lacagtii ugu dambeysay ee aad heshay: " + lastReceived);
            return;
        }

        if (number === 14) {
            renderAccountSettings();
            return;
        }

        if (number === 8) {
            renderRefund();
            return;
        }

        if (number === 9) {
            renderBlock();
            return;
        }

        const configs = {
            2: {
                labels: ["Lambarka telefoonka", "Lacagta"],
                types: ["tel", "number"],
                placeholders: ["61XXXXXXX", "Tusaale: 5"],
                action: "Ku shubo",
                kind: "airtime"
            },
            3: {
                labels: ["Lambarka qaataha", "Lacagta"],
                types: ["tel", "number"],
                placeholders: ["61XXXXXXX", "Tusaale: 10"],
                action: "Dir lacagta",
                kind: "send"
            },
            4: {
                labels: ["Lambarka telefoonka", "Lacagta"],
                types: ["tel", "number"],
                placeholders: ["61XXXXXXX", "Tusaale: 5"],
                action: "Iibso internet",
                kind: "internet"
            },
            5: {
                labels: ["Lambarka biilka", "Lacagta"],
                types: ["text", "number"],
                placeholders: ["Geli lambarka biilka", "Tusaale: 20"],
                action: "Bixi biilka",
                kind: "bill"
            },
            10: {
                labels: ["Lacagta aad dhigeyso"],
                types: ["number"],
                placeholders: ["Tusaale: 50"],
                action: "Dhig lacagta",
                kind: "deposit"
            },
            11: {
                labels: ["Lacagta aad la baxayso"],
                types: ["number"],
                placeholders: ["Tusaale: 50"],
                action: "La bax lacagta",
                kind: "withdraw"
            },
            12: {
                labels: ["Merchant ID", "Lacagta"],
                types: ["text", "number"],
                placeholders: ["Geli Merchant ID", "Tusaale: 10"],
                action: "Bixi lacagta",
                kind: "merchant"
            },
            13: {
                labels: ["Account number", "Lacagta"],
                types: ["text", "number"],
                placeholders: ["Geli account number", "Tusaale: 20"],
                action: "U dir account",
                kind: "account"
            }
        };

        renderForm(configs[number]);
    }

    function renderForm(config) {
        const form = document.createElement("form");
        form.id = "serviceForm";

        config.labels.forEach((label, index) => {
            const lbl = document.createElement("label");
            lbl.textContent = label;

            const input = document.createElement("input");
            input.type = config.types[index];
            input.placeholder = config.placeholders[index];
            input.required = true;

            if (input.type === "number") {
                input.min = "0.01";
                input.step = "0.01";
            }

            input.name = "field" + index;
            lbl.appendChild(input);
            form.appendChild(lbl);
        });

        const submit = document.createElement("button");
        submit.type = "submit";
        submit.className = "main-btn";
        submit.textContent = config.action;
        form.appendChild(submit);

        form.onsubmit = function(event) {
            event.preventDefault();

            const values = [...form.querySelectorAll("input")]
                .map(input => input.value.trim());

            const amount = Number(values[values.length - 1]);

            if (!Number.isFinite(amount) || amount <= 0) {
                message("Geli lacag sax ah.", true);
                return;
            }

            if (config.kind === "deposit") {
                balance += amount;
                transactions.push("Waxaad dhigatay $" + amount.toFixed(2));
                message("Waxaad akoonka demo ku dartay $" +
                    amount.toFixed(2) + ". Haraaga cusub: $" +
                    balance.toFixed(2));
                return;
            }

            if (amount > balance) {
                message("Haraagaagu kuma filna. Haraaga: $" +
                    balance.toFixed(2), true);
                return;
            }

            balance -= amount;

            const recipient = values[0];

            const descriptions = {
                airtime: "Waxaad kaar hadal ugu shubtay ",
                send: "Waxaad lacag u dirtay ",
                internet: "Waxaad internet ugu shubtay ",
                bill: "Waxaad bixisay biilka ",
                withdraw: "Waxaad lacag la baxday ",
                merchant: "Waxaad lacag siisay ganacsi ",
                account: "Waxaad lacag u dirtay account "
            };

            const target = ["withdraw"].includes(config.kind)
                ? ""
                : recipient + " lacag dhan ";

            const description = descriptions[config.kind] +
                target + "$" + amount.toFixed(2);

            transactions.push(description);
            
            if (config.kind === "send" ||
                config.kind === "account" ||
                config.kind === "merchant") {
                lastSent = description;
            }

            message("Guul! " + description +
                ". Haraaga cusub: $" + balance.toFixed(2));
        };

        $("serviceContent").appendChild(form);
    }

    function renderRefund() {
        const p = document.createElement("p");
        p.textContent = "Geli lambarka tixraaca ee macaamilka demo.";
        $("serviceContent").appendChild(p);

        const form = document.createElement("form");
        form.id = "serviceForm";

        const input = document.createElement("input");
        input.placeholder = "Tixraaca macaamilka";
        input.required = true;
        input.name = "reference";
        form.appendChild(input);

        const btn = document.createElement("button");
        btn.className = "main-btn";
        btn.textContent = "Hubi lacag soo celinta";
        form.appendChild(btn);

        form.onsubmit = event => {
            event.preventDefault();
            const ref = input.value.trim();
            const exists = transactions.some(t => t.includes(ref));

            message(exists
                ? "Codsigaaga demo waa la helay. Xaqiijin dheeraad ah ayaa loo baahan yahay."
                : "Tixraacan lagama helin macaamillada demo.", !exists);
        };

        $("serviceContent").appendChild(form);
    }

    function renderBlock() {
        const p = document.createElement("p");
        p.textContent = "Geli lambarka aad rabto inaad iska celiso.";
        $("serviceContent").appendChild(p);

        const form = document.createElement("form");
        form.id = "serviceForm";

        const input = document.createElement("input");
        input.placeholder = "Lambarka telefoonka";
        input.required = true;
        input.type = "tel";
        form.appendChild(input);

        const btn = document.createElement("button");
        btn.className = "main-btn";
        btn.textContent = "Iska celi lambarka";
        form.appendChild(btn);

        form.onsubmit = event => {
            event.preventDefault();
            const number = input.value.trim();

            if (blockedNumbers.includes(number)) {
                message("Lambarkan horay ayaa loo iska celiyey.", true);
            } else {
                blockedNumbers.push(number);
                message("Lambarka " + number +
                    " waxaa lagu daray liiska iska celinta demo.");
            }
        };

        $("serviceContent").appendChild(form);
    }

    function renderAccountSettings() {
        const options = [
            ["1", "Beddel PIN-ka"],
            ["2", "Tus macaamillada demo"],
            ["3", "Tus liiska lambarrada la iska celiyey"]
        ];

        options.forEach(([number, title]) => {
            const btn = document.createElement("button");
            btn.className = "main-btn";
            btn.textContent = number + ". " + title;

            btn.onclick = () => {
                $("result").innerHTML = "";

                if (number === "1") {
                    renderChangePin();
                } else if (number === "2") {
                    message(transactions.length
                        ? transactions.join(" | ")
                        : "Weli macaamil ma jiro.");
                } else {
                    message(blockedNumbers.length
                        ? blockedNumbers.join(", ")
                        : "Weli lambar lama iska celin.");
                }
            };

            $("serviceContent").appendChild(btn);
        });
    }

    function renderChangePin() {
        $("serviceContent").innerHTML = "";

        const form = document.createElement("form");
        form.id = "serviceForm";

        const oldPin = document.createElement("input");
        oldPin.type = "password";
        oldPin.placeholder = "PIN-kii hore";
        oldPin.required = true;

        const newPin = document.createElement("input");
        newPin.type = "password";
        newPin.placeholder = "PIN cusub (4 lambar)";
        newPin.required = true;
        newPin.pattern = "[0-9]{4}";
        newPin.title = "Geli 4 lambar";

        const btn = document.createElement("button");
        btn.className = "main-btn";
        btn.textContent = "Beddel PIN";

        form.append(oldPin, newPin, btn);

        form.onsubmit = event => {
            event.preventDefault();

            if (oldPin.value !== currentPin) {
                message("PIN-kii hore waa khalad.", true);
                return;
            }

            currentPin = newPin.value;
            message("PIN-ka demo si guul leh ayaa loo beddelay.");
            form.reset();
        };

        $("serviceContent").appendChild(form);
    }

    let currentPin = "8989";