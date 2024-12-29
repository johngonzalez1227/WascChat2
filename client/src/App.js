import React, {useState} from 'react'
import "./App.css"

function App() {

  const backendUrl = "https://wasc-chatbot-backend-15118306301.us-central1.run.app"
  const [messages, setMessages] = useState([]);
  const [sendDisabled, setSendDisabled] = useState(false);
  const [currMessage, setCurrMessage] = useState("");

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
      backendUrl + "/chat",
      {
        method: "POST", 
        body: JSON.stringify(frontendMessagesJson),
        headers: {
          "Content-Type": "application/json"
        }
      }
    ).then(
      // body is a property of res of type ReadableStream.
      res => res.body
    ).then(
      async resStream => {

        // A TextDecoderStream object converts a stream of binary text to a
        // stream of strings. A ReadableStream can be piped through a 
        // TextDecoderStream to convert it to a stream of strings.

        const streamDecoder = new TextDecoderStream("utf-8");

        const resStreamText = resStream.pipeThrough(streamDecoder);

        // This method creates a reader that can read the stream assigned to
        // resStream. This object is a ReadableDefaultStreamReader.
        const reader = resStreamText.getReader();

        let chatbotResponse = "";

        let streamClosed = false;

        // The read method of a ReadableDefaultStreamReader returns an object
        // of the form {done, value}. If the stream is closed, meaning that it
        // is finished getting read, done will be set to true and value will
        // be undefined, so the object would look like {done: true, value:
        // undefined}. Otherwise done will be set to false and value will be
        // set to the chunk that was read.

        while (!streamClosed) {

          // Object returned by the read method is unpacked into variables
          // done and value.
          const {done, value} = await reader.read();

          // If the stream is closed, then user will be able to send a message
          // again and the loop will end since streamClosed is set to true.
          if (done) {
            streamClosed = true;

            setSendDisabled(false);

          } else {
            chatbotResponse += value;

            appendChunkToMessages(value, chatbotResponse);
          }
        }

      }
    ).catch(error => console.error('Error:', error));
  }

  function appendChunkToMessages(chunk, chatbotResponse) {
    // On the first chunk, the chunk will be equal to the chatbotResponse.

    const firstChunk = chunk === chatbotResponse

    // setMessages([...messages.slice(0, messages.length - 1), chatbotReply]) 
    // does not work because the previous setMessages has not necessarily
    // actually been performed yet because state updates are batched
    // together. Functionally updating messages guarantees that
    // messages is updated based on what it was previously set to.
    // Source: https://dev.to/gakii/functional-state-update-in-react-42io. 

    // On the first chunk a new message will be added to messages.
    if (firstChunk) {

      setMessages(previousMessages => [...previousMessages, chatbotResponse]);
    } else {
      // The last message will be replaced with the full response after the
      // first chunk.
      setMessages(previousMessages => {
        return [...previousMessages.slice(0, previousMessages.length - 1), chatbotResponse];
      });
    }
  }

  return (
    <div>

      <div className = "messageSection">
        <MessageDisplay messages = {messages} />
      </div>

      <div className = "inputSection">
        
        <input
          placeholder= "Enter your inquiry" 
          onChange = {newTextEvent => setCurrMessage(newTextEvent.target.value)}
          onKeyDown = {(e) => {
            // This makes the enter key have the same effect as the send button.
            if (e.key === "Enter" && !sendDisabled) {
              getMessage()
            }
          }} 
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
        sectionsWithBoldText.push(<React.Fragment key = {i}>{messageSections[i]}</React.Fragment>);
      }

      else {
        sectionsWithBoldText.push(<b key = {i}>{messageSections[i]}</b>);
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
    // Here Fragments are types out so that keys can be given to them.

    for (let i = 0; i < messageLines.length - 1; i++) {
      messageBody.push(<React.Fragment key = {i}>
        {asterisksToBold(messageLines[i])}<br /> 
      </React.Fragment>);
    }

    messageBody.push(messageLines[messageLines.length - 1]);

    return messageBody;
  }

  // Since the messages are displayed with flex and column reverse to ensure
  // that the bottom of the messages are always in view, for the messages to
  // be in order, they are looped through and outputted in reverse order.  
  const messageChain = [...messages].reverse().map((message, i) => {

    // User messages are even since message 0 is from the user and messages
    // alternate. But, since messages are reversed, to check if messages are
    // even, messages.length - 1 - i should be used. This converts i to the
    // forward messages index since i for message 0 is messages.length - 1.

    const messageClass = (messages.length - 1 - i) % 2 === 0 ? 
    "userMessage" : "chatbotMessage";

      return (
        <p key = {i} className = {messageClass}>
          {messageToHtml(message)}
        </p>
      );
    }
  );
  

  return (
    <div className = "messageSection">
      {messageChain}
    </div>
  );
}

export default App
