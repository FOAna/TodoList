let tasks = [];

async function CreateTask(i) {
  const li = document.createElement("li");
  li.classList.add("checkbox");
  const input = document.createElement("input");
  input.classList.add("checkbox__input");
  input.setAttribute("id", tasks[i].id);
  input.setAttribute("type", "checkbox");
  const label = document.createElement("label");
  label.classList.add("checkbox__label");
  label.setAttribute("for", tasks[i].id);
  label.innerText = tasks[i].content;
  const imgEditor = document.createElement("img");
  imgEditor.classList.add("checkbox__editor");
  imgEditor.src = `${DJANGO_STATIC_URL}/static/images/pencil.png`;
  const imgRemove = document.createElement("img");
  imgRemove.classList.add("checkbox__remove");
  imgRemove.src = `${DJANGO_STATIC_URL}/static/images/close.svg`;
  const imgContainer = document.createElement("div");
  imgContainer.classList.add("checkbox__container");
  const taskContainer = document.createElement("div");
  taskContainer.classList.add("checkbox__container");
  // добавление ребёнка элементу
  taskContainer.appendChild(input);
  taskContainer.appendChild(label);
  imgContainer.appendChild(imgEditor);
  imgContainer.appendChild(imgRemove);
  li.appendChild(taskContainer);
  li.appendChild(imgContainer);
  const parent = document.getElementById("todoList");
  parent.insertBefore(li, parent.children[i]);

  /* change - один из вариантов действий, на который мы вешаем слушатель (addEventListener), он слушает и на каждый change элемента
    вызывает функцию, которую мы передали слушателю*/
  document.getElementById(tasks[i].id).addEventListener("change", function () {
    const task = document.getElementById(tasks[i].id);
    if (task.checked) {
      task.parentElement.style.textDecoration = "line-through";
    } else {
      task.parentElement.style.textDecoration = "none";
    }
  });

  // Функция-обработчик события клика
  imgRemove.onclick = async function () {
    await fetch(`http://127.0.0.1:8000/todo/delete/${tasks[i].id}`);
    tasks.splice[(i, 1)];
    li.remove();
    getAllTasks();
  };

  imgEditor.onclick = function () {
    const parent = li.parentElement;
    CreateEditedTask(i, parent);
    li.remove();
  };
}

async function CreateEditedTask(i, parent) {
  if (i >= tasks.length) {
    tasks.push({ id: `${i} New element`, content: "" });
  }
  const newLi = document.createElement("li");
  newLi.classList.add("checkbox");
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.value = tasks[i].content;
  const imgCheck = document.createElement("img");
  imgCheck.classList.add("checkbox__save");
  imgCheck.src = `${DJANGO_STATIC_URL}/static/images/check.svg`;
  // сохранение новой задачи
  imgCheck.onclick = async function () {
    if (tasks[i].content) {
      await fetch(
        `http://127.0.0.1:8000/todo/edit/${tasks[i].id}/${textInput.value}`,
        {
          method: "POST",
          headers: {
            "X-CSRFToken": csrftoken,
          },
        }
      );
    } else {
      await fetch(`http://127.0.0.1:8000/todo/create/${textInput.value}/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrftoken,
        },
      });
    }
    tasks[i].content = textInput.value;
    newLi.remove();
    CreateTask(i);
    getAllTasks();
  };
  newLi.appendChild(textInput);
  newLi.appendChild(imgCheck);
  parent.insertBefore(newLi, parent.children[i]); // в parent вставляем newLi перед (выше слой) parent.children[i]
}

document
  .getElementById("removeAll")
  .addEventListener("click", async function () {
    tasks = [];
    const list = document.getElementById("todoList");
    while (list.firstChild) {
      list.removeChild(list.lastChild);
    }
    await fetch("http://127.0.0.1:8000/todo/delete_all_todo/");
    getAllTasks();
  });

document.getElementById("addNewTask").addEventListener("click", function () {
  const parent = document.getElementById("todoList");
  CreateEditedTask(tasks.length, parent);
  console.log(tasks.length);
});

async function getAllTasks() {
  tasks = [];
  const list = document.getElementById("todoList");
  while (list.firstChild) {
    list.removeChild(list.lastChild);
  }
  await fetch("http://127.0.0.1:8000/todo/all_user_data")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const dataArray = JSON.parse(data);
      tasks = dataArray.map((item) => {
        return { id: item.pk, content: item.fields.todo_title };
      });
      for (let i = 0; i < tasks.length; i++) {
        CreateTask(i);
      }
    });
}

getAllTasks();
