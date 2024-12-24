import chat_information
from google.genai import types

def send_message(frontend_conversation):

    # The contents array is copied. Then a placeholder response from the model
    # is added because by default because the Python code provided by Vertex AI
    # cuts off the training conversation before the chatbot responds. So, the
    # placeholder prevents there from being to user messages in a row. Then
    # the frontend conversation is added to the conversation.
    full_conversation = chat_information.contents[:]
    
    full_conversation.append(
        types.Content(
            role = "model",
            parts=[
                types.Part.from_text("Placeholder")
            ]
        )
    )
    
    full_conversation.extend(frontend_conversation)

    output_message = ""

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

    for message_dict in frontend:
        formatted_frontend.append(
            types.Content(
                role = message_dict["role"],
                parts = [
                    types.Part.from_text(message_dict["message"])
                ]
            )
        )

    return formatted_frontend