// Fetch JSON Data
async function fetchCardDetails(set, card) {
  const url = 'https://raw.githubusercontent.com/LynnB0729/Lorcana/refs/heads/main/Lorcana%20JSON.json';
  const response = await fetch(url);
  const data = await response.json();

  const cardDetails = data.cards.find(
    c => c.setCode == set && c.number == card
  );

  return cardDetails
    ? {
        name: cardDetails.name,
        ability: cardDetails.fullText || "No ability found",
      }
    : null;
}

// Display Card Details
document.getElementById("fetchCard").addEventListener("click", async () => {
  const setNumber = document.getElementById("setNumber").value;
  const cardNumber = document.getElementById("cardNumber").value;

  if (setNumber && cardNumber) {
    const details = await fetchCardDetails(setNumber, cardNumber);

    if (details) {
      document.getElementById("cardName").textContent = `Name: ${details.name}`;
      document.getElementById("cardAbility").textContent = `Ability: ${details.ability}`;
    } else {
      document.getElementById("cardName").textContent = "Name: Not found";
      document.getElementById("cardAbility").textContent = "Ability: Not found";
    }
  }
});

// Send Question to ChatGPT
async function askChatGPT(question) {
  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`, // Replace YOUR_API_KEY with your actual API key
      },
      body: JSON.stringify({
        model: "gpt-4",
        prompt: question,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("ChatGPT Response:", data); // Log the response for debugging
    return data.choices[0]?.text.trim() || "No response from ChatGPT.";
  } catch (error) {
    console.error("Error with ChatGPT API:", error);
    return "An error occurred while communicating with ChatGPT. Please try again.";
  }
}

// Handle Chat Questions
document.getElementById("askChatGPT").addEventListener("click", async () => {
  const question = document.getElementById("question").value;
  const responseDiv = document.getElementById("response");

  if (question) {
    responseDiv.textContent = "Thinking...";
    const answer = await askChatGPT(question);
    responseDiv.textContent = answer;
  }
});