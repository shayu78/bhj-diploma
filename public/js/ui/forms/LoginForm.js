/**
 * Класс LoginForm управляет формой
 * входа в портал
 * Наследуется от AsyncForm
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(options) {
    User.login(options.data, (err, response) => {
      if (response) {
        if (response.success) {
          App.setState('user-logged');
          App.getModal('login').close();
        } else App.getModal('login').setMessage(response.error);
      } else if (err) App.getModal('login').setMessage(err.message);
      App.getForm('login').reset();
    });
  }
}
