const socket = io();

function addTask(task) {
    let newTask = document.createElement('li');
    newTask.innerHTML = `<li id="${task.id}">${task.content}</li>`;
    document.querySelector('.tasks').append(newTask);
}

socket.on('task:add', task => {
    addTask(task)
})

socket.on('task:loadTasks', tasks => {
    console.log(tasks);
    for (let task of tasks) addTask(task);
})