"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { api } from "@/lib/axios"

interface UserAvatarProps {
    src?: string | null
    name: string
    className?: string
}

export function UserAvatar({ src, name, className }: UserAvatarProps) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)

    const imageUrl = src
        ? `${api.defaults.baseURL}/attachments/${src}`
        : null

    return (
        <Avatar className={cn("h-10 w-10 border shrink-0", className)}>
            <AvatarImage
                src={imageUrl || ""}
                alt={name}
                className="object-cover"
            />
            <AvatarFallback className="bg-muted text-xs font-semibold">
                {initials}
            </AvatarFallback>
        </Avatar>
    )
}