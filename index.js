const express = require('express');
const app = express();
const { Server } = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 1002;
const password = process.env.PASSWORD;

// * MongoDB
const urlDB = process.env.URL_DB; // mongodb://<Username>:<Password>@<URL>/<db>

const { Task } = require('./config/schemes.js')

mongoose.connect(urlDB).then(() => {
    console.log(`Connect DB`)
});

let Tasks = mongoose.model('lists', Task);

app.use('/', express.static(path.join(__dirname, '/tasks')))

const server = app.listen(PORT, () => {
    console.log(`TASK LIST: http://localhost:${PORT}`);
})

const io = new Server(server);
io.on('connection', socket => {

    Tasks.find({}, (err, e) => {
        for (let task of e) if (!task.done) task['done'] = false;
        socket.emit('task:loadTasks', e);
    })

    socket.on('task:create', content => {
        console.log(content);
        let task = { content, date: Date.now() }
        let newTesk = new Tasks(task)
        newTesk.save();
        io.emit('task:add', task)
    })

    socket.on('task:reqEdit', async newTask => {
        await Tasks.updateOne({ _id: newTask.id }, { content: newTask.content });
        io.emit('task:update', newTask)
    })

    socket.on('task:reqCheck', async id => {
        await Tasks.updateOne({ _id: id }, { done: true });
        io.emit('task:done', id)
    })

    socket.on('task:reqDelete', async id => {
        Tasks.findOneAndRemove({ _id: id }, (err, data) => {
            if (!err) io.emit('task:delete', id);
                else console.log(err);
        })
    })


    // * Event User
    socket.on('user:isCode', code => {
        socket.emit('user:code', code === password ? true : false);
    })

})