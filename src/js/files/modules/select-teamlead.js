getJson("./team.json");

let selectTeamleadContainer = document.getElementById("select-teamlead");

let input = "<input type='text' placeholder='Выбор группы'/>";
selectTeamleadContainer.innerHTML = input;

//Получаем данные о командах
async function getJson(url) {
  let response = await fetch(url);
  let result = await response.json();
  console.log(result);
}

// sync function fetchMoviesJSON() {
//     const response = await fetch('/movies');
//     const movies = await response.json();
//     return movies;
//   }
//   fetchMoviesJSON().then(movies => {
//     movies; // fetched movies
//   });

//Прослушка клика на input
let listItems = selectTeamleadContainer.addEventListener(
  "click",
  getTeamleadList
);
function getTeamleadList() {}
