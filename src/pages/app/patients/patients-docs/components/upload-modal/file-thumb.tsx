import { cn } from "@/lib/utils"
import { getFileMimeGroup, MIME_GRADIENT } from "@/utils/file-helpers"

interface FileThumbProps {
    type: string
}

export function FileThumb({ type }: FileThumbProps) {
    const group = getFileMimeGroup(type)
    return (
        <div className={cn(
            "flex h-10 w-8 shrink-0 items-end justify-center rounded-md bg-gradient-to-br overflow-hidden",
            MIME_GRADIENT[group],
        )}>
            <span className="mb-0.5 text-[7px] font-bold text-white/80">{group}</span>
        </div>
    )
}
