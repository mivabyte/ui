# @mivabyte/ui Component Catalog

`@mivabyte/ui` is a centrally installable shadcn/ui distribution. The authoritative component inventory is `config/components.mjs`; release checks require the source directory, package subpaths, Storybook coverage, and generated exports to match it exactly.

This file is the human-facing catalog: one section per registry slug listing its import subpath, its runtime exports, and any exported types. Those facts are read from `src/components/ui/<slug>.tsx`. Use [`generated/exports.md`](generated/exports.md) for the machine-generated subpath and artifact map, and Storybook for runtime behavior and props — this document does not duplicate prop tables or examples.

## Setup

```bash
npm install @mivabyte/ui
```

```tsx
import { Button } from "@mivabyte/ui/button"
import { Toaster, toast } from "@mivabyte/ui/toast"
import "@mivabyte/ui/styles.css"

export function App() {
  return (
    <>
      <Button onClick={() => toast.add({ title: "Saved" })}>Continue</Button>
      <Toaster />
    </>
  )
}
```

Root imports are supported; component subpaths give the clearest dependency boundary and are verified for ESM and CommonJS consumers.

## Official catalog — 66 modules

`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `attachment`, `avatar`, `badge`, `breadcrumb`, `bubble`, `button`, `button-group`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `combobox`, `command`, `context-menu`, `data-table`, `date-picker`, `dialog`, `direction`, `drawer`, `dropdown-menu`, `empty`, `field`, `form`, `hover-card`, `input`, `input-group`, `input-otp`, `item`, `kbd`, `label`, `marker`, `menubar`, `message`, `message-scroller`, `native-select`, `navigation-menu`, `pagination`, `popover`, `progress`, `questionnaire`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toggle`, `toggle-group`, `tooltip`, `typography`.

## Actions & Triggers

### Button

Subpath `@mivabyte/ui/button`, source `src/components/ui/button.tsx`.

Runtime exports: `Button`, `buttonVariants`.

Exported types: `ButtonProps`.

Storybook usage: `stories/button.stories.tsx`.

### Button Group

Subpath `@mivabyte/ui/button-group`, source `src/components/ui/button-group.tsx`.

Runtime exports: `ButtonGroup`.

Storybook usage: `stories/button-group.stories.tsx`.

### Toggle

Subpath `@mivabyte/ui/toggle`, source `src/components/ui/toggle.tsx`.

Runtime exports: `Toggle`, `toggleVariants`.

Storybook usage: `stories/toggle.stories.tsx`.

### Toggle Group

Subpath `@mivabyte/ui/toggle-group`, source `src/components/ui/toggle-group.tsx`.

Runtime exports: `ToggleGroup`, `ToggleGroupItem`.

Storybook usage: `stories/toggle-group.stories.tsx`.

## Forms & User Input

### Field

Subpath `@mivabyte/ui/field`, source `src/components/ui/field.tsx`.

Runtime exports: `Field`, `FieldContent`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldLabel`, `FieldLegend`, `FieldSeparator`, `FieldSet`, `FieldTitle`.

Storybook usage: `stories/field.stories.tsx`.

### Form

Subpath `@mivabyte/ui/form`, source `src/components/ui/form.tsx`.

Runtime exports: `Form`, `FormControl`, `FormDescription`, `FormField`, `FormItem`, `FormLabel`, `FormMessage`, `useFormField`.

Storybook usage: `stories/form.stories.tsx`.

### Input

Subpath `@mivabyte/ui/input`, source `src/components/ui/input.tsx`.

Runtime exports: `Input`.

Storybook usage: `stories/input.stories.tsx`.

### Input Group

Subpath `@mivabyte/ui/input-group`, source `src/components/ui/input-group.tsx`.

Runtime exports: `InputGroup`.

Exported types: `InputGroupProps`.

Storybook usage: `stories/input-group.stories.tsx`.

### Input OTP

Subpath `@mivabyte/ui/input-otp`, source `src/components/ui/input-otp.tsx`.

Runtime exports: `InputOTP`, `InputOTPGroup`, `InputOTPSeparator`, `InputOTPSlot`.

Storybook usage: `stories/input-otp.stories.tsx`.

### Textarea

Subpath `@mivabyte/ui/textarea`, source `src/components/ui/textarea.tsx`.

Runtime exports: `Textarea`.

Storybook usage: `stories/textarea.stories.tsx`.

### Checkbox

Subpath `@mivabyte/ui/checkbox`, source `src/components/ui/checkbox.tsx`.

Runtime exports: `Checkbox`.

Storybook usage: `stories/checkbox.stories.tsx`.

### Radio Group

Subpath `@mivabyte/ui/radio-group`, source `src/components/ui/radio-group.tsx`.

Runtime exports: `RadioGroup`, `RadioGroupItem`.

Storybook usage: `stories/radio-group.stories.tsx`.

### Select

Subpath `@mivabyte/ui/select`, source `src/components/ui/select.tsx`.

Runtime exports: `Select`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectLabel`, `SelectScrollDownButton`, `SelectScrollUpButton`, `SelectSeparator`, `SelectTrigger`, `SelectValue`.

Storybook usage: `stories/select.stories.tsx`.

### Native Select

Subpath `@mivabyte/ui/native-select`, source `src/components/ui/native-select.tsx`.

Runtime exports: `NativeSelect`.

Exported types: `NativeSelectProps`.

Storybook usage: `stories/native-select.stories.tsx`.

### Switch

Subpath `@mivabyte/ui/switch`, source `src/components/ui/switch.tsx`.

Runtime exports: `Switch`.

Storybook usage: `stories/switch.stories.tsx`.

### Slider

Subpath `@mivabyte/ui/slider`, source `src/components/ui/slider.tsx`.

Runtime exports: `Slider`.

Storybook usage: `stories/slider.stories.tsx`.

### Combobox

Subpath `@mivabyte/ui/combobox`, source `src/components/ui/combobox.tsx`.

Runtime exports: `Combobox`.

Exported types: `ComboboxOption`, `ComboboxProps`.

Storybook usage: `stories/combobox.stories.tsx`.

### Date Picker

Subpath `@mivabyte/ui/date-picker`, source `src/components/ui/date-picker.tsx`.

Runtime exports: `DatePicker`.

Exported types: `DatePickerProps`.

Storybook usage: `stories/date-picker.stories.tsx`.

### Calendar

Subpath `@mivabyte/ui/calendar`, source `src/components/ui/calendar.tsx`.

Runtime exports: `Calendar`, `CalendarDayButton`.

Storybook usage: `stories/calendar.stories.tsx`.

### Questionnaire

Subpath `@mivabyte/ui/questionnaire`, source `src/components/ui/questionnaire.tsx`.

Runtime exports: `Questionnaire`.

Exported types: `QuestionnaireProps`.

Storybook usage: `stories/questionnaire.stories.tsx`.

## Overlays & Dialogs

### Dialog

Subpath `@mivabyte/ui/dialog`, source `src/components/ui/dialog.tsx`.

Runtime exports: `Dialog`, `DialogClose`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, `DialogTrigger`.

Storybook usage: `stories/dialog.stories.tsx`.

### Alert Dialog

Subpath `@mivabyte/ui/alert-dialog`, source `src/components/ui/alert-dialog.tsx`.

Runtime exports: `AlertDialog`, `AlertDialogAction`, `AlertDialogCancel`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogOverlay`, `AlertDialogPortal`, `AlertDialogTitle`, `AlertDialogTrigger`.

Storybook usage: `stories/alert-dialog.stories.tsx`.

### Sheet

Subpath `@mivabyte/ui/sheet`, source `src/components/ui/sheet.tsx`.

Runtime exports: `Sheet`, `SheetClose`, `SheetContent`, `SheetDescription`, `SheetFooter`, `SheetHeader`, `SheetOverlay`, `SheetPortal`, `SheetTitle`, `SheetTrigger`.

Storybook usage: `stories/sheet.stories.tsx`.

### Drawer

Subpath `@mivabyte/ui/drawer`, source `src/components/ui/drawer.tsx`.

Runtime exports: `Drawer`, `DrawerClose`, `DrawerContent`, `DrawerDescription`, `DrawerFooter`, `DrawerHeader`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, `DrawerTrigger`.

Storybook usage: `stories/drawer.stories.tsx`.

### Popover

Subpath `@mivabyte/ui/popover`, source `src/components/ui/popover.tsx`.

Runtime exports: `Popover`, `PopoverAnchor`, `PopoverContent`, `PopoverTrigger`.

Storybook usage: `stories/popover.stories.tsx`.

### Tooltip

Subpath `@mivabyte/ui/tooltip`, source `src/components/ui/tooltip.tsx`.

Runtime exports: `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`.

Storybook usage: `stories/tooltip.stories.tsx`.

### Hover Card

Subpath `@mivabyte/ui/hover-card`, source `src/components/ui/hover-card.tsx`.

Runtime exports: `HoverCard`, `HoverCardContent`, `HoverCardTrigger`.

Storybook usage: `stories/hover-card.stories.tsx`.

### Context Menu

Subpath `@mivabyte/ui/context-menu`, source `src/components/ui/context-menu.tsx`.

Runtime exports: `ContextMenu`, `ContextMenuCheckboxItem`, `ContextMenuContent`, `ContextMenuGroup`, `ContextMenuItem`, `ContextMenuLabel`, `ContextMenuPortal`, `ContextMenuRadioGroup`, `ContextMenuRadioItem`, `ContextMenuSeparator`, `ContextMenuShortcut`, `ContextMenuSub`, `ContextMenuSubContent`, `ContextMenuSubTrigger`, `ContextMenuTrigger`.

Storybook usage: `stories/context-menu.stories.tsx`.

### Dropdown Menu

Subpath `@mivabyte/ui/dropdown-menu`, source `src/components/ui/dropdown-menu.tsx`.

Runtime exports: `DropdownMenu`, `DropdownMenuCheckboxItem`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuPortal`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuTrigger`.

Storybook usage: `stories/dropdown-menu.stories.tsx`.

### Command

Subpath `@mivabyte/ui/command`, source `src/components/ui/command.tsx`.

Runtime exports: `Command`, `CommandDialog`, `CommandEmpty`, `CommandGroup`, `CommandInput`, `CommandItem`, `CommandList`, `CommandSeparator`, `CommandShortcut`.

Storybook usage: `stories/command.stories.tsx`.

## Navigation

### Navigation Menu

Subpath `@mivabyte/ui/navigation-menu`, source `src/components/ui/navigation-menu.tsx`.

Runtime exports: `NavigationMenu`, `NavigationMenuContent`, `NavigationMenuIndicator`, `NavigationMenuItem`, `NavigationMenuLink`, `NavigationMenuList`, `NavigationMenuTrigger`, `NavigationMenuViewport`, `navigationMenuTriggerStyle`.

Storybook usage: `stories/navigation-menu.stories.tsx`.

### Breadcrumb

Subpath `@mivabyte/ui/breadcrumb`, source `src/components/ui/breadcrumb.tsx`.

Runtime exports: `Breadcrumb`, `BreadcrumbEllipsis`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbList`, `BreadcrumbPage`, `BreadcrumbSeparator`.

Storybook usage: `stories/breadcrumb.stories.tsx`.

### Pagination

Subpath `@mivabyte/ui/pagination`, source `src/components/ui/pagination.tsx`.

Runtime exports: `Pagination`, `PaginationContent`, `PaginationEllipsis`, `PaginationItem`, `PaginationLink`, `PaginationNext`, `PaginationPrevious`.

Storybook usage: `stories/pagination.stories.tsx`.

### Tabs

Subpath `@mivabyte/ui/tabs`, source `src/components/ui/tabs.tsx`.

Runtime exports: `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`.

Exported types: `TabsListProps`.

Storybook usage: `stories/tabs.stories.tsx`.

### Menubar

Subpath `@mivabyte/ui/menubar`, source `src/components/ui/menubar.tsx`.

Runtime exports: `Menubar`, `MenubarCheckboxItem`, `MenubarContent`, `MenubarGroup`, `MenubarItem`, `MenubarLabel`, `MenubarMenu`, `MenubarPortal`, `MenubarRadioGroup`, `MenubarRadioItem`, `MenubarSeparator`, `MenubarShortcut`, `MenubarSub`, `MenubarSubContent`, `MenubarSubTrigger`, `MenubarTrigger`.

Storybook usage: `stories/menubar.stories.tsx`.

### Sidebar

Subpath `@mivabyte/ui/sidebar`, source `src/components/ui/sidebar.tsx`.

Runtime exports: `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupAction`, `SidebarGroupContent`, `SidebarGroupLabel`, `SidebarHeader`, `SidebarInput`, `SidebarInset`, `SidebarMenu`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubButton`, `SidebarMenuSubItem`, `SidebarProvider`, `SidebarRail`, `SidebarSeparator`, `SidebarTrigger`, `useSidebar`.

Storybook usage: `stories/sidebar.stories.tsx`.

### Direction

Subpath `@mivabyte/ui/direction`, source `src/components/ui/direction.tsx`.

Runtime exports: `DirectionProvider`, `useDirection`.

Storybook usage: `stories/direction.stories.tsx`.

## Layout & Structure

### Card

Subpath `@mivabyte/ui/card`, source `src/components/ui/card.tsx`.

Runtime exports: `Card`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardTitle`.

Exported types: `CardProps`.

Storybook usage: `stories/card.stories.tsx`.

### Separator

Subpath `@mivabyte/ui/separator`, source `src/components/ui/separator.tsx`.

Runtime exports: `Separator`.

Storybook usage: `stories/separator.stories.tsx`.

### Resizable

Subpath `@mivabyte/ui/resizable`, source `src/components/ui/resizable.tsx`.

Runtime exports: `ResizableHandle`, `ResizablePanel`, `ResizablePanelGroup`.

Storybook usage: `stories/resizable.stories.tsx`.

### Scroll Area

Subpath `@mivabyte/ui/scroll-area`, source `src/components/ui/scroll-area.tsx`.

Runtime exports: `ScrollArea`, `ScrollBar`.

Storybook usage: `stories/scroll-area.stories.tsx`.

### Aspect Ratio

Subpath `@mivabyte/ui/aspect-ratio`, source `src/components/ui/aspect-ratio.tsx`.

Runtime exports: `AspectRatio`.

Exported types: `AspectRatioProps`.

Storybook usage: `stories/aspect-ratio.stories.tsx`.

### Collapsible

Subpath `@mivabyte/ui/collapsible`, source `src/components/ui/collapsible.tsx`.

Runtime exports: `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`.

Storybook usage: `stories/collapsible.stories.tsx`.

### Accordion

Subpath `@mivabyte/ui/accordion`, source `src/components/ui/accordion.tsx`.

Runtime exports: `Accordion`, `AccordionContent`, `AccordionItem`, `AccordionTrigger`.

Storybook usage: `stories/accordion.stories.tsx`.

## Data Display & Content

### Table

Subpath `@mivabyte/ui/table`, source `src/components/ui/table.tsx`.

Runtime exports: `Table`, `TableBody`, `TableCaption`, `TableCell`, `TableFooter`, `TableHead`, `TableHeader`, `TableRow`.

Storybook usage: `stories/table.stories.tsx`.

### Data Table

Subpath `@mivabyte/ui/data-table`, source `src/components/ui/data-table.tsx`.

Runtime exports: `DataTable`.

Exported types: `DataTableColumn`, `DataTableProps`.

Storybook usage: `stories/data-table.stories.tsx`.

### Badge

Subpath `@mivabyte/ui/badge`, source `src/components/ui/badge.tsx`.

Runtime exports: `Badge`, `badgeVariants`.

Exported types: `BadgeProps`.

Storybook usage: `stories/badge.stories.tsx`.

### Avatar

Subpath `@mivabyte/ui/avatar`, source `src/components/ui/avatar.tsx`.

Runtime exports: `Avatar`, `AvatarFallback`, `AvatarImage`.

Storybook usage: `stories/avatar.stories.tsx`.

### Skeleton

Subpath `@mivabyte/ui/skeleton`, source `src/components/ui/skeleton.tsx`.

Runtime exports: `Skeleton`.

Storybook usage: `stories/skeleton.stories.tsx`.

### Empty

Subpath `@mivabyte/ui/empty`, source `src/components/ui/empty.tsx`.

Runtime exports: `Empty`, `EmptyContent`, `EmptyDescription`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`.

Storybook usage: `stories/empty.stories.tsx`.

### Item

Subpath `@mivabyte/ui/item`, source `src/components/ui/item.tsx`.

Runtime exports: `Item`.

Storybook usage: `stories/item.stories.tsx`.

### Bubble

Subpath `@mivabyte/ui/bubble`, source `src/components/ui/bubble.tsx`.

Runtime exports: `Bubble`.

Storybook usage: `stories/bubble.stories.tsx`.

### Attachment

Subpath `@mivabyte/ui/attachment`, source `src/components/ui/attachment.tsx`.

Runtime exports: `Attachment`.

Exported types: `AttachmentProps`.

Storybook usage: `stories/attachment.stories.tsx`.

### Marker

Subpath `@mivabyte/ui/marker`, source `src/components/ui/marker.tsx`.

Runtime exports: `Marker`.

Storybook usage: `stories/marker.stories.tsx`.

### Message

Subpath `@mivabyte/ui/message`, source `src/components/ui/message.tsx`.

Runtime exports: `Message`.

Storybook usage: `stories/message.stories.tsx`.

### Message Scroller

Subpath `@mivabyte/ui/message-scroller`, source `src/components/ui/message-scroller.tsx`.

Runtime exports: `MessageScroller`.

Storybook usage: `stories/message-scroller.stories.tsx`.

### Carousel

Subpath `@mivabyte/ui/carousel`, source `src/components/ui/carousel.tsx`.

Runtime exports: `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselNext`, `CarouselPrevious`.

Exported types: `CarouselApi`.

Storybook usage: `stories/carousel.stories.tsx`.

### Kbd

Subpath `@mivabyte/ui/kbd`, source `src/components/ui/kbd.tsx`.

Runtime exports: `Kbd`.

Storybook usage: `stories/kbd.stories.tsx`.

## Typography

### Typography

Subpath `@mivabyte/ui/typography`, source `src/components/ui/typography.tsx`.

Runtime exports: `Eyebrow`, `Heading`, `Text`, `Typography`, `headingVariants`, `textVariants`.

Exported types: `HeadingProps`, `TextProps`, `TypographyProps`.

Storybook usage: `stories/typography.stories.tsx`.

### Label

Subpath `@mivabyte/ui/label`, source `src/components/ui/label.tsx`.

Runtime exports: `Label`.

Storybook usage: `stories/label.stories.tsx`.

## Feedback & Status

### Alert

Subpath `@mivabyte/ui/alert`, source `src/components/ui/alert.tsx`.

Runtime exports: `Alert`, `AlertDescription`, `AlertTitle`.

Storybook usage: `stories/alert.stories.tsx`.

### Progress

Subpath `@mivabyte/ui/progress`, source `src/components/ui/progress.tsx`.

Runtime exports: `Progress`.

Storybook usage: `stories/progress.stories.tsx`.

### Spinner

Subpath `@mivabyte/ui/spinner`, source `src/components/ui/spinner.tsx`.

Runtime exports: `Spinner`.

Storybook usage: `stories/spinner.stories.tsx`.

### Toast

Subpath `@mivabyte/ui/toast`, source `src/components/ui/toast.tsx`.

Runtime exports: `Toast`, `ToastAction`, `ToastClose`, `ToastContent`, `ToastDescription`, `ToastPortal`, `ToastProvider`, `ToastTitle`, `ToastViewport`, `Toaster`, `createToastManager`, `toast`, `useToastManager`.

The manager is a Base UI toast manager, not a callable function: use `toast.add({ title })`, `toast.add({ type: "error", title })`, plus `close`, `update`, and `promise`. Mount `<Toaster />` once near the app root.

Storybook usage: `stories/toast.stories.tsx`.

### Sonner

Subpath `@mivabyte/ui/sonner`, source `src/components/ui/sonner.tsx`.

Runtime exports: `Toaster`.

The subpath export is `Toaster`. The root barrel re-exports it as `SonnerToaster` because `toast` already owns the canonical `Toaster` name. This wrapper reads the active theme through `next-themes`.

Storybook usage: `stories/sonner.stories.tsx`.

## Data Visualization

### Chart

Subpath `@mivabyte/ui/chart`, source `src/components/ui/chart.tsx`.

Runtime exports: `ChartContainer`, `ChartLegend`, `ChartLegendContent`, `ChartStyle`, `ChartTooltip`, `ChartTooltipContent`, `THEMES`.

Exported types: `ChartConfig`, `ChartTooltipContentProps`.

Storybook usage: `stories/chart.stories.tsx`.
