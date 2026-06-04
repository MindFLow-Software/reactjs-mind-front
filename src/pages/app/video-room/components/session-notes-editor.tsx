'use client'

import type React from 'react'

import { useRef, useEffect, useState, useCallback } from 'react'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Minus,
  Plus,
  Type,
  Sparkles,
  CheckCircle2,
  Clock,
  AlignLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SessionNotesEditorProps {
  content: string
  isSessionActive: boolean
  onContentChange: (value: string) => void
  maxLength?: number
}

export function SessionNotesEditor({
  content = '',
  isSessionActive,
  onContentChange,
  maxLength = 8000,
}: SessionNotesEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [fontSize, setFontSize] = useState(16)
  const [isFocused, setIsFocused] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.max(400, textarea.scrollHeight)}px`
    }
  }, [content])

  // Simular auto-save
  useEffect(() => {
    if (content && isSessionActive) {
      const timer = setTimeout(() => {
        setLastSaved(new Date())
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [content, isSessionActive])

  const applyFormat = useCallback(
    (symbol: string, type: 'wrap' | 'prefix' = 'wrap') => {
      const textarea = textareaRef.current
      if (!textarea || !isSessionActive) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = content.substring(start, end)

      let newText: string
      let newCursorPos: number

      if (type === 'wrap') {
        newText =
          content.substring(0, start) +
          `${symbol}${selectedText}${symbol}` +
          content.substring(end)
        newCursorPos = end + symbol.length * 2
      } else {
        newText =
          content.substring(0, start) + `\n${symbol} ` + content.substring(end)
        newCursorPos = start + symbol.length + 2
      }

      onContentChange(newText)

      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    },
    [content, isSessionActive, onContentChange],
  )

  const wordCount = content?.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content?.length || 0
  const progress = (charCount / maxLength) * 100

  const ToolbarButton = ({
    onClick,
    icon: Icon,
    label,
    shortcut,
  }: {
    onClick: () => void
    icon: React.ElementType
    label: string
    shortcut?: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={!isSessionActive}
      title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
      className={cn(
        'relative flex h-8 w-8 items-center justify-center rounded-md transition-all duration-150',
        'text-muted-foreground hover:bg-secondary hover:text-foreground',
        'disabled:cursor-not-allowed disabled:opacity-40',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  )

  return (
    <div
      className={cn(
        'group relative w-full rounded-xl border bg-card transition-all duration-300',
        isFocused && isSessionActive
          ? 'border-foreground/20 shadow-lg shadow-foreground/5'
          : 'border-border',
        !isSessionActive && 'opacity-60',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
              isSessionActive
                ? 'bg-[hsl(var(--editor-active))]/10'
                : 'bg-muted',
            )}
          >
            {isSessionActive ? (
              <Sparkles className="h-4 w-4 text-[hsl(var(--editor-active))]" />
            ) : (
              <Clock className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">
              {isSessionActive ? 'Evolução Clínica' : 'Aguardando Sessão'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isSessionActive
                ? 'Suas anotações serão salvas automaticamente'
                : 'Inicie o atendimento para começar'}
            </p>
          </div>
        </div>

        {/* Status indicator */}
        {isSessionActive && lastSaved && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3 w-3 text-[hsl(var(--editor-success))]" />
            <span>Salvo</span>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div
        className={cn(
          'flex items-center gap-1 border-b border-border/50 px-3 py-2 transition-opacity',
          !isSessionActive && 'pointer-events-none opacity-50',
        )}
      >
        {/* Font size control */}
        <div className="flex items-center rounded-md border border-border bg-background">
          <button
            type="button"
            onClick={() => setFontSize((s) => Math.max(12, s - 1))}
            disabled={!isSessionActive}
            className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40"
          >
            <Minus className="h-3 w-3" />
          </button>
          <div className="flex w-10 items-center justify-center border-x border-border">
            <Type className="mr-1 h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-xs text-foreground">
              {fontSize}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setFontSize((s) => Math.min(24, s + 1))}
            disabled={!isSessionActive}
            className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        <div className="mx-2 h-5 w-px bg-border" />

        {/* Format buttons */}
        <ToolbarButton
          onClick={() => applyFormat('**')}
          icon={Bold}
          label="Negrito"
          shortcut="Ctrl+B"
        />
        <ToolbarButton
          onClick={() => applyFormat('*')}
          icon={Italic}
          label="Itálico"
          shortcut="Ctrl+I"
        />

        <div className="mx-2 h-5 w-px bg-border" />

        <ToolbarButton
          onClick={() => applyFormat('##', 'prefix')}
          icon={Heading2}
          label="Título"
        />
        <ToolbarButton
          onClick={() => applyFormat('-', 'prefix')}
          icon={List}
          label="Lista"
        />
        <ToolbarButton
          onClick={() => applyFormat('1.', 'prefix')}
          icon={ListOrdered}
          label="Lista numerada"
        />

        {/* Stats - right side */}
        <div className="ml-auto flex items-center gap-4 pr-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <AlignLeft className="h-3 w-3" />
            <span className="tabular-nums">{wordCount}</span>
            <span>palavras</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  progress < 70
                    ? 'bg-[hsl(var(--editor-active))]'
                    : progress < 90
                      ? 'bg-[hsl(var(--editor-warning))]'
                      : 'bg-destructive',
                )}
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
            <span className="min-w-[60px] text-right font-mono text-xs text-muted-foreground">
              {charCount.toLocaleString()}/{maxLength.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Editor area */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          placeholder={
            isSessionActive
              ? 'Comece a escrever sua evolução clínica...'
              : 'Aguardando início da sessão...'
          }
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          readOnly={!isSessionActive}
          maxLength={maxLength}
          style={{ fontSize: `${fontSize}px` }}
          className={cn(
            'w-full min-h-[400px] resize-none bg-transparent px-6 py-5 font-serif leading-relaxed text-foreground',
            'placeholder:text-muted-foreground/50',
            'outline-none transition-all',
            !isSessionActive && 'cursor-not-allowed',
          )}
        />

        {/* Empty state */}
        {!content && isSessionActive && (
          <div className="pointer-events-none absolute left-6 top-5 flex items-center gap-2 text-muted-foreground/40">
            <span className="animate-pulse">|</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border/50 px-4 py-2.5">
        <p className="text-xs text-muted-foreground">
          {isSessionActive
            ? 'Use **texto** para negrito, *texto* para itálico'
            : 'Editor desabilitado'}
        </p>
        <div className="flex items-center gap-2">
          <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
            Markdown
          </kbd>
        </div>
      </div>
    </div>
  )
}
