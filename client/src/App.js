import React, {useState, useEffect} from 'react'

function App() {

  const [messages, setMessages] = useState([])
  const [sendDisabled, setSendDisabled] = useState(false)
  const [currMessage, setCurrMessage] = useState("")

  const getMessage = async () => {

    setSendDisabled(true)

    let frontendMessagesJson = []

    // Conversation objects are added to the JSON list to be sent in the POST
    // HTTP request. The first message will be the user message, so even
    // indices will be considered user messages.

    for (let i = 0; i < messages.length; i++) {
      let message_origin = "user"

      if (i % 2 !== 0) {
        message_origin = "model"
      }

      frontendMessagesJson.push({role: message_origin, message: messages[i]})
    }

    // currMessage is added to frontendMessagesJson.

    frontendMessagesJson.push({role: "user", message: currMessage})

    // State of messages updated to include currMessage.
    setMessages([...messages, currMessage])

    setCurrMessage("")
    
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
      data => setMessages(
        previousMessages => [...previousMessages, data.message]
      )
    )

    setSendDisabled(false)
  }
  return (
    <div>
      <input
        placeholder= "Enter your inquiry" 
        onChange = {newTextEvent => setCurrMessage(newTextEvent.target.value)} 
        value = {currMessage}
      />
      <button onClick = {getMessage} disabled = {sendDisabled}>Send</button>

      {messages.map((message, i) => {
        return <p key = {i}>{message}</p>
      })}
    </div>
  )
}

export default App
