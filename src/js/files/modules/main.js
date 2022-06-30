import { manageSettings } from "./settings.js";
import { getJson } from "./get-json.js";
import { minsToMsecs } from "./mins-to-msecs.js";
import { showTeamMembers } from "./show-team-members.js";

export const teamList = document.getElementById("team-list");
export const timeForPersonDefaultMsec = minsToMsecs(timeForPersonDefaultMin); //время на выступление 1 сотрудника, мсек
export const timeAlarmMsec = timeAlarmSec * 1000; //перевод в миллисекунды
export const minsDefault = Math.floor(timeForPersonDefaultMsec / 60000); //выделяем минуты
export const secsDefault =
  (timeForPersonDefaultMsec - minsDefault * 60000) / 1000; //выделяем секунды
export const plugText = "Нажмите на Паузу, чтобы выбрать другого спикера";

const jsonUrl = "https://ekatrif.github.io/spiker-time-control/src/team.json"; //url json с данными о командах
const timeForPersonDefaultMin = 5; //время на выступление 1 сотрудника, мин
const timeAlarmSec = 30; //за сколько cекунд до конца времени показать предупреждение

//По клику загружаем данные с сервера
let inputSelectGroup = document.getElementById("select-team");
inputSelectGroup.innerHTML = "<input  type='text' placeholder='Выбор группы'/>";
inputSelectGroup.addEventListener("click", function () {
  getJson(jsonUrl);
});

//Отображаем данные из json
showTeamMembers();

//Блок с настройками приложения
manageSettings();
