/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * Наследуется от AsyncForm
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.accountsSelect = element.querySelector('.accounts-select');
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const user = User.current();
    if (user) {
      Account.list(user, (err, response) => {
        while (this.accountsSelect.hasChildNodes()) this.accountsSelect.removeChild(this.accountsSelect.firstChild);
        if (response) {
          if (response.success) {
            response.data.forEach((item) => {
              const optionElement = document.createElement('option');
              optionElement.appendChild(document.createTextNode(item.name));
              optionElement.value = item.id;
              this.accountsSelect.appendChild(optionElement);
            });
          } else alert(response.error);
        } else if (err) alert(err.message);
      });
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(options) {
    let formName = '';
    let modalName = '';
    switch (this.element.id) {
      case 'new-income-form': {
        formName = 'createIncome';
        modalName = 'newIncome';
        break;
      }
      case 'new-expense-form': {
        formName = 'createExpense';
        modalName = 'newExpense';
        break;
      }
      default:
    }
    Transaction.create(options.data, (err, response) => {
      if (response) {
        if (response.success) {
          App.update();
          App.getForm(formName).reset();
          App.getModal(modalName).close();
        } else App.getModal(modalName).setMessage(response.error);
      } else if (err) App.getModal(modalName).setMessage(err.message);
    });
  }
}
