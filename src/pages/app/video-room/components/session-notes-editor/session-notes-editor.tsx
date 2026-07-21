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
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import './session-notes-editor.css'

type SessionNotesEditorProps = {
  content: string
  isSessionActive: boolean
  onContentChange: (value: string) => void
  maxLength?: number
}

function resolveProgressFill(progress: number) {
  if (progress < 70) return 'bg-[hsl(var(--editor-active))]'
  if (progress < 90) return 'bg-[hsl(var(--editor-warning))]'
  return 'bg-destructive'
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
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={!isSessionActive}
      title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
      className="vr-notes-toolbar-btn"
    >
      <Icon className="h-4 w-4" />
    </Button>
  )

  return (
    <div
      className={cn(
        'group vr-notes-shell',
        isFocused && isSessionActive
          ? 'border-foreground/20 shadow-lg shadow-foreground/5'
          : 'border-border',
        !isSessionActive && 'opacity-60',
      )}
    >
      {/* Header */}
      <div className="vr-notes-header">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'vr-notes-header-icon',
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
          'vr-notes-toolbar',
          !isSessionActive && 'pointer-events-none opacity-50',
        )}
      >
        {/* Font size control */}
        <div className="vr-notes-font-size-control">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setFontSize((s) => Math.max(12, s - 1))}
            disabled={!isSessionActive}
            className="vr-notes-font-size-btn"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <div className="vr-notes-font-size-value">
            <Type className="mr-1 h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-xs text-foreground">
              {fontSize}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setFontSize((s) => Math.min(24, s + 1))}
            disabled={!isSessionActive}
            className="vr-notes-font-size-btn"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="vr-notes-divider" />

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

        <div className="vr-notes-divider" />

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
        <div className="vr-notes-stats">
          <div className="vr-notes-word-count">
            <AlignLeft className="h-3 w-3" />
            <span className="tabular-nums">{wordCount}</span>
            <span>palavras</span>
          </div>
          <div className="vr-notes-char-progress">
            <div className="vr-notes-char-progress-track">
              <div
                className={cn(
                  'vr-notes-char-progress-fill',
                  resolveProgressFill(progress),
                )}
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
            <span className="vr-notes-char-count">
              {charCount.toLocaleString()}/{maxLength.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Editor area */}
      <div className="relative">
        <Textarea
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
            'vr-notes-textarea',
            !isSessionActive && 'cursor-not-allowed',
          )}
        />

        {/* Empty state */}
        {!content && isSessionActive && (
          <div className="vr-notes-caret">
            <span className="animate-pulse">|</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="vr-notes-footer">
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
