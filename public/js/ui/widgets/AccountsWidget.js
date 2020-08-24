/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */
class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) throw new Error("Нет элемента виджета");
    this.element = element;
    this.accountPanelElement = document.querySelector('.accounts-panel');
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    document.querySelector('.create-account').addEventListener('click', (event) => {
      App.getModal('createAccount').open();
    });
    this.accountPanelElement.addEventListener('click', (event) => {
      const account = event.target.closest('.account');
      if (account) this.onSelectAccount(account);
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const user = User.current();
    if (user) {
      Account.list(user, (err, response) => {
        if (response) {
          if (response.success) {
            this.clear();
            response.data.forEach((value) => this.renderItem(value));
          }
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    document.querySelectorAll('.account').forEach((value) => value.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const activeAccountElement = this.accountPanelElement.querySelector('.active');
    element.classList.add('active');
    if (activeAccountElement) activeAccountElement.classList.remove('active');
    App.showPage('transactions', { account_id: `${element.dataset.id}` });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    return `<li class="account" data-id="${item.id}">
      <a href="#">
          <span>${item.name}</span> /
          <span>${item.sum} ₽</span>
      </a>
    </li>`;
  }

  /**
 * Возвращает элемент счёта для последующего
 * отображения в боковой колонке.
 * item - объект с данными о счёте
 * */
  getAccountElement(item) {
    const liElement = document.createElement('li');
    liElement.classList.add('account');
    liElement.dataset.id = item.id;
    const aElement = document.createElement('a');
    aElement.setAttribute('href', '#');
    const firstSpan = document.createElement('span');
    firstSpan.appendChild(document.createTextNode(item.name));
    const secondSpan = document.createElement('span');
    secondSpan.appendChild(document.createTextNode(`${item.sum} ₽`));
    aElement.appendChild(firstSpan);
    aElement.appendChild(document.createTextNode(' / '));
    aElement.appendChild(secondSpan);
    liElement.appendChild(aElement);
    return liElement;
  }

  /**
   * Получает информацию о счете.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(item) {
    // this.element.insertAdjacentHTML('beforeend', this.getAccountHTML(item));
    this.element.appendChild(this.getAccountElement(item));
  }
}
