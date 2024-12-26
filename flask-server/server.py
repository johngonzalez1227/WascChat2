from flask import Flask, request
import messaging

app = Flask(__name__)

# Chat API Route

@app.route("/chat", methods = ["POST"])

def chat():
    frontend_conversation = messaging.format_frontend(request.json)
    return {"message": messaging.send_message(frontend_conversation)}

def create_app():
    return app

'''
if __name__ == "__main__":
    app.run(debug = True)
'''