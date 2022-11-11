const f = async () => {
    const res = await fetch("https://reqres.in/api/users");
    return await res.json();
  }
  
  const submitForm = async (e) => {
    //e.preventDefault();
    const arr = await f();
    //console.log('arr=>', arr.data)
    var InputEmail = document.getElementById("email").value;
    var pass = document.getElementById("password").value;
    let data = arr?.data.filter(element => element.email === InputEmail)
    if (data.length>0 && pass === '12345') {
      alert("login done!");
      return true;
    }
    else {
      alert("login failed");
      return false;
    }
  
  };

  const taskInput = document.querySelector(".taskInput input");
  const filters = document.querySelectorAll(".filters span");
  const clearAll = document.querySelector(".deleteBtn");
  const taskBox = document.querySelector(".taskBox");
  const addBtn=document.querySelector(".add");

  //console.log(taskBox);
  let editId,
  isEditTask = false,
  toDos = JSON.parse(localStorage.getItem("todo-list"));
  
  filters.forEach(btn => {
      btn.addEventListener("click", () => {
          document.querySelector("span.active").classList.remove("active");
          btn.classList.add("active");
          showTodo(btn.id);
      });
  });
  
  function showTodo(filter) {
      let listItems= "";
      if(toDos) {
          toDos.forEach((todo, id) => {
              let completed = todo.status == "finished" ? "checked" : "";
              if(filter == todo.status || filter == "all") {
                  listItems += `<li class="task">
                              <label for="${id}">
                                  <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                  <p class="${completed}">${todo.name}</p>
                              </label>
                              <div class="settings">
                                  <ul class="task-menu">
                                      <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                      <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                  </ul>
                              </div>
                          </li>`;
              }
          });
      }
      taskBox.innerHTML = listItems || `<span>You Don't Have Any Task Available</span>`;
      let checkTask = taskBox.querySelectorAll(".task");
      !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
      taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
  }
  showTodo("all");
  
 
  
  function updateStatus(selectedTask) {
      let taskName = selectedTask.parentElement.lastElementChild;
      if(selectedTask.checked) {
          taskName.classList.add("checked");
          toDos[selectedTask.id].status = "finished";
      } else {
          taskName.classList.remove("checked");
          toDos[selectedTask.id].status = "pending";
      }
      localStorage.setItem("todo-list", JSON.stringify(toDos))
  }
  
  function editTask(taskId, textName) {
      editId = taskId;
      isEditTask = true;
      taskInput.value = textName;
      taskInput.focus();
      taskInput.classList.add("active");
  }
  
  function deleteTask(deleteId, filter) {
      isEditTask = false;
      toDos.splice(deleteId, 1);
      localStorage.setItem("todo-list", JSON.stringify(toDos));
      showTodo(filter);
  }
  
  clearAll.addEventListener("click", () => {
      isEditTask = false;
      toDos.splice(0, toDos.length);
      localStorage.setItem("todo-list", JSON.stringify(toDos));
      showTodo()
  });
  
  addBtn.addEventListener('click',function(e){
    e.preventDefault();
    let userTask=taskInput.value.trim();
    if(userTask)
    {
      if(!isEditTask) {
        toDos = !toDos ? [] : toDos;
        let taskInfo = {name: userTask, status: "pending"};
        toDos.push(taskInfo);
    } else {
        isEditTask = false;
        toDos[editId].name = userTask;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(toDos));
    showTodo(document.querySelector("span.active").id);

    }
  });