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


  