import React, {useState, useEffect} from 'react'
import "./App.css"

function App() {

  const [messages, setMessages] = useState([])
  const [sendDisabled, setSendDisabled] = useState(false)
  const [currMessage, setCurrMessage] = useState("")

  const getMessage = async () => {

    setSendDisabled(true);

    let frontendMessagesJson = [];

    // Conversation objects are added to the JSON list to be sent in the POST
    // HTTP request. The first message will be the user message, so even
    // indices will be considered user messages.

    for (let i = 0; i < messages.length; i++) {
      let message_origin = "user";

      if (i % 2 !== 0) {
        message_origin = "model";
      }

      frontendMessagesJson.push({role: message_origin, message: messages[i]});
    }

    // currMessage is added to frontendMessagesJson.

    frontendMessagesJson.push({role: "user", message: currMessage});

    // State of messages updated to include currMessage.
    setMessages([...messages, currMessage]);

    setCurrMessage("");
    
    // Headers mandatory for requests that include content like POST
    await fetch(
      "/chat",
      {
        method: "POST", 
        body: JSON.stringify(frontendMessagesJson),
        headers: {
          "Content-Type": "application/json"
        }
      }
    ).then(
      res => res.json()
    ).then(
      // Using setMessages([...messages, data.message]) does not work because
      // the previous setMessages has not necessarily actually been performed
      // yet because state updates are batched together. Functionally updating
      // messages guarantees that messages is updated based on what it was
      // previously set to.
      // Source: https://dev.to/gakii/functional-state-update-in-react-42io.
      data => {
        setMessages(
          previousMessages => [...previousMessages, data.message]
        );
      }
    
    );

    setSendDisabled(false);
  }

  return (
    <div>

      <div class = "messageSection">
        <MessageDisplay messages = {messages} />
      </div>

      <div class = "inputSection">
        
        <input
          placeholder= "Enter your inquiry" 
          onChange = {newTextEvent => setCurrMessage(newTextEvent.target.value)} 
          value = {currMessage}
          style={
            // marginRight is not needed as that is handled by the gap between
            // columns in the class inputSection's grid display.
            { 
              borderRadius: '10px',
              marginLeft: "0.2%",
              marginTop: "1%",
              marginBottom: "1%"
            }
          }
        />

        <button 
          onClick = {getMessage} 
          disabled = {sendDisabled}
          style={
            { 
              borderRadius: '10px',
              marginRight: "2%",
              marginTop: "9%",
              marginBottom: "9%",
              backgroundColor: "#b3f5c4"
            }
          }
        >
          Send
        </button>

      </div>
    </div>
  );
}

// This function returns the display of messages between the user and chatbot.
function MessageDisplay({messages}) {

  // This function bolds text surrounded by double asterisks.
  function asterisksToBold(messageLine) {

    const messageSections = messageLine.split("**");

    // The first section will be empty or will include the message before the
    // bold. The next will include bolded text. Then there will be text that
    // is not bolded. Effectively, any odd message section is bold.

    const sectionsWithBoldText = [];

    for (let i = 0; i < messageSections.length; i++) {
      if (i % 2 === 0) {
        sectionsWithBoldText.push(<>{messageSections[i]}</>);
      }

      else {
        sectionsWithBoldText.push(<b>{messageSections[i]}</b>);
      }
    }

    return sectionsWithBoldText
  }

  // This function converts messages to HTML by replacing \n with <br /> tags.
  function messageToHtml(message) {

    const messageBody = [];

    const messageLines = message.split("\n");

    // <> stands for Fragment. This is a react component that allows you to
    // return multiple HTML components or a component without a container.

    for (let i = 0; i < messageLines.length - 1; i++) {
      messageBody.push(<>
        {asterisksToBold(messageLines[i])}<br />
      </>);
    }

    messageBody.push(messageLines[messageLines.length - 1]);

    return messageBody;
  }

  const messageChain = [...messages].reverse().map((message, i) => {

    // User messages are even since message 0 is from the user and messages
    // alternate. But, since messages are reversed, to check if messages are
    // even, messages.length - 1 - i should be used. This converts i to the
    // forward messages index since i for message 0 is messages.length - 1.

    const messageClass = (messages.length - 1 - i) % 2 === 0 ? 
    "userMessage" : "chatbotMessage";

      return (
        <p key = {i} class = {messageClass}>
          {messageToHtml(message)}
        </p>
      );
    }
  );
  

  return (
    <div class = "messageSection">
      {messageChain}
    </div>
  );
}

export default App
