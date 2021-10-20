const socket = io();

document.getElementById('.task-input').addEventListener('keyup', event => {
    if (event.keyCode === 13 && event.target.value.trim() !== '') {
        socket.emit('task:create', event.target.value);
        event.target.value = '';
    }
})