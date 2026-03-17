"use client"

import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

interface AnamnesisPDFTemplateProps {
    patientName: string
    content: string
    generatedAt: string
}

const styles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingBottom: 50,
        paddingHorizontal: 40,
        fontFamily: "Helvetica",
        color: "#1f2937",
        fontSize: 11,
        lineHeight: 1.6,
    },
    header: {
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        paddingBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: "#1d4ed8",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 10,
        color: "#6b7280",
    },
    contentWrap: {
        marginTop: 4,
    },
    heading: {
        marginTop: 10,
        marginBottom: 4,
        fontSize: 12,
        fontWeight: 700,
        color: "#111827",
    },
    bullet: {
        marginLeft: 8,
    },
    numbered: {
        marginLeft: 8,
    },
    paragraph: {
        marginBottom: 3,
    },
    spacer: {
        marginBottom: 7,
    },
    footer: {
        position: "absolute",
        bottom: 24,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        paddingTop: 8,
        fontSize: 9,
        color: "#9ca3af",
        textAlign: "center",
    },
})

Font.registerHyphenationCallback((word) => {
    if (word.length <= 24) return [word]
    const chunks = word.match(/.{1,12}/g)
    return chunks ?? [word]
})

function getLineType(line: string): "heading" | "bullet" | "numbered" | "paragraph" | "spacer" {
    const trimmed = line.trim()
    if (!trimmed) return "spacer"
    if (trimmed.startsWith("## ")) return "heading"
    if (trimmed.startsWith("- ")) return "bullet"
    if (/^\d+\.\s/.test(trimmed)) return "numbered"
    return "paragraph"
}

function forceWrapLongTokens(text: string, chunkSize = 28): string {
    return text.replace(/\S{30,}/g, (token) => {
        const chunks = token.match(new RegExp(`.{1,${chunkSize}}`, "g"))
        return chunks ? chunks.join("\n") : token
    })
}

type InlineSegment = { text: string; style?: { [key: string]: string | number } }

const INLINE_RULES = [
    { marker: "**", style: { fontWeight: 700 } },
    { marker: "__", style: { textDecoration: "underline" } },
    { marker: "==", style: { backgroundColor: "#fef9c3" } },
    { marker: "*", style: { fontStyle: "italic" } },
]

function normalizeInlineText(text: string): string {
    let normalized = text

    if (normalized.startsWith("==") && normalized.endsWith("=") && !normalized.endsWith("==")) {
        normalized = `${normalized}=`
    }

    const markerCounts = new Map<string, number>()
    let cursor = 0

    while (cursor < normalized.length) {
        let nextIndex = -1
        let nextMarker: string | null = null

        for (const rule of INLINE_RULES) {
            const idx = normalized.indexOf(rule.marker, cursor)
            if (idx === -1) continue
            if (nextIndex === -1 || idx < nextIndex) {
                nextIndex = idx
                nextMarker = rule.marker
            }
        }

        if (nextIndex === -1 || !nextMarker) break

        markerCounts.set(nextMarker, (markerCounts.get(nextMarker) ?? 0) + 1)
        cursor = nextIndex + nextMarker.length
    }

    for (const rule of INLINE_RULES) {
        const marker = rule.marker
        const count = markerCounts.get(marker) ?? 0
        if (count % 2 === 0 || count === 0) continue

        if (normalized.startsWith(marker)) {
            normalized = `${normalized}${marker}`
            continue
        }
        if (normalized.endsWith(marker)) {
            normalized = `${marker}${normalized}`
            continue
        }
        normalized = `${normalized}${marker}`
    }

    return normalized
}

function parseInline(rawText: string): InlineSegment[] {
    const segments: InlineSegment[] = []
    const stack: { marker: string; style: InlineSegment["style"] }[] = []
    const text = normalizeInlineText(rawText)
    let cursor = 0

    const currentStyle = () =>
        stack.reduce<InlineSegment["style"]>((acc, item) => ({ ...acc, ...item.style }), {}) || undefined

    while (cursor < text.length) {
        let nextIndex = -1
        let nextRule: (typeof INLINE_RULES)[number] | null = null

        for (const rule of INLINE_RULES) {
            const idx = text.indexOf(rule.marker, cursor)
            if (idx === -1) continue
            if (nextIndex === -1 || idx < nextIndex) {
                nextIndex = idx
                nextRule = rule
            }
        }

        if (nextIndex === -1 || !nextRule) {
            const tail = text.slice(cursor)
            if (tail) segments.push({ text: tail, style: currentStyle() })
            break
        }

        if (nextIndex > cursor) {
            const chunk = text.slice(cursor, nextIndex)
            if (chunk) segments.push({ text: chunk, style: currentStyle() })
        }

        const top = stack[stack.length - 1]
        if (top?.marker === nextRule.marker) {
            stack.pop()
            cursor = nextIndex + nextRule.marker.length
            continue
        }

        const hasClosing = text.indexOf(nextRule.marker, nextIndex + nextRule.marker.length) !== -1
        if (!hasClosing) {
            segments.push({ text: nextRule.marker, style: currentStyle() })
            cursor = nextIndex + nextRule.marker.length
            continue
        } else {
            stack.push({ marker: nextRule.marker, style: nextRule.style })
        }
        cursor = nextIndex + nextRule.marker.length
    }

    return segments
}

function renderInline(text: string, keyPrefix: string) {
    const segments = parseInline(text)
    return segments.map((segment, index) => (
        <Text key={`${keyPrefix}-${index}`} style={segment.style}>
            {segment.text}
        </Text>
    ))
}

export function AnamnesisPDFTemplate({ patientName, content, generatedAt }: AnamnesisPDFTemplateProps) {
    const lines = content.split("\n")

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Anamnese Clínica</Text>
                    <Text style={styles.subtitle}>Paciente: {patientName}</Text>
                    <Text style={styles.subtitle}>Gerado em: {generatedAt}</Text>
                </View>

                <View style={styles.contentWrap}>
                    {lines.map((line, index) => {
                        const lineType = getLineType(line)
                        if (lineType === "spacer") return <Text key={`line-${index}`} style={styles.spacer} />
                        if (lineType === "heading") {
                            const headingText = forceWrapLongTokens(line.replace(/^##\s*/, ""))
                            return (
                                <Text key={`line-${index}`} style={styles.heading}>
                                    {renderInline(headingText, `heading-${index}`)}
                                </Text>
                            )
                        }
                        if (lineType === "bullet") {
                            const bulletText = forceWrapLongTokens(line.replace(/^-+\s*/, ""))
                            return (
                                <Text key={`line-${index}`} style={styles.bullet}>
                                    • {renderInline(bulletText, `bullet-${index}`)}
                                </Text>
                            )
                        }
                        if (lineType === "numbered") {
                            const numberedText = forceWrapLongTokens(line.trim())
                            return (
                                <Text key={`line-${index}`} style={styles.numbered}>
                                    {renderInline(numberedText, `numbered-${index}`)}
                                </Text>
                            )
                        }
                        const paragraphText = forceWrapLongTokens(line)
                        return (
                            <Text key={`line-${index}`} style={styles.paragraph}>
                                {renderInline(paragraphText, `paragraph-${index}`)}
                            </Text>
                        )
                    })}
                </View>

                <Text style={styles.footer}>Documento confidencial de uso clínico.</Text>
            </Page>
        </Document>
    )
}
