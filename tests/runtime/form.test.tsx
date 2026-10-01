import * as React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { useForm } from "react-hook-form"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form"

type Values = {
  email: string
}

const onSubmit = vi.fn()

// `FormItem` owns one base id and every sibling id is that base plus a suffix,
// so the whole contract is "`<base>-form-item`" plus "-description" /
// "-message".
//
// The expected base must NOT be recovered by stripping a suffix off the id
// under test: `expect(controlId).toBe(`${stripped}-form-item`)` holds for any
// string, so a wrong base sails through. These patterns are anchored and are
// asserted on their own, and the shared base is then compared across ids.
const FORM_ITEM_ID = /^.+-form-item$/
const FORM_DESCRIPTION_ID = /^.+-form-item-description$/
const FORM_MESSAGE_ID = /^.+-form-item-message$/

const FORM_ITEM_SUFFIX = /-form-item(?:-description|-message)?$/

const baseOf = (id: string) => id.replace(FORM_ITEM_SUFFIX, "")

/** All ids must descend from one non-empty `React.useId` value. */
const expectOneSharedBase = (ids: string[]) => {
  const bases = ids.map(baseOf)
  expect(bases[0]).not.toBe("")
  expect(new Set(bases).size).toBe(1)
  return bases[0]
}

function Harness({
  withDescription,
  withError,
}: {
  withDescription?: boolean
  withError?: boolean
}) {
  const form = useForm<Values>({
    defaultValues: { email: "" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              {withDescription ? (
                <FormDescription>Helpful detail</FormDescription>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />
        {withError ? (
          <Button
            type="button"
            onClick={() => form.setError("email", { message: "Invalid email" })}
          >
            Mark invalid
          </Button>
        ) : null}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

// `FormMessage` falls back to `children` when the field has no error, so this
// needs a real field context to reach that branch.
function StaticMessageHarness() {
  const form = useForm<Values>({ defaultValues: { email: "" } })

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="email"
          render={() => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" />
              </FormControl>
              <FormMessage>Always visible</FormMessage>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

// `useFormField` is a public export; exercise it directly to cover the hook's
// return shape. Note the upstream `if (!fieldContext) throw` guard is dead code
// — the default context value is `{}`, which is always truthy — so it is
// deliberately not asserted here.
function FieldShapeProbe() {
  const field = useFormField()
  return (
    <dl>
      <dt>name</dt>
      <dd>{field.name}</dd>
      <dt>formItemId</dt>
      <dd>{field.formItemId}</dd>
      <dt>formDescriptionId</dt>
      <dd>{field.formDescriptionId}</dd>
      <dt>formMessageId</dt>
      <dd>{field.formMessageId}</dd>
      <dt>invalid</dt>
      <dd>{String(field.invalid)}</dd>
    </dl>
  )
}

// Two fields in one form prove the ids come from `React.useId` and cannot
// collide, which a single-field harness cannot show.
function TwoFieldHarness() {
  const form = useForm<{ first: string; second: string }>({
    defaultValues: { first: "", second: "" },
  })

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="first"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="second"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Second</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

// An error object without `message` is what `required` validation produces.
function MessageLessErrorHarness() {
  const form = useForm<Values>({ defaultValues: { email: "" } })

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          onClick={() => form.setError("email", { type: "required" })}
        >
          Mark invalid
        </Button>
      </form>
    </Form>
  )
}

// Consuming `useFormField` outside a `FormField` has no field name, so the hook
// must reject it rather than silently producing undefined ids.
function OrphanFieldConsumer() {
  useFormField()
  return null
}

function OrphanHarness() {
  const form = useForm<Values>({ defaultValues: { email: "" } })
  return (
    <Form {...form}>
      <form>
        <OrphanFieldConsumer />
      </form>
    </Form>
  )
}

function FieldShapeHarness() {
  const form = useForm<Values>({ defaultValues: { email: "" } })
  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="email"
          render={() => (
            <FormItem>
              <FieldShapeProbe />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

// `FormControl` forwards a ref to its child through Slot. Record every element
// the ref receives so the test can prove it landed on the real input rather
// than being swallowed by the wrapper.
function RefProbeHarness({
  probeRef,
}: {
  probeRef: (element: HTMLInputElement | null) => void
}) {
  const form = useForm<Values>({ defaultValues: { email: "" } })

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="email"
          render={() => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input ref={probeRef} type="email" />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

describe("Form", () => {
  beforeEach(() => {
    onSubmit.mockClear()
  })

  it("links label, control, description and generated ids", () => {
    render(<Harness withDescription />)

    const label = screen.getByText("Email")
    const control = screen.getByLabelText("Email")
    const description = screen.getByText("Helpful detail")

    const controlId = control.id
    const descriptionId = description.id

    // Absolute shape contract, independent of what the base happens to be.
    expect(controlId).toMatch(FORM_ITEM_ID)
    expect(descriptionId).toMatch(FORM_DESCRIPTION_ID)

    const base = expectOneSharedBase([controlId, descriptionId])

    expect(label).toHaveAttribute("for", controlId)
    expect(control).toHaveAttribute(
      "aria-describedby",
      `${base}-form-item-description`
    )
    expect(control).toHaveAttribute("aria-invalid", "false")
    // `data-slot` marks the elements these ids belong to, so an id that matched
    // the pattern but landed on some unrelated node would still be caught.
    expect(control).toHaveAttribute("data-slot", "form-control")
    expect(description).toHaveAttribute("data-slot", "form-description")
  })

  it("keeps the description id wired when no description is rendered", () => {
    render(<Harness />)
    const control = screen.getByLabelText("Email")

    expect(control.id).toMatch(FORM_ITEM_ID)
    const base = baseOf(control.id)
    expect(base).not.toBe("")
    expect(control.getAttribute("aria-describedby")).toBe(
      `${base}-form-item-description`
    )
    // The id is still reserved even though nothing renders it: it is the hook
    // a later description would claim, and reusing it for something else would
    // break the contract above.
    expect(document.querySelector(`[id="${base}-form-item-description"]`)).toBe(
      null
    )
  })

  it("surfaces a validation message and marks the control invalid", async () => {
    render(<Harness withDescription withError />)
    const control = screen.getByLabelText("Email")

    fireEvent.click(screen.getByRole("button", { name: "Mark invalid" }))

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeInTheDocument()
    })

    const message = screen.getByText("Invalid email")
    const description = screen.getByText("Helpful detail")

    expect(control.id).toMatch(FORM_ITEM_ID)
    expect(message.id).toMatch(FORM_MESSAGE_ID)
    const base = expectOneSharedBase([control.id, description.id, message.id])

    expect(message).toHaveAttribute("data-slot", "form-message")
    expect(control.getAttribute("aria-describedby")).toBe(
      `${base}-form-item-description ${base}-form-item-message`
    )
    expect(control.getAttribute("aria-invalid")).toBe("true")
    expect(screen.getByText("Email")).toHaveAttribute("data-error", "true")
  })

  it("renders a static FormMessage but does not announce it", () => {
    // The real guarantee: `FormMessage` falls back to `children` when the field
    // has no error, so the text renders and carries the generated message id.
    //
    // The known limitation, pinned on purpose: `FormControl` only appends the
    // message id to `aria-describedby` when the field HAS an error, so a static
    // message is never announced. `src/components/ui/form.tsx` is a faithful
    // upstream port and is deliberately not changed here; these assertions
    // record the behaviour so that fixing it upstream has to be a deliberate,
    // visible change rather than a silent one.
    render(<StaticMessageHarness />)

    const control = screen.getByLabelText("Email")
    const message = screen.getByText("Always visible")

    expect(message.tagName).toBe("P")
    expect(message).toHaveAttribute("data-slot", "form-message")
    expect(message.id).toMatch(FORM_MESSAGE_ID)

    const base = expectOneSharedBase([control.id, message.id])

    // The wiring that DOES exist: label association plus the description hook.
    expect(screen.getByText("Email")).toHaveAttribute("for", control.id)
    expect(control).toHaveAttribute(
      "aria-describedby",
      `${base}-form-item-description`
    )
    // ...and the gap, spelled out rather than glossed over.
    expect(control.getAttribute("aria-describedby")).not.toContain(message.id)
  })

  it("forwards the control ref through FormControl to the input", () => {
    const seen: (HTMLInputElement | null)[] = []
    render(<RefProbeHarness probeRef={(element) => seen.push(element)} />)

    const control = screen.getByLabelText("Email")
    expect(control).toBeInstanceOf(HTMLInputElement)
    // Slot composes refs, so the caller's ref must receive the real element.
    expect(seen).toContain(control)
    expect(control.id).toMatch(FORM_ITEM_ID)
  })

  it("throws when useFormField is used outside a FormField", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    try {
      expect(() => render(<OrphanHarness />)).toThrow(
        /useFormField should be used within <FormField>/
      )
    } finally {
      // Exception-safe: otherwise a failed assertion leaves console.error
      // silenced for every later test in this file.
      spy.mockRestore()
    }
  })

  it("gives each field a distinct id", () => {
    render(<TwoFieldHarness />)

    const [first, second] = screen.getAllByRole("textbox")
    expect(first.id).toMatch(FORM_ITEM_ID)
    expect(second.id).toMatch(FORM_ITEM_ID)
    // React.useId guarantees uniqueness. A constant id would silently break
    // label association and aria-describedby on any page with two fields.
    expect(first.id).not.toBe(second.id)
    expect(baseOf(first.id)).not.toBe(baseOf(second.id))
  })

  it("mints a fresh id for every mounted form item", () => {
    // Anchored patterns plus a shared-base check cannot tell a real
    // `React.useId` value from a hardcoded literal like "field-form-item",
    // because a literal satisfies every one of them. Two independent mounts of
    // the same harness can: a constant id repeats across renders and would
    // silently cross-wire label, control and description on any page that
    // renders a form more than once.
    const first = render(<Harness withDescription />)
    const firstControl = screen.getByLabelText("Email")
    const firstIds = [firstControl.id, screen.getByText("Helpful detail").id]
    first.unmount()

    const second = render(<Harness withDescription />)
    const secondControl = screen.getByLabelText("Email")
    const secondIds = [secondControl.id, screen.getByText("Helpful detail").id]

    for (const [controlId, descriptionId] of [firstIds, secondIds]) {
      expect(controlId).toMatch(FORM_ITEM_ID)
      expect(descriptionId).toMatch(FORM_DESCRIPTION_ID)
    }
    expect(new Set([...firstIds, ...secondIds]).size).toBe(4)
    expect(baseOf(firstControl.id)).not.toBe(baseOf(secondControl.id))
  })

  it("exposes field ids and state through useFormField", () => {
    render(<FieldShapeHarness />)

    // Anchor the patterns: an unanchored substring check cannot tell
    // `formItemId` from `formDescriptionId`.
    const field = (label: string) =>
      screen.getByText(label).nextElementSibling as HTMLElement
    const text = (label: string) => field(label).textContent ?? ""

    expect(field("name")).toHaveTextContent(/^email$/)
    expect(field("formItemId")).toHaveTextContent(FORM_ITEM_ID)
    expect(field("formDescriptionId")).toHaveTextContent(FORM_DESCRIPTION_ID)
    expect(field("formMessageId")).toHaveTextContent(FORM_MESSAGE_ID)
    expect(field("invalid")).toHaveTextContent(/^false$/)

    // All three ids must share one base, which is the point of the probe.
    expectOneSharedBase([
      text("formItemId"),
      text("formDescriptionId"),
      text("formMessageId"),
    ])
  })

  it("renders no message when the error carries no message text", async () => {
    // `setError("email", { type: "required" })` yields an error with no
    // `message`, so `String(error?.message ?? "")` resolves to the empty
    // string and `FormMessage` returns null instead of an empty <p>.
    render(<MessageLessErrorHarness />)

    fireEvent.click(screen.getByRole("button", { name: "Mark invalid" }))

    await waitFor(() => {
      expect(screen.getByLabelText("Email")).toHaveAttribute(
        "aria-invalid",
        "true"
      )
    })

    expect(document.querySelector("[data-slot='form-message']")).toBeNull()

    // The control is still wired to the message slot it will occupy: the error
    // branch of `FormControl` runs on `error`, not on message text.
    const control = screen.getByLabelText("Email")
    const base = baseOf(control.id)
    expect(control.id).toMatch(FORM_ITEM_ID)
    expect(base).not.toBe("")
    expect(control.getAttribute("aria-describedby")).toBe(
      `${base}-form-item-description ${base}-form-item-message`
    )
    expect(
      document.querySelector(`[id="${base}-form-item-message"]`)
    ).toBeNull()
  })

  it("submits field values through the form context", async () => {
    render(<Harness />)

    const control = screen.getByLabelText("Email")
    fireEvent.change(control, { target: { value: "ada@example.com" } })
    fireEvent.click(screen.getByRole("button", { name: "Submit" }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
    expect(onSubmit.mock.calls[0][0]).toEqual({ email: "ada@example.com" })
  })
})
