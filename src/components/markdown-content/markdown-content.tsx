import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { cn } from '@/lib/utils'

import './markdown-content.css'

type IMarkdownContent = {
  content: string
  className?: string
}

export function MarkdownContent({ content, className }: IMarkdownContent) {
  return (
    <div className={cn('mdc-root', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
