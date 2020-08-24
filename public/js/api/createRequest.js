'use strict';

/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();
  if (!options.hasOwnProperty('url') || !options.url) return xhr;
  if (!options.hasOwnProperty('data') || !options.data) options.data = {};
  if (!options.hasOwnProperty('method') || !options.method) return xhr;

  let sendBody = null;
  let requestURL = options.url;
  switch (options.method) {
    case 'GET': {
      requestURL += dataToURLQueryParams(options.data);
      break;
    }
    case 'POST': {
      sendBody = dataToFormData(options.data);
      break;
    }
    default: {
      return xhr;
    }
  }
  try {
    xhr.open(options.method, requestURL);
    if (options.hasOwnProperty('headers') && options.headers) setHeaders(options.headers);
    if (options.hasOwnProperty('responseType') && options.responseType) xhr.responseType = options.responseType;
    xhr.withCredentials = true;
    xhr.send(sendBody);
  }
  catch (exception) {
    options.callback(new Error(`Исключение: тип = ${exception.name}, текст = ${exception.message}`), null);
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState === xhr.DONE) {
      (xhr.status >= 200 && xhr.status < 400) ? options.callback(null, xhr.response) :
        options.callback(new Error(`Ошибка выполнения запроса на сервер: код = ${xhr.status}, текст = ${xhr.statusText}`), null);
    }
  };
  return xhr;

  function setHeaders(headers) {
    Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));
  }

  function dataToFormData(data) {
    const formData = new FormData;
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    return formData;
  }

  function dataToURLQueryParams(data) {
    let urlQueryParams = '';
    const dataArray = Object.entries(data);
    if (dataArray.length) urlQueryParams = '?' + dataArray.map(([key, value]) => `${key}=${value}`).join('&');
    return urlQueryParams;
  }
};
