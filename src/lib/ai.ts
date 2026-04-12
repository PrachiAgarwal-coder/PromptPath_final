const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function callAI(prompt: string, systemPrompt: string) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    })
  });
  const data = await response.json();
  console.log('Groq response:', data);
  if (!data.choices || !data.choices[0]) {
    throw new Error(JSON.stringify(data));
  }
  return data.choices[0].message.content;
}