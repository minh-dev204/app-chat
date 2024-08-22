import { useContext } from "react"
import { ChatContext } from "../context/ChatContext"
import { AuthContext } from "../context/AuthContext";

// list các user (nhưng ko phải là list user chat kiểu như có bao nhiêu người onl)
function PotentialChats() {
    const { user } = useContext(AuthContext)
    const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);
    // console.log("potentialChats", potentialChats);

    // console.log("UserId", user._id);



    return <>
        {/* all user */}
        <div className="all-users">
            {potentialChats && potentialChats.map((u, index) => {
                return (
                    // user._id là id của mình, u._id là id của tk đc click
                    <div className="single-user" key={index} onClick={() => createChat(user._id, u._id)}>
                        {u.name}
                        <span className={
                            // check xem onlineUsers này có ko bằng cách check id
                            onlineUsers.some((user) => {
                                return user?.userId === u?._id
                            }) ?
                                "user-online"
                                : ""
                        }></span>
                    </div>
                )
            })}
        </div>
    </>
}

export default PotentialChats
