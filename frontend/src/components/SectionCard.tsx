import type { PropsWithChildren, ReactNode } from 'react'

type SectionCardProps = PropsWithChildren<{
  title: string
  description?: string
  actions?: ReactNode
  className?: string
  contentClassName?: string
}>

export function SectionCard({
  title,
  description,
  actions,
  className = '',
  contentClassName = '',
  children,
}: SectionCardProps) {
  return (
    <section className={`panel ${className}`.trim()}>
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {actions}
      </div>
      <div className={contentClassName}>{children}</div>
    </section>
  )
}
