import { cn } from '@/lib/utils'
import './avatar-stack.css'

interface AvatarStackProps {
  urls: readonly string[]
  size: number
  imgClassName?: string
}

export function AvatarStack({ urls, size, imgClassName }: AvatarStackProps) {
  return (
    <div className="flex">
      {urls.map((url, i) => (
        <img
          key={i}
          src={url}
          width={size}
          height={size}
          loading="lazy"
          alt=""
          style={{ width: size, height: size }}
          className={cn('lp-avatar', imgClassName)}
        />
      ))}
    </div>
  )
}
