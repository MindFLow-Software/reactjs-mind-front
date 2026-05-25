export type FileKind = "pdf" | "image" | "doc" | "xls" | "other"

export function getFileKind(contentType: string): FileKind {
    const ct = contentType.toLowerCase()
    if (ct.includes("pdf")) return "pdf"
    if (ct.includes("image")) return "image"
    if (ct.includes("word") || ct.includes("document") || ct.includes("msword")) return "doc"
    if (ct.includes("excel") || ct.includes("spreadsheet") || ct.includes("csv")) return "xls"
    return "other"
}

export function getFileMimeGroup(type: string): string {
    if (type.includes("pdf")) return "PDF"
    if (type.includes("image")) return "IMG"
    if (type.includes("word") || type.includes("document")) return "DOC"
    if (type.includes("excel") || type.includes("spreadsheet")) return "XLS"
    return "FILE"
}

export function getFileLabel(contentType: string): string {
    const ct = contentType.toLowerCase()
    if (ct.includes("pdf")) return "PDF"
    if (ct.includes("jpeg") || ct.includes("jpg")) return "JPEG"
    if (ct.includes("png")) return "PNG"
    if (ct.includes("gif")) return "GIF"
    if (ct.includes("webp")) return "WebP"
    if (ct.includes("word") || ct.includes("document")) return "Word"
    if (ct.includes("excel") || ct.includes("spreadsheet")) return "Excel"
    if (ct.includes("text")) return "Texto"
    return "Arquivo"
}

export const FILE_KIND_STYLES: Record<FileKind, { gradient: string; label: string; labelColor: string }> = {
    pdf:   { gradient: "from-red-600 to-red-800",    label: "PDF",  labelColor: "#fca5a5" },
    image: { gradient: "from-cyan-500 to-cyan-700",  label: "IMG",  labelColor: "#67e8f9" },
    doc:   { gradient: "from-blue-500 to-blue-800",  label: "DOC",  labelColor: "#93c5fd" },
    xls:   { gradient: "from-green-600 to-green-800",label: "XLS",  labelColor: "#86efac" },
    other: { gradient: "from-slate-500 to-slate-700",label: "FILE", labelColor: "#cbd5e1" },
}

export const MIME_GRADIENT: Record<string, string> = {
    PDF:  "from-red-600 to-red-800",
    IMG:  "from-cyan-500 to-cyan-700",
    DOC:  "from-blue-500 to-blue-800",
    XLS:  "from-green-600 to-green-800",
    FILE: "from-slate-500 to-slate-700",
}

export const TYPE_BADGE: Record<FileKind, { bg: string; text: string; label: string }> = {
    pdf:   { bg: "bg-red-50 dark:bg-red-950/30",    text: "text-red-700 dark:text-red-400",    label: "PDF" },
    image: { bg: "bg-cyan-50 dark:bg-cyan-950/30",  text: "text-cyan-700 dark:text-cyan-400",  label: "Imagem" },
    doc:   { bg: "bg-blue-50 dark:bg-blue-950/30",  text: "text-blue-700 dark:text-blue-400",  label: "Documento" },
    xls:   { bg: "bg-green-50 dark:bg-green-950/30",text: "text-green-700 dark:text-green-400",label: "Planilha" },
    other: { bg: "bg-muted",                         text: "text-muted-foreground",              label: "Arquivo" },
}
