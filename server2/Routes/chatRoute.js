const express = require("express")
const { createChat, findUserChats, findChat } = require("../Controllers/chatController")

const router = express.Router();

router.get("/find/:firsId/:secondId", findChat);
router.get("/:userId", findUserChats);
router.post("/", createChat);

module.exports = router;