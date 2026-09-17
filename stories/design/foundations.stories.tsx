import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
  Container,
  Heading,
  Text,
  Eyebrow,
  Badge,
  Input,
  Label,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../src/index"

const meta = {
  title: "Design System/Foundations",
  parameters: { layout: "fullscreen" },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const TokensAndStates: Story = {
  render: () => (
    <Container className="ui-stack py-12">
      <header className="ui-stack">
        <Eyebrow>Mivabyte / Design foundations</Eyebrow>
        <Heading variant="display">
          Quiet depth.
          <br />
          Clear intent.
        </Heading>
        <Text variant="lead">
          One visual language for the first impression and the everyday
          workflow.
        </Text>
      </header>
      <section className="ui-stack" aria-label="Surface hierarchy">
        <Heading variant="section">A surface for every layer</Heading>
        <div className="ui-grid">
          {[
            "default",
            "surface",
            "elevated",
            "interactive",
            "accent",
            "highlighted",
            "glass",
            "outline",
          ].map((variant) => (
            <Card key={variant} variant={variant}>
              <CardHeader>
                <CardTitle className="capitalize">{variant}</CardTitle>
                <CardDescription>
                  Purposeful contrast. Readable content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {variant === "interactive" ? (
                  <Button variant="outline">Explore surface</Button>
                ) : (
                  <Text variant="meta">Canvas → content → attention</Text>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="ui-stack" aria-label="Actions">
        <Heading variant="section">Actions with a clear priority</Heading>
        <div className="flex flex-wrap gap-3">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete item</Button>
          <Button loading>Saving…</Button>
          <Button disabled>Unavailable</Button>
        </div>
      </section>
      <section className="ui-stack" aria-label="Feedback">
        <Heading variant="section">Color carries meaning</Heading>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">Operational</Badge>
          <Badge variant="warning">Needs attention</Badge>
          <Badge variant="info">Processing</Badge>
          <Badge variant="destructive">Failed</Badge>
          <Badge variant="accent">Selected</Badge>
        </div>
      </section>
      <section className="ui-grid" aria-label="Form states">
        <div className="ui-stack">
          <Label htmlFor="foundation-name">Workspace name</Label>
          <Input id="foundation-name" placeholder="Your workspace" />
          <Label htmlFor="foundation-error">Workspace URL</Label>
          <Input
            id="foundation-error"
            value="existing-workspace"
            readOnly
            aria-invalid="true"
            aria-describedby="foundation-error-help"
          />
          <Text
            variant="small"
            className="text-destructive"
            id="foundation-error-help"
          >
            This URL is already in use.
          </Text>
        </div>
        <div className="ui-stack">
          <Heading variant="card">Navigation and numbers</Heading>
          <Tabs defaultValue="overview">
            <TabsList aria-label="Preview navigation">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">Workspace summary</TabsContent>
            <TabsContent value="activity">Recent workspace updates</TabsContent>
          </Tabs>
          <Text variant="signal">128,640</Text>
          <Text variant="meta">
            Tabular figures keep changing values aligned.
          </Text>
        </div>
      </section>
    </Container>
  ),
}
