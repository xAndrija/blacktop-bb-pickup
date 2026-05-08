export interface Court {
  id: string
  slug?: string | null
  name: string
  location_name: string
  description?: string | null
  image_url?: string | null
  lat: number
  lng: number
  created_at: string
}

export interface Session {
  id: string
  court_id: string
  creator_id: string
  date_time: string
  max_players: number
  description?: string | null
  created_at: string
  session_players?: SessionPlayer[]
}

export interface PlayerProfile {
  username: string | null
  avatar_url: string | null
}

export type ProfileMap = Record<string, PlayerProfile>

export interface SessionPlayer {
  id: string
  session_id: string
  user_id: string
  created_at: string
}

export interface SessionWithPlayers extends Session {
  session_players: SessionPlayer[]
}
