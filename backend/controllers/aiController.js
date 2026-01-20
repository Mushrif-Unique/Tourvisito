import axios from "axios";

export const generateItinerary = async (req, res) => {
  try {
    const { destination, days, budget } = req.body;

    if (!destination || !days) {
      return res.status(400).json({ message: "Please provide destination and days" });
    }

    const promptText = `
Create a ${days}-day travel itinerary for ${destination}.
Include attractions, activities, accommodations, and brief descriptions.
Budget: ${budget || "medium"}
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: promptText }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const aiText = response.data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text)
      .join("") || "";

    res.json({ itinerary: aiText });

  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    res.status(500).json({
      message: "AI generation failed",
      error: err.response?.data || err.message
    });
  }
};
