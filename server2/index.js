const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

const app = express();
require("dotenv").config()

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());

app.use("/auth", userRoute)
app.use("/chats", chatRoute)
app.use("/messages", messageRoute)

app.get("/", (req, res) => {
    res.send("welcom your chatAPP")
})

const port = process.env.PORT || 3000;
const uri = process.env.ATLAS_URI;


app.listen(port, (req, res) => {
    console.log(`Server running on port. ${port}`);
})

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("MongoDB connection astablished")
    // Xóa chỉ mục 'email_1' nếu nó tồn tại
    try {
        await mongoose.connection.collection('messages').dropIndex('email_1');
        console.log('Index email_1 dropped successfully');
    } catch (error) {
        if (error.code === 27) {
            console.log('Index email_1 does not exist, skipping drop');
        } else {
            console.error('Error dropping index:', error);
        }
    }
})
    .catch((error) => console.log("MongoDB connection fail:", error.message))