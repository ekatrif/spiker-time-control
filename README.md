# Приложение для контроля времени выступления группы разработчиков.

Ссылка на приложение: https://ekatrif.github.io/spiker-time-control/dist/

## Краткое описание работы приложения

Приложение предназначено для контроля времени выступления каждого члена команды разработчиков.

Данные о группах разработчиков (название группы,
ФИО тимлида, ФИО и должности разработчиков) подгружаются в формате JSON с сервера с помощью fetch, обрабатываются и выводятся на странице приложения. При выборе сотрудника появляется таймер с отведенным на выступление временем и кнопками управления таймером (старт, пауза, сброс). Когда до конца выступления остается 30с, отображается предупреждение об истечении времени.

В настройках приложениях руководитель команды может менять время, отведенное спикеру на выступление.

## Стек:
- Vue 2
- Bootstrap
- Axios
- Vue-cli
