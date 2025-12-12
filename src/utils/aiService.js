import { GoogleGenerativeAI } from "@google/generative-ai";
import { songs } from "./songs"; 

// 👇 PASTE YOUR KEY INSIDE THESE QUOTES ONLY. DO NOT PASTE CODE HERE.
const API_KEY = "AIzaSyAebc5G81uTmShjos4CNF4oARscQlDW-0c"; 

const genAI = new GoogleGenerativeAI(API_KEY);

export const getSmartRecommendation = async (likedSong) => {
  console.log("🤖 AI Service: Analyzing match for", likedSong.title);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 1. Filter out the song we just heard
    const availableSongs = songs.filter(s => s.id !== likedSong.id);

    // 2. The Prompt
    const prompt = `
      I am a DJ AI. 
      The user just listened to "${likedSong.title}" by ${likedSong.artist}.
      Attributes: ${likedSong.tags ? likedSong.tags.join(", ") : "pop"}.
      
      Here is my available library:
      ${JSON.stringify(availableSongs.map(s => ({ id: s.id, title: s.title, tags: s.tags })))}

      Task: Select the ONE song from the library that best matches the vibe.
      Output Constraint: Return ONLY the ID number (e.g. 2). No text.
    `;

    // 3. Call Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    const recommendedId = parseInt(text);

    console.log(`🤖 AI Suggestion ID: ${recommendedId}`);
    
    // Return the song object
    return songs.find(s => s.id === recommendedId) || availableSongs[0];

  } catch (error) {
    console.error("AI Error:", error);
    // Fallback: If AI fails, play the next song in list
    return songs.find(s => s.id !== likedSong.id);
  }
};