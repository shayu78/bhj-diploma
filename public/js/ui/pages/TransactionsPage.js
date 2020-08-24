/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) throw new Error("Нет элемента виджета");
    this.element = element;
    this.lastOptions = '';
    this.transactionsContentElement = document.querySelector('.content');
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    document.querySelector('.remove-account').addEventListener('click', (event) => this.removeAccount());
    this.transactionsContentElement.addEventListener('click', (event) => {
      const transactionRemove = event.target.closest('.transaction__remove');
      if (transactionRemove) this.removeTransaction(transactionRemove.dataset.id);
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.update()
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      if (window.confirm("Вы действительно хотите удалить счёт?")) {
        Account.remove(this.lastOptions.account_id, this.lastOptions, (err, response) => {
          if (response) {
            if (response.success) {
              this.clear();
              App.update();
            } else alert(response.error);
          } else if (err) alert(err.message);
        });
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update()
   * */
  removeTransaction(id) {
    if (window.confirm("Вы действительно хотите удалить эту транзакцию?")) {
      Transaction.remove(id, {}, (err, response) => {
        if (response) {
          if (response.success) {
            App.update();
          } else alert(response.error);
        } else if (err) alert(err.message);
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (options) {
      this.lastOptions = options;
      Account.get(options.account_id, options, (err, response) => {
        if (response) {
          if (response.success) {
            this.renderTitle(response.data.name);
          } else alert(response.error);
        } else if (err) alert(err.message);
      });
      Transaction.list(options, (err, response) => {
        if (response) {
          if (response.success) {
            this.renderTransactions(response.data);
          } else alert(response.error);
        } else if (err) alert(err.message);
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счёта");
    this.lastOptions = '';
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    document.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const dateTime = new Date(date);
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    const time_options = { hour: '2-digit', minute: '2-digit' };
    return `${dateTime.toLocaleDateString('ru-RU', options)} в ${dateTime.toLocaleTimeString('ru-RU', time_options)}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    let resultHTML = '';
    switch (item.type) {
      case 'EXPENSE': {
        resultHTML = '<div class="transaction transaction_expense row">';
        break;
      }
      case 'INCOME': {
        resultHTML = '<div class="transaction transaction_income row">';
        break;
      }
      default:
        return resultHTML;
    }
    return `${resultHTML}
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
      ${item.sum}
      <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>  
        </button>
    </div>
    </div>`;
  }

  /**
 * Формирует элемент транзакции (дохода или расхода).
 * item - объект с информацией о транзакции
 * */
  getTransactionElement(item) {
    const transactionElement = document.createElement('div');
    transactionElement.classList.add('transaction', 'row');
    switch (item.type) {
      case 'EXPENSE': {
        transactionElement.classList.add('transaction_expense');
        break;
      }
      case 'INCOME': {
        transactionElement.classList.add('transaction_income');
        break;
      }
      default:
        return transactionElement;
    }
    const transactionDetailsElement = document.createElement('div');
    transactionDetailsElement.classList.add('col-md-7', 'transaction__details');

    const transactionIconElement = document.createElement('div');
    transactionIconElement.classList.add('transaction__icon');
    const transactionIconSpanElement = document.createElement('span');
    transactionIconSpanElement.classList.add('fa', 'fa-money', 'fa-2x');
    transactionIconElement.appendChild(transactionIconSpanElement);

    const transactionInfoElement = document.createElement('div');
    transactionInfoElement.classList.add('transaction__info');
    const transactionTitleElement = document.createElement('h4');
    transactionTitleElement.classList.add('transaction__title');
    transactionTitleElement.appendChild(document.createTextNode(item.name));
    const transactionDateElement = document.createElement('div');
    transactionDateElement.classList.add('transaction__date');
    transactionDateElement.appendChild(document.createTextNode(this.formatDate(item.created_at)));
    transactionInfoElement.appendChild(transactionTitleElement);
    transactionInfoElement.appendChild(transactionDateElement);
    transactionDetailsElement.appendChild(transactionIconElement);
    transactionDetailsElement.appendChild(transactionInfoElement);

    const transactionSumElement = document.createElement('div');
    transactionSumElement.classList.add('col-md-3');
    const transactionSummElement = document.createElement('div');
    transactionSummElement.classList.add('transaction__summ');
    transactionSummElement.appendChild(document.createTextNode(item.sum));
    const currencySpanElement = document.createElement('span');
    currencySpanElement.classList.add('currency');
    currencySpanElement.appendChild(document.createTextNode('₽'));
    transactionSummElement.appendChild(currencySpanElement);
    transactionSumElement.appendChild(transactionSummElement);

    const transactionControlsElement = document.createElement('div');
    transactionControlsElement.classList.add('col-md-2', 'transaction__controls');
    const transactionRemoveButtonElement = document.createElement('button');
    transactionRemoveButtonElement.classList.add('btn', 'btn-danger', 'transaction__remove');
    transactionRemoveButtonElement.dataset.id = item.id;
    const idiomaticElement = document.createElement('i');
    idiomaticElement.classList.add('fa', 'fa-trash');
    transactionRemoveButtonElement.appendChild(idiomaticElement);
    transactionControlsElement.appendChild(transactionRemoveButtonElement);

    transactionElement.appendChild(transactionDetailsElement);
    transactionElement.appendChild(transactionSumElement);
    transactionElement.appendChild(transactionControlsElement);

    return transactionElement;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    // this.transactionsContentElement.innerHTML = data.sort((a, b) => {
    //   if (a.created_at < b.created_at) return -1;
    //   if (a.created_at > b.created_at) return 1;
    //   return 0;
    // }).reverse().map((value) => this.getTransactionHTML(value)).join('');

    while (this.transactionsContentElement.hasChildNodes()) this.transactionsContentElement.removeChild(this.transactionsContentElement.firstChild);
    const fragment = new DocumentFragment();
    data.sort((a, b) => {
      if (a.created_at < b.created_at) return -1;
      if (a.created_at > b.created_at) return 1;
      return 0;
    }).reverse().forEach((value) => fragment.appendChild(this.getTransactionElement(value)));
    this.transactionsContentElement.appendChild(fragment);
  }
}
