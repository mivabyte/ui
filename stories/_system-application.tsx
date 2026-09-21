import { useState } from "react"
import {
  Activity,
  ArrowUpRight,
  Bell,
  FolderKanban,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Layers,
} from "lucide-react"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Eyebrow,
  Heading,
  Input,
  Label,
  Text,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "../src/index"

const initialProjects = [
  {
    name: "Customer portal",
    team: "Product experience",
    status: "On track",
    variant: "success" as const,
    progress: "86%",
    date: "24 Sep",
  },
  {
    name: "Commerce platform",
    team: "Digital commerce",
    status: "In review",
    variant: "info" as const,
    progress: "72%",
    date: "28 Sep",
  },
  {
    name: "Analytics workspace",
    team: "Data & insights",
    status: "Needs attention",
    variant: "warning" as const,
    progress: "48%",
    date: "02 Oct",
  },
]

function CreateProject({ onCreate }: { onCreate: (name: string) => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus aria-hidden="true" />
          New project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a project</DialogTitle>
          <DialogDescription>
            Give your next project a clear name.
          </DialogDescription>
        </DialogHeader>
        <form
          className="ui-stack"
          onSubmit={(event) => {
            event.preventDefault()
            if (name.trim()) {
              onCreate(name.trim())
              setName("")
              setOpen(false)
            }
          }}
        >
          <Label htmlFor="project-name">Project name</Label>
          <Input
            id="project-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="off"
          />
          <Button type="submit">Create project</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
function DeliveryChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Heading variant="card" render={<h2 />}>
            Delivery momentum
          </Heading>
          <Badge variant="secondary">Last 6 weeks</Badge>
        </div>
        <CardDescription>
          Completed milestones increased from 12 to 38 per week.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <svg
          viewBox="0 0 500 150"
          role="img"
          aria-label="Completed milestones: 12, 18, 16, 26, 31, 38. Planned milestones: 16, 20, 24, 28, 32, 36."
          className="w-full text-border"
        >
          <path
            d="M10 30H490M10 80H490M10 130H490"
            stroke="currentColor"
            fill="none"
          />
          <path
            d="M10 120L100 102L200 108L300 66L400 46L490 18"
            className="text-chart-1"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M10 106L100 92L200 78L300 64L400 50L490 32"
            className="text-chart-3"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 5"
            fill="none"
          />
        </svg>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>— Completed</span>
          <span>┄ Planned</span>
          <span className="ms-auto">Week 1 → Week 6</span>
        </div>
      </CardContent>
    </Card>
  )
}
function ProjectTable({
  projects,
  query,
}: {
  projects: typeof initialProjects
  query: string
}) {
  const visible = projects.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  )
  return (
    <Card>
      <CardHeader>
        <Heading variant="card" render={<h2 />}>
          Active projects
        </Heading>
        <CardDescription>
          Priorities, progress and the next delivery.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {visible.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Delivery</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((p) => (
                <TableRow key={p.name}>
                  <TableCell>
                    <span className="block font-medium">{p.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {p.team}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.variant}>{p.status}</Badge>
                  </TableCell>
                  <TableCell>{p.progress}</TableCell>
                  <TableCell className="whitespace-nowrap">{p.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No projects found</EmptyTitle>
              <EmptyDescription>Try a different project name.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}
export function ApplicationComposition() {
  const [query, setQuery] = useState("")
  const [projects, setProjects] = useState(initialProjects)
  const [notice, setNotice] = useState("")
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <a
            href="#workspace"
            className="ui-focus inline-flex min-h-11 items-center gap-2 px-2 font-semibold"
          >
            <Layers aria-hidden="true" className="size-5 text-primary" />
            mivabyte<Text variant="meta">/ workspace</Text>
          </a>
        </SidebarHeader>
        <SidebarContent className="px-3">
          <nav
            aria-label="Workspace navigation"
            className="flex gap-2 overflow-auto md:flex-col"
          >
            <Button asChild variant="subtle" className="justify-start">
              <a href="#workspace" aria-current="page">
                <LayoutDashboard aria-hidden="true" />
                Overview
              </a>
            </Button>
            <Button asChild variant="ghost" className="justify-start">
              <a href="#projects">
                <FolderKanban aria-hidden="true" />
                Projects
              </a>
            </Button>
            <Button asChild variant="ghost" className="justify-start">
              <a href="#activity">
                <Activity aria-hidden="true" />
                Activity
              </a>
            </Button>
          </nav>
        </SidebarContent>
        <SidebarFooter>
          <Card variant="surface" className="mt-auto hidden md:block">
            <CardHeader>
              <Text variant="small" className="text-foreground font-medium">
                Your workspace, aligned.
              </Text>
              <CardDescription>
                One place for the work that moves you forward.
              </CardDescription>
            </CardHeader>
          </Card>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-surface px-5 py-3">
          <SidebarTrigger aria-label="Toggle navigation" />
          <Text variant="small">
            Workspace{" "}
            <span className="px-2" aria-hidden="true">
              /
            </span>
            <span className="text-foreground">Overview</span>
          </Text>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell aria-hidden="true" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Notifications</DialogTitle>
                <DialogDescription>
                  You’re all caught up. New project updates will appear here.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </header>
        <div id="workspace" className="ui-stack p-5 lg:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="ui-stack gap-2">
              <Eyebrow>Workspace overview</Eyebrow>
              <Heading variant="page">Good work starts with clarity.</Heading>
              <Text className="text-muted-foreground">
                Here’s where things stand across your projects.
              </Text>
            </div>
            <CreateProject
              onCreate={(name) => {
                setProjects([
                  ...projects,
                  {
                    name,
                    team: "Your workspace",
                    status: "On track",
                    variant: "success",
                    progress: "0%",
                    date: "Not set",
                  },
                ])
                setNotice(`${name} created`)
              }}
            />
          </div>
          <p role="status" className="sr-only">
            {notice}
          </p>
          <div className="ui-grid">
            {[
              {
                label: "Active projects",
                value: String(projects.length).padStart(2, "0"),
                note: "Across your workspace",
              },
              {
                label: "Milestones completed",
                value: "38",
                note: "12 more than last week",
              },
              {
                label: "On-time delivery",
                value: "96.8%",
                note: "Above the 95% target",
              },
            ].map((metric, i) => (
              <Card
                key={metric.label}
                variant={i === 2 ? "highlighted" : "default"}
              >
                <CardHeader className="gap-3">
                  <CardDescription>{metric.label}</CardDescription>
                  <Text variant="signal">{metric.value}</Text>
                  <Text variant="meta" className={i > 0 ? "text-success" : ""}>
                    {i > 0 && (
                      <ArrowUpRight
                        aria-hidden="true"
                        className="me-1 inline size-4"
                      />
                    )}
                    {metric.note}
                  </Text>
                </CardHeader>
              </Card>
            ))}
          </div>
          <Tabs defaultValue="projects" id="projects">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <TabsList variant="ghost" aria-label="Workspace views">
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="archive">Archived</TabsTrigger>
              </TabsList>
              <div className="w-full sm:w-64">
                <Label htmlFor="project-search" className="sr-only">
                  Search projects
                </Label>
                <Input
                  id="project-search"
                  type="search"
                  placeholder="Search projects…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            <TabsContent value="projects">
              <ProjectTable projects={projects} query={query} />
            </TabsContent>
            <TabsContent value="archive">
              <Card>
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FolderKanban aria-hidden="true" />
                    </EmptyMedia>
                    <EmptyTitle>No archived projects</EmptyTitle>
                    <EmptyDescription>
                      Completed projects can be archived to keep this workspace
                      focused.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setNotice("No projects are ready to archive yet.")
                      }
                    >
                      Check completed projects
                    </Button>
                  </EmptyContent>
                </Empty>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <DeliveryChart />
            <Card id="activity">
              <CardHeader>
                <Heading variant="card" render={<h2 />}>
                  Latest activity
                </Heading>
                <CardDescription>
                  Small steps. Visible progress.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                {[
                  "Design review completed",
                  "Portal release approved",
                  "Analytics checkpoint added",
                ].map((text, i) => (
                  <div key={text} className="flex gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Settings className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <Text variant="small" className="text-foreground">
                        {text}
                      </Text>
                      <Text variant="meta">
                        {i + 1} hour{i > 0 ? "s" : ""} ago
                      </Text>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
