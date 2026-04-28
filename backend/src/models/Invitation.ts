import mongoose, { Document, Schema } from 'mongoose'

export interface IInvitation extends Document {
  userId: mongoose.Types.ObjectId
  templateId: string
  title: string
  customData: {
    brideName: string
    groomName: string
    brideFullName?: string
    groomFullName?: string
    date: string
    time: string
    endTime?: string
    venueName: string
    venueAddress: string
    venueMapUrl?: string
    message?: string
    background: string
    accentColor: string
    textColor: string
    fontStyle: string
    galleryImages: string[]
    coverImage?: string
    musicUrl?: string
    musicName?: string
    musicAutoPlay: boolean
    rsvpDeadline?: string
    rsvpPhone?: string
    showCountdown: boolean
    showGuestbook: boolean
  }
  published: boolean
  shareableSlug: string
  views: number
  rsvps: Array<{
    name: string
    phone?: string
    attending: 'yes' | 'no' | 'maybe'
    guests: number
    message?: string
    createdAt: Date
  }>
  guestbook: Array<{
    name: string
    message: string
    createdAt: Date
  }>
  createdAt: Date
  updatedAt: Date
}

const InvitationSchema = new Schema<IInvitation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    templateId: { type: String, required: true, default: 'floral-romance' },
    title: { type: String, required: true, trim: true },
    customData: {
      brideName: { type: String, default: 'Bride' },
      groomName: { type: String, default: 'Groom' },
      brideFullName: String,
      groomFullName: String,
      date: { type: String, required: true },
      time: { type: String, default: '10:00' },
      endTime: String,
      venueName: { type: String, default: '' },
      venueAddress: { type: String, default: '' },
      venueMapUrl: String,
      message: String,
      background: { type: String, default: 'warm' },
      accentColor: { type: String, default: '#C9A96E' },
      textColor: { type: String, default: '#2C2825' },
      fontStyle: { type: String, default: "'Great Vibes', cursive" },
      galleryImages: [{ type: String }],
      coverImage: String,
      musicUrl: String,
      musicName: String,
      musicAutoPlay: { type: Boolean, default: false },
      rsvpDeadline: String,
      rsvpPhone: String,
      showCountdown: { type: Boolean, default: true },
      showGuestbook: { type: Boolean, default: true },
    },
    published: { type: Boolean, default: false, index: true },
    shareableSlug: { type: String, unique: true, index: true, trim: true, lowercase: true },
    views: { type: Number, default: 0, min: 0 },
    rsvps: [{
      name: { type: String, required: true },
      phone: String,
      attending: { type: String, enum: ['yes', 'no', 'maybe'], required: true },
      guests: { type: Number, default: 1 },
      message: String,
      createdAt: { type: Date, default: Date.now },
    }],
    guestbook: [{
      name: { type: String, required: true },
      message: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
)

const Invitation = mongoose.model<IInvitation>('Invitation', InvitationSchema)
export { Invitation }
export default Invitation