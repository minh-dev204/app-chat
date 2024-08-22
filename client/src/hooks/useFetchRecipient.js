import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null)

    // console.log("chat", chat);
    // console.log("user", user);
    

    // ở đây có thể hiểu là nó sẽ lấy id người nhắn tin với bạn dựa vào id bạn đăng nhập vào
    const recipientId = chat?.members.find((id) => id !== user?._id)
    // console.log("recipientId",recipientId);
    

    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) {
                return ;
            }
            // phần này sử lý api , load user dựa vào id
            const response = await getRequest(`${baseUrl}/auth/find/${recipientId}`)
            if (response.error) {
                return setError(error)
            }
            setRecipientUser(response)
        }
        getUser()
    }, [recipientId])

    return { recipientUser }
}