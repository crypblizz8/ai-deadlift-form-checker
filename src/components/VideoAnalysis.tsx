'use client';

import { AnalysisResult } from '@/app/page';

interface VideoAnalysisProps {
  analysis: AnalysisResult;
}

export default function VideoAnalysis({ analysis }: VideoAnalysisProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-yellow-600 bg-yellow-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreColorBar = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Needs Work';
    return 'Poor';
  };

  return (
    <div className='space-y-6'>
      {/* Overall Score */}
      <div className='text-center'>
        <h3 className='text-2xl font-bold text-gray-900 mb-4'>Form Analysis</h3>
        <div className='inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-4'>
          <span className='text-3xl font-bold text-gray-900'>
            {analysis.overallScore}
          </span>
        </div>
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
            analysis.overallScore
          )}`}
        >
          {getScoreLabel(analysis.overallScore)}
        </div>
      </div>

      {/* Key Points Analysis */}
      <div>
        <h4 className='text-lg font-semibold text-gray-900 mb-4'>
          Detailed Breakdown
        </h4>
        <div className='space-y-4'>
          {Object.entries(analysis.keyPoints).map(([key, point]) => (
            <div key={key} className='border border-gray-200 rounded-lg p-4'>
              <div className='flex items-center justify-between mb-2'>
                <h5 className='font-medium text-gray-900 capitalize'>
                  {key === 'liftOff'
                    ? 'Lift Off'
                    : key === 'midRange'
                    ? 'Mid Range'
                    : key === 'barPath'
                    ? 'Bar Path'
                    : key}
                </h5>
                <div className='flex items-center space-x-2'>
                  <span className='text-sm font-medium text-gray-700'>
                    {point.score}/100
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full ${getScoreColorBar(
                      point.score
                    )}`}
                  ></div>
                </div>
              </div>

              {/* Score Bar */}
              <div className='w-full bg-gray-200 rounded-full h-2 mb-3'>
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getScoreColorBar(
                    point.score
                  )}`}
                  style={{ width: `${point.score}%` }}
                ></div>
              </div>

              <p className='text-sm text-gray-600 mb-3'>{point.feedback}</p>

              {'strengths' in point &&
                point.strengths &&
                point.strengths.length > 0 && (
                  <div className='mb-2'>
                    <h6 className='text-xs font-medium text-green-700 mb-1'>
                      Strengths:
                    </h6>
                    <ul className='text-xs text-green-600 space-y-1'>
                      {point.strengths.map((strength, index) => (
                        <li key={index} className='flex items-start space-x-1'>
                          <span className='text-green-500 mt-0.5'>•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {'improvements' in point &&
                point.improvements &&
                point.improvements.length > 0 && (
                  <div>
                    <h6 className='text-xs font-medium text-orange-700 mb-1'>
                      Areas for Improvement:
                    </h6>
                    <ul className='text-xs text-orange-600 space-y-1'>
                      {point.improvements.map((improvement, index) => (
                        <li key={index} className='flex items-start space-x-1'>
                          <span className='text-orange-500 mt-0.5'>•</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      {/* General Feedback */}
      <div>
        <h4 className='text-lg font-semibold text-gray-900 mb-4'>
          Key Recommendations
        </h4>
        <div className='bg-blue-50 rounded-lg p-4'>
          <ul className='space-y-2'>
            {analysis.feedback.map((item, index) => (
              <li key={index} className='flex items-start space-x-2'>
                <svg
                  className='w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span className='text-sm text-blue-800'>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Items */}
      <div>
        <h4 className='text-lg font-semibold text-gray-900 mb-4'>Next Steps</h4>
        <div className='grid gap-4'>
          {/* Practice Areas from AI */}
          {analysis.practiceAreas && analysis.practiceAreas.length > 0 && (
            <div className='border border-gray-200 rounded-lg p-4'>
              <div className='flex items-center space-x-2 mb-2'>
                <svg
                  className='w-5 h-5 text-purple-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                  />
                </svg>
                <h5 className='font-medium text-gray-900'>
                  Practice Focus Areas
                </h5>
              </div>
              <ul className='text-sm text-gray-600 space-y-1'>
                {analysis.practiceAreas.map((area, index) => (
                  <li key={index} className='flex items-start space-x-2'>
                    <span className='text-purple-500 mt-1'>•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Safety Notes from AI */}
          {analysis.safetyNotes && analysis.safetyNotes.length > 0 && (
            <div className='border border-red-200 bg-red-50 rounded-lg p-4'>
              <div className='flex items-center space-x-2 mb-2'>
                <svg
                  className='w-5 h-5 text-red-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
                  />
                </svg>
                <h5 className='font-medium text-red-900'>
                  Safety Considerations
                </h5>
              </div>
              <ul className='text-sm text-red-700 space-y-1'>
                {analysis.safetyNotes.map((note, index) => (
                  <li key={index} className='flex items-start space-x-2'>
                    <span className='text-red-500 mt-1'>•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Default practice areas if none from AI */}
          {(!analysis.practiceAreas || analysis.practiceAreas.length === 0) && (
            <div className='border border-gray-200 rounded-lg p-4'>
              <div className='flex items-center space-x-2 mb-2'>
                <svg
                  className='w-5 h-5 text-purple-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                  />
                </svg>
                <h5 className='font-medium text-gray-900'>
                  Practice Focus Areas
                </h5>
              </div>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>
                  • Work on maintaining a neutral spine throughout the lift
                </li>
                <li>
                  • Practice the hip hinge movement pattern with lighter weights
                </li>
                <li>
                  • Focus on keeping the bar close to your body during the
                  ascent
                </li>
              </ul>
            </div>
          )}

          <div className='border border-gray-200 rounded-lg p-4'>
            <div className='flex items-center space-x-2 mb-2'>
              <svg
                className='w-5 h-5 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
              <h5 className='font-medium text-gray-900'>Track Progress</h5>
            </div>
            <p className='text-sm text-gray-600'>
              Record another video after practicing these techniques to see your
              improvement over time.
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Timestamp */}
      <div className='text-center pt-4 border-t border-gray-200'>
        <p className='text-xs text-gray-500'>
          Analysis completed on{' '}
          {new Date(analysis.timestamp).toLocaleDateString()} at{' '}
          {new Date(analysis.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
