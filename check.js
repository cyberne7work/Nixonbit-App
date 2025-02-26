// Please install OpenAI SDK first: `npm install openai`

const OpenAI = require("openai");

const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: 'sk-25b9030295e4400ea3e8d54d77f6be89'
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "deepseek-chat",
  });

  console.log(completion.choices[0].message.content);
}

main();