//Передаем правильную форму окончания слов минута и секунда в зависимости от числа
export function getCorrectForm(number) {
  let letter;
  if (number >= 11 && number <= 14) {
    letter = "";
  } else if (number % 10 === 1) {
    letter = "а";
  } else if (number % 10 >= 2 && number % 10 <= 4) {
    letter = "ы";
  } else {
    letter = "";
  }
  return letter;
}
