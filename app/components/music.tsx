'use client'

import { useEffect, useState } from 'react'
import { Disc3 } from 'lucide-react'

interface Track {
  artist: {
    '#text': string
  }
  name: string
  album: {
    '#text': string
  }
  image: {
    size: string
    '#text': string
  }[]
  '@attr'?: {
    nowplaying: string
  }
  url: string
}

interface LastFmData {
  recenttracks?: {
    track: Track[]
  }
}

export function MusicPlayer() {
  const [musicData, setMusicData] = useState<LastFmData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/lastfm')
        
        if (!response.ok) {
          throw new Error('Failed to fetch music data')
        }
        
        const data = await response.json()
        setMusicData(data)
      } catch (err) {
        setError('Could not load music data')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMusicData()
    
    // Refresh every minute
    const intervalId = setInterval(fetchMusicData, 60000)
    
    return () => clearInterval(intervalId)
  }, [])

  // Get currently playing track if exists
  const nowPlayingTrack = musicData?.recenttracks?.track.find(
    track => track['@attr']?.nowplaying === 'true'
  )
  
  // Get recent tracks (excluding now playing)
  const recentTracks = musicData?.recenttracks?.track.filter(
    track => !track['@attr']?.nowplaying
  ).slice(0, 3) || []

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="mb-2 flex items-center">
          <span className="text-amber-400 mr-2">$</span>
          <h2 className="text-lg font-semibold tracking-tight">
            sptfy --now-playing
          </h2>
        </div>
        <div className="bg-gray-900 p-2.5 rounded-md border border-gray-800">
          <p className="text-gray-300 text-xs">loading music data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-6">
        <div className="mb-2 flex items-center">
          <span className="text-amber-400 mr-2">$</span>
          <h2 className="text-lg font-semibold tracking-tight">
            sptfy --now-playing
          </h2>
        </div>
        <div className="bg-gray-900 p-2.5 rounded-md border border-gray-800">
          <p className="text-gray-300 text-xs">error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-2 flex items-center">
        <span className="text-amber-400 mr-2">$</span>
        <h2 className="text-lg font-semibold tracking-tight">
          sptfy --now-playing
        </h2>
      </div>
      <div className="bg-gray-900 p-2.5 rounded-md border border-gray-800">
        {nowPlayingTrack ? (
          <div className="mb-2">
            <div className="flex items-center mb-1.5">
              <Disc3 className="h-3 w-3 text-green-400 animate-spin mr-1.5" />
              <span className="text-green-400 text-[10px] font-medium">NOW PLAYING</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0">
                <img 
                  src={nowPlayingTrack.image.find(img => img.size === "medium")?.['#text'] || ''} 
                  alt={`${nowPlayingTrack.name} album art`}
                  className="w-10 h-10 rounded-sm"
                />
              </div>
              <div className="flex flex-col justify-center">
                <a 
                  href={nowPlayingTrack.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 text-xs font-medium hover:underline leading-tight"
                >
                  {nowPlayingTrack.name}
                </a>
                <p className="text-gray-400 text-[10px] leading-tight mt-0.5">{nowPlayingTrack.artist['#text']}</p>
                <p className="text-gray-500 text-[10px] leading-tight mt-0.5">{nowPlayingTrack.album['#text']}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-300 text-xs mb-2">Not playing any music right now.</p>
        )}
        
        {recentTracks.length > 0 && (
          <>
            <div className="text-gray-400 text-[10px] mb-1.5 mt-2 border-t border-gray-800 pt-2">
              Recent tracks:
            </div>
            <div className="space-y-1.5">
              {recentTracks.map((track, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <img 
                      src={track.image.find(img => img.size === "small")?.['#text'] || ''} 
                      alt={`${track.name} album art`}
                      className="w-6 h-6 rounded-sm"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <a 
                      href={track.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 text-[10px] hover:underline leading-tight"
                    >
                      {track.name}
                    </a>
                    <p className="text-gray-400 text-[10px] leading-tight mt-0.5">{track.artist['#text']}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}