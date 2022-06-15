let employeesList = document.getElementById("employeesList");

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
