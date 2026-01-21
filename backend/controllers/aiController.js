import axios from "axios";

export const generateItinerary = async (req, res) => {
  try {
    let { destination, days, budget } = req.body;

    // 1. Validation
    if (!destination || !days) {
      return res.status(400).json({ message: "Destination and duration are required." });
    }

    const duration = Number(days);
    const budgetLevel = budget || "Medium";

    // 2. Safety check for API Key
    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY in .env file");
      return res.status(500).json({ message: "AI Configuration error on server." });
    }

    // 3. Use gemini-2.5-flash (you have access to this model!)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(url, {
      contents: [
        {
          parts: [
            {
              text: `Create a ${duration}-day travel itinerary for ${destination} with a ${budgetLevel} budget. Format it clearly with daily headings.`
            }
          ]
        }
      ]
    });

    // 4. Safely extract the response text
    const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      return res.status(500).json({ message: "AI returned an empty response. Try again." });
    }

    // 5. Success!
    res.json({ itinerary: aiResponse });

  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);

    res.status(err.response?.status || 500).json({
      message: "AI Generation failed. Please check your API key or quota.",
      error: err.response?.data?.error?.message || err.message
    });
  }
};