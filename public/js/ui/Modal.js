/**
 * Класс Modal отвечает за
 * управление всплывающими окнами.
 * В первую очередь это открытие или
 * закрытие имеющихся окон
 * */
class Modal {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) throw new Error("Отсутствует элемент модального окна");
    this.element = element;
    this.messageOutputElement = document.createElement('output');
    this.messagePanel = this.getMessagePanel();
    this.bindClose = this.onClose.bind(this);
    this.registerEvents();
  }

  /**
   * При нажатии на элемент с data-dismiss="modal"
   * должен закрыть текущее окно
   * (с помощью метода Modal.onClose)
   * */
  registerEvents() {
    this.element.querySelectorAll('[data-dismiss="modal"]').forEach((value) => value.addEventListener('click', this.bindClose));
  }

  /**
   * Срабатывает после нажатия на элементы, закрывающие окно.
   * Закрывает текущее окно (Modal.close())
   * */
  onClose(e) {
    this.close();
  }

  /**
   * Удаляет обработчики событий
   * */
  unregisterEvents() {
    this.element.querySelectorAll('[data-dismiss="modal"]').forEach((value) => value.removeEventListener('click', this.bindClose));
  }

  /**
   * Открывает окно: устанавливает CSS-свойство display
   * со значением «block»
   * */
  open() {
    this.element.style.display = 'block';
    this.element.querySelector('form').reset();
    this.messagePanel.style.display = 'none';
  }

  /**
   * Закрывает окно: удаляет CSS-свойство display
   * */
  close() {
    this.element.style.display = 'none';
  }

  /**
   * Создает панель вывода сообщений
   * */
  getMessagePanel() {
    const messagePanelElement = document.createElement('div');
    messagePanelElement.classList.add('modal-message');
    this.messageOutputElement.style.color = '#ff0000';
    this.messageOutputElement.style.textAlign = 'center';
    this.messageOutputElement.style.padding = '10px';
    this.messageOutputElement.style.marginTop = '10px';
    this.messageOutputElement.style.backgroundColor = '#ffffff';
    this.messageOutputElement.style.border = '1px solid red';
    this.messageOutputElement.style.borderRadius = '4px';
    messagePanelElement.appendChild(this.messageOutputElement);
    this.element.querySelector('.modal-dialog').appendChild(messagePanelElement);
    return messagePanelElement;
  }

  /**
   * Отображает на 5 секунд панель вывода сообщений с заданным текстом
   * */
  setMessage(message) {
    this.messageOutputElement.textContent = message;
    this.messagePanel.style.display = 'block';
    setTimeout(() => {
      this.messageOutputElement.textContent = '';
      this.messagePanel.style.display = 'none';
    }, 5000);
  }
}
