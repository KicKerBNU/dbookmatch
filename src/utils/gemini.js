import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchBooks } from './googleBooks';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Get the Gemini Pro model - using the correct model identifier
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Generate a response from Gemini AI
 * @param {string} prompt - The prompt to send to Gemini AI
 * @returns {Promise<string>} - The generated response
 */
export async function generateResponse(prompt) {
  try {
    const result = await model.generateContent({
      contents: [{
        parts: [{ text: prompt }]
      }]
    });
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

/**
 * Generate a response with streaming
 * @param {string} prompt - The prompt to send to Gemini AI
 * @param {function} onChunk - Callback function to handle each chunk of the response
 * @returns {Promise<void>}
 */
export async function generateStreamingResponse(prompt, onChunk) {
  try {
    const result = await model.generateContentStream({
      contents: [{
        parts: [{ text: prompt }]
      }]
    });
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      onChunk(chunkText);
    }
  } catch (error) {
    console.error('Error generating streaming response:', error);
    throw error;
  }
}

/**
 * Get book recommendations based on user interests
 * @param {string[]} interests - Array of user interests
 * @returns {Promise<Array>} - Array of book recommendations with Google Books data
 */
export async function getBookRecommendationsByInterests(interests) {
  try {
    const prompt = `Based on these interests: ${interests.join(', ')}, recommend 3 books. 
    Return ONLY a JSON array with this exact format, without any markdown or additional text:
    [
      {
        "title": "Book Title",
        "author": "Author Name"
      }
    ]
    Do not include any markdown formatting, backticks, or explanations. Just the pure JSON array.`;

    const response = await generateResponse(prompt);
    
    // Clean the response by removing any markdown formatting
    const cleanResponse = response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    const recommendedBooks = JSON.parse(cleanResponse);
    
    // Fetch detailed book information from Google Books API for each recommendation
    const detailedBooks = await Promise.all(
      recommendedBooks.map(async (book) => {
        try {
          // Search for the book in Google Books API
          const searchResults = await searchBooks(`${book.title} ${book.author}`);
          if (searchResults && searchResults.length > 0) {
            return searchResults[0]; // Return the first matching result
          }
          return null;
        } catch (error) {
          console.error(`Error fetching details for ${book.title}:`, error);
          return null;
        }
      })
    );

    // Filter out any null results and return the detailed books
    return detailedBooks.filter(book => book !== null);
  } catch (error) {
    console.error('Error getting book recommendations:', error);
    throw error;
  }
} 