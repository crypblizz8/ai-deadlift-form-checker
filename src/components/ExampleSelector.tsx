'use client'

import { useState } from 'react'

interface ExampleVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  url: string
  expectedScore: number
}

interface ExampleSelectorProps {
  onExampleSelect: (url: string) => void
}

const exampleVideos: ExampleVideo[] = [
  {
    id: 'good-form',
    title: 'Good Form Example',
    description: 'Proper deadlift technique with excellent bar path and posture',
    thumbnail: '/api/placeholder/300/200',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    expectedScore: 92
  },
  {
    id: 'moderate-form',
    title: 'Moderate Form',
    description: 'Decent technique with some areas for improvement',
    thumbnail: '/api/placeholder/300/200',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    expectedScore: 78
  },
  {
    id: 'needs-work',
    title: 'Form Needs Work',
    description: 'Common mistakes that need correction',
    thumbnail: '/api/placeholder/300/200',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
    expectedScore: 65
  }
]

export default function ExampleSelector({ onExampleSelect }: ExampleSelectorProps) {
  const [selectedExample, setSelectedExample] = useState<string | null>(null)

  const handleExampleClick = (example: ExampleVideo) => {
    setSelectedExample(example.id)
    // In a real app, these would be actual deadlift videos
    // For demo purposes, we'll use a placeholder video URL
    onExampleSelect(example.url)
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">
        Choose from our curated examples to see how the AI analysis works
      </p>
      
      {exampleVideos.map((example) => (
        <div
          key={example.id}
          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedExample === example.id 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleExampleClick(example)}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-20 h-14 bg-gray-200 rounded-md flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16v-4a2 2 0 012-2h2a2 2 0 012 2v4M9 12V9a4 4 0 118 0v3" />
                </svg>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {example.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    example.expectedScore >= 90 
                      ? 'bg-green-100 text-green-800'
                      : example.expectedScore >= 75
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {example.expectedScore}/100
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {example.description}
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <svg 
                className={`w-5 h-5 transition-colors ${
                  selectedExample === example.id ? 'text-blue-600' : 'text-gray-400'
                }`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      ))}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Example Videos</h4>
            <p className="text-sm text-blue-700">
              These are placeholder videos for demonstration. In a real implementation, 
              these would be actual deadlift videos with different form qualities.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
