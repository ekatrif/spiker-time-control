(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    let employeesList = document.getElementById("employeesList");
    let teamList = document.getElementById("team-list");
    const jsonUrl = "https://ekatrif.github.io/spiker-time-control/src/team.json";
    const timeForPersonDefaultMin = 5;
    const timeForPersonDefaultMsec = minsToMsecs(timeForPersonDefaultMin);
    const timeAlarmSec = 30;
    const timeAlarmMsec = 1e3 * timeAlarmSec;
    const minsDefault = Math.floor(timeForPersonDefaultMsec / 6e4);
    const secsDefault = (timeForPersonDefaultMsec - 6e4 * minsDefault) / 1e3;
    function minsToMsecs(number) {
        return 6e4 * number;
    }
    let jsonData;
    async function getJson(url) {
        try {
            let response = await fetch(url);
            if (!response.ok) throw new Error("Код ответа сервера не 200-299."); else {
                jsonData = await response.json();
                getTeamList(jsonData);
            }
        } catch (error) {
            teamList.innerHTML = "Данные не получены :(";
            if ("Код ответа сервера не 200-299." === error.message) throw error; else throw new Error("Данные не получены");
        }
    }
    function getTeamList(data) {
        teamList.innerHTML = ``;
        if (data.teams.length) for (let i = 0; i < data.teams.length; i++) teamList.innerHTML += `<div class="select-team__item">${data.teams[i].orgName}</div`; else teamList.innerHTML = "Данные не получены :(";
    }
    function addActiveClass(e) {
        let employees = document.querySelectorAll(".employees__list__body__item");
        for (let item of [ ...employees ]) item.classList.remove("employees__list__body__item_active");
        e.target.classList.add("employees__list__body__item_active");
    }
    function showTeamsAndEmployees() {
        let employees = document.querySelectorAll(".employees__list__body__item");
        for (let item of [ ...employees ]) item.setAttribute("style", "display:block");
        let teams = document.querySelectorAll(".select-team__item");
        for (let item of [ ...teams ]) item.setAttribute("style", "display:block");
    }
    function hideTeams() {
        let teams = document.querySelectorAll(".select-team__item");
        for (let item of [ ...teams ]) if (!item.classList.contains("select-team__item_active")) item.setAttribute("style", "display:none");
    }
    function hideEmployees(e) {
        let employees = document.querySelectorAll(".employees__list__body__item");
        for (let item of [ ...employees ]) if (e.target.textContent !== item.textContent) item.setAttribute("style", "display:none");
    }
    function showTimer(e) {
        let activeUser = document.querySelector(".employees__list__body__item_active").textContent;
        let timeToEnd;
        let mins;
        let secs;
        let minsForm;
        let secsForm;
        let timerMessage;
        if (localStorage.getItem(activeUser) && localStorage.getItem(activeUser) > 0) timeToEnd = localStorage.getItem(activeUser); else if (localStorage.getItem("timeForPersonSaved")) timeToEnd = minsToMsecs(localStorage.getItem("timeForPersonSaved")); else timeToEnd = timeForPersonDefaultMsec;
        mins = Math.floor(timeToEnd / 6e4);
        secs = (timeToEnd - 6e4 * mins) / 1e3;
        minsForm = getCorrectForm(mins);
        secsForm = getCorrectForm(secs);
        timerMessage = "Оставшееся время";
        let timer = document.getElementById("timer");
        let timerTemplate = `<div class="timer"><div id="timer-message" class="timer__title">${timerMessage}</div> <div class="timer__time time"><div class="time__container"><div id="mins" class="time__container__body">${mins}</div><div id="minsForm" class="time__container__title">Минут${minsForm}</div></div><div class="time__container"><div id="secs" class="time__container__body">${secs}</div><div id="secsForm" class="time__container__title">Секунд${secsForm}</div></div></div><div class="timer__buttons"><div id="start" class="button button__start">Старт</div><div id="pause" class="button button__pause">Пауза</div><div id="reset" class="button button__reset">Сброс</div></div></div>`;
        timer.innerHTML = timerTemplate;
        let isPaused = true;
        let timerId = window.setInterval((function() {
            if (!isPaused) {
                let mins = Math.floor(timeToEnd / 6e4);
                let secs = (timeToEnd - 6e4 * mins) / 1e3;
                let minsForm = getCorrectForm(mins);
                let secsForm = getCorrectForm(secs);
                document.getElementById("mins").innerText = mins;
                document.getElementById("secs").innerText = secs;
                document.getElementById("minsForm").innerText = `Минут${minsForm}`;
                document.getElementById("secsForm").innerText = `Секунд${secsForm}`;
                if (timeToEnd <= timeAlarmMsec) {
                    document.getElementById("timer-message").innerText = "Время заканчивается";
                    document.getElementById("mins").classList.add("time__container__body_alarm");
                    document.getElementById("secs").classList.add("time__container__body_alarm");
                }
                timeToEnd -= 1e3;
                if (timeToEnd < 0) setTimeout((() => {
                    clearInterval(timerId);
                    document.getElementById("timer-message").innerText = "Время истекло";
                    showTeamsAndEmployees();
                }));
            }
        }), 1e3);
        document.getElementById("pause").addEventListener("click", (function() {
            document.getElementById("employees-title").textContent = "Команда";
            document.getElementById("start").classList.remove("button__start_disable");
            document.getElementById("pause").classList.add("button__pause_disable");
            isPaused = true;
            localStorage.setItem(`${activeUser}`, timeToEnd);
            showTeamsAndEmployees();
        }));
        document.getElementById("start").addEventListener("click", (function() {
            document.getElementById("employees-title").textContent = "Спикер";
            hideEmployees(e);
            hideTeams();
            isPaused = false;
            document.getElementById("start").classList.add("button__start_disable");
            document.getElementById("pause").classList.remove("button__pause_disable");
            if (localStorage.getItem(activeUser) && localStorage.getItem(activeUser) > 0) timeToEnd = localStorage.getItem(activeUser); else if (localStorage.getItem("timeForPersonSaved")) timeToEnd = minsToMsecs(localStorage.getItem("timeForPersonSaved")); else timeToEnd = timeForPersonDefaultMsec;
        }));
        document.getElementById("reset").addEventListener("click", (function() {
            document.getElementById("employees-title").textContent = "Команда";
            document.getElementById("start").classList.remove("button__start_disable");
            document.getElementById("pause").classList.remove("button__pause_disable");
            isPaused = true;
            if (localStorage.getItem("timeForPersonSaved")) {
                let savedTimeMins = localStorage.getItem("timeForPersonSaved");
                let mins = Math.floor(minsToMsecs(savedTimeMins) / 6e4);
                document.getElementById("mins").innerText = mins;
                document.getElementById("secs").innerText = (minsToMsecs(savedTimeMins) - 6e4 * mins) / 1e3;
            } else {
                document.getElementById("mins").innerText = minsDefault;
                document.getElementById("secs").innerText = secsDefault;
                ию;
            }
            document.getElementById("minsForm").innerText = `Минут${getCorrectForm(minsDefault)}`;
            document.getElementById("secsForm").innerText = `Секунд${getCorrectForm(secsDefault)}`;
            localStorage.setItem(`${activeUser}`, 0);
            document.getElementById("mins").classList.remove("time__container__body_alarm");
            document.getElementById("secs").classList.remove("time__container__body_alarm");
            document.getElementById("timer-message").innerText = "Оставшееся время";
            showTeamsAndEmployees();
        }));
    }
    function getCorrectForm(number) {
        let letter;
        if (number >= 11 && number <= 14) letter = ""; else if (number % 10 === 1) letter = "а"; else if (number % 10 >= 2 && number % 10 <= 4) letter = "ы"; else letter = "";
        return letter;
    }
    let inputSelectGroup = document.getElementById("select-team");
    inputSelectGroup.innerHTML = "<input  type='text' placeholder='Выбор группы'/>";
    inputSelectGroup.addEventListener("click", (function() {
        getJson(jsonUrl);
    }));
    teamList.addEventListener("click", (e => getEmployeesList(jsonData, e)));
    function getEmployeesList(data, e) {
        employeesList.innerHTML = ``;
        let teamleads = teamList.querySelectorAll(".select-team__item");
        for (let item of [ ...teamleads ]) item.classList.remove("select-team__item_active");
        for (let i = 0; i < data.teams.length; i++) if (e.target.textContent === data.teams[i].orgName) {
            e.target.classList.add("select-team__item_active");
            employeesList.innerHTML += `<div class="employees__teamlead"><div class="employees__teamlead__name">${data.teams[i].teamlead.fullName}</div><div class="employees__teamlead__position">${data.teams[i].teamlead.position}</div></div>`;
            let divEmployeesList = document.createElement("div");
            divEmployeesList.setAttribute("class", "employees__list");
            employeesList.insertAdjacentElement("beforeend", divEmployeesList);
            let employeesListContainer = employeesList.querySelector(".employees__list");
            employeesListContainer.innerHTML += `<div id="employees-title" class="employees__list__title">Команда:</div>`;
            let divEmployeeslistBody = document.createElement("div");
            divEmployeeslistBody.setAttribute("class", "employees__list__body");
            divEmployeeslistBody.setAttribute("id", "employees");
            employeesListContainer.insertAdjacentElement("beforeend", divEmployeeslistBody);
            let employeesListBodyContainer = employeesList.querySelector(".employees__list__body");
            for (let j = 0; j < data.teams[i].colleagues.length; j++) employeesListBodyContainer.innerHTML += `<div class="employees__list__body__item">${data.teams[i].colleagues[j].fullName}</div`;
        }
        let employeesContainer = document.getElementById("employees");
        employeesContainer.addEventListener("click", (function(e) {
            if (e.target.classList.contains("employees__list__body__item")) {
                addActiveClass(e);
                showTimer(e);
            }
        }));
    }
    document.getElementById("popup").setAttribute("style", "display:none");
    document.getElementById("settings-icon").addEventListener("click", (function() {
        if ("display:flex" === document.getElementById("popup").getAttribute("style")) {
            document.getElementById("popup").classList.toggle("popup_visible");
            document.getElementById("popup").classList.toggle("popup_hidden");
            setTimeout((function() {
                document.getElementById("popup").setAttribute("style", "display:none");
            }), 500);
        } else {
            document.getElementById("popup").setAttribute("style", "display:flex");
            setTimeout((function() {
                document.getElementById("popup").classList.toggle("popup_hidden");
                document.getElementById("popup").classList.toggle("popup_visible");
            }), 500);
        }
    }));
    let input = document.getElementById("time-for-person");
    if (localStorage.getItem("timeForPersonSaved")) input.setAttribute("placeholder", localStorage.getItem("timeForPersonSaved")); else input.setAttribute("placeholder", timeForPersonDefaultMin);
    document.getElementById("button-ok").addEventListener("click", (function() {
        localStorage.setItem("timeForPersonSaved", input.value);
        document.getElementById("popup").classList.toggle("popup_visible");
        document.getElementById("popup").classList.toggle("popup_hidden");
        setTimeout((function() {
            document.getElementById("popup").setAttribute("style", "display:none");
        }), 500);
    }));
    document.getElementById("button-cancel").addEventListener("click", (function() {
        document.getElementById("popup").classList.toggle("popup_visible");
        document.getElementById("popup").classList.toggle("popup_hidden");
        setTimeout((function() {
            document.getElementById("popup").setAttribute("style", "display:none");
        }), 500);
    }));
    window["FLS"] = true;
    isWebp();
})();