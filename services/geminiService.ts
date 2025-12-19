
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedSong, SongPreset } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export const generateSong = async (
  prompt: string,
  preset: SongPreset,
  existingSong?: GeneratedSong,
  feedback?: string,
  additionalContext?: string
): Promise<GeneratedSong> => {
  // Use process.env.API_KEY directly to avoid potential issues with injected environment variables.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let userPrompt = "";
  
  const contextBlock = additionalContext ? `
    ADDITIONAL CONTEXT & BACKGROUND:
    "${additionalContext}"
  ` : "";

  if (existingSong) {
    userPrompt = `
      REFINE AND POLISH THIS SONG.
      
      The user has provided an existing draft (which may contain manual edits and verse suggestions). 
      Your job is to polish the lyrics, ensure perfect rhythm and meter for a sing-along, and integrate the user's feedback.

      ${contextBlock}

      EXISTING DRAFT (Current state of song):
      ${JSON.stringify(existingSong, null, 2)}
      
      USER'S SPECIFIC NOTES / FEEDBACK:
      "${feedback || 'Please polish the current draft and ensure it follows the style.'}"
      
      ORIGINAL CONTEXT/STORY:
      "${prompt || 'Maintain existing theme.'}"

      REQUIRED STYLE:
      - Name: ${preset.name}
      - Rhythm Style: ${preset.rhythmStyle}
      - Rhyme Scheme: ${preset.rhymeScheme}
      
      IMPORTANT: 
      1. If the user edited specific lines, try to keep their meaning but fix the meter/rhyme if needed to make it singable.
      2. Ensure the "Chorus" is extremely catchy and simple.
      3. Return the full, completed song structure in the specified JSON format.
    `;
  } else {
    userPrompt = `
      GENERATE A NEW SING-ALONG SONG.

      STORY/IDEA: "${prompt}"

      ${contextBlock}

      STYLE:
      - Name: ${preset.name}
      - Rhythm Style: ${preset.rhythmStyle}
      - Rhyme Scheme: ${preset.rhymeScheme}
      
      The song MUST be:
      1. Catchy and repetitive.
      2. Rhythmic (consistent syllables per line).
      3. Easy for "tone-deaf" people to join in.
      
      Output the title, mood, tempo, performance tips, and a series of song parts (Verse, Chorus, etc.).
    `;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: userPrompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          mood: { type: Type.STRING },
          tempo: { type: Type.STRING },
          tips: { type: Type.STRING },
          parts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ['Verse', 'Chorus', 'Bridge', 'Outro'] },
                lines: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ['type', 'lines']
            }
          }
        },
        required: ['title', 'mood', 'tempo', 'tips', 'parts']
      }
    }
  });

  // Access the .text property directly. It is a getter, not a method.
  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  try {
    return JSON.parse(text) as GeneratedSong;
  } catch (e) {
    console.error("Failed to parse AI response", text);
    throw new Error("The Genie struggled with that format. Please try refining again.");
  }
};
