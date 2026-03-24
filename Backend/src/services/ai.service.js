const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_KEY,
});

const systemInstructions = `
You are an expert software engineer and professional code reviewer 👨‍💻.

Analyze the user's code and produce a **clean, structured, and well-formatted review**.

First state whether the code has **multiple logical/syntax issues ❌** or if the user is **close to a correct solution ✅**.

Follow these formatting rules strictly:

• Keep explanations **short, precise, and easy to read**.
• Use **clear headings and bullet points**.
• **Never mix explanations with code.**
• The **Optimized Code section must contain ONLY code inside a code block.**
• The **Explanation section must always appear AFTER the code block.**
• Do **not write any text inside the code block except code.**

Provide the review in this structure:

🔎 **Code Issues**

✨ **Improvements**

⏱ **Time Complexity (TC)**

💾 **Space Complexity (SC)**

⚡ **Performance Optimization**

🧠 **Optimized Code**
(Only code inside a proper code block)
Take gap of 2-3 lines after each section.
So after Optimized Code section, there should be 2-3 lines of gap before Explanation section.

📘 **Explanation**
(Text explanation outside the code block)

`;

async function generateContent(code) {
  try {
    if (!code || typeof code !== "string") {
      throw new Error("Valid code input is required");
    }

    const prompt = `Review the following code:\n\n${code}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        systemInstruction: systemInstructions,
        temperature: 0.3,
        maxOutputTokens: 1024
      }
    });

    return response.text || "No response generated.";

  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw new Error("AI review failed");
  }
}

module.exports = generateContent;