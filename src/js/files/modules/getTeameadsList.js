let inputTeamleadContainer = document.getElementById("select-teamlead");

let employeesList = document.getElementById("employeesList");

let input = "<input type='text' placeholder='Выбор группы'/>";

let teamleadList = document.getElementById("teamlead-list");

let jsonUrl = "https://ekatrif.github.io/spiker-time-control/src/team.json";

let flagTeamleadsAdded = false;

inputTeamleadContainer.innerHTML = input;

//teamleadList.innerText = json;

//Получаем данные о командах
async function getJson(url) {
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error("Код ответа сервера не 200-299.");
    } else {
      let result = await response.json();
      return result;
    }
  } catch (error) {
    if (error.message === "Код ответа сервера не 200-299.") {
      throw error;
    } else throw new Error("Данные не получены");
  }
}

//Прослушка клика на input
let listItems = inputTeamleadContainer.addEventListener("click", () =>
  getTeamleadList(jsonUrl)
);

async function getTeamleadList(url) {
  if (!flagTeamleadsAdded) {
    getJson(url).then((data) => {
      for (let i = 0; i < data.teams.length; i++) {
        teamleadList.innerHTML += `<div>${data.teams[i].teamlead.fullName}</div`;
      }
    });
  }
  flagTeamleadsAdded = true;
}

teamleadList.addEventListener("click", (e) => getEmployeesList(jsonUrl, e));
async function getEmployeesList(url, e) {
  getJson(url).then((data) => {
    employeesList.innerHTML = ``;
    for (let i = 0; i < data.teams.length; i++) {
      if (e.target.textContent === data.teams[i].teamlead.fullName) {
        for (let j = 0; j < data.teams[i].colleagues.length; j++) {
          employeesList.innerHTML += `<div>${data.teams[i].colleagues[j].fullName}</div`;
        }
      }
    }
  });
}
