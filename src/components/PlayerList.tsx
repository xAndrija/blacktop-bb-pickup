import { Users } from 'lucide-react'
import Image from 'next/image'
import { SessionPlayer, ProfileMap } from '@/types'

interface Props {
  players: SessionPlayer[]
  maxPlayers: number
  currentUserId?: string
  profilesMap?: ProfileMap
}

export default function PlayerList({ players, maxPlayers, currentUserId, profilesMap = {} }: Props) {
  const spots = Array.from({ length: maxPlayers })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        {spots.map((_, i) => {
          const player = players[i]
          const isMe = player?.user_id === currentUserId
          const profile = player ? profilesMap[player.user_id] : null
          const initial = profile?.username ? profile.username[0].toUpperCase() : '?'

          if (!player) {
            return (
              <div
                key={i}
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  border: '1.5px dashed rgba(255,255,255,0.10)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              />
            )
          }

          return (
            <div
              key={i}
              title={profile?.username ?? undefined}
              style={{
                width: 28, height: 28, borderRadius: '50%', overflow: 'hidden',
                border: isMe ? '2px solid #f97316' : '1.5px solid rgba(255,255,255,0.20)',
                background: isMe ? 'rgba(249,115,22,0.25)' : 'rgba(255,255,255,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: isMe ? '#fb923c' : 'rgba(255,255,255,0.65)',
                flexShrink: 0, position: 'relative',
                boxShadow: isMe ? '0 0 0 2px rgba(249,115,22,0.20)' : 'none',
              }}
            >
              {profile?.avatar_url
                ? <Image src={profile.avatar_url} alt={profile.username ?? ''} fill style={{ objectFit: 'cover' }} />
                : initial}
            </div>
          )
        })}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 6, color: 'rgba(255,255,255,0.28)', fontSize: 12 }}>
          <Users size={11} />
          <span>{players.length}/{maxPlayers}</span>
        </div>
      </div>
    </div>
  )
}
