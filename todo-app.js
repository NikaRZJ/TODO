(function () {
    // создаём и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    // создаём и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('from');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('forn-control');
        input.placeholder = 'Новое дело';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);
        // <form class="input-group mb-3">
        //     <input class="form-control" placeholder="Введите название нового дела">
        //         <div class="input-group-append">
        //             <button class="btn btn-primary">Добавить делоы</button>
        //         </div>
        // </form>

        return {
            form,
            input,
            button,
        };
    }

    // создаём и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name, done) {
        let item = document.createElement('li');
        // кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // устанавливаем стили для элемента списка, а также для размещения кнопок в его правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        if (done) {
            item.classList.toggle('list-group-item-success');
        }
        // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function addItem(todoItem, todoList, i, allTask, key) {
        // добавляем обработчики на кнопки
        todoItem.doneButton.addEventListener('click', function () {
            todoItem.item.classList.toggle('list-group-item-success');
            if (allTask[i].done) {
                allTask[i].done = false;
            } else {
                allTask[i].done = true;
            }
            localStorage.setItem(key, JSON.stringify(allTask));
        });
        todoItem.deleteButton.addEventListener('click', function () {
            if (confirm('Вы уверены?')) {
                allTask.splice(i, 1);
                localStorage.setItem(key, JSON.stringify(allTask));
                todoItem.item.remove();
            }
        });

    }

    function createTodoApp(container, title = 'Список дел', arr, key) {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        todoItemForm.button.disabled = true;

        todoItemForm.input.addEventListener('input', function () {
            todoItemForm.button.disabled = (todoItemForm.input.value === '');
        })

        let allTask = JSON.parse(localStorage.getItem(key));
        if (typeof arr === "object") {
            allTask.push(arr);
        }

        if (allTask === null) {
            allTask = [];
        } else {
            for (let i = 0; i < allTask.length; i++) {
                let todoItem = createTodoItem(allTask[i].name, allTask[i].done);
                addItem(todoItem, todoList, i, allTask, key);
                todoList.append(todoItem.item);
            }
        }

        // браузер создаёт событие submit на форме по нажатию Enter или на кнопку создания дела
        todoItemForm.button.addEventListener('click', function (e) {
            if (todoItemForm.input.value != '') {

                // эта строчка необходима, чтобы предотвратить стандартные действия браузера
                // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
                e.preventDefault();

                // игнорируем создание элемента, если пользователь ничего не ввёл в поле
                if (!todoItemForm.input.value) {
                    return;
                }
                let task = {
                    name: todoItemForm.input.value,
                    done: false,
                }

                allTask.push(task);
                let todoItem = createTodoItem(task.name, task.done);
                addItem(todoItem, todoList, allTask.length - 1, allTask, key);
                localStorage.setItem(key, JSON.stringify(allTask));

                // создаём и добавляем в список новое дело с названием из поля для ввода
                todoList.append(todoItem.item);

                // обнуляем значение в поле, чтобы не пришлось стирать его вручную
                todoItemForm.input.value = '';
                this.disabled = true;
            }
        });
    }
    window.createTodoApp = createTodoApp;
})();
