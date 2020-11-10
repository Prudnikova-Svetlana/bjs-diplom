"use strict";

const userNewForm = new UserForm();

userNewForm.loginFormCallback = data => ApiConnector.login(data, checkLogin);

function checkLogin(response) {
  if (response.success) { // если успешно прошел запрос на сервер
    location.reload(); // страницу обновляем
  } else {
    userNewForm.setLoginErrorMessage(response.error); // иначе ошибка выводится
  }
}

userNewForm.registerFormCallback = data => ApiConnector.register(data, checkRegister);

function checkRegister(response) {
  if (response.success) {
      location.reload();
  } else {
      userNewForm.setRegisterErrorMessage(response.error);
  }
}


  // setLoginErrorMessage(message) — выводит сообщение с ошибкой при авторизации

 // setRegisterErrorMessage(message) — выводит сообщение с ошибкой при регистрации

 // объект data (объект, который содержит логин и пароль, введённые в форму, 
// и который будет передаваться внутри loginFormAction).
 //loginFormAction() — обработчик события сабмита формы авторизации
   
 // registerFormAction() — обработчик события сабмита формы регистрации
  
 // getData(form) — метод получения данных из переданной формы
  
/*
В классе UserForm актуальными свойствами будут использоваться:
1.   loginFormCallback — функция, которая будет выполняться при попытке авторизации
2.   registerFormCallback — функция, которая будет выполняться при попытке регистрации
UserForm

Свойства
loginForm — объект формы авторизации
registerForm — объект формы регистрации
loginErrorMessageBox — объект окна вывода сообщений на странице авторизации
registerErrorMessageBox — объект окна вывода сообщений на странице регистрации

loginFormCallback — функция, которая будет выполняться при попытке авторизации
registerFormCallback — функция, которая будет выполняться при попытке регистрации
*/