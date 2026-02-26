import { useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AnamnesisBlock } from "./types"

interface EditorBlockProps {
    block: AnamnesisBlock
    index: number
    isActive: boolean
    isRemoveDisabled: boolean
    onUpdate: (id: string, updates: Partial<AnamnesisBlock>) => void
    onRemove: (id: string) => void
    onFocus: (id: string) => void
    registerRef: (id: string, el: HTMLTextAreaElement | null) => void
}

export function AnamnesisEditorBlock({
    block, index, isActive, isRemoveDisabled, onUpdate, onRemove, onFocus, registerRef
}: EditorBlockProps) {

    const internalRef = useRef<HTMLTextAreaElement>(null)

    const handleAutoResize = () => {
        if (internalRef.current) {
            internalRef.current.style.height = "auto"
            internalRef.current.style.height = `${internalRef.current.scrollHeight}px`
        }
    }

    useEffect(() => {
        handleAutoResize()
    }, [block.content])

    return (
        <div className={cn(
            "rounded-xl bg-background/70 p-3 ring-1 ring-border/50 transition-all",
            isActive && "bg-primary/[0.04] ring-primary/50"
        )}>
            <div className="mb-2 flex items-center gap-2">
                <Input
                    value={block.title}
                    onChange={(e) => onUpdate(block.id, { title: e.target.value })}
                    onFocus={() => onFocus(block.id)}
                    placeholder={`Seção ${index + 1}`}
                    className="h-8 flex-1 bg-background"
                />
                <Button
                    variant="ghost" size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => onRemove(block.id)}
                    disabled={isRemoveDisabled}
                >
                    <Trash2 className="mr-1 h-4 w-4" /> Excluir
                </Button>
            </div>

            <Textarea
                ref={(el) => {
                    (internalRef as any).current = el
                    registerRef(block.id, el)
                }}
                value={block.content}
                onFocus={() => onFocus(block.id)}
                onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                placeholder="Queixa principal, história..."
                className="min-h-[140px] w-full resize-none overflow-hidden leading-relaxed"
            />
        </div>
    )
}