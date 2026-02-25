"use client"

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

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

function getLineType(line: string): "heading" | "bullet" | "numbered" | "paragraph" | "spacer" {
    const trimmed = line.trim()
    if (!trimmed) return "spacer"
    if (trimmed.startsWith("## ")) return "heading"
    if (trimmed.startsWith("- ")) return "bullet"
    if (/^\d+\.\s/.test(trimmed)) return "numbered"
    return "paragraph"
}

export function AnamnesisPDFTemplate({ patientName, content, generatedAt }: AnamnesisPDFTemplateProps) {
    const lines = content.split("\n")

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Anamnese Clinica</Text>
                    <Text style={styles.subtitle}>Paciente: {patientName}</Text>
                    <Text style={styles.subtitle}>Gerado em: {generatedAt}</Text>
                </View>

                <View style={styles.contentWrap}>
                    {lines.map((line, index) => {
                        const lineType = getLineType(line)
                        if (lineType === "spacer") return <Text key={`line-${index}`} style={styles.spacer} />
                        if (lineType === "heading") {
                            return (
                                <Text key={`line-${index}`} style={styles.heading}>
                                    {line.replace(/^##\s*/, "")}
                                </Text>
                            )
                        }
                        if (lineType === "bullet") {
                            return (
                                <Text key={`line-${index}`} style={styles.bullet}>
                                    • {line.replace(/^-+\s*/, "")}
                                </Text>
                            )
                        }
                        if (lineType === "numbered") {
                            return (
                                <Text key={`line-${index}`} style={styles.numbered}>
                                    {line.trim()}
                                </Text>
                            )
                        }
                        return (
                            <Text key={`line-${index}`} style={styles.paragraph}>
                                {line}
                            </Text>
                        )
                    })}
                </View>

                <Text style={styles.footer}>Documento confidencial de uso clinico.</Text>
            </Page>
        </Document>
    )
}
