import {
  ArrowUpRight,
  Check,
  Layers,
  ShieldCheck,
  Workflow,
} from "lucide-react"
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Container,
  Eyebrow,
  Heading,
  Text,
} from "../src/index"

function ProductEvidence() {
  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-4">
          <Text variant="small" className="font-medium text-foreground">
            Release overview
          </Text>
          <Badge variant="success">All systems ready</Badge>
        </div>
      </CardHeader>
      <CardContent className="ui-stack pt-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Text variant="meta">Project readiness</Text>
            <Text variant="signal">
              98.6<span className="text-xl text-muted-foreground">%</span>
            </Text>
          </div>
          <Badge variant="accent">Ready to launch</Badge>
        </div>
        <div
          className="flex h-24 items-end gap-2"
          role="img"
          aria-label="Release readiness improved across six checkpoints, from 40 to 98.6 percent"
        >
          {["h-2/5", "h-1/2", "h-3/5", "h-3/4", "h-5/6", "h-full"].map(
            (height, index) => (
              <div
                key={height}
                className={`flex-1 rounded-t ${height} ${index === 5 ? "bg-primary" : "bg-accent-muted"}`}
              />
            )
          )}
        </div>
        <div className="grid gap-4 border-t pt-5">
          {[
            "Design system connected",
            "Accessibility reviewed",
            "Deployment checks complete",
          ].map((label) => (
            <div className="flex items-center gap-3 text-sm" key={label}>
              <Check aria-hidden="true" className="size-4 text-success" />
              {label}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function MarketingComposition() {
  return (
    <div>
      <Container asChild>
        <header className="flex flex-wrap items-center justify-between gap-4 py-5">
          <a
            href="#home"
            className="ui-focus inline-flex min-h-11 items-center gap-2 font-semibold tracking-tight"
          >
            <Layers className="size-5 text-primary" aria-hidden="true" />
            mivabyte
          </a>
          <nav aria-label="Main navigation" className="flex gap-2">
            <Button asChild variant="ghost">
              <a href="#capabilities">Capabilities</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#contact">
                Let’s talk <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
          </nav>
        </header>
      </Container>
      <main id="home">
        <section className="ui-section" data-tone="gradient">
          <Container className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div className="ui-stack">
              <Eyebrow>Design intelligence. Engineering discipline.</Eyebrow>
              <Heading variant="display">
                Built to work.
                <br />
                <span className="text-primary">Made to matter.</span>
              </Heading>
              <Text variant="lead" className="max-w-xl">
                From the first idea to the tools your team uses every day.
                Digital products with clarity at every layer.
              </Text>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg">
                  <a href="#contact">
                    Start a project <ArrowUpRight aria-hidden="true" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#capabilities">Explore our approach</a>
                </Button>
              </div>
              <Text variant="meta">
                Strategy, design and engineering. One connected team.
              </Text>
            </div>
            <ProductEvidence />
          </Container>
        </section>
        <section className="ui-section" id="capabilities">
          <Container className="ui-stack">
            <div className="grid gap-6 md:grid-cols-2 md:items-end">
              <div className="ui-stack">
                <Eyebrow>From ambition to operation</Eyebrow>
                <Heading variant="statement" render={<h2 />}>
                  The whole system.
                  <br />
                  Thought through.
                </Heading>
              </div>
              <Text variant="lead">
                A compelling first impression and a dependable everyday
                experience, built from the same foundation.
              </Text>
            </div>
            <div className="ui-grid pt-6">
              {[
                {
                  icon: Layers,
                  title: "Digital experiences",
                  copy: "Websites and products that turn complexity into a clear next step.",
                },
                {
                  icon: Workflow,
                  title: "Connected workflows",
                  copy: "Purposeful applications that put your people and their work first.",
                },
                {
                  icon: ShieldCheck,
                  title: "Dependable platforms",
                  copy: "Carefully engineered systems that grow with your organization.",
                },
              ].map(({ icon: Icon, title, copy }, i) => (
                <Card variant={i === 0 ? "highlighted" : "default"} key={title}>
                  <CardHeader className="gap-4">
                    <Icon
                      aria-hidden="true"
                      className="size-6 text-accent-foreground"
                    />
                    <Heading variant="card" render={<h3 />}>
                      {title}
                    </Heading>
                    <CardDescription>{copy}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </Container>
        </section>
        <section className="ui-section" data-tone="muted" id="contact">
          <Container className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="ui-stack">
              <Eyebrow>Make the next move</Eyebrow>
              <Heading variant="section">
                A better system starts with a conversation.
              </Heading>
              <Text className="text-muted-foreground">
                Tell us what you want to change. We’ll work out the path
                together.
              </Text>
            </div>
            <Button asChild size="lg">
              <a href="mailto:hello@example.com">
                Describe your project <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
          </Container>
        </section>
      </main>
      <Container asChild>
        <footer className="flex flex-wrap justify-between gap-4 py-8">
          <Text variant="meta">Mivabyte / Design system composition</Text>
          <Text variant="meta">
            Illustrative content · Built with shared primitives
          </Text>
        </footer>
      </Container>
    </div>
  )
}
