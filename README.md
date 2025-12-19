# 🎙️ Sing-Along Genie

**Sing-Along Genie** is an AI-powered songwriting assistant designed to turn your stories, memories, or silly ideas into catchy, rhythmic hits. Whether you're a parent looking for a custom nursery rhyme, a troop leader needing a campfire anthem, or a shower singer dreaming of a power ballad, the Genie has you covered.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Features

- **Story-to-Song Engine**: Input a simple story or a list of "in-jokes," and the AI generates rhythmic, rhyming lyrics.
- **Categorized Presets**:
  - **For Kids**: Classic Nursery, Animal Safari, Sweet Lullaby.
  - **Group Sing-Alongs**: Pub Anthems, Campfire Folk, Sea Shanties, Troop Cadences.
  - **Solo Singing**: Upbeat Pop, Power Ballads, Jazz Crooners, Country Stories.
- **Interactive Lyric Editor**: Manually tweak any line or change song structures (Verse, Chorus, Bridge, Outro).
- **AI Refinement**: Use the "Genie Polish" tool to ask for specific changes like "make it funnier" or "fix the rhymes in verse 2."
- **Performance Guides**: Every song comes with custom performance tips and tempo suggestions.
- **Export Options**: 
  - **HTML Lyrics**: Generates a beautifully styled, print-ready document of just the lyrics.
  - **JSON Data**: Save your song data to reload and edit later.

## 🚀 Tech Stack

- **Frontend**: React (v19)
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API via `@google/genai`
- **Icons**: FontAwesome 6
- **Fonts**: Google Fonts (Fredoka & Outfit)

## 🛠️ Getting Started

### Prerequisites

- A [Google AI Studio API Key](https://aistudio.google.com/)
- Node.js (for local development)

### Environment Variables

The application requires an API key from Google. Ensure you have the following environment variable configured:

```env
API_KEY=your_gemini_api_key_here
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sing-along-genie.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm start
   ```

## 📖 Usage

1. **The Story**: Enter your story or prompt in the main text area.
2. **Context**: (Optional) Add specific details you want the AI to remember, like names or specific events.
3. **The Vibe**: Select a musical style from the categorized dropdown.
4. **Generate**: Hit "Write My Song" and watch the Genie work.
5. **Edit & Polish**: Use the editor to change lines yourself, or type a request in the Refinement Box to let the AI fix it.
6. **Export**: Save your masterpiece as an HTML file for sharing or a JSON file for backup.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Generative AI team for the Gemini API.
- The community for providing inspiration for the sing-along presets.

---
*Created with ❤️ for singers everywhere.*
