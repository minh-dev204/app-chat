import { useContext } from "react"
import { ChatContext } from "../context/ChatContext"
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/PotentialChats";
import ChatBox from "../components/ChatBox";

function Chat() {
    const { user } = useContext(AuthContext)
    const { userChats, isUserChatsLoading, updateCurrentChat } = useContext(ChatContext);

    console.log("UserChats", userChats);

  
    return <>
        <Container>
            <PotentialChats />
            {/* nếu ko có đoạn chát nào thì null ngược thì vế sau */}
            {userChats?.length < 1 ? null : (
                <Stack direction="horizontal" gap={4} className="align-items-start">
                    <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                        {isUserChatsLoading && <p>Loading chats...</p>}
                        {userChats?.map((chat, index) => {
                            return (
                                <div key={index} onClick={() => updateCurrentChat(chat)}>
                                    <UserChat 
                                        chat={chat}
                                        user={user} />
                                 </div>
                            )
                        })}
                    </Stack>
                    {/* hôp trò chuyện */}
                   <ChatBox />
                </Stack>
            )}
        </Container>
    </>
}

export default Chat
