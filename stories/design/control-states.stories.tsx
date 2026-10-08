import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Input,
  Textarea,
  NativeSelect,
  InputGroup,
  Button,
  Heading,
  Label,
} from "../../src/index"

const meta = {
  title: "Design System/Control States",
  parameters: { layout: "fullscreen" },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <main className="mx-auto max-w-4xl p-6 ui-stack">
      <Heading variant="page">Control states</Heading>
      <div className="grid gap-6 md:grid-cols-2">
        {(["default", "invalid", "readonly", "disabled"] as const).map(
          (state) => (
            <section key={state} className="ui-stack">
              <Heading variant="card">{state}</Heading>
              <Label htmlFor={`input-${state}`}>Workspace name — {state}</Label>
              <Input
                id={`input-${state}`}
                placeholder="Workspace name"
                defaultValue={
                  state === "readonly" ? "Read-only workspace" : undefined
                }
                aria-invalid={state === "invalid" || undefined}
                readOnly={state === "readonly"}
                disabled={state === "disabled"}
              />
              <Label htmlFor={`textarea-${state}`}>Description — {state}</Label>
              <Textarea
                id={`textarea-${state}`}
                placeholder="Description"
                defaultValue={
                  state === "readonly" ? "Read-only description" : undefined
                }
                aria-invalid={state === "invalid" || undefined}
                readOnly={state === "readonly"}
                disabled={state === "disabled"}
              />
              {state !== "readonly" && (
                <>
                  <Label htmlFor={`select-${state}`}>
                    Visibility — {state}
                  </Label>
                  <NativeSelect
                    id={`select-${state}`}
                    aria-invalid={state === "invalid" || undefined}
                    disabled={state === "disabled"}
                  >
                    <option>Private</option>
                    <option>Public</option>
                  </NativeSelect>
                </>
              )}
            </section>
          )
        )}
      </div>
      <Label htmlFor="group-input">Workspace URL</Label>
      <InputGroup className="items-center gap-2 px-3">
        <span className="text-muted-foreground">https://</span>
        <input
          id="group-input"
          aria-invalid="true"
          className="min-w-0 flex-1 bg-transparent outline-none"
          defaultValue="taken.example"
        />
      </InputGroup>
      <Heading variant="section">Action variants</Heading>
      <div className="flex flex-wrap gap-3">
        {(
          [
            "default",
            "primary",
            "secondary",
            "outline",
            "accent",
            "subtle",
            "inverse",
            "ghost",
            "navigation",
            "link",
            "destructive",
          ] as const
        ).map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Button disabled>Disabled action</Button>
        <Button loading>Saving changes</Button>
      </div>
    </main>
  ),
}
