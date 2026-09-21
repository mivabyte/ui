import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mivabyte/ui"
import { KeyboardTestbed } from "./KeyboardTestbed"

export function App() {
  const isKeyboardSuite =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("suite") === "keyboard"

  if (isKeyboardSuite) {
    return <KeyboardTestbed />
  }

  return (
    <div
      data-mivabyte-theme="product"
      data-density="comfortable"
      className="min-h-screen bg-background text-foreground"
    >
      <SidebarProvider
        defaultOpen
        persistence="localStorage"
        storageKey="consumer-sidebar-e2e"
      >
        <Sidebar
          collapsible="icon"
          mobileTitle="Consumer navigation"
          mobileDescription="Primary navigation for the packed consumer testbed."
        >
          <SidebarHeader>
            <strong>Consumer navigation</strong>
            <SidebarInput aria-label="Sidebar search" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
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
          <SidebarFooter className="p-2 text-xs">Consumer footer</SidebarFooter>
          <SidebarRail label="Toggle consumer navigation" />
        </Sidebar>

        <SidebarInset className="p-8">
          <div className="mx-auto grid w-full max-w-3xl gap-6">
            <SidebarTrigger label="Toggle consumer navigation" />

            <Card>
              <CardHeader>
                <CardTitle>
                  <h1 className="text-2xl font-bold">Vite React 19 consumer</h1>
                </CardTitle>
                <CardDescription>
                  This page compiles against the packed @mivabyte/ui
                  distribution.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <p className="text-sm text-muted-foreground">
                  The fixture exercises the root barrel, component subpaths,
                  forms, overlays, tabs, sidebar, and packaged styles.
                </p>

                <div className="grid gap-2">
                  <Label htmlFor="consumer-email">Email</Label>
                  <Input id="consumer-email" type="email" />
                  <p className="text-xs text-muted-foreground">
                    Used only to verify the consumer form API.
                  </p>
                </div>

                <Tabs defaultValue="overview">
                  <TabsList aria-label="Fixture sections">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    Root and subpath imports compile.
                  </TabsContent>
                  <TabsContent value="details">
                    Tailwind package styles compile.
                  </TabsContent>
                </Tabs>

                <div className="flex flex-wrap gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Open dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Consumer dialog</DialogTitle>
                        <DialogDescription>
                          Client-side overlay primitives compile in a Vite
                          application.
                        </DialogDescription>
                      </DialogHeader>
                      <Input aria-label="Dialog email" type="email" />
                    </DialogContent>
                  </Dialog>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline">Open sheet</Button>
                    </SheetTrigger>
                    <SheetContent side="right" size="sm">
                      <SheetHeader>
                        <SheetTitle>Consumer sheet</SheetTitle>
                        <SheetDescription>
                          Sheet focus management is exercised from the packed
                          distribution.
                        </SheetDescription>
                      </SheetHeader>
                      <Input aria-label="Sheet email" type="email" />
                    </SheetContent>
                  </Sheet>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline">Tooltip target</Button>
                      </TooltipTrigger>
                      <TooltipContent>Consumer tooltip</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
