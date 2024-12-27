import chat_information
from google.genai import types

def send_message(frontend_conversation):

    '''
    This function actually sends a message to Vertex AI and gets its response
    based on the frontend conversation.
    Arguments:
        frontend_conversation: a list of of objects of type types.Part holding
        information from the frontend json (after it has been formatted).
    Returns: a string hodling the output message.
    '''

    # The contents array is copied. Then a placeholder response from the model
    # is added because by default because the Python code provided by Vertex AI
    # cuts off the training conversation before the chatbot responds. So, the
    # placeholder prevents there from being to user messages in a row. Then
    # the frontend conversation is added to the conversation.
    full_conversation = chat_information.contents[:]
    
    # A placeholder is added to the frontend conversation. The reason for this
    # is that the last message in the contents object is from the user. But
    # the first message from the frontend will also be from the user. This 
    # placeholder ensures that messages alternate between the user and model.
    full_conversation.append(
        types.Content(
            role = "model",
            parts=[
                types.Part.from_text("Placeholder")
            ]
        )
    )
    
    # The frontend conversation is added to the full conversation.
    full_conversation.extend(frontend_conversation)

    output_message = ""


    # The generate_content_stream method sends a message to Vertex AI. Then
    # in this for loop, parts of the response stream are added to
    # output_message.
    for chunk in chat_information.client.models.generate_content_stream(
        model = chat_information.model,
        contents = full_conversation,
        config = chat_information.generate_content_config
    ):
        output_message += chunk.text

    return output_message

def format_frontend(frontend):
    '''
    This function formats the frontend JSON into a list of types.Content
    objects.
    Args:
        frontend: a list of dictionaries returned by request.json.
    Returns:
        a list of types.Content objects holding the same information held in
        frontend.
    '''

    formatted_frontend = []

    # Loops through each message dictionary in the frontend conversation list.
    for message_dict in frontend:

        # Each element in frontend, message_dict, is a dictionary with keys
        # "role" and "message".
        formatted_frontend.append(

            # Frontend dictionaries are changed to types.Content objects, since
            # the function to message Vertex AI requires a list of these
            # objects.
            types.Content(
                role = message_dict["role"],
                parts = [
                    types.Part.from_text(message_dict["message"])
                ]
            )
        )

    return formatted_frontend