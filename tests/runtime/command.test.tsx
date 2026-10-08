import * as React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axe from "axe-core"
import { describe, expect, it, vi } from "vitest"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../../src/components/ui/command.js"

describe("Command palette primitive", () => {
  it("renders labelled search input, groups, items, and shortcuts", async () => {
    const onSelectCalendar = vi.fn()
    const { container } = render(
      <Command>
        <CommandInput
          placeholder="Search actions..."
          aria-label="Search actions"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={onSelectCalendar}>
              Calendar
              <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
            <CommandItem>Profile</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Help">
            <CommandItem disabled>Feedback</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )

    const input = screen.getByRole("combobox")
    expect(input).toBeInTheDocument()
    expect(screen.getByText("Calendar")).toBeInTheDocument()
    expect(screen.getByText("Profile")).toBeInTheDocument()
    expect(screen.getByText("⌘C")).toBeInTheDocument()
    expect(screen.getByText("Actions")).toBeInTheDocument()

    // Visual separators are hidden from the listbox accessibility tree.
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it("filters items by query and shows empty state when nothing matches", async () => {
    const user = userEvent.setup()
    render(
      <Command>
        <CommandInput placeholder="Search..." aria-label="Search" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Items">
            <CommandItem>Apple</CommandItem>
            <CommandItem>Banana</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )

    const input = screen.getByRole("combobox")
    expect(screen.getByText("Apple")).toBeInTheDocument()
    expect(screen.getByText("Banana")).toBeInTheDocument()

    await user.type(input, "xyz")

    await waitFor(() => {
      expect(screen.queryByText("Apple")).toBeNull()
      expect(screen.queryByText("Banana")).toBeNull()
      expect(screen.getByText("No results found.")).toBeInTheDocument()
    })
  })

  it("supports keyboard navigation with ArrowDown and Enter selection", async () => {
    const user = userEvent.setup()
    const onSelectBanana = vi.fn()

    render(
      <Command>
        <CommandInput placeholder="Search..." aria-label="Search" />
        <CommandList>
          <CommandGroup heading="Items">
            <CommandItem>Apple</CommandItem>
            <CommandItem onSelect={onSelectBanana}>Banana</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )

    const input = screen.getByRole("combobox")
    await user.click(input)
    await user.keyboard("{ArrowDown}")
    await user.keyboard("{Enter}")

    expect(onSelectBanana).toHaveBeenCalled()
  })

  it("supports CommandDialog modal overlay", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <CommandDialog open>
        <CommandInput
          placeholder="Search in dialog..."
          aria-label="Search in dialog"
        />
        <CommandList>
          <CommandEmpty>No matches</CommandEmpty>
          <CommandGroup heading="Dialog Items">
            <CommandItem>Option 1</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    )

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Option 1")).toBeInTheDocument()

    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })
})
