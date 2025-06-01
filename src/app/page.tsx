'use client';

import { useState } from 'react';
import VideoUpload from '@/components/VideoUpload';
import VideoAnalysis from '@/components/VideoAnalysis';
import ExampleSelector from '@/components/ExampleSelector';

export interface AnalysisResult {
  overallScore: number;
  feedback: string[];
  keyPoints: {
    setup: { score: number; feedback: string };
    liftOff: { score: number; feedback: string };
    midRange: { score: number; feedback: string };
    lockout: { score: number; feedback: string };
    barPath: { score: number; feedback: string };
  };
  timestamp: string;
}

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleVideoUpload = (file: File) => {
    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setAnalysis(null);
    setShowAnalysis(false);
  };

  const handleExampleSelect = (exampleUrl: string) => {
    setVideoFile(null);
    setVideoUrl(exampleUrl);
    setAnalysis(null);
    setShowAnalysis(false);
  };

  const analyzeVideo = async () => {
    if (!videoUrl) return;
    
    setIsAnalyzing(true);
    
    try {
      // Only analyze with Gemini if we have an actual uploaded file
      if (videoFile) {
        // Convert video file to base64 for Gemini API
        const base64Video = await convertVideoToBase64(videoFile);
        
        console.log('Sending video to Gemini API for analysis...');
        
        const response = await fetch('/api/analyze-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            videoFile: base64Video,
            prompt: `Analyze this video of a person deadlifting. Consider Setup / lift off / mid range / lockout and bar path with extra recommendations and an overall score in a consumable JSON format.

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
          })
        });

        if (!response.ok) {
          throw new Error(`Analysis failed: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Gemini analysis result:', result);
        
        if (!result.success) {
          throw new Error('Analysis was not successful');
        }

        // Use the structured analysis from Gemini API
        const geminiAnalysis: AnalysisResult = {
          overallScore: result.structuredAnalysis?.overallScore || 75,
          feedback: result.structuredAnalysis?.feedback || [
            "AI Analysis from Gemini:",
            result.rawAnalysis || "No analysis available"
          ],
          keyPoints: {
            setup: { 
              score: result.structuredAnalysis?.keyPoints?.setup?.score || 75, 
              feedback: result.structuredAnalysis?.keyPoints?.setup?.feedback || "Analysis completed",
              strengths: result.structuredAnalysis?.keyPoints?.setup?.strengths || [],
              improvements: result.structuredAnalysis?.keyPoints?.setup?.improvements || []
            },
            liftOff: { 
              score: result.structuredAnalysis?.keyPoints?.liftOff?.score || 75, 
              feedback: result.structuredAnalysis?.keyPoints?.liftOff?.feedback || "Analysis completed",
              strengths: result.structuredAnalysis?.keyPoints?.liftOff?.strengths || [],
              improvements: result.structuredAnalysis?.keyPoints?.liftOff?.improvements || []
            },
            midRange: { 
              score: result.structuredAnalysis?.keyPoints?.midRange?.score || 75, 
              feedback: result.structuredAnalysis?.keyPoints?.midRange?.feedback || "Analysis completed",
              strengths: result.structuredAnalysis?.keyPoints?.midRange?.strengths || [],
              improvements: result.structuredAnalysis?.keyPoints?.midRange?.improvements || []
            },
            lockout: { 
              score: result.structuredAnalysis?.keyPoints?.lockout?.score || 75, 
              feedback: result.structuredAnalysis?.keyPoints?.lockout?.feedback || "Analysis completed",
              strengths: result.structuredAnalysis?.keyPoints?.lockout?.strengths || [],
              improvements: result.structuredAnalysis?.keyPoints?.lockout?.improvements || []
            },
            barPath: { 
              score: result.structuredAnalysis?.keyPoints?.barPath?.score || 75, 
              feedback: result.structuredAnalysis?.keyPoints?.barPath?.feedback || "Analysis completed",
              strengths: result.structuredAnalysis?.keyPoints?.barPath?.strengths || [],
              improvements: result.structuredAnalysis?.keyPoints?.barPath?.improvements || []
            }
          },
          timestamp: result.timestamp,
          keyRecommendations: result.structuredAnalysis?.keyRecommendations || [],
          practiceAreas: result.structuredAnalysis?.practiceAreas || [],
          safetyNotes: result.structuredAnalysis?.safetyNotes || []
        };

        setAnalysis(geminiAnalysis);
        
      } else {
        // Fallback to mock analysis for example videos
        const mockAnalysis: AnalysisResult = {
          overallScore: Math.floor(Math.random() * 30) + 70,
          feedback: [
            'Example video analysis (mock data)',
            'Upload your own video for AI-powered analysis',
          ],
          keyPoints: {
            setup: {
              score: Math.floor(Math.random() * 20) + 80,
              feedback: 'Example analysis - upload your video for real AI feedback',
            },
            liftOff: {
              score: Math.floor(Math.random() * 25) + 75,
              feedback: 'Mock data for demonstration purposes',
            },
            midRange: {
              score: Math.floor(Math.random() * 30) + 70,
              feedback: 'Real analysis available with video upload',
            },
            lockout: {
              score: Math.floor(Math.random() * 15) + 85,
              feedback: 'Example feedback for demo',
            },
            barPath: {
              score: Math.floor(Math.random() * 35) + 65,
              feedback: 'Upload your own video for personalized feedback',
            },
          },
          timestamp: new Date().toISOString(),
        };
        setAnalysis(mockAnalysis);
      }
      
      setShowAnalysis(true);
      
    } catch (error) {
      console.error('Video analysis failed:', error);
      alert('Video analysis failed. Please try again or check the console for details.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const convertVideoToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:video/mp4;base64,")
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const resetAnalysis = () => {
    setVideoFile(null);
    setVideoUrl('');
    setAnalysis(null);
    setShowAnalysis(false);
  };

  return (
    <div className='min-h-screen py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-4'>
            AI Deadlift Form Checker
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Upload your deadlift video or try an example to get instant
            AI-powered form analysis and personalized feedback
          </p>
        </div>

        {!showAnalysis ? (
          <div className=''>
            {/* Video Upload Section */}
            <div className='card'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                Upload Your Video
              </h2>
              <VideoUpload onVideoUpload={handleVideoUpload} />
            </div>

            {/* Example Videos Section */}
            {/* <div className='card'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                Try an Example
              </h2>
              <ExampleSelector onExampleSelect={handleExampleSelect} />
            </div> */}
          </div>
        ) : null}

        {/* Video Preview and Analysis */}
        {videoUrl && (
          <div className='card mb-8'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold text-gray-900'>
                {showAnalysis ? 'Analysis Results' : 'Video Preview'}
              </h2>
              <button onClick={resetAnalysis} className='btn-secondary'>
                Upload New Video
              </button>
            </div>

            <div className={`${!showAnalysis ? 'flex justify-center' : 'grid lg:grid-cols-2 gap-8'}`}>
              {/* Video Player */}
              <div className={`${!showAnalysis ? 'max-w-md w-full' : ''}`}>
                <video
                  src={videoUrl}
                  controls
                  className='w-full rounded-lg shadow-md'
                  style={{ maxHeight: '400px' }}
                >
                  Your browser does not support the video tag.
                </video>

                {!showAnalysis && (
                  <div className='mt-6 text-center'>
                    <button
                      onClick={analyzeVideo}
                      disabled={isAnalyzing}
                      className='btn-primary disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {isAnalyzing ? (
                        <span className='flex items-center justify-center'>
                          <svg
                            className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                          >
                            <circle
                              className='opacity-25'
                              cx='12'
                              cy='12'
                              r='10'
                              stroke='currentColor'
                              strokeWidth='4'
                            ></circle>
                            <path
                              className='opacity-75'
                              fill='currentColor'
                              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            ></path>
                          </svg>
                          Analyzing Form...
                        </span>
                      ) : (
                        'Analyze My Form'
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Analysis Results */}
              {showAnalysis && analysis && (
                <VideoAnalysis analysis={analysis} />
              )}
            </div>
          </div>
        )}

        {/* Features Section */}
      </div>
    </div>
  );
}
