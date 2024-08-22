import { Stack } from "react-bootstrap"
import { useFetchRecipientUser } from "../hooks/useFetchRecipient"
import avatar from "../assets/avatar.png"
import { useContext } from "react"
import { ChatContext } from "../context/ChatContext"

// chat : {_id: "fmamfk", firsId: "123", secondIdL "456"}
// user : {name, email ,pass, _id}

function UserChat({ chat, user }) {

  const { onlineUsers } = useContext(ChatContext)
  const { recipientUser } = useFetchRecipientUser(chat, user)

  if (!recipientUser) {
    return;  // Hoặc xử lý trạng thái tải tùy ý
  }
  // console.log("recipientUser",recipientUser);

  // recipientUser : là id người nhận (nhắn tin vs mình)


  return <>
    {/* UserChat */}
    <Stack direction="horizontal" gap={3}
      className="user-card align-items-center p-2 justify-content-between" role="button">
      <div className="d-flex">
        <div className="me-2">
          <img src={avatar} height="35px" />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser.name}</div>
          <div className="text">Text Message</div>
        </div>
      </div>

      <div className="d-flex flex-column align-items-end">
        <div className="date">
          12/12/2022
        </div>
        <div className="this-user-notifications">2</div>
        <div className={
          onlineUsers.some((user) => {
            return user?.userId === recipientUser?._id
          }) ?
          "user-online"
          : ""
          }></div>
      </div>
    </Stack>
  </>
}

export default UserChat
