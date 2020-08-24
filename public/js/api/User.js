/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = '/user';

  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (exception) {
      console.log(`Исключение: тип = ${exception.name}, текст = ${exception.message}`);
    }
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem('user');
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    let user;
    try {
      user = JSON.parse(localStorage.getItem('user'));
      if (!user) user = undefined;
    } catch (exception) {
      user = undefined;
      console.log(`Исключение: тип = ${exception.name}, текст = ${exception.message}`);
    }
    return user;
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(data, callback = f => f) {
    const xhr = createRequest({
      url: this.URL + '/current',
      data,
      responseType: 'json',
      method: 'GET',
      callback: (err, response) => {
        if (response) {
          response.success ? this.setCurrent(response.user) : this.unsetCurrent();
        } else if (err) alert(err.message);
        callback(err, response);
      }
    });
    return xhr;
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback = f => f) {
    const xhr = createRequest({
      url: this.URL + '/login',
      data,
      responseType: 'json',
      method: 'POST',
      callback: (err, response) => {
        if (response) {
          response.success ? this.setCurrent(response.user) : this.unsetCurrent();
        } else if (err) alert(err.message);
        callback(err, response);
      }
    });
    return xhr;
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback = f => f) {
    const xhr = createRequest({
      url: this.URL + '/register',
      data,
      responseType: 'json',
      method: 'POST',
      callback: (err, response) => {
        if (response) {
          response.success ? this.setCurrent(response.user) : this.unsetCurrent();
        } else if (err) alert(err.message);
        callback(err, response);
      }
    });
    return xhr;
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(data, callback = f => f) {
    const xhr = createRequest({
      url: this.URL + '/logout',
      data,
      responseType: 'json',
      method: 'POST',
      callback: (err, response) => {
        if (response) {
          response.success ? this.unsetCurrent() : alert(response.error);
        } else if (err) alert(err.message);
        callback(err, response);
      }
    });
    return xhr;
  }
}
