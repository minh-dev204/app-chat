const mongoose = require("mongoose")


// ở đây là nó sẽ tạo luôn 1 cái bảng Message vào csdl luôn
const messageSchema = new mongoose.Schema({
    chatId: String,
    senderId: String,
    text: String,
},
    {
        timestamps: true,
    }
);

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;