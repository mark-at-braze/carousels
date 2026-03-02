import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({ code, language = 'typescript', className }: CodeBlockProps) {
  return (
    <div className={cn('relative rounded-lg border border-border bg-muted', className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {language}
        </span>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="text-sm leading-relaxed text-foreground">{code}</code>
      </pre>
    </div>
  )
}
