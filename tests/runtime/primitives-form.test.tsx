import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Button, buttonVariants } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { InputGroup } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { KbdGroup } from "@/components/ui/kbd-group"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Toggle, toggleVariants } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

describe("Primitives: Form & Controls", () => {
  describe("Button & ButtonGroup", () => {
    it("renders all variants and sizes of Button", () => {
      const variants = [
        "default",
        "primary",
        "destructive",
        "outline",
        "secondary",
        "accent",
        "subtle",
        "inverse",
        "ghost",
        "navigation",
        "link",
      ] as const

      const sizes = [
        "default",
        "compact",
        "sm",
        "lg",
        "xs",
        "icon",
        "icon-xs",
        "icon-lg",
      ] as const

      variants.forEach((variant) => {
        sizes.forEach((size) => {
          const { unmount } = render(
            <Button variant={variant} size={size} wrap>
              {variant}-{size}
            </Button>
          )
          expect(
            screen.getByRole("button", { name: `${variant}-${size}` })
          ).toBeInTheDocument()
          unmount()
        })
      })

      expect(
        buttonVariants({ variant: "destructive", size: "sm", wrap: false })
      ).toContain("bg-destructive")
    })

    it("handles disabled, loading, and click capturing properly", () => {
      const handleClick = vi.fn()
      const handleCapture = vi.fn()

      const { rerender } = render(
        <Button onClick={handleClick} onClickCapture={handleCapture}>
          Click Me
        </Button>
      )
      const btn = screen.getByRole("button", { name: "Click Me" })
      fireEvent.click(btn)
      expect(handleClick).toHaveBeenCalledTimes(1)
      expect(handleCapture).toHaveBeenCalledTimes(1)

      // Disabled state
      rerender(
        <Button disabled onClick={handleClick} onClickCapture={handleCapture}>
          Click Me
        </Button>
      )
      fireEvent.click(btn)
      expect(handleClick).toHaveBeenCalledTimes(1) // not called again

      // Loading state
      rerender(
        <Button loading onClick={handleClick}>
          Click Me
        </Button>
      )
      expect(btn).toHaveAttribute("aria-busy", "true")
      fireEvent.click(btn)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it("renders ButtonGroup with and without className", () => {
      const { rerender } = render(
        <ButtonGroup className="custom-group" data-testid="bg">
          <Button>First</Button>
          <Button>Second</Button>
        </ButtonGroup>
      )
      expect(screen.getByTestId("bg")).toHaveClass("custom-group")
      expect(screen.getAllByRole("button")).toHaveLength(2)

      rerender(
        <ButtonGroup data-testid="bg">
          <Button>First</Button>
        </ButtonGroup>
      )
      expect(screen.getByTestId("bg")).toBeInTheDocument()
    })
  })

  describe("Input & InputGroup", () => {
    it("renders Input with types, custom classes, and disabled state", () => {
      const { rerender } = render(
        <Input placeholder="Enter text" type="text" className="test-input" />
      )
      const input = screen.getByPlaceholderText("Enter text")
      expect(input).toHaveClass("test-input")
      expect(input).toHaveAttribute("type", "text")

      fireEvent.change(input, { target: { value: "Hello" } })
      expect(input).toHaveValue("Hello")

      rerender(<Input placeholder="Enter text" disabled />)
      expect(input).toBeDisabled()
    })

    it("renders InputGroup", () => {
      render(
        <InputGroup className="test-group">
          <Input placeholder="Search..." />
        </InputGroup>
      )
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument()
    })
  })

  describe("Checkbox", () => {
    it("handles checked, unchecked, indeterminate and disabled states", () => {
      const onCheckedChange = vi.fn()
      const { rerender } = render(
        <Checkbox
          checked={false}
          onCheckedChange={onCheckedChange}
          aria-label="Agree"
          className="custom-cb"
        />
      )
      const cb = screen.getByRole("checkbox", { name: "Agree" })
      expect(cb).toHaveAttribute("aria-checked", "false")
      expect(cb).toHaveClass("custom-cb")

      fireEvent.click(cb)
      expect(onCheckedChange).toHaveBeenCalled()

      rerender(
        <Checkbox
          checked={true}
          onCheckedChange={onCheckedChange}
          aria-label="Agree"
        />
      )
      expect(cb).toHaveAttribute("aria-checked", "true")

      rerender(
        <Checkbox
          checked="indeterminate"
          onCheckedChange={onCheckedChange}
          aria-label="Agree"
        />
      )
      expect(cb).toHaveAttribute("data-state", "indeterminate")

      rerender(
        <Checkbox
          disabled
          checked={false}
          onCheckedChange={onCheckedChange}
          aria-label="Agree"
        />
      )
      expect(cb).toBeDisabled()
    })
  })

  describe("Switch", () => {
    it("renders switch and responds to changes", () => {
      const onCheckedChange = vi.fn()
      const { rerender } = render(
        <Switch
          checked={false}
          onCheckedChange={onCheckedChange}
          aria-label="Dark mode"
        />
      )
      const sw = screen.getByRole("switch", { name: "Dark mode" })
      expect(sw).toHaveAttribute("aria-checked", "false")

      fireEvent.click(sw)
      expect(onCheckedChange).toHaveBeenCalledWith(true)

      rerender(
        <Switch
          checked={true}
          onCheckedChange={onCheckedChange}
          aria-label="Dark mode"
        />
      )
      expect(sw).toHaveAttribute("aria-checked", "true")

      rerender(
        <Switch
          disabled
          checked={false}
          onCheckedChange={onCheckedChange}
          aria-label="Dark mode"
        />
      )
      expect(sw).toBeDisabled()
    })
  })

  describe("RadioGroup & RadioGroupItem", () => {
    it("renders radio group and items", () => {
      const onValueChange = vi.fn()
      render(
        <RadioGroup
          defaultValue="opt1"
          onValueChange={onValueChange}
          className="radio-grid"
        >
          <RadioGroupItem value="opt1" aria-label="Option 1" />
          <RadioGroupItem value="opt2" aria-label="Option 2" disabled />
        </RadioGroup>
      )

      const opt1 = screen.getByRole("radio", { name: "Option 1" })
      const opt2 = screen.getByRole("radio", { name: "Option 2" })

      expect(opt1).toHaveAttribute("aria-checked", "true")
      expect(opt2).toBeDisabled()

      fireEvent.click(opt2)
      expect(onValueChange).not.toHaveBeenCalled()
    })
  })

  describe("Label", () => {
    it("renders label associated with an element", () => {
      render(
        <div>
          <Label htmlFor="test-id" className="label-cls">
            Username
          </Label>
          <Input id="test-id" />
        </div>
      )
      const label = screen.getByText("Username")
      expect(label).toHaveAttribute("for", "test-id")
      expect(label).toHaveClass("label-cls")
    })
  })

  describe("Slider", () => {
    it("renders slider and handles properties", () => {
      const onValueChange = vi.fn()
      render(
        <Slider
          defaultValue={[25]}
          max={100}
          step={5}
          onValueChange={onValueChange}
          aria-label="Volume"
          className="slider-cls"
        />
      )
      const slider = screen.getByRole("slider")
      expect(slider).toHaveAttribute("aria-valuenow", "25")
      expect(slider).toHaveAttribute("aria-valuemax", "100")
    })
  })

  describe("Textarea", () => {
    it("renders textarea with value and handles input", () => {
      render(<Textarea placeholder="Type bio" rows={4} className="ta-cls" />)
      const ta = screen.getByPlaceholderText("Type bio")
      expect(ta).toHaveAttribute("rows", "4")
      expect(ta).toHaveClass("ta-cls")

      fireEvent.change(ta, { target: { value: "My bio" } })
      expect(ta).toHaveValue("My bio")
    })
  })

  describe("NativeSelect", () => {
    it("renders select element with options and handles changes", () => {
      const handleChange = vi.fn()
      render(
        <NativeSelect
          defaultValue="b"
          onChange={handleChange}
          className="select-cls"
        >
          <option value="a">Alpha</option>
          <option value="b">Beta</option>
          <option value="c">Gamma</option>
        </NativeSelect>
      )
      const select = screen.getByRole("combobox")
      expect(select).toHaveValue("b")
      expect(select).toHaveClass("select-cls")

      fireEvent.change(select, { target: { value: "c" } })
      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe("Toggle & ToggleGroup", () => {
    it("renders toggle variants and sizes", () => {
      const onToggle = vi.fn()
      const { rerender } = render(
        <Toggle
          pressed={false}
          onPressedChange={onToggle}
          variant="outline"
          size="sm"
          aria-label="Mute"
        >
          Mute
        </Toggle>
      )
      const btn = screen.getByRole("button", { name: "Mute" })
      expect(btn).toHaveAttribute("aria-pressed", "false")

      fireEvent.click(btn)
      expect(onToggle).toHaveBeenCalledWith(true)

      rerender(
        <Toggle pressed={true} variant="default" size="lg" aria-label="Mute">
          Mute
        </Toggle>
      )
      expect(btn).toHaveAttribute("aria-pressed", "true")
      expect(toggleVariants({ variant: "outline", size: "sm" })).toContain(
        "border"
      )
    })

    it("renders ToggleGroup single and multiple selection", () => {
      const onValueChange = vi.fn()
      render(
        <ToggleGroup
          type="single"
          defaultValue="a"
          onValueChange={onValueChange}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>
      )
      const btnA =
        screen.getByRole("radio", { name: "A" }) ||
        screen.getByRole("button", { name: "A" })
      expect(btnA).toHaveAttribute("data-state", "on")

      // Test item fallback variant and size when context does not define them
      render(
        <ToggleGroup type="multiple">
          <ToggleGroupItem value="c" variant="default" size="lg">
            C
          </ToggleGroupItem>
        </ToggleGroup>
      )
      expect(screen.getByText("C")).toBeInTheDocument()
    })
  })

  describe("Kbd & KbdGroup", () => {
    it("renders Kbd and KbdGroup", () => {
      render(
        <KbdGroup className="kbd-wrap">
          <Kbd>Cmd</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      )
      expect(screen.getByText("Cmd")).toBeInTheDocument()
      expect(screen.getByText("K")).toBeInTheDocument()

      // Test single child and without className
      render(
        <KbdGroup>
          <Kbd>Shift</Kbd>
        </KbdGroup>
      )
      expect(screen.getByText("Shift")).toBeInTheDocument()

      // Test separator=false
      render(
        <KbdGroup separator={false}>
          <Kbd>Ctrl</Kbd>
          <Kbd>Alt</Kbd>
        </KbdGroup>
      )
      expect(screen.getByText("Ctrl")).toBeInTheDocument()
      expect(screen.getByText("Alt")).toBeInTheDocument()
    })
  })
})
