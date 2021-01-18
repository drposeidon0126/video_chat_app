import { peerCode } from '@peek/core/model'

export interface PageInfo {
  icon: string
  title: string
  route: string | string[]
}

export type Page = 'home' | 'check' | 'room'

export const navigation: Record<Page, PageInfo> = {
  home: { icon: 'house', title: 'home', route: '/home' },
  check: { icon: 'settings_voice', title: 'check', route: '/check' },
  room: { icon: 'meeting_room', title: 'room', route: '/room/' + peerCode() },
}
