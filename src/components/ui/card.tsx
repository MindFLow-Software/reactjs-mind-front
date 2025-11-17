import * as React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="article"
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground",
        "flex flex-col gap-6",
        "relative overflow-hidden py-6",
        "rounded-[20px]",
        "shadow-md shadow-black/8",
        "border border-b-[3px]",
        "border-zinc/8 dark:border-white/8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        "@container/card-header",
        "grid auto-rows-min items-start gap-2 px-6",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        "[.border-b]:pb-6",
        "relative z-10",
        className
      )}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-title"
      className={cn(
        "leading-none font-semibold",
        "text-lg",
        className
      )}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-description"
      className={cn(
        "text-muted-foreground text-sm leading-relaxed",
        className
      )}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

const CardAction = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1",
        "self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
)
CardAction.displayName = "CardAction"

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn("px-6 relative z-10", className)}
      {...props}
    />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn(
        "flex items-center px-6",
        "[.border-t]:pt-6",
        "relative z-10",
        className
      )}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
