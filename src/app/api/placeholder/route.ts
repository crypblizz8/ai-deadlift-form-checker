import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const width = searchParams.get('width') || '300'
  const height = searchParams.get('height') || '200'
  
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <rect x="50%" y="50%" width="40" height="30" fill="#9ca3af" transform="translate(-20, -15)"/>
      <circle cx="50%" cy="45%" r="5" fill="#6b7280"/>
      <polygon points="45%,55% 55%,55% 50%,65%" fill="#6b7280"/>
      <text x="50%" y="80%" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">
        Video Thumbnail
      </text>
    </svg>
  `
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}
