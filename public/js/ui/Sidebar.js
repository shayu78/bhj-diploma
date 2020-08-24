/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const sideBarMiniElement = document.querySelector('.sidebar-mini');
    document.querySelector('.sidebar-toggle').addEventListener('click', (event) => {
      event.preventDefault();
      ['sidebar-open', 'sidebar-collapse'].forEach((value) => sideBarMiniElement.classList.toggle(value));
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регистрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    document.querySelector('.menu-item_register').addEventListener('click', (event) => {
      event.preventDefault();
      App.getModal('register').open();
    });

    document.querySelector('.menu-item_logout').addEventListener('click', (event) => {
      event.preventDefault();
      User.logout({}, (err, response) => {
        if (response) {
          if (response.success) App.setState('init');
          else alert(response.error);
        } else if (err) alert(err.message);
      });
    });

    document.querySelector('.menu-item_login').addEventListener('click', (event) => {
      event.preventDefault();
      App.getModal('login').open();
    });
  }
}
