import './markdown-editor.css'
import { useState, useRef, useLayoutEffect } from 'react'
import {
  FileText,
  Bold,
  Italic,
  Heading,
  List,
  ListOrdered,
  Quote,
  Link,
  Code,
  Eye,
  Pencil,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { renderMarkdown } from '@/utils/renderMarkdown'

type IMarkdownEditor = {
  value: string
  onChange: (value: string) => void
}

export function MarkdownEditor({ value, onChange }: IMarkdownEditor) {
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const ref = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const textarea = ref.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`
  }, [value])

  function insertInline(prefix: string, suffix: string, placeholder: string) {
    const textarea = ref.current
    if (!textarea) return
    const { selectionStart: selStart, selectionEnd: selEnd } = textarea
    const selected = value.slice(selStart, selEnd) || placeholder
    onChange(
      value.slice(0, selStart) +
        prefix +
        selected +
        suffix +
        value.slice(selEnd),
    )
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(
        selStart + prefix.length,
        selStart + prefix.length + selected.length,
      )
    })
  }

  function insertLinePrefix(prefix: string) {
    const textarea = ref.current
    if (!textarea) return
    const selStart = textarea.selectionStart
    const lineStart = value.lastIndexOf('\n', selStart - 1) + 1
    onChange(value.slice(0, lineStart) + prefix + value.slice(lineStart))
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(
        selStart + prefix.length,
        selStart + prefix.length,
      )
    })
  }

  const groups = [
    [
      { Icon: Heading, title: 'Título', fn: () => insertLinePrefix('## ') },
      {
        Icon: Bold,
        title: 'Negrito',
        fn: () => insertInline('**', '**', 'negrito'),
      },
      {
        Icon: Italic,
        title: 'Itálico',
        fn: () => insertInline('*', '*', 'itálico'),
      },
    ],
    [
      { Icon: List, title: 'Lista', fn: () => insertLinePrefix('- ') },
      {
        Icon: ListOrdered,
        title: 'Lista numerada',
        fn: () => insertLinePrefix('1. '),
      },
      { Icon: Quote, title: 'Citação', fn: () => insertLinePrefix('> ') },
    ],
    [
      {
        Icon: Link,
        title: 'Link',
        fn: () => insertInline('[', '](url)', 'texto'),
      },
      {
        Icon: Code,
        title: 'Código',
        fn: () => insertInline('`', '`', 'código'),
      },
    ],
  ]

  return (
    <div className="rp-md-editor">
      <div className="rp-md-editor__toolbar">
        <div className="flex shrink-0">
          {(['write', 'preview'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'rp-md-editor__tab',
                tab === t
                  ? 'rp-md-editor__tab--active'
                  : 'rp-md-editor__tab--inactive',
              )}
            >
              {t === 'write' ? (
                <Pencil className="size-[13px]" />
              ) : (
                <Eye className="size-[13px]" />
              )}
              {t === 'write' ? 'Escrever' : 'Visualizar'}
            </button>
          ))}
        </div>
        <div
          className={cn(
            'rp-md-editor__actions',
            tab === 'preview' && 'pointer-events-none opacity-40',
          )}
        >
          {groups.map((grp, gi) => (
            <div key={gi} className="flex items-center">
              {gi > 0 && <div className="rp-md-editor__divider" />}
              {grp.map(({ Icon, title, fn }) => (
                <button
                  key={title}
                  type="button"
                  title={title}
                  onClick={fn}
                  className="rp-md-editor__fmt-btn"
                >
                  <Icon className="size-[13px]" />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {tab === 'write' ? (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            'Ex:\n## Queixa principal\nAnsiedade generalizada com episódios noturnos.\n\n**Encaminhamento:** psiquiatra (Dra. Lima)\n\n- Insônia há 3 meses\n- Pico após mudança de emprego'
          }
          className="rp-md-editor__textarea"
        />
      ) : (
        <div
          className="mk-preview rp-md-editor__preview"
          dangerouslySetInnerHTML={{
            __html: value.trim()
              ? renderMarkdown(value)
              : '<p class="mk-empty">Nada para visualizar ainda.</p>',
          }}
        />
      )}

      <div className="rp-md-editor__footer">
        <div className="rp-md-editor__help">
          <FileText className="size-[11px]" />
          <span>Markdown suportado ·</span>
          {['**negrito**', '*itálico*', '# título', '- lista'].map((ex) => (
            <code key={ex} className="rp-md-editor__help-code">
              {ex}
            </code>
          ))}
        </div>
        <span className="rp-md-editor__char-count">
          {value.length} caracteres
        </span>
      </div>
    </div>
  )
}
