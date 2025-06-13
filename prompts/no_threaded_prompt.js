const { Langfuse } = require("langfuse");
const fs = require("fs").promises;

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  host: process.env.LANGFUSE_HOST,
});

module.exports = async function ({ vars, provider }) {
  const prompt = await langfuse.getPrompt("chat-agent");
  const json = await fs.readFile("mock_data/SPA_Wellness.json", "utf8");
  return [
    {
      role: "system",
      content: prompt.prompt,
    },
    {
      role: "user",
      content: vars.user_message,
    },
    {
      role: "assistant",
      content: json,
    },
  ];
};
