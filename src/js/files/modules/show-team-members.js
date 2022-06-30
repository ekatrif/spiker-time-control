import { teamList } from "./main.js";
import { jsonData } from "./get-json.js";
import { addActiveClass } from "./show-active-employee.js";
import { showTimer } from "./timer.js";
//По клику на команде выводим тимлида и список сотрудников
export function showTeamMembers() {
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
}
