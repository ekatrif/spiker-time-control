let employeesList = document.getElementById("employeesList");

let teamList = document.getElementById("team-list");

const jsonUrl = "https://ekatrif.github.io/spiker-time-control/src/team.json"; //url json с данными о командах
const timeForPersonDefaultSec = 5; //время на выступление 1 сотрудника, сек
const timeForPersonDefaultMsec = timeForPersonDefaultSec * 60000; //время на выступление 1 сотрудника, мсек
const timeAlarmSec = 30; //за сколько cекунд до конца времени показать предупреждение
const timeAlarmMsec = timeAlarmSec * 1000; //перевод в миллисекунды
const minsDefault = Math.floor(timeForPersonDefaultMsec / 60000); //выделяем минуты
const secsDefault = (timeForPersonDefaultMsec - minsDefault * 60000) / 1000; //выделяем секунды

///////////Блок функций
//Получаем данные о командах и сразу записываем их в переменную
let jsonData;
async function getJson(url) {
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error("Код ответа сервера не 200-299.");
    } else {
      jsonData = await response.json();
      //Выводим список команд
      getTeamList(jsonData);
    }
  } catch (error) {
    teamList.innerHTML = "Данные не получены :(";
    if (error.message === "Код ответа сервера не 200-299.") {
      throw error;
    } else throw new Error("Данные не получены");
  }
}

//Вывод списка команд
function getTeamList(data) {
  teamList.innerHTML = ``;
  if (data.teams.length) {
    for (let i = 0; i < data.teams.length; i++) {
      teamList.innerHTML += `<div class="select-team__item">${data.teams[i].orgName}</div`;
    }
  } else {
    teamList.innerHTML = "Данные не получены :(";
  }
}

//Подсвечивает активного сотрудника
function addActiveClass(e) {
  let employees = document.querySelectorAll(".employees__list__body__item");
  for (let item of [...employees]) {
    item.classList.remove("employees__list__body__item_active");
  }

  e.target.classList.add("employees__list__body__item_active");
}

//Показываем списки команд и сотрудников
function showTeamsAndEmployees() {
  //Показываем сотрудников
  let employees = document.querySelectorAll(".employees__list__body__item");
  for (let item of [...employees]) {
    item.setAttribute("style", "display:block");
  }
  //Показываем команды
  let teams = document.querySelectorAll(".select-team__item");
  for (let item of [...teams]) {
    item.setAttribute("style", "display:block");
  }
}
//Скрываем команды
function hideTeams() {
  let teams = document.querySelectorAll(".select-team__item");
  for (let item of [...teams]) {
    if (!item.classList.contains("select-team__item_active")) {
      item.setAttribute("style", "display:none");
    }
  }
}
//Скрываем всех спикеров кроме выбранного
function hideEmployees(e) {
  let employees = document.querySelectorAll(".employees__list__body__item");
  for (let item of [...employees]) {
    if (e.target.textContent !== item.textContent) {
      item.setAttribute("style", "display:none");
    }
  }
}
//Вывод таймера
function showTimer(e) {
  let activeUser = document.querySelector(
    ".employees__list__body__item_active"
  ).textContent;
  let timeToEnd;
  let mins;
  let secs;
  let minsForm;
  let secsForm;
  let timerMessage;
  //Если данные о таймере конкетного сотрудника уже были сохранены (нажималась пауза)
  if (
    localStorage.getItem(activeUser) &&
    localStorage.getItem(activeUser) > 0
  ) {
    timeToEnd = localStorage.getItem(activeUser); //Получаем данные об оставшемся времени
  } else {
    timeToEnd = timeForPersonDefaultMsec; //Берем время из настроек
  }
  mins = Math.floor(timeToEnd / 60000);
  secs = (timeToEnd - mins * 60000) / 1000;
  minsForm = getCorrectForm(mins); //Получаем правильное окончание для минут
  secsForm = getCorrectForm(secs); //Получаем правильное окончание для секунд
  timerMessage = "Оставшееся время";
  let timer = document.getElementById("timer");
  let timerTemplate = `<div class="timer"><div id="timer-message" class="timer__title">${timerMessage}</div> <div class="timer__time time"><div class="time__container"><div id="mins" class="time__container__body">${mins}</div><div id="minsForm" class="time__container__title">Минут${minsForm}</div></div><div class="time__container"><div id="secs" class="time__container__body">${secs}</div><div id="secsForm" class="time__container__title">Секунд${secsForm}</div></div></div><div class="timer__buttons"><div id="start" class="button button__start">Старт</div><div id="pause" class="button button__pause">Пауза</div><div id="reset" class="button button__reset">Сброс</div></div></div>`;
  timer.innerHTML = timerTemplate;
  let isPaused = true; //Флаг, стоит ли таймер на паузе
  //Запускаем таймер
  let timerId = window.setInterval(function () {
    if (!isPaused) {
      //Если таймер не на паузе, то он меняет минуты и секунды
      let mins = Math.floor(timeToEnd / 60000);
      let secs = (timeToEnd - mins * 60000) / 1000;
      let minsForm = getCorrectForm(mins);
      let secsForm = getCorrectForm(secs);
      document.getElementById("mins").innerText = mins;
      document.getElementById("secs").innerText = secs;
      document.getElementById("minsForm").innerText = `Минут${minsForm}`;
      document.getElementById("secsForm").innerText = `Секунд${secsForm}`;
      //Если время подходит к концу, показывается предупреждение
      if (timeToEnd <= timeAlarmMsec) {
        document.getElementById("timer-message").innerText =
          "Время заканчивается";
        document
          .getElementById("mins")
          .classList.add("time__container__body_alarm");
        document
          .getElementById("secs")
          .classList.add("time__container__body_alarm");
      }
      //Шаг таймера 1с
      timeToEnd -= 1000;
      //Если время заканчивается
      if (timeToEnd < 0) {
        setTimeout(() => {
          //Таймер обнуляется
          clearInterval(timerId);
          //Выводится сообщение
          document.getElementById("timer-message").innerText = "Время истекло";
          //Показываем команды и сотрудников
          showTeamsAndEmployees();
        });
      }
    }
  }, 1000);
  // });

  //Пауза таймера
  document.getElementById("pause").addEventListener("click", function () {
    //Меняем заголовок
    document.getElementById("employees-title").textContent = "Команда";
    document.getElementById("start").classList.remove("button__start_disable");
    document.getElementById("pause").classList.add("button__pause_disable");
    isPaused = true;
    //Записываем текущее состояние таймера
    localStorage.setItem(`${activeUser}`, timeToEnd);
    //Показываем команды и сотрудников
    showTeamsAndEmployees();
  });

  //Продолжить отсчет таймера (кнопка Старт)
  document.getElementById("start").addEventListener("click", function () {
    //Меняем за головок на Спикер
    document.getElementById("employees-title").textContent = "Спикер";
    //Скрываем всех спикеров кроме выбранного
    hideEmployees(e);
    //Скрываем команды
    hideTeams();
    isPaused = false;
    document.getElementById("start").classList.add("button__start_disable");
    document.getElementById("pause").classList.remove("button__pause_disable");
    //Если есть сохраненный таймер, продолжаем отсчет по нему
    if (
      localStorage.getItem(activeUser) &&
      localStorage.getItem(activeUser) > 0
    ) {
      timeToEnd = localStorage.getItem(activeUser);
    }
    //Иначе отсчитываем от времени из настроек
    else {
      timeToEnd = timeForPersonDefaultMsec;
    }
  });

  //Сброс таймера
  document.getElementById("reset").addEventListener("click", function () {
    //Меняем заголовок
    document.getElementById("employees-title").textContent = "Команда";
    document.getElementById("start").classList.remove("button__start_disable");
    document.getElementById("pause").classList.remove("button__pause_disable");
    isPaused = true;
    document.getElementById("mins").innerText = minsDefault;
    document.getElementById("secs").innerText = secsDefault;
    document.getElementById("minsForm").innerText = `Минут${getCorrectForm(
      minsDefault
    )}`;
    document.getElementById("secsForm").innerText = `Секунд${getCorrectForm(
      secsDefault
    )}`;
    //Сброс сохраненного значения таймера
    localStorage.setItem(`${activeUser}`, 0);
    document
      .getElementById("mins")
      .classList.remove("time__container__body_alarm");
    document
      .getElementById("secs")
      .classList.remove("time__container__body_alarm");
    document.getElementById("timer-message").innerText = "Оставшееся время";
    //Показываем всех спикеров и команды
    showTeamsAndEmployees();
  });
}

//Передаем правильную форму окончания слов минута и секунда в зависимости от числа
function getCorrectForm(number) {
  let letter;
  if (number >= 11 && number <= 14) {
    letter = "";
  } else if (number % 10 === 1) {
    letter = "а";
  } else if (number % 10 >= 2 && number % 10 <= 4) {
    letter = "ы";
  } else {
    letter = "";
  }
  return letter;
}

///////////Блок функций

//По клику загружаем данные с сервера
let inputSelectGroup = document.getElementById("select-team");
inputSelectGroup.innerHTML = "<input  type='text' placeholder='Выбор группы'/>";
inputSelectGroup.addEventListener("click", function () {
  getJson(jsonUrl);
});

//По клику на команде выводим тимлида и список сотрудников
teamList.addEventListener("click", (e) => getEmployeesList(jsonData, e));
function getEmployeesList(data, e) {
  employeesList.innerHTML = ``;
  let teamleads = teamList.querySelectorAll(".select-team__item");
  //Снимаем выделение у всех элементов списка команд
  for (let item of [...teamleads]) {
    item.classList.remove("select-team__item_active");
  }
  //Выделяем кликнутую команду
  for (let i = 0; i < data.teams.length; i++) {
    if (e.target.textContent === data.teams[i].orgName) {
      e.target.classList.add("select-team__item_active");
      //Отображаем данные тимлида
      employeesList.innerHTML += `<div class="employees__teamlead"><div class="employees__teamlead__name">${data.teams[i].teamlead.fullName}</div><div class="employees__teamlead__position">${data.teams[i].teamlead.position}</div></div>`;
      //Создаем контейнер для заголовка и списка сотрудников
      let divEmployeesList = document.createElement("div");
      divEmployeesList.setAttribute("class", "employees__list");
      employeesList.insertAdjacentElement("beforeend", divEmployeesList);
      let employeesListContainer =
        employeesList.querySelector(".employees__list");
      //Отображаем заголовок Команда
      employeesListContainer.innerHTML += `<div id="employees-title" class="employees__list__title">Команда:</div>`;
      //Контейнер для списка сотрудников
      let divEmployeeslistBody = document.createElement("div");
      divEmployeeslistBody.setAttribute("class", "employees__list__body");
      divEmployeeslistBody.setAttribute("id", "employees");
      employeesListContainer.insertAdjacentElement(
        "beforeend",
        divEmployeeslistBody
      );
      let employeesListBodyContainer = employeesList.querySelector(
        ".employees__list__body"
      );
      //Выводим сотрудников команды
      for (let j = 0; j < data.teams[i].colleagues.length; j++) {
        employeesListBodyContainer.innerHTML += `<div class="employees__list__body__item">${data.teams[i].colleagues[j].fullName}</div`;
      }
    }
  }
  let employeesContainer = document.getElementById("employees");
  employeesContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("employees__list__body__item")) {
      //Подсвечиваем выбранного сотрудника
      addActiveClass(e);
      //Пказываем таймер
      showTimer(e);
    }
  });
}

//Настройки
//По умолчанию блок с настройками скрыт
document.getElementById("popup").setAttribute("style", "display:none");

//По клику показываем/скрываем блок с настройками
document.getElementById("settings-icon").addEventListener("click", function () {
  if (
    document.getElementById("popup").getAttribute("style") === "display:flex"
  ) {
    document.getElementById("popup").classList.toggle("popup_visible");
    document.getElementById("popup").classList.toggle("popup_hidden");
    setTimeout(function () {
      document.getElementById("popup").setAttribute("style", "display:none");
    }, 500);
  } else {
    document.getElementById("popup").setAttribute("style", "display:flex");
    setTimeout(function () {
      document.getElementById("popup").classList.toggle("popup_hidden");
      document.getElementById("popup").classList.toggle("popup_visible");
    }, 0);
  }
});
