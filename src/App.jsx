import { useState } from 'react'
import './App.css'
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react";
import axios from 'axios';

const API_KEY = "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"


function App() {


  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ChatGPT!",
      sender: "ChatGPt"
    }
])

  const handleSend = async (message) => {
    // when the send button is clicked you want to create a message object that will be displayed on the messagelist
    const newMessage = [
      {
        message: message,
        user: "user",
        direction: "outgoing"
      }
    ]

    const newMessages = [...messages, newMessage]

    // update messages state

    setMessages(newMessages)

    // send message to chatgpt

    await processMessageToChatGPT(newMessage)

  }

  const processMessageToChatGPT = async (chatMessages) => {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = '';

      if (messageObject.sender === "ChatGPT") {
        role = "assistant"
      } else {
        role = "user"
      }

      return {role: role, content: messageObject.message}

    });

     const systemMessage = {
      role: "system",
      content: "Explain all concepts like I am high school student in south africa attending a public school"
     }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages]

    }

      await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      }).then((data)=>{
        return data.json();
      }).then((data) => {
        console.log(data)
        console.log(data.choices[0].message.content);
        setMessages([...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT" 
        }])
      })
    }

  return (
<div style={{ position: "relative", height: "500px" }}>
  <MainContainer>
    <ChatContainer>
      <MessageList>
        {messages.map((message, i) => {
          return <Message key={i} model={message}/>
        })}
      </MessageList>
      <MessageInput placeholder="Type message here" onSend={handleSend}/>
    </ChatContainer>
  </MainContainer>
</div>
  )
}

export default App
