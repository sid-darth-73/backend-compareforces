const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const corsOptions = {
  origin: 'https://compare-forces.vercel.app', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
  credentials: true,
  optionsSuccessStatus: 200 
}
app.use(cors(corsOptions));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/compare", async (req, res) => {
  try {
    const { user1, user2, userInfo1, userInfo2 } = req.body;

    const prompt = `
Compare two Codeforces users based on the following data. Choose who is the better competitive programmer.
User 1: ${user1}
- Rating: ${userInfo1.rating}
- Max Rating: ${userInfo1.maxRating}
- Rank: ${userInfo1.rank}
- Max Rank: ${userInfo1.maxRank}
- Friend Count: ${userInfo1.friendOfCount}
- Contribution: ${userInfo1.contribution}
- Last Online Time: ${userInfo1.lastOnlineTimeSeconds}

User 2: ${user2}
- Rating: ${userInfo2.rating}
- Max Rating: ${userInfo2.maxRating}
- Rank: ${userInfo2.rank}
- Max Rank: ${userInfo2.maxRank}
- Friend Count: ${userInfo2.friendOfCount}
- Contribution: ${userInfo2.contribution}
- Last Online Time: ${userInfo2.lastOnlineTimeSeconds}

Write a fun, snarky comparison (like a sarcastic but smart friend) that:
- Clearly declares who is better
- Praises the winner confidently
- Makes cheeky, lighthearted remarks about the loser (without sounding cruel)
- Uses wit and coding puns where appropriate.
- Keep the response atleast 300 words, comment on all the aspects of the provided data.

Suggest the loser on how can he beat the other person.
Make advices based on the themes:
- Keep solving more problems with rating +200 of their current rating
- Keeping calm when giving contests
- Give this advice of um_nik "don't waste time learning random algorithms, learn binary search first." It's not like you are telling the useer to just
  get better at binary search, but you want them to practicing the basics instead of just learning new algorithms?
Also, Provide a couple of advices from your side too
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ result: responseText });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Failed to generate content." });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
