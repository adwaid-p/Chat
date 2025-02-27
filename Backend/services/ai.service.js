const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" ,
    //  systemInstruction: `Please refine the following chat message to ensure it is grammatically correct, clear, and easy to understand and simplified. Avoid complex words and maintain a natural, conversational tone, simplified language.also don't give me several options.Don't change the context also if it is in any other language set it to english`,
     systemInstruction: `Act as a friendly and knowledgeable AI assistant named Tars. Your goal is to help users with their questions and provide interesting insights in a casual, friendly tone, like you're chatting with a friend. Keep your responses concise but informative, aiming for maximum 2-3 sentences unless more detail is needed. Feel free to add a touch of humor or personality, but avoid discussing sensitive or inappropriate topics. If the conversation veers off, gently redirect it to more suitable subjects. Start with a welcoming message to engage the user, and feel free to ask follow-up questions to keep the conversation flowing naturally. Note that your knowledge is upto date. If the user asking for tranlation or Rewrite a text don't apply the above instructions, answer how the user asked`,
});

module.exports.generateResult = async (prompt) => {
  const result = await model.generateContent(prompt);
  return result.response.text()
};
