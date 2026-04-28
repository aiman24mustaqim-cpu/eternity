'use client'
import { motion } from 'framer-motion'
import { useStudioStore } from '@/store/studioStore'
import { format, parseISO } from 'date-fns'

const bgStyles: Record<string, { bg: string; text: string; accent: string; muted: string }> = {
  warm: { bg: 'linear-gradient(135deg,#f5e6d3,#e8c9aa)', text: '#2c2825', accent: '#C9A96E', muted: '#7a5c3a' },
  sage: { bg: 'linear-gradient(135deg,#e8f0e8,#c5d9c5)', text: '#1a2e1a', accent: '#8A9E8C', muted: '#3a5a3a' },
  lavender: { bg: 'linear-gradient(135deg,#f0e8f0,#d9c5d9)', text: '#2a1a3a', accent: '#A07AC4', muted: '#5a3a6a' },
  dark: { bg: 'linear-gradient(135deg,#2c2825,#3d3530)', text: '#f5f0ea', accent: '#C9A96E', muted: 'rgba(255,255,255,0.6)' },
  blush: { bg: 'linear-gradient(135deg,#f5e8f0,#e6c5da)', text: '#2a0a1a', accent: '#C4847A', muted: '#5a1a4a' },
}

export default function InvitationPreview() {
  const { data } = useStudioStore()
  const style = bgStyles[data.background] || bgStyles.warm

  const formattedDate = (() => {
    try {
      return format(parseISO(data.date), 'EEEE, d MMMM yyyy')
    } catch { return data.date }
  })()

  const formattedTime = (() => {
    try {
      const [h, m] = data.time.split(':').map(Number)
      const ampm = h >= 12 ? 'PM' : 'AM'
      return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${ampm}`
    } catch { return data.time }
  })()

  return (
    <motion.div
      className="w-[380px] max-w-full rounded-3xl overflow-hidden shadow-2xl"
      layout
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="px-8 pt-12 pb-8 text-center" style={{ background: style.bg }}>
        <div className="text-2xl mb-3" style={{ color: style.accent, opacity: 0.5 }}>✦ ✦ ✦</div>
        <div className="text-xs tracking-widest uppercase mb-4" style={{ color: style.muted }}>
          Walimatulurus
        </div>
        <motion.div
          className="text-5xl leading-tight"
          key={data.brideName}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: data.fontStyle, color: style.text }}
        >
          {data.brideName}
        </motion.div>
        <div className="text-2xl italic my-1 font-cormorant" style={{ color: style.accent }}>
          &amp;
        </div>
        <motion.div
          className="text-5xl leading-tight"
          key={data.groomName}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: data.fontStyle, color: style.text }}
        >
          {data.groomName}
        </motion.div>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: `${style.accent}40` }} />
          <span style={{ color: style.accent }}>❧</span>
          <div className="flex-1 h-px" style={{ background: `${style.accent}40` }} />
        </div>

        <motion.div key={data.date} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="font-cormorant text-xl" style={{ color: style.text }}>
            {formattedDate}
          </div>
          <div className="text-sm mt-1" style={{ color: style.muted }}>{formattedTime}</div>
        </motion.div>
      </div>

      {/* Venue */}
      <div className="px-8 py-6 bg-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs tracking-widest uppercase text-warm-gray">Venue</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="text-center">
          <motion.div
            key={data.venueName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-cormorant text-lg font-medium"
          >
            {data.venueName}
          </motion.div>
          <div className="text-sm text-warm-gray mt-1">{data.venueAddress}</div>
        </div>
        <div className="mt-4 bg-gray-50 rounded-xl h-24 flex items-center justify-center text-warm-gray text-sm">
          📍 Google Maps
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-6 bg-white border-t border-gray-100 text-center">
        <p className="text-sm text-warm-gray mb-4">We joyfully invite you to celebrate with us</p>
        <button
          className="px-8 py-3 rounded-full text-white text-sm font-medium tracking-wide"
          style={{ background: `linear-gradient(135deg, ${style.accent}, ${style.muted})` }}
        >
          RSVP Now
        </button>
      </div>
    </motion.div>
  )
}