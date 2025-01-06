from flask import Flask, request
import messaging
from flask_cors import cross_origin

frontend_url = "https://wasc-chat-frontend-905415252668.us-central1.run.app"

app = Flask(__name__)

# Cross origin is configured so that the /chat endpoint allows requests from
# the frontend URL. Since a JSON fetch request is made to the /chat endpoint,
# with the header specifying that the content type is application/json, the
# Content-Type header must be allowed.

# Chat API Route: this endpoint is for HTTP POST requests and it allows
# conversations from the frontend to be sent to the Vertex AI chatbot then
# sends back the chatbot's response.

@app.route("/chat", methods = ["POST"])
@cross_origin(origins = frontend_url, allow_headers = "Content-Type")
def chat():
    '''
    This function returns messages based on a frontend conversation.
    Arguments:
        None
    Returns: 
        A dictionary with one key whose value is the chatbot response.
    '''

    # This formats incoming JSON to one that can be sent to Vertex AI.
    frontend_conversation = messaging.format_frontend(request.json)

    # A message is sent to Vertex AI using the send_message function and that
    # message is returned as a dictionary with the key "message" and the
    # Vertex AI response as its output. Because send_message is a generator
    # function, this method returns a stream.
    return messaging.send_message(frontend_conversation)

def create_app():
    return app

'''
if __name__ == "__main__":
    app.run(debug = True)
'''
