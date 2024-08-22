const chatModel = require("../Models/chatModel")

// hàm này có thể hiệu là sẽ tạo id chat 2 người với nhau
const createChat = async (req, res) => {
    const { firsId, secondId } = req.body;

    try {
        // đoạn này nó sẽ tìm firsId, secondId trong members (members mở bên chatModel sẽ rỏ)
        const chat = await chatModel.findOne({
            members: { $all: [firsId, secondId] }
        })

        // nếu tìm thấy thì return về chat
        if (chat) return res.status(200).json(chat);

        const newChat = new chatModel({
            members: [firsId, secondId],
        })

        const response = await newChat.save()
        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


// nó sẽ tìm các item chats dựa vào userId
const findUserChats = async (req, res) => {
    const userId = req.params.userId

    try {
        const chats = await chatModel.find({
            members: { $in: [userId] }
        })

        res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


// nó cũng sẽ tìm item chat đó dựa vào firsId, secondId
const findChat = async (req, res) => {
    const { firsId, secondId } = req.params;

    try {
        const chat = await chatModel.find({
            members: { $all: [firsId, secondId] }
        })

        res.status(200).json(chat);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


module.exports = { createChat, findUserChats, findChat }