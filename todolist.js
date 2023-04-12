// Get Elements
var notyf = new Notyf({
    duration: 2000,
    position: {
        x: "right",
        y: "bottom",
    },
    dismissible: true,
});

let taskInput = document.querySelector(".todolist-input-add");

let addBtn = document.getElementsByTagName("button")[0];

let prioritizedTasksList = document.getElementById("prioritized-list-tasks");

let pendingTasksList = document.getElementById("pending-list-tasks");

let doneTasksList = document.getElementById("done-list-tasks");

let dashboardListName = document.getElementById("dashboard-info-list-name");

let dashboardListValue = document.getElementById("dashboard-info-done");

let deleteAll = document.querySelector('.dashboard-info-list-delete');

let overlay = document.getElementById("overlay");

let popup = document.getElementById("edit-popup");

let closeBtn = document.getElementById("close-button");

let saveBtn = document.getElementById("save-button");

let editInput = document.getElementById("edit-input");


// Create a task element
const createNewTask = ((task, completed, priority) => {
    // li
    let listItem = document.createElement("li");
    // input[checkbox]
    let checkbox = document.createElement("input")
    // label
    let label = document.createElement("label");
    //div
    let div_btn = document.createElement("div");
    let div_label = document.createElement("div");

    let prioritizedBtn = document.createElement("button");
    // button.edit
    let editBtn = document.createElement("button"); // xu ly sau
    // button.delete
    let deleteBtn = document.createElement("button");

    // get value for label

    label.innerText = task;
    // get type attributes for elements
    checkbox.type = "checkbox";

    // editInput.type = "text";

    prioritizedBtn.innerHTML = '<span class="icon_edit"><i class="fa-solid fa-star" style="color: #fff700;"</i></i></span>';
    prioritizedBtn.className = "todolist-btn-prioritized";

    editBtn.innerHTML = '<span class="icon_edit"><i class="fa-sharp fa-solid fa-pen-to-square"></i></span>';
    editBtn.className = "todolist-btn-edit";
    editBtn.setAttribute("data-task-id", pendingTasksList.querySelectorAll("li").length + 1);

    deleteBtn.innerHTML = '<span class="icon_edit"><i class="fa-sharp fa-solid fa-trash"></i></span>';
    deleteBtn.className = "todolist-btn-delete";

    //add class elements
    if (!completed) {
        listItem.classList = "pending-task";
        label.classList = "pending-task-name";
        checkbox.classList = "pending-task-checkbox"
        prioritizedBtn.classList.remove("hide");
    }
    else {
        listItem.classList = "done-task";
        label.classList = "done-task-name";
        checkbox.classList = "done-task-checkbox"
        prioritizedBtn.classList.add("hide");
    }

    div_label.classList = "todolist-container-label-task"
    div_btn.classList = "todolist-container-btn"
    //append to listItem
    div_label.appendChild(checkbox);
    div_label.appendChild(label);
    // listItem.appendChild(editInput);
    div_btn.appendChild(prioritizedBtn);
    div_btn.appendChild(editBtn);
    div_btn.appendChild(deleteBtn);

    listItem.appendChild(div_label);
    listItem.appendChild(div_btn);

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            pendingTasksList.removeChild(listItem);
            listItem.classList.remove("pending-task");
            listItem.querySelector('label').classList.remove("pending-task-name")
            listItem.classList.add("done-task");
            listItem.querySelector('label').classList.add("done-task-name")
            prioritizedBtn.classList.add("hide");
            if (listItem.classList.contains("pending-task-color")) {
                listItem.classList.remove("pending-task-color");
            }
            doneTasksList.appendChild(listItem);
            updateTasks();
        } else {
            doneTasksList.removeChild(listItem);
            listItem.classList.remove("done-task");
            listItem.querySelector('label').classList.remove("done-task-name")
            listItem.classList.add("pending-task");
            listItem.querySelector('label').classList.add("pending-task-name")
            prioritizedBtn.classList.remove("hide");
            pendingTasksList.appendChild(listItem);
            updateTasks();
        }
    });

    deleteBtn.addEventListener('click', () => {
        if (checkbox.checked) {
            doneTasksList.removeChild(listItem);
            updateTasks();
        }
        else {
            pendingTasksList.removeChild(listItem);
            updateTasks();
        }
    })

    prioritizedBtn.addEventListener('click', () => {
        let check = listItem.classList.contains("pending-task-color");
        if (check) {
            pendingTasksList.removeChild(listItem);
            listItem.classList.remove("pending-task-color")
            pendingTasksList.append(listItem);
        }
        else {
            pendingTasksList.removeChild(listItem);
            listItem.classList.add("pending-task-color");
            pendingTasksList.prepend(listItem);
        }
        updateTasks();
    })
    // let currentTask;
    editBtn.addEventListener('click', (event) => {
        const taskId = editBtn.getAttribute("data-task-id");
        popup.dataset.taskId = taskId;
        // show the overlay and editing popup
        overlay.style.display = "block";
        popup.style.display = "flex";
        // set the current task and input value
        editInput.value = listItem.querySelector("label").innerText;
    })

    closeBtn.addEventListener("click", (e) => {
        // hide the overlay and editing popup
        overlay.style.display = "none";
        popup.style.display = "none";
    });

    saveBtn.addEventListener("click", () => {
        const taskId = popup.dataset.taskId;
        // update the task label
        let saveEditBtn = document.querySelector(`[data-task-id="${taskId}"]`).parentElement.parentElement;
        overlay.style.display = "none";
        popup.style.display = "none";
        if (editInput.value !== "") {
            saveEditBtn.querySelector("label").innerText = editInput.value.trim();
            swal("Thành công, dữ liệu của bạn đã thay đổi", {
                icon: "success",
            });       
        }else{
            swal("Bạn chưa thay đổi dữ liệu nào", {
                icon: "info",
            });
        }

        updateTasks()

    });

    return listItem;
})

// add click event listener to the close button

// add click event listener to the save button
const updateTasks = () => {
    let tasks = [];
    for (const taskElement of pendingTasksList.children) {
        tasks.push({
            taskLabel: taskElement.innerText,
            completed: false,
            priority: false
        });
    }
    for (const taskElement of doneTasksList.children) {
        tasks.push({
            taskLabel: taskElement.innerText,
            completed: true,
            priority: false
        });
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    const dashboard = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem('tasks')) : [];
    dashboardListName.innerText = dashboard.length;
    dashboardListValue.innerText = dashboard.filter((task) => task.completed).length;
}

const addTask = () => {
    //Create new list item with value input
    if (taskInput.value === "") {
        notyf.error("Vui lòng nhập task vào input!!");
        return;
    }
    let listItem = createNewTask(taskInput.value);
    // Append listItem to pendingTaskLists
    pendingTasksList.appendChild(listItem);

    // Save to local storage
    let incompleteTask = {
        taskLabel: listItem.querySelector("label").innerText,
        completed: false,
        priority: false
    }

    let existingTasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];
    existingTasks.push(incompleteTask);
    localStorage.setItem("tasks", JSON.stringify(existingTasks));
    const dashboard = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem('tasks')) : [];
    dashboardListName.innerText = dashboard.length;
    dashboardListValue.innerText = dashboard.filter((task) => task.completed).length;
    taskInput.value = "";
}
//Handle Event Keypress: "Enter"
document.querySelector("#todolist-input-add").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const item = document.querySelector("#todolist-input-add")
        addTask(item)
    }
})
const displayTask = () => {
    const tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem('tasks')) : [];
    if (tasks) {
        // Convert savedTasks to an array
        tasks.forEach(task => {
            const listItemSaved = createNewTask(task.taskLabel, task.completed);
            
            if (task.completed) {
                doneTasksList.appendChild(listItemSaved);
                listItemSaved.querySelector('input[type="checkbox"]').checked = true;
            } else {
                pendingTasksList.appendChild(listItemSaved);
            }
        });
    }
    const dashboard = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem('tasks')) : [];
    dashboardListName.innerText = dashboard.length;
    dashboardListValue.innerText = dashboard.filter((task) => task.completed).length;
}
addBtn.addEventListener('click', () => {
    if (taskInput.classList.contains("todolist-input-add-hidden")) {
        taskInput.classList.remove("todolist-input-add-hidden")
        taskInput.classList.add("todolist-input-add")
    } else {
        addTask();
    }
})

// handle dashboard
const handleDeleteAll = () => {
    localStorage.removeItem("tasks");
    swal("Thành công, dữ liệu của bạn đã thay đổi", {
        icon: "success",
    });
    setTimeout(() => {
        location.reload()
    }, 2000)
}
deleteAll.addEventListener('click', () => {
    swal({
        title: "Bạn có chắc chắn muốn xóa toàn bộ task không?",
        text: "Khi đã xác nhận, bạn sẽ không thể khôi phục lại dữ liệu hiện tại!",
        icon: "warning",
        buttons: ["Hủy bỏ", "Xác nhận"],
        dangerMode: true,
    }).then((value) => {
        if (value) {
            handleDeleteAll()
        } else {
            swal("Dữ liệu của bạn không đổi!");
        }
        displayTask();
    });

})

//call function

//display status task
window.onload = function () {
    displayTask();
};
