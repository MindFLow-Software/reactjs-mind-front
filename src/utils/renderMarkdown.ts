function esc(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

const SAFE_HREF_RE = /^https?:|^mailto:/i

function sanitizeHref(url: string): string {
    return SAFE_HREF_RE.test(url.trimStart()) ? url : '#'
}

function applyInline(text: string): string {
    return text
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>")
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, linkText, url) =>
            `<a href="${sanitizeHref(url)}" target="_blank" rel="noopener noreferrer">${linkText}</a>`)
}

export function renderMarkdown(text: string): string {
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
