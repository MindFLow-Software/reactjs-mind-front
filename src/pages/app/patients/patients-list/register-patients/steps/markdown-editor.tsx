import { useState, useRef, useLayoutEffect } from "react"
import {
    FileText, Bold, Italic, Heading, List, ListOrdered,
    Quote, Link, Code, Eye, Pencil,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Renderer ──────────────────────────────────────────────────────────────────

function esc(s: string) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function applyInline(text: string): string {
    return text
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>")
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
}

function renderMarkdown(text: string): string {
    if (!text.trim()) return ""
    const lines = text.split("\n")
    const out: string[] = []
    let inUl = false, inOl = false

    for (const line of lines) {
        const isUl = line.startsWith("- ")
        const isOl = /^\d+\. /.test(line)
        const isBq = line.startsWith("> ")
        const isH3 = line.startsWith("### ")
        const isH2 = !isH3 && line.startsWith("## ")
        const isH1 = !isH2 && !isH3 && line.startsWith("# ")
        const isHr = /^---+$/.test(line.trim())

        if (!isUl && inUl) { out.push("</ul>"); inUl = false }
        if (!isOl && inOl) { out.push("</ol>"); inOl = false }

        if      (isH1) out.push(`<h1>${applyInline(esc(line.slice(2)))}</h1>`)
        else if (isH2) out.push(`<h2>${applyInline(esc(line.slice(3)))}</h2>`)
        else if (isH3) out.push(`<h3>${applyInline(esc(line.slice(4)))}</h3>`)
        else if (isBq) out.push(`<blockquote>${applyInline(esc(line.slice(2)))}</blockquote>`)
        else if (isUl) { if (!inUl) { out.push("<ul>"); inUl = true } out.push(`<li>${applyInline(esc(line.slice(2)))}</li>`) }
        else if (isOl) { if (!inOl) { out.push("<ol>"); inOl = true } out.push(`<li>${applyInline(esc(line.replace(/^\d+\. /, "")))}</li>`) }
        else if (isHr) out.push("<hr />")
        else if (!line.trim()) out.push("")
        else           out.push(`<p>${applyInline(esc(line))}</p>`)
    }
    if (inUl) out.push("</ul>")
    if (inOl) out.push("</ol>")
    return out.join("\n")
}

// ── Component ─────────────────────────────────────────────────────────────────

interface MarkdownEditorProps {
    value:    string
    onChange: (v: string) => void
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
    const [tab, setTab] = useState<"write" | "preview">("write")
    const ref = useRef<HTMLTextAreaElement>(null)

    useLayoutEffect(() => {
        const el = ref.current
        if (!el) return
        el.style.height = "auto"
        el.style.height = `${el.scrollHeight}px`
    }, [value])

    function insertInline(prefix: string, suffix: string, placeholder: string) {
        const el = ref.current; if (!el) return
        const { selectionStart: ss, selectionEnd: se } = el
        const sel = value.slice(ss, se) || placeholder
        onChange(value.slice(0, ss) + prefix + sel + suffix + value.slice(se))
        requestAnimationFrame(() => { el.focus(); el.setSelectionRange(ss + prefix.length, ss + prefix.length + sel.length) })
    }

    function insertLinePrefix(prefix: string) {
        const el = ref.current; if (!el) return
        const ss = el.selectionStart
        const ls = value.lastIndexOf("\n", ss - 1) + 1
        onChange(value.slice(0, ls) + prefix + value.slice(ls))
        requestAnimationFrame(() => { el.focus(); el.setSelectionRange(ss + prefix.length, ss + prefix.length) })
    }

    const groups = [
        [
            { Icon: Heading,     title: "Título",         fn: () => insertLinePrefix("## ") },
            { Icon: Bold,        title: "Negrito",        fn: () => insertInline("**", "**", "negrito") },
            { Icon: Italic,      title: "Itálico",        fn: () => insertInline("*", "*", "itálico") },
        ],
        [
            { Icon: List,        title: "Lista",          fn: () => insertLinePrefix("- ") },
            { Icon: ListOrdered, title: "Lista numerada", fn: () => insertLinePrefix("1. ") },
            { Icon: Quote,       title: "Citação",        fn: () => insertLinePrefix("> ") },
        ],
        [
            { Icon: Link,        title: "Link",           fn: () => insertInline("[", "](url)", "texto") },
            { Icon: Code,        title: "Código",         fn: () => insertInline("`", "`", "código") },
        ],
    ]

    return (
        <div className="overflow-hidden rounded-[8px] border border-border bg-card transition-[border-color,box-shadow] focus-within:border-blue-600 focus-within:ring-[3px] focus-within:ring-blue-600/[.18]">
            <div className="flex items-center border-b border-border bg-muted/50">
                <div className="flex shrink-0">
                    {(["write", "preview"] as const).map((t) => (
                        <button key={t} type="button" onClick={() => setTab(t)}
                            className={cn(
                                "flex items-center gap-[6px] border-b-2 px-3 py-2 text-[12px] font-semibold transition-all",
                                tab === t ? "border-blue-600 bg-card text-blue-600" : "border-transparent text-muted-foreground"
                            )}>
                            {t === "write" ? <Pencil className="size-[13px]" /> : <Eye className="size-[13px]" />}
                            {t === "write" ? "Escrever" : "Visualizar"}
                        </button>
                    ))}
                </div>
                <div className={cn("ml-auto flex items-center pr-1.5", tab === "preview" && "pointer-events-none opacity-40")}>
                    {groups.map((grp, gi) => (
                        <div key={gi} className="flex items-center">
                            {gi > 0 && <div className="mx-1 h-4 w-px bg-border" />}
                            {grp.map(({ Icon, title, fn }) => (
                                <button key={title} type="button" title={title} onClick={fn}
                                    className="flex h-[26px] w-[26px] items-center justify-center rounded text-muted-foreground transition-all hover:bg-card hover:text-blue-600">
                                    <Icon className="size-[13px]" />
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {tab === "write" ? (
                <textarea
                    ref={ref}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={"Ex:\n## Queixa principal\nAnsiedade generalizada com episódios noturnos.\n\n**Encaminhamento:** psiquiatra (Dra. Lima)\n\n- Insônia há 3 meses\n- Pico após mudança de emprego"}
                    className="w-full resize-none overflow-hidden bg-card p-3 font-mono text-[13px] leading-relaxed text-foreground outline-none placeholder:font-sans placeholder:text-muted-foreground"
                    style={{ minHeight: 160 }}
                />
            ) : (
                <div
                    className="mk-preview overflow-y-auto px-4 py-3.5 text-[13.5px] leading-[1.65] text-foreground"
                    style={{ minHeight: 160, maxHeight: 340 }}
                    dangerouslySetInnerHTML={{
                        __html: value.trim()
                            ? renderMarkdown(value)
                            : '<p class="mk-empty">Nada para visualizar ainda.</p>',
                    }}
                />
            )}

            <div className="flex items-center justify-between border-t border-border bg-muted/50 px-3 py-[6px]">
                <div className="flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
                    <FileText className="size-[11px]" />
                    <span>Markdown suportado ·</span>
                    {["**negrito**", "*itálico*", "# título", "- lista"].map((ex) => (
                        <code key={ex} className="rounded border border-border bg-card px-1 text-[10px]">{ex}</code>
                    ))}
                </div>
                <span className="shrink-0 tabular-nums text-[11px] text-muted-foreground">{value.length} caracteres</span>
            </div>
        </div>
    )
}
