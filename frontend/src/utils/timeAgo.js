import TimeAgo from 'javascript-time-ago'

// English.
import vi from 'javascript-time-ago/locale/vi.json'

TimeAgo.addDefaultLocale(vi)

// Create formatter (English).
export const timeAgo = new TimeAgo('en-US')
