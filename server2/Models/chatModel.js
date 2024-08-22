const mongoose = require("mongoose")

// ở đây là nó sẽ tạo luôn 1 cái bảng chat vào csdl luôn
const chatSchema = new mongoose.Schema(
    {
        members: Array,
    },
    {
        timestamps: true,
    }
);

const chatModel = mongoose.model("Chat", chatSchema);

module.exports = chatModel;