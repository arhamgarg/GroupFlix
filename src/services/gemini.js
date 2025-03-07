import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const getMovieRecommendations = async (movies) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-thinking-exp-01-21",
  });

  const prompt = `Recommend 3 movies similar to these: ${movies.join(", ")}. 
    For each recommendation, provide:
    - Title
    - Year
    - Brief reason for recommendation
    Format as JSON array with keys: title, year, reason`;

  // const prompt = `Based on these movies: ${movies.join(', ')}, suggest 2 movies that:
  //                 Combine ≥ 3 genres from input titles using IMDB's taxonomy
  //                 Match narrative elements from metadata
  //                 Prioritize films with multi-genre DNA
  //                 Include at least 1 non-English language films
  //                 Exclude 18+ content and documentaries
  //                 Return exactly 3 movie titles in this format, one per line:
  //                 - Title (Original Language Title)
  //                 - Year
  //                 - Brief reason for recommendation
  //                 No numbers, bullets, or punctuation. Only movie names with original language titles in parentheses, one per line.
  //                 Format as JSON array with keys: title, year, reason`

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json|```/g, "");
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(`Gemini API error: ${error}`);
    throw new Error("Failed to get recommendations");
  }
};
