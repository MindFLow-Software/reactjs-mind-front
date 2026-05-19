import { useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Trash2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AnamnesisBlock } from "./anamnesis-types"

interface EditorBlockProps {
    block: AnamnesisBlock
    index: number
    isActive: boolean
    isRemoveDisabled: boolean
    saveStatus: "synced" | "pending" | "draft"
    onUpdate: (id: string, updates: Partial<AnamnesisBlock>) => void
    onRemove: (id: string) => void
    onFocus: (id: string) => void
    registerRef: (id: string, el: HTMLTextAreaElement | null) => void
}

function wordCount(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length
}

export function AnamnesisEditorBlock({
    block,
    index,
    isActive,
    isRemoveDisabled,
    saveStatus,
    onUpdate,
    onRemove,
    onFocus,
    registerRef,
}: EditorBlockProps) {
    const internalRef = useRef<HTMLTextAreaElement>(null)
    const words = wordCount(block.content)

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
        <div
            className={cn(
                "rounded-xl border bg-card transition-all duration-150",
                isActive ? "border-border shadow-sm" : "border-border/50",
            )}
        >
            {/* Block heading row */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground tabular-nums">
                    {index + 1}
                </span>
                <input
                    type="text"
                    value={block.title}
                    onChange={(e) => onUpdate(block.id, { title: e.target.value })}
                    onFocus={() => onFocus(block.id)}
                    placeholder={`Seção ${index + 1}`}
                    className="flex-1 bg-transparent text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground/50 focus:outline-none"
                />
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 shrink-0 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    onClick={() => onRemove(block.id)}
                    disabled={isRemoveDisabled}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>

            {/* Textarea */}
            <div className="px-4 pb-2">
                <Textarea
                    ref={(el) => {
                        (internalRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el
                        registerRef(block.id, el)
                    }}
                    value={block.content}
                    onFocus={() => onFocus(block.id)}
                    onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                    placeholder="Queixa principal, história..."
                    className="min-h-[80px] w-full resize-none overflow-hidden leading-relaxed border-0 bg-transparent shadow-none focus-visible:ring-0 px-0"
                    style={{ resize: "none" }}
                />
            </div>

            {/* Block footer: save status + word count */}
            <div className="flex items-center gap-1.5 border-t border-border/30 px-4 py-2">
                {saveStatus === "synced" ? (
                    <>
                        <Check className="h-3 w-3 text-emerald-500" />
                        <span className="text-[11px] text-muted-foreground/70">
                            Salvo automaticamente
                        </span>
                    </>
                ) : saveStatus === "pending" ? (
                    <span className="text-[11px] text-amber-500">Sincronizando...</span>
                ) : (
                    <span className="text-[11px] text-amber-500">Rascunho local</span>
                )}
                {words > 0 && (
                    <>
                        <span className="text-[11px] text-muted-foreground/40">·</span>
                        <span className="text-[11px] text-muted-foreground/60 tabular-nums">
                            {words} {words === 1 ? "palavra" : "palavras"}
                        </span>
                    </>
                )}
            </div>
        </div>
    )
}
