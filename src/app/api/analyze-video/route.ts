import { NextRequest, NextResponse } from 'next/server'

interface ParsedAnalysis {
  overallScore: number
  feedback: string[]
  keyPoints: {
    setup: { score: number; feedback: string; strengths?: string[]; improvements?: string[] }
    liftOff: { score: number; feedback: string; strengths?: string[]; improvements?: string[] }
    midRange: { score: number; feedback: string; strengths?: string[]; improvements?: string[] }
    lockout: { score: number; feedback: string; strengths?: string[]; improvements?: string[] }
    barPath: { score: number; feedback: string; strengths?: string[]; improvements?: string[] }
  }
  keyRecommendations?: string[]
  practiceAreas?: string[]
  safetyNotes?: string[]
}

function parseGeminiAnalysis(analysisText: string): ParsedAnalysis {
  console.log('Parsing Gemini analysis text...')
  
  // Initialize default structure
  const parsed: ParsedAnalysis = {
    overallScore: 75,
    feedback: [],
    keyPoints: {
      setup: { score: 75, feedback: 'Analysis in progress...', strengths: [], improvements: [] },
      liftOff: { score: 75, feedback: 'Analysis in progress...', strengths: [], improvements: [] },
      midRange: { score: 75, feedback: 'Analysis in progress...', strengths: [], improvements: [] },
      lockout: { score: 75, feedback: 'Analysis in progress...', strengths: [], improvements: [] },
      barPath: { score: 75, feedback: 'Analysis in progress...', strengths: [], improvements: [] }
    },
    keyRecommendations: [],
    practiceAreas: [],
    safetyNotes: []
  }

  try {
    // First, try to parse as JSON
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const jsonData = JSON.parse(jsonMatch[0])
        console.log('Successfully parsed JSON response:', jsonData)
        
        // Extract data from JSON structure
        if (jsonData.overallScore) {
          parsed.overallScore = Math.min(100, Math.max(0, jsonData.overallScore))
        }
        
        if (jsonData.phases) {
          const phases = jsonData.phases
          
          // Map phases to our structure
          const phaseMapping = {
            setup: 'setup',
            liftOff: 'liftOff', 
            midRange: 'midRange',
            lockout: 'lockout',
            barPath: 'barPath'
          }
          
          Object.entries(phaseMapping).forEach(([key, targetKey]) => {
            if (phases[key]) {
              parsed.keyPoints[targetKey as keyof typeof parsed.keyPoints] = {
                score: Math.min(100, Math.max(0, phases[key].score || 75)),
                feedback: phases[key].feedback || 'Analysis completed',
                strengths: phases[key].strengths || [],
                improvements: phases[key].improvements || []
              }
            }
          })
        }
        
        // Extract additional data
        if (jsonData.keyRecommendations && Array.isArray(jsonData.keyRecommendations)) {
          parsed.keyRecommendations = jsonData.keyRecommendations
          parsed.feedback = [...jsonData.keyRecommendations]
        }
        
        if (jsonData.practiceAreas && Array.isArray(jsonData.practiceAreas)) {
          parsed.practiceAreas = jsonData.practiceAreas
        }
        
        if (jsonData.safetyNotes && Array.isArray(jsonData.safetyNotes)) {
          parsed.safetyNotes = jsonData.safetyNotes
        }
        
        console.log('Successfully parsed JSON analysis:', parsed)
        return parsed
        
      } catch (jsonError) {
        console.log('JSON parsing failed, falling back to text parsing:', jsonError)
      }
    }
    
    // Fallback to text parsing if JSON parsing fails
    console.log('Using text parsing method...')
    const text = analysisText.toLowerCase()
    
    // Extract overall score with multiple patterns
    const overallPatterns = [
      /(?:overall|total|final)\s*(?:score)?\s*:?\s*(\d+)(?:\/100)?/i,
      /6\.\s*overall\s*(?:score)?\s*:?\s*(\d+)(?:\/100)?/i,
      /overall\s*assessment\s*:?\s*(\d+)(?:\/100)?/i
    ]
    
    for (const pattern of overallPatterns) {
      const match = analysisText.match(pattern)
      if (match) {
        parsed.overallScore = Math.min(100, Math.max(0, parseInt(match[1])))
        break
      }
    }

    // Helper function to extract score and feedback for each phase
    const extractPhaseData = (phase: string, patterns: RegExp[]) => {
      for (const pattern of patterns) {
        const match = analysisText.match(pattern)
        if (match) {
          const score = Math.min(100, Math.max(0, parseInt(match[1])))
          const feedback = match[2]?.replace(/^[:\-\s]+/, '').trim() || `${phase} analysis completed`
          return { score, feedback: feedback.substring(0, 200), strengths: [], improvements: [] }
        }
      }
      return null
    }

    // Extract setup data
    const setupPatterns = [
      /1\.\s*setup[^\n]*?(?:score)?\s*:?\s*(\d+)(?:\/100)?([^\n]*(?:\n(?!\d\.).*)?)/i,
      /setup[^\n]*?(?:score|rating)?\s*:?\s*(\d+)(?:\/100)?([^\n]*(?:\n(?!\d\.).*)?)/i
    ]
    const setupData = extractPhaseData('Setup', setupPatterns)
    if (setupData) {
      parsed.keyPoints.setup = setupData
    }

    // Extract lift-off data
    const liftOffPatterns = [
      /2\.\s*lift[\-\s]?off[^\n]*?(?:score)?\s*:?\s*(\d+)(?:\/100)?([^\n]*(?:\n(?!\d\.).*)?)/i,
      /(?:lift[\-\s]?off|initial\s+pull)[^\n]*?(?:score|rating)?\s*:?\s*(\d+)(?:\/100)?([^\n]*(?:\n(?!\d\.).*)?)/i
    ]
    const liftOffData = extractPhaseData('Lift-off', liftOffPatterns)
    if (liftOffData) {
      parsed.keyPoints.liftOff = liftOffData
    }

    // Extract mid-range data
    const midRangePatterns = [
      /3\.\s*mid[\-\s]?range[^\n]*?(?:score)?\s*:?\s*(\d+)(?:\/100)?([^\n]*(?:\n(?!\d\.).*)?)/i,
      /(?:mid[\-\s]?range|execution)[^\n]*?(?:score|rating)?\s*:?\s*(\d+)(?:\/100)?([^\n]*(?:\n(?!\d\.).*)?)/i
    ]
    const midRangeData = extractPhaseData('Mid-range', midRangePatterns)
    if (midRangeData) {
      parsed.keyPoints.midRange = midRangeData
    }

    // Extract lockout data
    const lockoutPatterns = [
      /4\.\s*lockout[^\n]*?(?:score)?\s*:?\s*(\d+)(?:\/100)?([^\n]*(?:\n(?!\d\.).*)?)/i,
      /lockout[^\n]*?(?:score|rating)?\s*:?\s*(\d+)(?:\/100)?([^\n]*(?:\n(?!\d\.).*)?)/i
    ]
    const lockoutData = extractPhaseData('Lockout', lockoutPatterns)
    if (lockoutData) {
      parsed.keyPoints.lockout = lockoutData
    }

    // Extract bar path data
    const barPathPatterns = [
      /5\.\s*bar\s+path[^\n]*?(?:score)?\s*:?\s*(\d+)(?:\/100)?([^\n]*(?:\n(?!\d\.).*)?)/i,
      /(?:bar\s+path|trajectory)[^\n]*?(?:score|rating)?\s*:?\s*(\d+)(?:\/100)?([^\n]*(?:\n(?!\d\.).*)?)/i
    ]
    const barPathData = extractPhaseData('Bar path', barPathPatterns)
    if (barPathData) {
      parsed.keyPoints.barPath = barPathData
    }

    // Extract general feedback
    const lines = analysisText.split('\n')
    const feedbackLines = lines.filter(line => {
      const trimmed = line.trim().toLowerCase()
      return trimmed.length > 15 && (
        trimmed.includes('recommend') ||
        trimmed.includes('improve') ||
        trimmed.includes('focus') ||
        trimmed.includes('should') ||
        trimmed.includes('try') ||
        trimmed.includes('practice') ||
        trimmed.startsWith('•') ||
        trimmed.startsWith('-') ||
        trimmed.startsWith('*')
      )
    })

    if (feedbackLines.length > 0) {
      parsed.feedback = feedbackLines
        .slice(0, 4)
        .map(line => line.replace(/^[•\-*]\s*/, '').trim())
        .filter(line => line.length > 10)
    }

    // Fallback for feedback if none found
    if (parsed.feedback.length === 0) {
      const sentences = analysisText
        .split(/[.!?]+/)
        .filter(s => s.trim().length > 20 && s.trim().length < 150)
        .slice(0, 3)
        .map(s => s.trim())
      
      parsed.feedback = sentences.length > 0 ? sentences : ['Analysis completed successfully']
    }

    console.log('Successfully parsed analysis:', parsed)
    
  } catch (error) {
    console.error('Error parsing analysis:', error)
    parsed.feedback = ['Analysis completed - see console for details']
  }

  return parsed
}

export async function POST(request: NextRequest) {
  try {
    const { videoFile, prompt } = await request.json()
    
    if (!videoFile) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      )
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    console.log('Starting Gemini API call for video analysis...')
    console.log('Video file size:', videoFile.length, 'characters (base64)')
    console.log('Prompt:', prompt || 'Analyze this deadlift video')

    // Prepare the request payload for Gemini API
    const requestPayload = {
      contents: [
        {
          parts: [
            {
              text: prompt || `Analyze this video of a person deadlifting. Consider Setup / lift off / mid range / lockout and bar path with extra recommendations and an overall score in a consumable JSON format.

Please provide your analysis in the following JSON structure:
{
  "overallScore": 85,
  "phases": {
    "setup": {
      "score": 80,
      "feedback": "Detailed feedback about setup phase",
      "strengths": ["What was done well"],
      "improvements": ["What needs work"]
    },
    "liftOff": {
      "score": 75,
      "feedback": "Detailed feedback about lift-off",
      "strengths": ["What was done well"],
      "improvements": ["What needs work"]
    },
    "midRange": {
      "score": 85,
      "feedback": "Detailed feedback about mid-range",
      "strengths": ["What was done well"],
      "improvements": ["What needs work"]
    },
    "lockout": {
      "score": 90,
      "feedback": "Detailed feedback about lockout",
      "strengths": ["What was done well"],
      "improvements": ["What needs work"]
    },
    "barPath": {
      "score": 70,
      "feedback": "Detailed feedback about bar path",
      "strengths": ["What was done well"],
      "improvements": ["What needs work"]
    }
  },
  "keyRecommendations": [
    "Most important recommendation 1",
    "Most important recommendation 2",
    "Most important recommendation 3"
  ],
  "practiceAreas": [
    "Specific drill or exercise 1",
    "Specific drill or exercise 2"
  ],
  "safetyNotes": [
    "Important safety consideration 1",
    "Important safety consideration 2"
  ]
}`
            },
            {
              inline_data: {
                mime_type: "video/mp4",
                data: videoFile
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    }

    console.log('Making request to Gemini API...')
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', response.status, errorText)
      return NextResponse.json(
        { error: `Gemini API error: ${response.status}` },
        { status: response.status }
      )
    }

    const result = await response.json()
    console.log('Gemini API response received successfully')
    console.log('Response structure:', JSON.stringify(result, null, 2))
    
    // Extract the text content from Gemini response
    const analysisText = result.candidates?.[0]?.content?.parts?.[0]?.text || 'No analysis text received'
    console.log('Analysis text:', analysisText)

    // Parse the analysis text to extract structured data
    const structuredAnalysis = parseGeminiAnalysis(analysisText)
    console.log('Structured analysis:', structuredAnalysis)

    return NextResponse.json({
      success: true,
      rawAnalysis: analysisText,
      structuredAnalysis: structuredAnalysis,
      fullResponse: result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in video analysis:', error)
    return NextResponse.json(
      { error: 'Internal server error during analysis' },
      { status: 500 }
    )
  }
}
