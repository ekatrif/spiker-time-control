let inputSelectGroup = document.getElementById("select-team");

let employeesList = document.getElementById("employeesList");

let teamList = document.getElementById("team-list");

let employeeCard = document.getElementById("employee-card");

let jsonUrl = "https://ekatrif.github.io/spiker-time-control/src/team.json";

inputSelectGroup.innerHTML = "<input  type='text' placeholder='Выбор группы'/>";

const timeForPersonDefault = 1 * 60000; //5 минут на сотрудника
const timeAlarm = 30000; //за 30с до окончания времени
const minsDefault = Math.floor(timeForPersonDefault / 60000);
const secsDefault = (timeForPersonDefault - minsDefault * 60000) / 1000;
//Получаем данные о командах и сразу записываем их в переменную
let jsonData;
async function getJson(url) {
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error("Код ответа сервера не 200-299.");
    } else {
      jsonData = await response.json();
      //console.log("Данные получены");
      //Получаем список команд
      getTeamList(jsonData);
      // return jsonData;
    }
  } catch (error) {
    teamList.innerHTML = "Данные не получены :(";
    if (error.message === "Код ответа сервера не 200-299.") {
      throw error;
    } else throw new Error("Данные не получены");
  }
}

//Загружаем данные с сервера
inputSelectGroup.addEventListener("click", function () {
  getJson(jsonUrl);
});

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

//Загружаем тимлида и список сотрудников
teamList.addEventListener("click", (e) => getEmployeesList(jsonData, e));
function getEmployeesList(data, e) {
  employeesList.innerHTML = ``;

  let teamleads = teamList.querySelectorAll(".select-team__item");
  for (let item of [...teamleads]) {
    item.classList.remove("select-team__item_active");
  }

  for (let i = 0; i < data.teams.length; i++) {
    if (e.target.textContent === data.teams[i].orgName) {
      // //Сохраняем номер выбранной команды
      // showTotalTime(jsonData, i);
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
  manageEmployees();
}

//Таймер
//Расчет запланированного времени выступление всех спикеров группы
// function getTotalTime(json, number) {
//   const numberOfEmployees = json.teams[number].colleagues.length;
//   //console.log(number);
//   return (timeForPersonDefault * numberOfEmployees) / 60000;
// }
// function showTotalTime(json, teamNumber) {
//   let container = document.querySelector("h2");
//   container.innerHTML = ``;
//   container.innerHTML += `Запланированное время встречи: ${getTotalTime(
//     json,
//     teamNumber
//   )} мин.`;
// }

function manageEmployees() {
  let employeesContainer = document.getElementById("employees");
  console.log(employeesContainer);
  employeesContainer.addEventListener("click", addTimer);
  function addTimer(e) {
    if (e.target.classList.contains("employees__list__body__item")) {
      addActiveClass(e);
      showTimer(e);
    }
  }
}
function addActiveClass(e) {
  let employees = document.querySelectorAll(".employees__list__body__item");
  for (let item of [...employees]) {
    item.classList.remove("employees__list__body__item_active");
  }

  e.target.classList.add("employees__list__body__item_active");
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
  if (
    localStorage.getItem(activeUser) &&
    localStorage.getItem(activeUser) > 0
  ) {
    timeToEnd = localStorage.getItem(activeUser);
    //console.log("есть сохраненное время");
  } else {
    timeToEnd = timeForPersonDefault;
    //  console.log("нет сохраненного времени");
  }
  mins = Math.floor(timeToEnd / 60000);
  secs = (timeToEnd - mins * 60000) / 1000;
  minsForm = getCorrectForm(mins);
  secsForm = getCorrectForm(secs);
  timerMessage = "Оставшееся время";
  let timer = document.getElementById("timer");
  let timerTemplate = `<div class="timer"><div id="timer-message" class="timer__title">${timerMessage}</div> <div class="timer__time time"><div class="time__container"><div id="mins" class="time__container__body">${mins}</div><div id="minsForm" class="time__container__title">Минут${minsForm}</div></div><div class="time__container"><div id="secs" class="time__container__body">${secs}</div><div id="secsForm" class="time__container__title">Секунд${secsForm}</div></div></div><div class="timer__buttons"><div id="start" class="button button__start">Старт</div><div id="pause" class="button button__pause">Пауза</div><div id="reset" class="button button__reset">Сброс</div></div></div>`;
  timer.innerHTML = timerTemplate;

  // console.log(activeUser);

  let isSaved = false;
  let isPaused = true;

  let timerId = window.setInterval(function () {
    if (!isPaused) {
      let mins = Math.floor(timeToEnd / 60000);
      let secs = (timeToEnd - mins * 60000) / 1000;
      let minsForm = getCorrectForm(mins);
      let secsForm = getCorrectForm(secs);

      document.getElementById("mins").innerText = mins;
      document.getElementById("secs").innerText = secs;
      document.getElementById("minsForm").innerText = `Минут${minsForm}`;
      document.getElementById("secsForm").innerText = `Секунд${secsForm}`;
      if (timeToEnd <= timeAlarm) {
        document.getElementById("timer-message").innerText =
          "Время заканчивается";

        document
          .getElementById("mins")
          .classList.add("time__container__body_alarm");
        document
          .getElementById("secs")
          .classList.add("time__container__body_alarm");
      }
      timeToEnd -= 1000;

      if (timeToEnd < 0) {
        setTimeout(() => {
          clearInterval(timerId);

          document.getElementById("timer-message").innerText = "Время истекло";

          //Показываем всех спикеров - избавить от дублирования переменных!!!
          let employees = document.querySelectorAll(
            ".employees__list__body__item"
          );
          for (let item of [...employees]) {
            item.setAttribute("style", "display:block");
          }
          //Показываем команды
          let teams = document.querySelectorAll(".select-team__item");
          for (let item of [...teams]) {
            item.setAttribute("style", "display:block");
          }
        });
      }
    }
  }, 1000);
  // });

  //Пауза
  pauseTimer();
  function pauseTimer() {
    document.getElementById("pause").addEventListener("click", function () {
      //Меняем за головок
      document.getElementById("employees-title").textContent = "Команда";
      document
        .getElementById("start")
        .classList.remove("button__start_disable");
      document.getElementById("pause").classList.add("button__pause_disable");
      isPaused = true;
      console.log(isPaused, "Пауза");

      localStorage.setItem(`${activeUser}`, timeToEnd);
      isSaved = true;
      //Показываем всех спикеров - избавить от дублирования переменных!!!

      let employees = document.querySelectorAll(".employees__list__body__item");
      for (let item of [...employees]) {
        item.setAttribute("style", "display:block");
      }
      /////
      //Показываем команды
      let teams = document.querySelectorAll(".select-team__item");
      for (let item of [...teams]) {
        item.setAttribute("style", "display:block");
      }
    });
  }

  //Продолжить
  startTimer(e);
  function startTimer(e) {
    document.getElementById("start").addEventListener("click", function () {
      //Меняем за головок на Спикер
      document.getElementById("employees-title").textContent = "Спикер";

      //Скрываем всех спикеров кроме выранного
      let employees = document.querySelectorAll(".employees__list__body__item");
      for (let item of [...employees]) {
        if (e.target.textContent !== item.textContent) {
          item.setAttribute("style", "display:none");
        }
      }
      /////
      //Скрываем команды
      let teams = document.querySelectorAll(".select-team__item");
      for (let item of [...teams]) {
        if (!item.classList.contains("select-team__item_active")) {
          item.setAttribute("style", "display:none");
        }
      }
      isPaused = false;
      document.getElementById("start").classList.add("button__start_disable");
      document
        .getElementById("pause")
        .classList.remove("button__pause_disable");
      if (isSaved) {
        timeToEnd = localStorage.getItem(activeUser);
        console.log("after save", timeToEnd);
      } else {
        timeToEnd = timeForPersonDefault;
        console.log(isPaused, "Продолжить");
      }
    });
  }

  //Сброс
  reset();
  function reset() {
    document.getElementById("reset").addEventListener("click", function () {
      //Меняем за головок
      document.getElementById("employees-title").textContent = "Команда";
      document
        .getElementById("start")
        .classList.remove("button__start_disable");
      document
        .getElementById("pause")
        .classList.remove("button__pause_disable");
      isPaused = true;
      isSaved = false;
      console.log("Сброс");
      document.getElementById("mins").innerText = minsDefault;
      document.getElementById("secs").innerText = secsDefault;
      document.getElementById("minsForm").innerText = `Минут${getCorrectForm(
        minsDefault
      )}`;
      document.getElementById("secsForm").innerText = `Секунд${getCorrectForm(
        secsDefault
      )}`;

      localStorage.setItem(`${activeUser}`, 0);
      document
        .getElementById("mins")
        .classList.remove("time__container__body_alarm");
      document
        .getElementById("secs")
        .classList.remove("time__container__body_alarm");
      document.getElementById("timer-message").innerText = "Оставшееся время";
      //Показываем всех спикеров - избавить от дублирования переменных!!!
      let employees = document.querySelectorAll(".employees__list__body__item");
      for (let item of [...employees]) {
        item.setAttribute("style", "display:block");
      }
      //Показываем команды
      let teams = document.querySelectorAll(".select-team__item");
      for (let item of [...teams]) {
        item.setAttribute("style", "display:block");
      }
    });
  }

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
}

//Настройки
document.getElementById("settings-icon").addEventListener("click", function () {
  if (
    document.getElementById("popup").getAttribute("style") === "display:flex"
  ) {
    document.getElementById("popup").setAttribute("style", "display:none");
  } else {
    document.getElementById("popup").setAttribute("style", "display:flex");
  }
});
