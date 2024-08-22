// đây là phần hộp trò chuyện

import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { ChatContext } from "../context/ChatContext"
import { useFetchRecipientUser } from "../hooks/useFetchRecipient"
import { Stack } from "react-bootstrap"
import moment from "moment"
import InputEmoji from "react-input-emoji";

function ChatBox() {
    const { user } = useContext(AuthContext)
    const { currenChats, messages, isMessagesLoading, sendTextMessage } = useContext(ChatContext)
    const { recipientUser } = useFetchRecipientUser(currenChats, user)
    const [textMessage, setTextMessage] = useState("")

    console.log("text", textMessage);


    // nếu mà chưa chọn cuộc trò chuyện mặc định nó sẽ hiện thông báo
    if (!recipientUser) return (
        <p style={{ textAlign: "center", width: "100%" }}>
            No conversation selected yet ...
        </p>
    )

    if (isMessagesLoading) return (
        <p style={{ textAlign: "center", width: "100%" }}>
            Loading chat...
        </p>
    )

    return <>
        <Stack gap={4} className="chat-box">
            <div className="chat-header">
                <strong>{recipientUser?.name}</strong>
            </div>
            <Stack gap={3} className="messages">
                {/* nếu mà có đoạn chat 2 người vs nhau */}
                {messages && messages.map((messages, index) => {
                    return (
                        // ở đây mình sẻ cho tk stack là nếu senderId mà trùng với id user thì hiện bên phải , ko thì hiện bên trái
                        <Stack key={index} className={`${messages?.senderId === user?._id ? "message self align-self-end flex-grow-0" : "message align-self-start flex-grow-0"}`}>
                            <span >{messages.text}</span>
                            {/* cài moment vào */}
                            <span  className="message-footer">{moment(messages.createdAt).calendar()}</span>
                        </Stack>
                    )
                })}
            </Stack>

            <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
                {/* form nhập text */}
                <InputEmoji value={textMessage} onChange={setTextMessage} fontFamily="nunito" borderColor="rgba(72,112,223,0.2)" />

                {/* nút gửi text */}
                <button className="send-btn" onClick={() => sendTextMessage(textMessage, user, currenChats._id, setTextMessage)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                    </svg>
                </button>
            </Stack>
        </Stack>
    </>
}

export default ChatBox
