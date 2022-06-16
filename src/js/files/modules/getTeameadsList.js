let inputSelectGroup = document.getElementById("select-team");

let employeesList = document.getElementById("employeesList");

let teamList = document.getElementById("team-list");

let employeeCard = document.getElementById("employee-card");

let jsonUrl = "https://ekatrif.github.io/spiker-time-control/src/team.json";

inputSelectGroup.innerHTML = "<input  type='text' placeholder='Выбор группы'/>";

const timeForPersonDefault = 1 * 60000; //5 минут на сотрудника
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
      console.log("Данные получены");
      //Получаем список команд
      getTeamList(jsonData);
      return jsonData;
    }
  } catch (error) {
    teamList.innerHTML = "Данные не получены :(";
    if (error.message === "Код ответа сервера не 200-299.") {
      throw error;
    } else throw new Error("Данные не получены");
  }
}

inputSelectGroup.addEventListener("click", function () {
  getJson(jsonUrl);
});

function getTeamList(data) {
  teamList.innerHTML = ``;
  for (let i = 0; i < data.teams.length; i++) {
    teamList.innerHTML += `<div class="select-team__item">${data.teams[i].orgName}</div`;
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
      //Сохраняем номер выбранной команды
      showTotalTime(jsonData, i);
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
      employeesListContainer.innerHTML += `<div class="employees__list__title">Команда:</div>`;

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
function getTotalTime(json, number) {
  const numberOfEmployees = json.teams[number].colleagues.length;
  console.log(number);
  return (timeForPersonDefault * numberOfEmployees) / 60000;
}
function showTotalTime(json, teamNumber) {
  let container = document.querySelector("h2");
  container.innerHTML = ``;
  container.innerHTML += `Запланированное время встречи: ${getTotalTime(
    json,
    teamNumber
  )} мин.`;
}

function manageEmployees() {
  let employeesContainer = document.getElementById("employees");
  console.log(employeesContainer);
  employeesContainer.addEventListener("click", addTimer);
  function addTimer(e) {
    if (e.target.classList.contains("employees__list__body__item")) {
      addActiveClass(e);
      showTimer();
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

function showTimer() {
  //Вывод таймера
  let timer = document.getElementById("timer");
  let timerTemplate = `<div class="timer"><div class="timer__title">Таймер</div> <div class="timer__time time"><div class="time__container"><div id="mins" class="time__container__body">${minsDefault}</div><div class="time__container__title">Минут</div></div><div class="time__container"><div id="secs" class="time__container__body">${secsDefault}</div><div class="time__container__title">Секунд</div></div></div><div class="timer__buttons"><div id="start" class="button button_start">Старт</div><div id="pause" class="button button_pause">Пауза</div><div id="reset" class="button button_reset">Сброс</div></div></div>`;
  timer.innerHTML = timerTemplate;
  let activeUser = document.querySelector(
    ".employees__list__body__item_active"
  ).textContent;
  console.log(activeUser);
  let isSaved = false;
  let isPaused = true;

  // document.getElementById("start").addEventListener("click", function () {
  let timeToEnd;

  let timerId = window.setInterval(function () {
    if (!isPaused) {
      let mins = Math.floor(timeToEnd / 60000);
      let secs = (timeToEnd - mins * 60000) / 1000;
      document.getElementById("mins").innerText = mins;
      document.getElementById("secs").innerText = secs;

      timeToEnd -= 1000;
      if (timeToEnd < 0) {
        setTimeout(() => {
          clearInterval(timerId);
          timer.innerHTML = `Время истекло`;
        });
      }
    }
  }, 1000);
  // });

  document.getElementById("pause").addEventListener("click", function () {
    isPaused = true;
    console.log(isPaused, "Пауза");
    let activeUser = document.querySelector(
      ".employees__list__body__item_active"
    ).innerText;
    console.log(activeUser);
    localStorage.setItem(`${activeUser}`, timeToEnd);
    isSaved = true;
  });
  //Продолжить
  document.getElementById("start").addEventListener("click", function () {
    isPaused = false;

    if (isSaved) {
      timeToEnd = localStorage.getItem(activeUser);
      console.log("after save", timeToEnd);
    } else {
      timeToEnd = timeForPersonDefault;
      console.log(isPaused, "Продолжить");
    }
  });
  //Сброс
  document.getElementById("reset").addEventListener("click", function () {
    isSaved = false;
    console.log("Сброс");
    document.getElementById("mins").innerText = minsDefault;
    document.getElementById("secs").innerText = secsDefault;
  });
}
