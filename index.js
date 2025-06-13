const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.get('/', (req, res) => {
    res.send('Backend is running');
});

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('joinRoom', (roomCode) => {
        socket.join(roomCode);
        console.log(`User joined room: ${roomCode}`);
    });

    socket.on('sendMessage', (data) => {
        io.to(data.roomCode).emit('receiveMessage', {
            sender: data.sender,
            message: data.message
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
