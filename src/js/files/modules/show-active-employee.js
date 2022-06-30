//Подсвечивает активного сотрудника
export function addActiveClass(e) {
  let employees = document.querySelectorAll(".employees__list__body__item");
  for (let item of [...employees]) {
    item.classList.remove("employees__list__body__item_active");
  }

  e.target.classList.add("employees__list__body__item_active");
}
