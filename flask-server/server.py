from flask import Flask, request
import messaging

app = Flask(__name__)

# Chat API Route: this endpoint is for HTTP POST requests and it allows
# conversations from the frontend to be sent to the Vertex AI chatbot then
# sends back the chatbot's response.

@app.route("/chat", methods = ["POST"])

def chat():
    '''
    This function returns messasges based on a frontend conversation.
    Arguments:
        None
    Returns: 
        A dictionary with one key whose value is the chatbot response.
    '''

    # This formats incoming JSON to one that can be sent to Vertex AI.
    frontend_conversation = messaging.format_frontend(request.json)

    # A message is sent to Vertex AI using the send_message function and that
    # message is returned as a dictionary with the key "message" and the
    # Vertex AI response as its output.
    return {"message": messaging.send_message(frontend_conversation)}

def create_app():
    return app

'''
if __name__ == "__main__":
    app.run(debug = True)
'''