import { createContext, useState, useEffect, useCallback } from "react";;
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client" // import io


export const ChatContext = createContext();
// user bên cạnh children là lấy user từ context kia (mở App.jsx là bik)
export const ChatContextProvider = ({ children, user }) => {

    const [userChats, setUserChats] = useState(null);
    const [userChatsError, setUserChatsError] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [potentialChats, setPotentialChats] = useState([]);

    const [currenChats, setCurrenChats] = useState(null);
    const [messages, setMessages] = useState(null);
    const [messagesError, setMessagesError] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);

    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null)

    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])

    // console.log("currenChats",currenChats);
    // console.log("messages", messages);
    console.log("onlineUsers", onlineUsers);

    // initial socket
    useEffect(() => {
        const newSocket = io("http://localhost:4000");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, [user]);

    // add online Users
    useEffect(() => {
        if(socket === null) return
        socket.emit("addNewUser", user?._id)

        // tk client nó sẽ nhận đc userOnlie nt đc socket gửi qua 
        socket.on("getOnineUsers", (res) => {
           setOnlineUsers(res)
        })

        return () => {
            socket.off("getOnineUsers");
        }
    }, [socket])

    // send mesage
    useEffect(() => {
        if (socket === null) return

        const recipientId = currenChats?.members?.find((id) => id !== user?._id)
        // recipientId ở đây là id người nhận
        socket.emit("sendMessage",{...newMessage, recipientId})
    }, [newMessage]) 
    // cái newMessage này là bên hàm sendTextMessage khi mình nhắn thì lấy dữ liệu trả về set vào newMessage

   //receive Mesage
    useEffect(() => {
        if (socket === null) return

        socket.on("getMessage", res => {
           if(currenChats?._id !== res.chatId) return

        //    nó sẽ lấy tin nhắn trả về đưa vào state message
           setMessages((prev) => [...prev, res])
        })

        return () => {
            socket.off("getMessage")
        }
    }, [socket, currenChats]) 
    // currenChats là id 2 tk chat

    useEffect(() => {
        const getUsers = async () => {
            // get all user
            const response = await getRequest(`${baseUrl}/auth`);
            // console.log(response);

            if (response.error) {
                return console.log("Err fetching user", response);
            }

            // lấy dữ liệu trả về lọc ra
            const pChats = response.filter((u) => {
                let isChatCreated = false
                // if dữ liệu nào có cái id giống với id của mình thì ko hiện user đó thôi
                if (user?._id === u._id) {
                    return false
                }

                if (userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id
                    })
                }

                return !isChatCreated;

            });
            setPotentialChats(pChats);
        }
        getUsers()
    }, [userChats])

    useEffect(() => {
        // lấy đoạn chat dựa vào id user
        const getUserChats = async () => {
            if (user?._id) {  // nếu id đăng nhập có tồn tại
                setIsUserChatsLoading(true);
                setUserChatsError(null)

                // api này nó sẽ tìm các đoạn chat dựa vào id user
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

                setIsUserChatsLoading(false);

                if (response.error) {
                    return setUserChatsError(response)
                }

                // set dữ liệu trả về vào userChats
                setUserChats(response)
            }
        }
        getUserChats(); // gọi hàm
    }, [user])


    // hàm này khi click vào list user ở trên nó sẽ tạo 1 cái item chat (đừng hiểu lầm với chat với nhau)
    const createChat = useCallback(async (firsId, secondId) => {
        const response = await postRequest(`${baseUrl}/chats`, JSON.stringify({
            firsId, secondId
        }));

        if (response.error) {
            return console.log("Error creating chat", response);
        }

        console.log("reponse", response);


        // set lại userChat 
        setUserChats((prev) => [
            ...prev,
            response
        ])
    }, [])


    // 


    useEffect(() => {
        // lấy đoạn chat dựa vào id user
        const getMessages = async () => {
            setIsMessagesLoading(true);
            setMessagesError(null)

            // api này nó sẽ tìm các đoạn chat dựa vào id user
            const response = await getRequest(`${baseUrl}/messages/${currenChats?._id}`);

            setIsMessagesLoading(false);

            if (response.error) {
                return setMessagesError(response)
            }

            // set dữ liệu trả về vào userChats
            setMessages(response)
        }
        getMessages(); // gọi hàm
    }, [currenChats])

    const updateCurrentChat = useCallback((chat) => {
        setCurrenChats(chat)
    }, [])


    //
    const sendTextMessage = useCallback(async (textMessage, sender, currenChatId, setTextMessage) => {
        // nếu mà gửi tn mà nó có gì thì hiện thông báo
        if (!textMessage) return console.log("You must type something");

        const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
            chatId: currenChatId,
            senderId: sender._id,
            text: textMessage
        }));

        if (response.error) {
            return setSendTextMessageError(response)
        }

        setNewMessage(response)

        // cập nhật lại đoạn tin nhắn chat, là mình gửi là hiện lên luôn
        setMessages((prev) => [...prev, response])

        // nó sẽ xóa đoạn chữ trong input
        setTextMessage("")

    }, [])

    return <ChatContext.Provider value={{
        userChats,
        userChatsError,
        isUserChatsLoading,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        messagesError,
        isMessagesLoading,
        currenChats,
        sendTextMessage,
        onlineUsers
    }}>
        {children}
    </ChatContext.Provider>
}