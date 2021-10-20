const socket = io();

let code = prompt('Введите пароль.', localStorage['code'] ? localStorage['code'] : '');
localStorage.setItem('code', code);

socket.emit('user:isCode', code)

socket.on('user:code', answer => {
    if (!answer) document.querySelector('body').innerHTML = '<div class="error">:O</div>'
})

function unix(unix = Date.now()) {
    const Months_name = [ "января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря" ];

    let date = new Date(unix),
        year = date.getFullYear(),
        day = date.getDate(),
        month = date.getMonth(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds();

    if (month < 10) month = `0${ month }`;
    if (day < 10) day = `0${ day }`;
    if (hours < 10) hours = `0${ hours }`;
    if (hours >= 24) hours = `0${ hours - new Number(24) }`;
    if (minutes < 10) minutes = `0${ minutes }`;
    if (minutes >= 60) minutes = `0${ minutes - new Number(60) }`;
    if (seconds < 10) seconds = `0${ seconds }`;
    if (seconds >= 60) seconds = `0${ seconds - new Number(60) }`;


    return {
        year      : year,
        day       : day,
        month     : month,
        month_name: Months_name[Number(month)],
        hours     : hours,
        minutes   : minutes,
        seconds   : seconds
    }
}

function addTask(task, before) {
    let time = unix(task.date);
    let newTask = document.createElement('li');
    newTask.className = `task`;
    newTask.id = task._id;
    newTask.innerHTML = `
${
    task.done ? '<div class="done">Выполнено</div>' : `
<ul class="menu">
    <li class="check" onclick="checkTask('${task._id}')">
        <i class="uil uil-check"></i>
    </li>
    <li class="edit" onclick="editTask('${task._id}')">
        <i class="uil uil-pen"></i>
    </li>
    <li class="delete" onclick="deleteTask('${task._id}')">
        <i class="uil uil-trash"></i>
    </li>
</ul>`
}
<div class="content">${task.content}</div>
<div class="date">${time.day} ${time.month_name} ${time.year} в ${time.hours}:${time.minutes}</div>`;
    document.querySelector('.tasks')[before ? 'prepend' : 'append'](newTask);
}

socket.on('task:add', task => addTask(task, true))

socket.on('task:loadTasks', tasks => {
    for (let task of tasks.sort((a, b) => (new Date(b.date) - new Date(a.date)) && (a.done - b.done))) addTask(task);
})

// * Functions

function checkTask(id) {
    socket.emit('task:reqCheck', id)
}

function editTask(id) {
    let text = document.getElementById(id).querySelector('.content').textContent
    let content = prompt('Введите текст задачи', text);
    socket.emit('task:reqEdit', { id, content })
}

function deleteTask(id) {
    socket.emit('task:reqDelete', id)
}

// *

socket.on('task:done', taskID => document.getElementById(taskID).classList.add('done'))

socket.on('task:update', newTask => {
    document.getElementById(newTask.id).querySelector('.content').textContent = newTask.content;
})

socket.on('task:delete', taskID => document.getElementById(taskID).remove())


document.querySelector('.bar input').addEventListener('keyup', event => {
    if (event.keyCode === 13 && event.target.value.trim() !== '') {
        socket.emit('task:create', event.target.value);
        event.target.value = '';
    }
})