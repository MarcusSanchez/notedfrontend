import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}
>(({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || '')

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === TabsList || child.type === TabsContent) {
            return React.cloneElement(child, {
              selectedValue,
              onValueChange: handleValueChange
            })
          }
        }
        return child
      })}
    </div>
  )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
  selectedValue?: string
  onValueChange?: (value: string) => void
}
>(({ className, children, selectedValue, onValueChange, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-12 items-center justify-center rounded-lg bg-gray-100 p-1 text-muted-foreground shadow-sm",
      className
    )}
    {...props}
  >
    {React.Children.map(children, child => {
      if (React.isValidElement(child) && child.type === TabsTrigger) {
        return React.cloneElement(child, {
          selectedValue,
          onValueChange
        })
      }
      return child
    })}
  </div>
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string
  selectedValue?: string
  onValueChange?: (value: string) => void
}
>(({ className, value, selectedValue, onValueChange, children, ...props }, ref) => {
  const isSelected = selectedValue === value

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected
          ? "bg-white text-gray-900 shadow-md border border-gray-200"
          : "text-gray-600 hover:bg-white/50 hover:text-gray-900",
        className
      )}
      onClick={() => onValueChange?.(value)}
      {...props}
    >
      {children}
    </button>
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
  value: string
  selectedValue?: string
}
>(({ className, value, selectedValue, children, ...props }, ref) => {
  if (selectedValue !== value) return null

  return (
    <div
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }