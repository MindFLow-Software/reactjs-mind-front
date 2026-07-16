import { Text, type TextProps } from '@react-pdf/renderer'

type InlineStyle = { [key: string]: string | number }
type InlineSegment = { text: string; style?: TextProps['style'] }

const INLINE_RULES: { marker: string; style: InlineStyle }[] = [
  { marker: '**', style: { fontWeight: 700 } },
  { marker: '__', style: { textDecoration: 'underline' } },
  { marker: '==', style: { backgroundColor: '#fef9c3' } },
  { marker: '*', style: { fontStyle: 'italic' } },
]

export function getLineType(
  line: string,
): 'heading' | 'bullet' | 'numbered' | 'paragraph' | 'spacer' {
  const trimmed = line.trim()
  if (!trimmed) return 'spacer'
  if (trimmed.startsWith('## ')) return 'heading'
  if (trimmed.startsWith('- ')) return 'bullet'
  if (/^\d+\.\s/.test(trimmed)) return 'numbered'
  return 'paragraph'
}

export function forceWrapLongTokens(text: string, chunkSize = 28): string {
  return text.replace(/\S{30,}/g, (token) => {
    const chunks = token.match(new RegExp(`.{1,${chunkSize}}`, 'g'))
    return chunks ? chunks.join('\n') : token
  })
}

function normalizeInlineText(text: string): string {
  let normalized = text

  if (
    normalized.startsWith('==') &&
    normalized.endsWith('=') &&
    !normalized.endsWith('==')
  ) {
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
  const stack: { marker: string; style: InlineStyle }[] = []
  const text = normalizeInlineText(rawText)
  let cursor = 0

  const currentStyle = () =>
    (stack.reduce<InlineStyle>(
      (acc, item) => ({ ...acc, ...item.style }),
      {},
    ) as TextProps['style']) || undefined

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

    const hasClosing =
      text.indexOf(nextRule.marker, nextIndex + nextRule.marker.length) !== -1
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

export function renderInline(text: string, keyPrefix: string) {
  const segments = parseInline(text)
  return segments.map((segment, index) => (
    <Text key={`${keyPrefix}-${index}`} style={segment.style}>
      {segment.text}
    </Text>
  ))
}
