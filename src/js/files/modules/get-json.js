import { teamList } from "./main.js";
//Получаем данные о командах и сразу записываем их в переменную
export let jsonData;
export async function getJson(url) {
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error("Код ответа сервера не 200-299.");
    } else {
      jsonData = await response.json();
      //Выводим список команд
      teamList.innerHTML = ``;
      if (jsonData.teams.length) {
        for (let i = 0; i < jsonData.teams.length; i++) {
          teamList.innerHTML += `<div class="select-team__item">${jsonData.teams[i].orgName}</div`;
        }
      } else {
        teamList.innerHTML = "Что-то пошло не так :(";
      }
    }
  } catch (error) {
    teamList.innerHTML = "Данные не получены :(";
    if (error.message === "Код ответа сервера не 200-299.") {
      throw error;
    } else throw new Error(error);
  }
}
