type IBrandIconProps = {
  size?: number
  className?: string
}

/**
 * Social/brand marks with no lucide equivalent (UISR-20 edge case).
 * Hand-drawn simplified glyphs, not sourced from any icon library.
 */

export function XIcon({ size = 18, className }: IBrandIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zM17.083 20.026h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function LinkedinIcon({ size = 18, className }: IBrandIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="4" />
      <circle cx="7" cy="8" r="1.6" fill="var(--color-background, white)" />
      <rect
        x="5.6"
        y="10.5"
        width="2.8"
        height="8"
        fill="var(--color-background, white)"
      />
      <path
        d="M11.5 10.5h2.7v1.3c.6-.9 1.6-1.5 2.9-1.5 2.2 0 3.4 1.4 3.4 4v4.2h-2.8v-3.7c0-1.2-.5-2-1.6-2-.9 0-1.5.6-1.7 1.2-.1.2-.1.5-.1.8v3.7h-2.8z"
        fill="var(--color-background, white)"
      />
    </svg>
  )
}

export function InstagramIcon({ size = 18, className }: IBrandIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function YoutubeIcon({ size = 18, className }: IBrandIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <rect x="1.5" y="5" width="21" height="14" rx="4" />
      <path d="M10 8.8l6 3.2-6 3.2z" fill="var(--color-background, white)" />
    </svg>
  )
}
