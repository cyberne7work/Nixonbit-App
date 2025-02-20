import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.EXPO_PUBLIC_CHATGPT_API_KEY });
console.log("openai", openai);

export default async function gpt3(query: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: query,
        },
      ],
      store: true,
    });
    console.log("completion", completion);

    return completion.choices[0].message;
  } catch (error) {
    throw new Error("Error fetching GPT-3 data: ");
  }
}
