/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {
  static URL = '';

  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static list(data, callback = f => f) {
    const xhr = createRequest({
      url: this.URL,
      data,
      responseType: 'json',
      method: 'GET',
      callback
    });
    return xhr;
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер
   * (в зависимости от того, что наследуется от Entity)
   * */
  static create(data, callback = f => f) {
    const xhr = createRequest({
      url: this.URL,
      data: Object.assign(data, { _method: 'PUT' }),
      responseType: 'json',
      method: 'POST',
      callback
    });
    return xhr;
  }

  /**
   * Получает информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static get(id = '', data, callback = f => f) {
    const xhr = createRequest({
      url: `${this.URL}/${id}`,
      data,
      responseType: 'json',
      method: 'GET',
      callback
    });
    return xhr;
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(id = '', data, callback = f => f) {
    const xhr = createRequest({
      url: this.URL,
      data: Object.assign(data, { _method: 'DELETE', id }),
      responseType: 'json',
      method: 'POST',
      callback
    });
    return xhr;
  }
}
