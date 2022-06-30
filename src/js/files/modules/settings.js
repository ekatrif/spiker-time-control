//Настройки
export function manageSettings() {
  //По умолчанию блок с настройками скрыт
  document.getElementById("popup").setAttribute("style", "display:none");

  //По клику показываем/скрываем блок с настройками
  document
    .getElementById("settings-icon")
    .addEventListener("click", function () {
      if (
        document.getElementById("popup").getAttribute("style") ===
        "display:flex"
      ) {
        document.getElementById("popup").classList.toggle("popup_visible");
        document.getElementById("popup").classList.toggle("popup_hidden");
        setTimeout(function () {
          document
            .getElementById("popup")
            .setAttribute("style", "display:none");
        }, 500);
      } else {
        document.getElementById("popup").setAttribute("style", "display:flex");
        setTimeout(function () {
          document.getElementById("popup").classList.toggle("popup_hidden");
          document.getElementById("popup").classList.toggle("popup_visible");
        }, 500);
      }
    });

  //Вставляем значение по умолчанию
  let input = document.getElementById("time-for-person");
  if (localStorage.getItem("timeForPersonSaved")) {
    input.setAttribute(
      "placeholder",
      localStorage.getItem("timeForPersonSaved")
    );
  } else {
    input.setAttribute("placeholder", timeForPersonDefaultMin);
  }

  //Кнопка OK
  document.getElementById("button-ok").addEventListener("click", function () {
    //Сохраняем настройки
    localStorage.setItem("timeForPersonSaved", input.value);

    //Закрываем окно настроек
    document.getElementById("popup").classList.toggle("popup_visible");
    document.getElementById("popup").classList.toggle("popup_hidden");
    setTimeout(function () {
      document.getElementById("popup").setAttribute("style", "display:none");
    }, 500);
  });
  //Кнопка Cancel
  document
    .getElementById("button-cancel")
    .addEventListener("click", function () {
      //Закрываем окно настроек
      document.getElementById("popup").classList.toggle("popup_visible");
      document.getElementById("popup").classList.toggle("popup_hidden");
      setTimeout(function () {
        document.getElementById("popup").setAttribute("style", "display:none");
      }, 500);
    });
}
