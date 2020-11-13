"user strict";
/*

   ОСОБЕННОСТИ
После регистрации нового пользователя его список избранного пустой.
В избранное можно добавить пользователя с любым id, но перевести деньги 
можно только существующему пользователю.
У дефолтных пользователей oleg@demo.ru, ivan@demo.ru и petr@demo.ru в избранном 
присутствуют существующие пользователи, между которыми можно переводить деньги.
Для полной реализации личного кабинета необходимо реализовать следующие фичи:


ВЫХОД ИЗ ЛИЧНОГО КАБИНЕТА
Создайте объект класса LogoutButton. В свойство action запишите функцию, 
которая будет вызывать запрос деавторизации (logout). В колбек запроса
добавьте проверку: если запрос выполнился успешно, то обновите страницу (с помощью location.reload();).
*/
const logoutButton = new LogoutButton();
logoutButton.action = function() {
   ApiConnector.logout(checkLogout);
}
  function checkLogout(response) {
    if (response.success) {
      location.reload();
    }
        
  }
  /*
  ПОЛУЧЕНИЕ ИНФОРМАЦИИ О ПОЛЬЗОВАТЕЛЕ
Выполните запрос на получение текущего пользователя (current), в колбеке которого проверьте ответ: 
если ответ успешный, то вызовите метод отображения данных профиля (ProfileWidget.showProfile) 
в который передавайте данные ответа от сервера.
*/
ApiConnector.current(checkCurrent);

  function checkCurrent(response) {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
    }     
}
/*
  ПОЛУЧЕНИЕ ТЕКУЩИХ КУРСОВ ВАЛЮТ
  - Создайте объект типа RatesBoard.
  - Напишите функцию, которая будет выполнять запрос получения курсов валют.
  - В случае успешного запроса, очищайте таблицу с данными (clearTable) и заполняйте её (fillTable) полученными данными.
  - Вызовите данную функцию для получения текущих валют.
  - Напишите интервал, который будет многократно выполняться (раз в минуту) и вызывать вашу функцию с получением валют.
  */
const ratesBoard = new RatesBoard();

  ratesBoard.getTheExchangeRate = function() {
    ApiConnector.getStocks(response => {
      if (response.success) {
        ratesBoard.clearTable();
        ratesBoard.fillTable(response.data);
      }
    })
  }
  ratesBoard.getTheExchangeRate()
  setInterval(ratesBoard.getTheExchangeRate, 60000);
 
/*
  ОПЕРАЦИИ С ДЕНЬГАМИ
1. Создайте объект типа MoneyManager

2. Реализуйте пополнение баланса:
- Запишите в свойство addMoneyCallback функцию, которая будет выполнять запрос.
- Внутри функции выполните запрос на пополнение баланса (addMoney).
- Используйте аргумент функции свойства addMoneyCallback для передачи данных data в запрос.
- После выполнения запроса выполните проверку успешности запроса.
- В случае успешного запроса отобразите в профиле новые данные о пользователе 
  из данных ответа от сервера (showProfile).
- Также выведите сообщение об успехе или ошибку (причину неудачного действия) пополнении 
  баланса в окне отображения сообщения (setMessage).
*/
const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = data => ApiConnector.addMoney(data, checkAddMoney);

  function checkAddMoney(response) { 
    if(response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, "Пополнение баланса прошло успешно!");                    
    } else {    
      moneyManager.setMessage(response.success, response.error);    //Ошибку присылает сервер!
      }                                          
  }
/*
3. Реализуйте конвертирование валюты:
- Запишите в свойство conversionMoneyCallback функцию, которая будет выполнять запрос.
- Внутри функции выполните запрос на пополнение баланса (convertMoney)
- Используйте аргумент функции свойства conversionMoneyCallback для передачи данных в запрос.
- Повторите пункты 2.4-2.7
*/

moneyManager.conversionMoneyCallback = data => ApiConnector.convertMoney(data, checkConvertMoney);

  function checkConvertMoney(response) {
    if(response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, "Конвертирование валюты прошло успешно!"); 
    } else {
      moneyManager.setMessage(response.success, response.error);     // Ошибку присылает сервер!
      }                                          
  }

/*
4. Реализуйте перевод валюты:
- Запишите в свойство sendMoneyCallback функцию, которая будет выполнять запрос.
- Внутри функции выполните запрос на пополнение баланса (transferMoney).
- Используйте аргумент функции свойства sendMoneyCallback для передачи данных в запрос.
- Повторите пункты 2.4-2.7
*/

moneyManager.sendMoneyCallback = data => ApiConnector.transferMoney(data, checkTransferMoney);
  function checkTransferMoney(response) {
    if(response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.updateUsersList(response.data);
      moneyManager.setMessage(response.success, "Перевод валюты выполнен успешно!");     
    } else {
      moneyManager.setMessage(response.success, response.error);   // Ошибку присылает сервер!
      }                                       
  }

/*
 РАБОТА С ИЗБРАННЫМ
1. Создайте объект типа FavoritesWidget

2. Запросите начальный список избранного:
- Выполните запрос на получение списка избранного (getFavorites).
- В колбеке запроса проверяйте успешность запроса.
- При успешном запросе очистите текущий список избранного (clearTable).
- Отрисуйте полученные данные (fillTable).
- Заполните выпадающий список для перевода денег (updateUsersList).
 */

const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites(checkGetFavorites);

function checkGetFavorites(response) {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  } 
}
/*
3. Реализуйте добавления пользователя в список избранных:
- Запишите в свойство addUserCallback функцию, которая будет выполнять запрос.
- Внутри функции выполните запрос на добавление пользователя (addUserToFavorites).
- Используйте аргумент функции свойства addUserCallback для передачи данных пользователя в запрос.
- После выполнения запроса выполните проверку успешности запроса.
- В случае успеха запроса выполните пункты 2.3-2.5
- Также выведите сообщение об успехе или ошибку (причину неудачного действия) добавлении 
  пользователя в окне отображения сообщения (setMessage).
*/

favoritesWidget.addUserCallback = data => ApiConnector.addUserToFavorites(data, checkAddUserToFavorites);

function checkAddUserToFavorites(response) {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
    favoritesWidget.setMessage(response.success, "Пользователь добавлен в список избранных!");
  } else {
      favoritesWidget.setMessage(response.success, response.error); // Ошибку присылает сервер!
    }
}

/*
4. Реализуйте удаление пользователя из избранного
- Запишите в свойство removeUserCallback функцию, которая будет выполнять запрос.
- Внутри функции выполните запрос на удаление пользователя (removeUserFromFavorites).
- Используйте аргумент функции свойства removeUserCallback для передачи данных пользователя в запрос.
- После запроса выполните пункты 3.4-3.6
*/

favoritesWidget.removeUserCallback = data => ApiConnector.removeUserFromFavorites(data, checkRemoveUserFromFavorites);

  function checkRemoveUserFromFavorites(response) {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(response.success, "Пользователь удален из списка избранных!");
    } else {
        favoritesWidget.setMessage(response.success, response.error); // Ошибку присылает сервер!
      }
  }

