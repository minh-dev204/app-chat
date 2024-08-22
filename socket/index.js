const { Server } = require('socket.io');

const io = new Server({ cors: "http://localhost:5173" });

let onlineUser = []
io.on('connection', (socket) => {
    console.log('new connection', socket.id);

    //listen to a connection
    // tk này nó sẽ nhận cái userId mà bên client nó emit cái "addNewUser"
    socket.on("addNewUser", (userId) => {
        // nó sẽ nhận id user 
        // lấy mảng onlineUser mình sẽ some nó sẽ tìm xem có userID nào === useId của mình ko
        // nếu ko có thì reuturn về false mà có ! nên return về true 
        // vì return về true nên mình sẽ push cái userId và socketId vào mảng onlineUSer
        !onlineUser.some((user) => user.userId === userId) &&
            onlineUser.push({
                userId,
                socketId: socket.id
            })

        console.log("onlinerUser", onlineUser);

        // nó sẽ phát đi onlineUser cho client
        io.emit("getOnineUsers", onlineUser)
    });


    // add message
    socket.on("sendMessage", (message) => {
        // recipientId có thể hiểu là id người nhận
        const user = onlineUser.find(user => user.userId === message.recipientId)

        if(user) {
            io.to(user.socketId).emit("getMessage",message)
        }
    })

    // ngắt kết nối người dùng
    socket.on("disconnect", () => {
        // nó sẽ lọc mảng userOnline
        // nó sẽ trả về mảng mới ko có những tk user.socketId !== socket.id
        onlineUser = onlineUser.filter((user) => user.socketId !== socket.id)

        // gửi dữ liệu lên lại client
        io.emit("getOnineUsers", onlineUser)
    })

});

io.listen(4000)

// tk này chạy nodemon