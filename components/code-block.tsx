import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({ code, language = 'typescript', className }: CodeBlockProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-lg border border-border', className)}>
      <div className="flex items-center border-b border-white/10 bg-[#1e1b2e] px-4 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <span className="ml-3 text-[11px] font-medium uppercase tracking-wider text-white/40">
          {language}
        </span>
      </div>
      <pre className="overflow-x-auto bg-[#161324] p-4">
        <code className="text-[13px] leading-relaxed text-[#c9c5e0]">{code}</code>
      </pre>
    </div>
  )
}
