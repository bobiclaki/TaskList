const express = require('express');
const app = express();
const { Server } = require('socket.io');
const path = require('path');

const PORT = process.argv[2] ? process.argv[2] : 1002;

let Tasks = []

app.use('/', express.static(path.join(__dirname, '/tasks')))
app.use('/edit', express.static(path.join(__dirname, '/edit')))

const server = app.listen(PORT, () => {
    console.log(`TASK LIST: http://localhost:${PORT}`);
})

const generateID = () => Array.apply(null, Array(8)).map(function() { 
    let c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return c.charAt(Math.random() * c.length);
}).join('');

const io = new Server(server);
io.on('connection', socket => {

    console.log(`connect user: ${socket.id}`);

    socket.emit('task:loadTasks', Tasks);

    socket.on('task:create', content => {
        console.log(content);
        let task = { id: generateID(), content, date: Date.now() }
        Tasks.push(task);
        io.emit('task:add', task);
    })

})