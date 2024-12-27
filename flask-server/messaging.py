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

    # This placeholder comes from the original conversation had with the
    # chatbot in training.
    responsePlaceholder = "Okay, let's dive into the specific action steps and activities for **Goal #1: College and Career Readiness**. Here's a breakdown of what ACHS plans to do to achieve this goal:\n\n*   **1.1 Enhance A-G Completion Rate:**\n    *   Training for counselors and teachers on A-G pathways.\n    *   Integration of A-G tracking in student information systems.\n    *   Workshops for parents and students on the importance of A-G completion.\n    *   Continued implementation of the Restorative Intervention Campus program to identify students in need of support earlier in the process.\n*   **1.2 Boost CTE Pathway Completion Rate:**\n    *   Collaboration with community colleges and local businesses for internships.\n    *   Additional CTE pathways that align with student interest.\n    *   Targeted support and counseling for EL students.\n    *   Additional funding for pathway-specific resources.\n*   **1.3 Increase Dual Enrollment Participation:**\n    *   Partnerships with local colleges.\n    *   Promotional materials for students and parents.\n    *   Dedicated time during Scorpion Connect sessions for information sessions.\n    *   Training for teachers on dual enrollment benefits.\n*   **1.4 Improve CAASPP Scores in ELA and Math:**\n    *   Data analysis tools for interim assessments.\n    *   Professional development for teachers on using data to inform instruction.\n    *   Targeted tutoring or intervention programs.\n\nThese action steps are designed to be specific, measurable, achievable, relevant, and time-bound (SMART), and they provide a roadmap for how ACHS will work towards improving college and career readiness for all students.\n\nWould you like to know more about the measurable student-focused outcomes for Goal #1, or would you like to explore another goal or aspect of the action plan?"

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
                types.Part.from_text(responsePlaceholder)
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