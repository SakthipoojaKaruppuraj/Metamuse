import { cn } from '@/lib/utils'

// Simplified MetaMask fox mark for UI purposes.
export function MetaMaskIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 37"
      className={cn('size-6', className)}
      aria-hidden="true"
    >
      <path
        d="M37.4 1 22.3 12.2l2.8-6.6L37.4 1Z"
        fill="#E17726"
        stroke="#E17726"
        strokeLinejoin="round"
        strokeWidth="0.5"
      />
      <path
        d="M2.6 1l15 11.3-2.7-6.7L2.6 1Zm27.9 25.2-4 6.2 8.6 2.4 2.5-8.4-7.1-.2Zm-28.1.2 2.5 8.4 8.6-2.4-4-6.2-7.1.2Z"
        fill="#E27625"
        stroke="#E27625"
        strokeLinejoin="round"
        strokeWidth="0.5"
      />
      <path
        d="M11 16.3 8.5 20l8.5.4-.3-9.2L11 16.3Zm18 0-5.8-5.2-.2 9.3 8.5-.4-2.5-3.7ZM11.5 32.4l5.2-2.5-4.5-3.5-.7 6Zm11.3-2.5 5.1 2.5-.6-6-4.5 3.5Z"
        fill="#E27625"
        stroke="#E27625"
        strokeLinejoin="round"
        strokeWidth="0.5"
      />
      <path
        d="m27.9 32.4-5.1-2.5.4 3.3v1.4l4.7-2.2Zm-16.4 0 4.7 2.2v-1.4l.4-3.3-5.1 2.5Z"
        fill="#D5BFB2"
        stroke="#D5BFB2"
        strokeLinejoin="round"
        strokeWidth="0.5"
      />
      <path
        d="m16.3 24.2-4.3-1.3 3-1.4 1.3 2.7Zm7.4 0 1.3-2.7 3.1 1.4-4.4 1.3Z"
        fill="#233447"
        stroke="#233447"
        strokeLinejoin="round"
        strokeWidth="0.5"
      />
      <path
        d="m11.5 32.4.8-6.2-4.8.2 4 6Zm16-6.2.7 6.2 4-6-4.7-.2Zm4.5-6.2-8.5.4.8 4.4 1.3-2.7 3.1 1.4 3.3-3.5Zm-20 3.5 3.1-1.4 1.3 2.7.8-4.4-8.5-.4 3.3 3.5Z"
        fill="#CC6228"
        stroke="#CC6228"
        strokeLinejoin="round"
        strokeWidth="0.5"
      />
      <path
        d="M8 20l3.6 7-.1-3.5L8 20Zm20.5 3.5-.2 3.5 3.6-7-3.4 3.5ZM16.5 20.4l-.8 4.4 1 5.1.2-6.7-.4-2.8Zm7 0-.4 2.8.2 6.7 1-5.1-.8-4.4Z"
        fill="#E27525"
        stroke="#E27525"
        strokeLinejoin="round"
        strokeWidth="0.5"
      />
      <path
        d="m24.3 24.2-1 5.1.7.5 4.5-3.5.2-3.5-4.4 1.4Zm-12.3-1.3.1 3.5 4.5 3.5.7-.5-1-5.1-4.3-1.4Z"
        fill="#F5841F"
        stroke="#F5841F"
        strokeLinejoin="round"
        strokeWidth="0.5"
      />
      <path
        d="m24.4 34.6v-1.4l-.4-.3h-8l-.4.3v1.4l-4.7-2.2 1.6 1.3 3.3 2.3h8.1l3.3-2.3 1.6-1.3-4.7 2.2Z"
        fill="#C0AC9D"
        stroke="#C0AC9D"
        strokeLinejoin="round"
        strokeWidth="0.5"
      />
      <path
        d="m23.9 29.8-.7-.5h-6.4l-.7.5-.4 3.3.4-.3h8l.4.3-.6-3.3Z"
        fill="#161616"
        stroke="#161616"
        strokeLinejoin="round"
        strokeWidth="0.5"
      />
      <path
        d="m38 12.9 1.3-6.2L37.4 1 23.9 11l5.1 4.3 7.3 2.1 1.6-1.9-.7-.5 1.1-1-.8-.6 1.1-.8-.6-.7ZM.7 6.7 2 12.9l-.8.6 1.1.8-.8.6 1.1 1-.7.5 1.6 1.9 7.3-2.1 5.1-4.3L2.6 1 .7 6.7Z"
        fill="#763E1A"
        stroke="#763E1A"
        strokeLinejoin="round"
        strokeWidth="0.5"
      />
      <path
        d="m36.3 17.4-7.3-2.1 2.2 3.3-3.3 6.4 4.4-.1h6.5l-2.5-7.5ZM11 15.3l-7.3 2.1-2.4 7.5h6.5l4.3.1-3.3-6.4 2.2-3.3Zm12.9 8.9.5-8.2 2.1-5.7h-9.4l2.1 5.7.5 8.2.2 2.6v6.7h3.9l.1-6.7.2-2.6Z"
        fill="#F5841F"
        stroke="#F5841F"
        strokeLinejoin="round"
        strokeWidth="0.5"
      />
    </svg>
  )
}
