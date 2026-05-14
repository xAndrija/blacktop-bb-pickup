'use client'

import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface Message {
  id: string
  user_id: string
  content: string
  created_at: string
  profiles: { username: string; avatar_url?: string | null } | null
}

interface Props {
  sessionId: string
  currentUserId: string
}

export default function SessionChat({ sessionId, currentUserId }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase
      .from('messages')
      .select('*, profiles(username, avatar_url)')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data as Message[])
        setTimeout(() => bottomRef.current?.scrollIntoView(), 50)
      })

    const channel = supabase
      .channel(`chat-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `session_id=eq.${sessionId}` },
        async payload => {
          const { data: prof } = await supabase
            .from('profiles').select('username, avatar_url').eq('id', payload.new.user_id).single()
          setMessages(prev => [...prev, { ...payload.new, profiles: prof } as Message])
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [sessionId])

  async function send() {
    const content = text.trim()
    if (!content || sending) return
    setSending(true)
    setText('')
    const supabase = createClient()
    await supabase.from('messages').insert({ session_id: sessionId, user_id: currentUserId, content })
    setSending(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Lista poruka */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.20)', fontSize: 13, marginTop: 32 }}>
            Nema poruka. Budi prvi!
          </p>
        )}
        {messages.map(m => {
          const isMe = m.user_id === currentUserId
          const name = m.profiles?.username ?? '?'
          const time = new Date(m.created_at).toLocaleTimeString('sr-Latn-RS', { hour: '2-digit', minute: '2-digit' })
          return (
            <div key={m.id} style={{ display: 'flex', gap: 8, flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: isMe ? 'rgba(249,115,22,0.20)' : 'rgba(255,255,255,0.08)',
                border: `1.5px solid ${isMe ? 'rgba(249,115,22,0.35)' : 'rgba(255,255,255,0.10)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: isMe ? '#fb923c' : 'rgba(255,255,255,0.45)',
                overflow: 'hidden', position: 'relative',
              }}>
                {m.profiles?.avatar_url
                  ? <Image src={m.profiles.avatar_url} alt={name} fill style={{ objectFit: 'cover' }} />
                  : (name[0] ?? '?').toUpperCase()
                }
              </div>
              <div style={{ maxWidth: '72%' }}>
                {!isMe && (
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 600, marginBottom: 3, paddingLeft: 2 }}>{name}</p>
                )}
                <div style={{
                  background: isMe ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.07)',
                  border: `1px solid ${isMe ? 'rgba(249,115,22,0.25)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  padding: '8px 12px',
                }}>
                  <p style={{ color: isMe ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 1.45, margin: 0 }}>
                    {m.content}
                  </p>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.20)', fontSize: 10, marginTop: 3, textAlign: isMe ? 'right' : 'left', paddingLeft: isMe ? 0 : 2, paddingRight: isMe ? 2 : 0 }}>
                  {time}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '10px 16px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Poruka…"
          maxLength={500}
          style={{
            flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 12, padding: '9px 14px', color: 'white', fontSize: 13, outline: 'none',
          }}
        />
        <button
          onClick={send}
          disabled={!text.trim() || sending}
          style={{
            width: 38, height: 38, borderRadius: 11, border: 'none', cursor: text.trim() ? 'pointer' : 'default',
            background: text.trim() ? 'linear-gradient(135deg,#f97316,#f59e0b)' : 'rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s', flexShrink: 0,
          }}
        >
          <Send size={15} color={text.trim() ? 'white' : 'rgba(255,255,255,0.25)'} />
        </button>
      </div>
    </div>
  )
}
