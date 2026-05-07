import { useState, useEffect, useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { api } from "@/lib/axios"

const avatarVariants = cva("border shrink-0 bg-muted", {
  variants: {
    size: {
      sm: "h-6 w-6",
      md: "h-8 w-8",
      lg: "h-10 w-10",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const fallbackVariants = cva("font-semibold text-muted-foreground", {
  variants: {
    size: {
      sm: "text-[10px]",
      md: "text-xs",
      lg: "text-sm",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string | null
  name: string
  className?: string
  showStatusRing?: boolean
  isActive?: boolean
}

export function UserAvatar({
  src,
  name,
  className,
  size,
  showStatusRing,
  isActive,
}: UserAvatarProps) {
  const [imgUrl, setImgUrl] = useState<string | undefined>(undefined)

  const initials = useMemo(() => {
    if (!name) return ""
    const parts = name.trim().split(/\s+/)
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase()
  }, [name])

  useEffect(() => {
    let objectUrl: string | undefined

    async function fetchAuthImage() {
      if (!src) { setImgUrl(undefined); return }
      if (src.startsWith("http") || src.startsWith("blob:")) { setImgUrl(src); return }

      try {
        const response = await api.get(`/attachments/${src}`, { responseType: "blob" })
        objectUrl = URL.createObjectURL(response.data)
        setImgUrl(objectUrl)
      } catch {
        setImgUrl(undefined)
      }
    }

    fetchAuthImage()
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl) }
  }, [src])

  const ringClass = showStatusRing
    ? isActive
      ? "ring-2 ring-emerald-500 ring-offset-1"
      : "ring-2 ring-muted-foreground/40 ring-offset-1"
    : undefined

  return (
    <Avatar className={cn(avatarVariants({ size }), ringClass, className)}>
      <AvatarImage src={imgUrl} className="object-cover" />
      <AvatarFallback className={fallbackVariants({ size })}>{initials}</AvatarFallback>
    </Avatar>
  )
}
