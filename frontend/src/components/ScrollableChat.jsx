import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
    isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatContext } from "../context/ChatProvider";
import { useContext } from "react";

const ScrollableChat = ({ messages }) => {
  const { user } = useContext(ChatContext);
//   if((messages[0].sender )){
    console.log(messages[0])
    // console.log(messages[0].sender.name)
//   }
  
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (m.sender )
                &&( m.sender[0].name) && (
              <Tooltip label={m.sender[0].name } placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender[0].name}
                  src={m.sender[0].pic}
                />
              </Tooltip>
            )
            }
            <span
              style={{
                backgroundColor: `${
                  m.sender[0]._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;