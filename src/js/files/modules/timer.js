import { getCorrectForm } from "./correct-form.js";
import {
  timeAlarmMsec,
  timeForPersonDefaultMsec,
  minsDefault,
  secsDefault,
  plugText,
} from "./main.js";
import { minsToMsecs } from "./mins-to-msecs.js";

//Вывод таймера
export function showTimer(e) {
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
    localStorage.getItem(activeUser) >= 0
  ) {
    timeToEnd = localStorage.getItem(activeUser); //Получаем данные об оставшемся времени
  } else if (localStorage.getItem("timeForPersonSaved")) {
    timeToEnd = minsToMsecs(localStorage.getItem("timeForPersonSaved")); //Берем время из сохраненных настроек
  } else {
    timeToEnd = timeForPersonDefaultMsec; //Берем время по умолчанию
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
          //Убираем заглушку на команды и членов команд, чтобы не ломать таймер
          let sections = document.getElementsByTagName("section");
          for (let i = 0; i < [...sections].length - 1; i++) {
            sections[i].classList.remove("plug");
          }
          //Убираем подсказку
          document
            .getElementsByTagName("body")[0]
            .removeAttribute("data-tooltip");

          //Меняем состояние кнопок
          document
            .getElementById("start")
            .classList.remove("button__start_disable");
          document
            .getElementById("pause")
            .classList.add("button__pause_disable");
          //Сброс сохраненного значения таймера
          localStorage.setItem(`${activeUser}`, 0);
          isPaused = true;
        });
      }
    }
  }, 1000);
  // });

  //Пауза таймера
  document.getElementById("pause").addEventListener("click", function () {
    //Убираем заглушку на команды и членов команд, чтобы не ломать таймер
    let sections = document.getElementsByTagName("section");
    for (let i = 0; i < [...sections].length - 1; i++) {
      sections[i].classList.remove("plug");
    }
    //Убираем подсказку
    document.getElementsByTagName("body")[0].removeAttribute("data-tooltip");

    //Меняем состояние кнопок
    document.getElementById("start").classList.remove("button__start_disable");
    document.getElementById("pause").classList.add("button__pause_disable");
    isPaused = true;
    //Записываем текущее состояние таймера
    if (timeToEnd < 0) {
      localStorage.setItem(activeUser, 0);
    } else {
      localStorage.setItem(activeUser, timeToEnd);
    }
  });

  //Начать/продолжить отсчет таймера (кнопка Старт)
  document.getElementById("start").addEventListener("click", function () {
    //Вешаем заглушку на команды и членов команд, чтобы не ломать таймер
    let sections = document.getElementsByTagName("section");
    for (let i = 0; i < [...sections].length - 1; i++) {
      sections[i].classList.add("plug");
    }
    //Добавляем подсказку
    document
      .getElementsByTagName("main")[0]
      .addEventListener("mouseover", function (e) {
        if (e.target.classList.contains("plug")) {
          document
            .getElementsByTagName("body")[0]
            .setAttribute("data-tooltip", plugText);
        }
      });
    //Убираем подсказку
    document
      .getElementsByTagName("main")[0]
      .addEventListener("mouseout", function (e) {
        if (e.target.classList.contains("plug")) {
          document
            .getElementsByTagName("body")[0]
            .removeAttribute("data-tooltip");
        }
      });

    isPaused = false;
    document.getElementById("start").classList.add("button__start_disable");
    document.getElementById("pause").classList.remove("button__pause_disable");
    //Если есть сохраненный таймер, продолжаем отсчет по нему
    if (
      (localStorage.getItem(activeUser) &&
        localStorage.getItem(activeUser) > 0) ||
      localStorage.getItem(activeUser) == 0 //Если время уже истекло
    ) {
      timeToEnd = localStorage.getItem(activeUser);
    }
    //Иначе отсчитываем от времени из настроек
    else {
      if (localStorage.getItem("timeForPersonSaved")) {
        timeToEnd = minsToMsecs(localStorage.getItem("timeForPersonSaved")); //Берем время из сохраненных настроек
      } else {
        timeToEnd = timeForPersonDefaultMsec; //Берем время по умолчанию
      }
    }
  });

  //Сброс таймера
  document.getElementById("reset").addEventListener("click", function () {
    //Убираем заглушку на команды и членов команд, чтобы не ломать таймер
    let sections = document.getElementsByTagName("section");
    for (let i = 0; i < [...sections].length - 1; i++) {
      sections[i].classList.remove("plug");
    }
    //Убираем подсказку
    document.getElementsByTagName("body")[0].removeAttribute("data-tooltip");
    //Меняем состояние кнопок
    document.getElementById("start").classList.remove("button__start_disable");
    document.getElementById("pause").classList.remove("button__pause_disable");
    isPaused = true;

    //Выводим сброшенные минуты и секунды таймера, используем либо время по умолчанию, либо сохраненное в настройках
    if (localStorage.getItem("timeForPersonSaved")) {
      //записываем новое время в localStorage
      localStorage.setItem(
        activeUser,
        minsToMsecs(localStorage.getItem("timeForPersonSaved"))
      );
      let savedTimeMins = localStorage.getItem("timeForPersonSaved");
      let mins = Math.floor(minsToMsecs(savedTimeMins) / 60000);
      let secs = (minsToMsecs(savedTimeMins) - mins * 60000) / 1000;
      document.getElementById("mins").innerText = mins;
      document.getElementById("secs").innerText = secs;

      //Выводим слови "минут", "секунд" в правильной форме
      document.getElementById("minsForm").innerText = `Минут${getCorrectForm(
        mins
      )}`;
      document.getElementById("secsForm").innerText = `Секунд${getCorrectForm(
        secs
      )}`;
    } else {
      //записываем время по умолчанию в localStorage
      localStorage.setItem(activeUser, timeForPersonDefaultMsec);
      document.getElementById("mins").innerText = minsDefault;
      document.getElementById("secs").innerText = secsDefault;
      //Выводим слови "минут", "секунд" в правильной форме
      document.getElementById("minsForm").innerText = `Минут${getCorrectForm(
        minsDefault
      )}`;
      document.getElementById("secsForm").innerText = `Секунд${getCorrectForm(
        secsDefault
      )}`;
    }

    //Убираем тревожные сообщения
    document
      .getElementById("mins")
      .classList.remove("time__container__body_alarm");
    document
      .getElementById("secs")
      .classList.remove("time__container__body_alarm");
    document.getElementById("timer-message").innerText = "Оставшееся время";
  });
}
