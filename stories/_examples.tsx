import {
  Alert,
  AlertDescription,
  AlertTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Attachment,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  Message,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Progress,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Slider,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  Skeleton,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Typography,
} from "../src/index.js"

export function ThemePreviewExample() {
  return (
    <div className="grid gap-6 p-6">
      <Typography variant="h3">Semantic Theme Preview</Typography>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs font-medium">
        <div className="bg-background text-foreground border border-border rounded-lg p-3 shadow-xs">
          Background
        </div>
        <div className="bg-muted text-muted-foreground rounded-lg p-3">
          Muted
        </div>
        <div className="bg-accent text-accent-foreground rounded-lg p-3">
          Accent
        </div>
        <div className="bg-primary text-primary-foreground rounded-lg p-3">
          Primary
        </div>
        <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
          Secondary
        </div>
        <div className="bg-card text-card-foreground border border-border rounded-lg p-3 shadow-xs">
          Card
        </div>
        <div className="bg-popover text-popover-foreground border border-border rounded-lg p-3 shadow-xs">
          Popover
        </div>
        <div className="bg-sidebar text-sidebar-foreground border border-sidebar-border rounded-lg p-3">
          Sidebar
        </div>
        <div className="bg-destructive text-destructive-foreground rounded-lg p-3">
          Destructive
        </div>
        <div className="bg-background text-foreground ring-3 ring-ring rounded-lg p-3">
          Ring Focus
        </div>
      </div>
    </div>
  )
}

export function AlertExample() {
  return (
    <Alert className="max-w-md">
      <AlertTitle>Deployment complete</AlertTitle>
      <AlertDescription>
        The production build passed all required checks.
      </AlertDescription>
    </Alert>
  )
}

export function AttachmentExample() {
  return (
    <Attachment className="items-center justify-between p-4 max-w-sm">
      <div className="space-y-1">
        <p className="text-sm font-medium">quarterly-report.pdf</p>
        <p className="text-xs text-muted-foreground">2.4 MB · PDF</p>
      </div>
      <Button variant="outline" size="sm">
        Download
      </Button>
    </Attachment>
  )
}

export function BadgeExample() {
  return <Badge>Stable</Badge>
}

export function BreadcrumbExample() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Library</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Components</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function ButtonExample() {
  return <Button>Continue</Button>
}

export function CardExample() {
  return (
    <Card className="w-[24rem] max-w-full">
      <CardHeader>
        <CardTitle>Design-system card</CardTitle>
        <CardDescription>
          Use one surface primitive for grouped content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Card spacing and surface tokens respond to theme and density.
        </p>
      </CardContent>
    </Card>
  )
}

export function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Confirm change</DialogTitle>
        <DialogDescription>
          Focus stays inside the modal until it closes.
        </DialogDescription>
        <Input aria-label="Change note" placeholder="Optional note" />
      </DialogContent>
    </Dialog>
  )
}

export function EmptyExample() {
  return (
    <Empty className="w-[28rem] max-w-full">
      <EmptyHeader>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          Create the first project to start organizing work.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export function FieldExample() {
  return (
    <Field className="w-80 max-w-full">
      <FieldLabel htmlFor="storybook-email">Email</FieldLabel>
      <Input id="storybook-email" type="email" placeholder="name@example.com" />
      <FieldDescription>Used for release notifications.</FieldDescription>
    </Field>
  )
}

export function InputExample() {
  return (
    <Input
      className="w-80 max-w-full"
      aria-label="Project name"
      placeholder="Project name"
    />
  )
}

export function MessageExample() {
  return (
    <Message date={new Date()} className="w-[28rem] max-w-full flex-col gap-1">
      <div className="text-xs text-muted-foreground">Release bot</div>
      <div className="rounded-xl bg-muted px-3 py-2 text-sm">
        All package checks passed.
      </div>
    </Message>
  )
}

export function PaginationExample() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export function ProgressExample() {
  return (
    <div className="w-80 max-w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span>Migration</span>
        <span className="text-muted-foreground">68%</span>
      </div>
      <Progress value={68} />
    </div>
  )
}

export function SelectExample() {
  return (
    <Select defaultValue="production">
      <SelectTrigger className="w-80 max-w-full">
        <SelectValue placeholder="Select environment" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="preview">Preview</SelectItem>
        <SelectItem value="production">Production</SelectItem>
      </SelectContent>
    </Select>
  )
}

export function SeparatorExample() {
  return (
    <div className="w-80 max-w-full">
      <span className="text-sm font-medium">Overview</span>
      <Separator className="my-4" />
      <span className="text-sm font-medium">Details</span>
    </div>
  )
}

export function SheetExample() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>Project details</SheetTitle>
        <SheetDescription>
          Sheet uses the same modal focus contract as Dialog.
        </SheetDescription>
        <Input aria-label="Project title" placeholder="Project title" />
      </SheetContent>
    </Sheet>
  )
}

function SidebarNavigation() {
  return (
    <>
      <SidebarHeader>
        <strong className="px-2">Workspace</strong>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Projects</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2 text-xs">mivabyte-ui</SidebarFooter>
    </>
  )
}

export function SidebarExample() {
  return (
    <div className="h-80 w-[52rem] max-w-full overflow-hidden rounded-xl border">
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="none">
          <SidebarNavigation />
        </Sidebar>
        <SidebarInset className="min-h-80 p-6">
          <Typography variant="h3">Static sidebar</Typography>
          <p className="text-sm text-muted-foreground">
            Use the responsive shell for application navigation.
          </p>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export function SidebarCollapsibleExample() {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <SidebarNavigation />
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="min-h-[32rem] p-6">
        <SidebarTrigger />
        <Typography variant="h3">Collapsible sidebar</Typography>
      </SidebarInset>
    </SidebarProvider>
  )
}

export function SkeletonExample() {
  return (
    <div className="grid w-80 max-w-full gap-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}

export function SwitchExample() {
  return (
    <label className="flex items-center gap-3 text-sm font-medium">
      <Switch aria-label="Enable notifications" defaultChecked />
      Enable notifications
    </label>
  )
}

export function TabsExample() {
  return (
    <Tabs defaultValue="overview" className="w-[28rem] max-w-full">
      <TabsList aria-label="Component sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        Tabs associate each trigger with one panel.
      </TabsContent>
      <TabsContent value="accessibility">
        Arrow keys move between tab triggers.
      </TabsContent>
    </Tabs>
  )
}

export function TextareaExample() {
  return (
    <Textarea
      className="w-80 max-w-full"
      aria-label="Release notes"
      placeholder="Release notes"
    />
  )
}

export function TooltipExample() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover or focus</Button>
        </TooltipTrigger>
        <TooltipContent>Keyboard-focusable tooltip target</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function TypographyExample() {
  return (
    <div className="grid w-[36rem] max-w-full gap-3">
      <Typography
        variant="small"
        className="font-semibold uppercase tracking-wider text-muted-foreground"
      >
        Design system
      </Typography>
      <Typography variant="h2">
        Clear hierarchy without local type scales
      </Typography>
      <Typography variant="p">
        Typography primitives use shared semantic tokens across themes.
      </Typography>
    </div>
  )
}

export function AlertDialogExample() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete workspace</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            workspace and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function SliderExample() {
  return (
    <div className="grid w-80 max-w-full gap-4">
      <div className="flex justify-between text-sm">
        <span>Volume</span>
        <span className="text-muted-foreground">50%</span>
      </div>
      <Slider defaultValue={[50]} max={100} step={1} aria-label="Volume" />
    </div>
  )
}

export function ScrollAreaExample() {
  return (
    <ScrollArea className="h-48 w-64 rounded-md border p-4">
      <div className="space-y-4">
        <h4 className="text-sm font-medium leading-none">Changelog</h4>
        {Array.from({ length: 15 }).map((_, i) => (
          <p key={i} className="text-sm text-muted-foreground">
            v26.{9 - Math.floor(i / 3)}.{i % 3} release notes and updates.
          </p>
        ))}
      </div>
    </ScrollArea>
  )
}
