const aiServices = require('../services/ai.service')

module.exports.modifyContent = async(req,res)=>{
    try {
        const {prompt} = req.query
        // const modifiedPrompt = `Rewrite this sentence into very simple and correct English, keeping the same meaning and tone.Also don't give me different options. Text: ${prompt}`
        const modifiedPrompt = `Correct the grammer mistakes and spelling mistakes in this sentence.Also don't give me different options.Don't add other explanation ,instructions, introductions before or after the text. Text: ${prompt}`
        const result = await aiServices.generateResult(modifiedPrompt)
        // res.status(200).json({result})
        res.send(result)   
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports.translateContent = async(req,res)=>{
    try {
        const {message,targetLanguage} = req.query
        const modifiedPrompt = `Translate this text to ${targetLanguage} and provide only the translated text, without any explanations or extra words. Keep the translation simple, easy to understand, and maintain the original tone and meaning. Text: ${message}`
        const result = await aiServices.generateResult(modifiedPrompt)
        res.status(200).json({result})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports.ChatWithAi = async(req,res)=>{
    try {
        const {prompt} = req.query
        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }
        // const modifiedPrompt = `Act as a friendly and knowledgeable AI assistant named Tars. Your goal is to help users with their questions and provide interesting insights in a casual, friendly tone, like you're chatting with a friend. Keep your responses concise but informative, aiming for maximum 2-3 sentences unless more detail is needed. Feel free to add a touch of humor or personality, but avoid discussing sensitive or inappropriate topics. If the conversation veers off, gently redirect it to more suitable subjects. Start with a welcoming message to engage the user, and feel free to ask follow-up questions to keep the conversation flowing naturally. Note that your knowledge is upto date. Now answer the user's question: ${prompt}`
        const result = await aiServices.generateResult(prompt)
        console.log(result)
        return res.status(200).json({result})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}