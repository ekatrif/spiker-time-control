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
      e.target.classList.add("select-team__item_active");
      employeesList.innerHTML += `<div class="employees__teamlead"><div class="employees__teamlead__name">${data.teams[i].teamlead.fullName}</div><div class="employees__teamlead__position">${data.teams[i].teamlead.position}</div></div>`;
      employeesList.innerHTML += `<div class="employees__list">`;
      for (let j = 0; j < data.teams[i].colleagues.length; j++) {
        employeesList.innerHTML += `<div class="employees__list__item">${data.teams[i].colleagues[j].fullName}</div`;
      }
      employeesList.innerHTML += `<div class="employees__list">`;
    }
  }
}
