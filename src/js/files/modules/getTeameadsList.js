let inputSelectGroup = document.getElementById("select-team");

let employeesList = document.getElementById("employeesList");

let teamList = document.getElementById("team-list");

let employeeCard = document.getElementById("employee-card");

let jsonUrl = "https://ekatrif.github.io/spiker-time-control/src/team.json";

inputSelectGroup.innerHTML = "<input  type='text' placeholder='Выбор группы'/>";

//Получаем данные о командах ит сразу записываем их в переменную
let jsonData;
async function getJson(url) {
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error("Код ответа сервера не 200-299.");
    } else {
      jsonData = await response.json();
      console.log("Данные получены");
      return jsonData;
    }
  } catch (error) {
    if (error.message === "Код ответа сервера не 200-299.") {
      throw error;
    } else throw new Error("Данные не получены");
  }
}
getJson(jsonUrl);
//console.log(jsonData);

//Загружаем список команд
let listItems = inputSelectGroup.addEventListener("click", () =>
  getTeamList(jsonData)
);
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
}

//Таймер
const timeForPersonDefault = 300000; //5 минут на сотрудника
function getTotalTime(json, number) {
  const numberOfEmployees = json.teams[number].colleagues.length;
  //console.log(teamNumber);
  return timeForPersonDefault * numberOfEmployees;
}
function showTotalTime(json) {
  let container = document.querySelector("h2");
  container.innerText += getTotalTime(json, 1);
}
window.addEventListener("load", () => showTotalTime(jsonData));
