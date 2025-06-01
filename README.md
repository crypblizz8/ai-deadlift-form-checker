# AI Deadlift Form Checker

A Next.js application that uses AI to analyze deadlift form from uploaded videos or example videos, providing detailed feedback and scoring.

## Features

- **Video Upload**: Drag and drop or click to upload deadlift videos
- **Example Videos**: Try pre-selected example videos with different form qualities
- **AI Analysis**: Simulated AI analysis of deadlift technique with detailed scoring
- **Detailed Feedback**: Comprehensive breakdown of different lift phases
- **Responsive Design**: Works on desktop and mobile devices
- **Clean UI**: Built with Tailwind CSS for a modern, professional look

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React** - Component-based UI library

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
   ```bash
   cd deadlift-form-checker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   Get your API key from: https://makersuite.google.com/app/apikey

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
deadlift-form-checker/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles and Tailwind imports
│   │   ├── layout.tsx           # Root layout component
│   │   └── page.tsx             # Main page component
│   └── components/
│       ├── VideoUpload.tsx      # Video upload component
│       ├── ExampleSelector.tsx  # Example video selector
│       └── VideoAnalysis.tsx    # Analysis results display
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── next.config.js              # Next.js configuration
```

## How It Works

1. **Upload or Select**: Users can either upload their own deadlift videos or select from example videos
2. **AI Analysis**: 
   - **Real Videos**: Uploaded videos are analyzed using Google's Gemini 2.0 Flash model with vision capabilities
   - **Example Videos**: Mock analysis for demonstration (no actual video files)
3. **Results**: Detailed analysis is displayed including:
   - Overall score (0-100)
   - Breakdown by lift phases (Setup, Lift Off, Mid Range, Lockout, Bar Path)
   - Specific feedback for each phase
   - General recommendations from AI
   - Next steps for improvement

## AI Integration

The app integrates with **Google's Gemini 2.0 Flash** model for video analysis:

- **Model**: `gemini-2.0-flash` - Advanced multimodal AI with vision capabilities
- **Analysis**: Videos are converted to base64 and sent to Gemini API
- **Response**: Detailed textual analysis of deadlift form and technique
- **Console Logging**: Full API responses are logged to browser console for debugging

## Features in Detail

### Video Upload
- Drag and drop interface
- File type validation (video files only)
- File size limit (100MB)
- Upload progress indicator
- Support for MP4, MOV, AVI formats

### Analysis Components
- **Setup**: Foot positioning, shoulder alignment, initial posture
- **Lift Off**: Initial pull mechanics, leg drive
- **Mid Range**: Bar path maintenance, body positioning
- **Lockout**: Hip extension, final positioning
- **Bar Path**: Overall bar trajectory analysis

### Scoring System
- **90-100**: Excellent form
- **75-89**: Good form with minor improvements needed
- **60-74**: Moderate form, needs work
- **Below 60**: Poor form, significant improvement needed

## Customization

### Adding Real AI Integration

To integrate with a real AI service, modify the `analyzeVideo` function in `src/app/page.tsx`:

```typescript
const analyzeVideo = async () => {
  if (!videoUrl) return
  
  setIsAnalyzing(true)
  
  try {
    // Replace this with actual AI service call
    const response = await fetch('/api/analyze-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoUrl })
    })
    
    const analysis = await response.json()
    setAnalysis(analysis)
  } catch (error) {
    console.error('Analysis failed:', error)
  } finally {
    setIsAnalyzing(false)
    setShowAnalysis(true)
  }
}
```

### Styling Customization

The app uses Tailwind CSS with custom components defined in `globals.css`:
- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.card` - Card container styling
- `.upload-area` - File upload area styling

## Future Enhancements

- Real AI integration with computer vision models
- User authentication and progress tracking
- Video playback with frame-by-frame analysis
- Comparison with previous uploads
- Export analysis reports
- Mobile app version
- Integration with fitness tracking platforms

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for demonstration purposes. In a production environment, ensure proper licensing for any AI models or services used.

## Support

For questions or issues, please check the documentation or create an issue in the repository.
