import type { CSSProperties, ReactNode } from 'react'

type IconName =
  | 'bar-chart'
  | 'banknote'
  | 'bot'
  | 'box'
  | 'briefcase'
  | 'building'
  | 'cash'
  | 'chart'
  | 'clipboard'
  | 'credit-card'
  | 'home'
  | 'message'
  | 'minus'
  | 'package'
  | 'plus'
  | 'receipt'
  | 'settings'
  | 'shopping-bag'
  | 'tag'
  | 'trending-up'
  | 'wallet'

const paths: Record<IconName, ReactNode> = {
  'bar-chart': (
    <>
      <path d="M5 19V9" />
      <path d="M12 19V5" />
      <path d="M19 19v-7" />
    </>
  ),
  banknote: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 9h.01M18 15h.01" />
    </>
  ),
  bot: (
    <>
      <rect x="5" y="8" width="14" height="10" rx="3" />
      <path d="M12 8V5" />
      <path d="M9 13h.01M15 13h.01" />
      <path d="M10 17h4" />
    </>
  ),
  box: (
    <>
      <path d="M21 8 12 3 3 8l9 5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5h6v2" />
      <path d="M3 12h18" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 8h.01M15 8h.01M9 13h.01M15 13h.01" />
      <path d="M10 21v-4h4v4" />
    </>
  ),
  cash: (
    <>
      <path d="M4 7h16v10H4z" />
      <path d="M8 11h.01M16 13h.01" />
      <path d="M12 9v6" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 4-4 3 3 5-7" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4h6v4H9z" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  'credit-card': (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h3" />
    </>
  ),
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  message: (
    <>
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      <path d="M8 9h8M8 13h5" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  package: (
    <>
      <path d="m7 8 5-3 5 3" />
      <path d="M5 10v8l7 4 7-4v-8l-7-4-7 4Z" />
      <path d="M12 14v8" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.08-1l2.03-1.56-2-3.46-2.39.96a7 7 0 0 0-1.73-1L14.5 3h-5l-.33 2.94a7 7 0 0 0-1.73 1l-2.39-.96-2 3.46L5.08 11a7 7 0 0 0 0 2l-2.03 1.56 2 3.46 2.39-.96a7 7 0 0 0 1.73 1L9.5 21h5l.33-2.94a7 7 0 0 0 1.73-1l2.39.96 2-3.46L18.92 13a7 7 0 0 0 .08-1Z" />
    </>
  ),
  'shopping-bag': (
    <>
      <path d="M6 8h12l-1 13H7L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </>
  ),
  tag: (
    <>
      <path d="M20 13 11 22 2 13V4h9l9 9Z" />
      <path d="M7 8h.01" />
    </>
  ),
  'trending-up': (
    <>
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 7h15a2 2 0 0 1 2 2v9H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12" />
      <path d="M16 13h.01" />
    </>
  ),
}

export default function AppIcon({
  name,
  size = 18,
  style,
}: {
  name: IconName
  size?: number
  style?: CSSProperties
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', ...style }}
    >
      {paths[name]}
    </svg>
  )
}
