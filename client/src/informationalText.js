/* Text on top section of website. Meant to be changed for intended purpose of specific site.

    1. To make a line bulleted, add a "-" before the line.


    2. To make text bold, surround text with double asterisks.
    You should not surround multiline sections with double asterisks. Instead,
    they should only be applied to specific lines. For example, the following
    would work:

    **Multiple**
    **Bolded**
    **Lines**

    But the following would not:

    **Multiple
    Bolded
    Lines**
    
    Lastly, for bold bulleted lines, double asterisks should come after the "-".
    For example, the following would work:
    
    -**Hello**

    But the following would not:

    **-Hello**
*/

const infoText = `
**Welcome to the ACHS WASC Chatbot!**

Use this site to have an interactive conversation with our 2025 WASC Report.

You can access the draft of the main report here: ACHS 2025 WASC Report

**The WASC Report is broken up into chapters:**

- Chapter 1: School Progress Report (Summarizing the past few years, developments, and progress)
- Chapter 2: School Profile (Data about the school, student performance, and student outcomes)
- Chapter 3: Self-Study (A thorough examination of our findings and evidence based on the WASC Focus on Learning Criteria)
- Chapter 4: Summary of Self-Study Findings (A brief summary of major insights, areas of strength and growth from Chapter 3)
- Chapter 5: Action Plan (What are our goals for the next three years and how do we hope to accomplish them?)
- Based on your interest, you can ask for information about information from specific chapters or ask a general question. After your first question, you can have an increasingly detailed conversation with the bot on the same topic, or can move to different parts of the report.
**Sample Starting Questions:**

- Summarize Chapter 1.
- What can you tell me about ACHS CAASPP Scores?
- What are the main goals of the Action Plan?
**Disclaimers:**

- There may be a lag time between submitting your question and receiving a response.  The lag can take 15-30 seconds.
- This is powered by generative AI and may make mistakes.
`;

export default infoText;
