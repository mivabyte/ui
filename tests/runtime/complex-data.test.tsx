import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Combobox } from "@/components/ui/combobox"
import { DataTable } from "@/components/ui/data-table"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { OTPInputContext } from "input-otp"
import { Questionnaire } from "@/components/ui/questionnaire"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

describe("Complex Data & Forms", () => {
  describe("Alert", () => {
    it("renders all alert variants and elements", () => {
      const variants = ["default", "destructive", "success"] as const
      variants.forEach((variant) => {
        const { unmount } = render(
          <Alert variant={variant} data-testid={`alert-${variant}`}>
            <AlertTitle>Alert Title {variant}</AlertTitle>
            <AlertDescription>Description for {variant}</AlertDescription>
          </Alert>
        )
        expect(screen.getByText(`Alert Title ${variant}`)).toBeInTheDocument()
        expect(
          screen.getByText(`Description for ${variant}`)
        ).toBeInTheDocument()
        unmount()
      })
    })
  })

  describe("Field & Subcomponents", () => {
    it("renders all field combinations, orientations, and error states", () => {
      render(
        <FieldSet className="custom-fs">
          <FieldLegend variant="legend">User Profile</FieldLegend>
          <FieldLegend variant="label">Compact Legend</FieldLegend>
          <FieldGroup>
            <Field orientation="vertical">
              <FieldLabel>Full Name</FieldLabel>
              <FieldTitle>Title Note</FieldTitle>
              <FieldContent>
                <input placeholder="John Doe" />
              </FieldContent>
              <FieldDescription>Your legal name.</FieldDescription>
            </Field>

            <FieldSeparator>Or</FieldSeparator>
            <FieldSeparator />

            <Field orientation="horizontal">
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <input placeholder="john@example.com" />
              </FieldContent>
            </Field>

            <Field orientation="responsive">
              <FieldError>Custom child error</FieldError>
              <FieldError errors={[{ message: "Single error message" }]} />
              <FieldError
                errors={[
                  { message: "First error" },
                  { message: "Second error" },
                ]}
              />
              <FieldError errors={[]} />
              <FieldError />
            </Field>
          </FieldGroup>
        </FieldSet>
      )

      expect(screen.getByText("User Profile")).toBeInTheDocument()
      expect(screen.getByText("Full Name")).toBeInTheDocument()
      expect(screen.getByText("Title Note")).toBeInTheDocument()
      expect(screen.getByText("Or")).toBeInTheDocument()
      expect(screen.getByText("Custom child error")).toBeInTheDocument()
      expect(screen.getByText("Single error message")).toBeInTheDocument()
      expect(screen.getByText("First error")).toBeInTheDocument()
      expect(screen.getByText("Second error")).toBeInTheDocument()
    })
  })

  describe("Select", () => {
    it("renders select structure and items", () => {
      render(
        <Select defaultValue="apple">
          <SelectTrigger className="select-trig">
            <SelectValue placeholder="Pick fruit" />
          </SelectTrigger>
          <SelectContent className="select-cnt">
            <SelectScrollUpButton />
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectScrollDownButton />
          </SelectContent>
        </Select>
      )

      expect(screen.getByRole("combobox")).toBeInTheDocument()
    })
  })

  describe("Combobox", () => {
    it("renders combobox and handles options", () => {
      const onValueChange = vi.fn()
      const options = [
        { value: "next", label: "Next.js" },
        { value: "react", label: "React" },
      ]

      render(
        <Combobox
          options={options}
          value="react"
          onValueChange={onValueChange}
          placeholder="Select framework"
        />
      )

      const trigger = screen.getByRole("combobox")
      expect(trigger).toHaveTextContent("React")

      fireEvent.click(trigger)
      const optNext = screen.getByText("Next.js")
      fireEvent.click(optNext)
      expect(onValueChange).toHaveBeenCalledWith("next")

      fireEvent.click(trigger)
      const optReact = screen.getByRole("option", { name: "React" })
      fireEvent.click(optReact)
      expect(onValueChange).toHaveBeenCalledWith("")

      // Test with unselected value (placeholder fallback)
      render(
        <Combobox options={options} placeholder="Unselected placeholder" />
      )
      expect(screen.getByText("Unselected placeholder")).toBeInTheDocument()
    })
  })

  describe("InputOTP", () => {
    it("renders InputOTP with groups, slots, and separator", () => {
      render(
        <InputOTP maxLength={4}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      )

      expect(screen.getByRole("separator")).toBeInTheDocument()

      // Test slot with isActive and hasFakeCaret
      render(
        <OTPInputContext.Provider
          value={
            {
              slots: [{ char: "7", hasFakeCaret: true, isActive: true }],
              isFocused: true,
              isHovering: false,
            } as any
          }
        >
          <InputOTPSlot index={0} data-testid="otp-active-slot" />
        </OTPInputContext.Provider>
      )
      expect(screen.getByTestId("otp-active-slot")).toBeInTheDocument()
      expect(screen.getByText("7")).toBeInTheDocument()
    })
  })

  describe("DataTable", () => {
    it("renders data table with data and handles empty state", () => {
      type Row = { id: string; name: string }
      const columns = [
        { id: "id", header: "ID", cell: (r: Row) => r.id },
        { id: "name", header: "Name", cell: (r: Row) => r.name },
      ]

      const { rerender } = render(
        <DataTable
          columns={columns}
          data={[{ id: "1", name: "Alice" }]}
          getRowId={(r) => r.id}
        />
      )
      expect(screen.getByText("Alice")).toBeInTheDocument()

      // Render without getRowId to test default getRowId
      render(<DataTable columns={columns} data={[{ id: "2", name: "Bob" }]} />)
      expect(screen.getByText("Bob")).toBeInTheDocument()

      rerender(
        <DataTable
          columns={columns}
          data={[]}
          emptyMessage="Zero records found"
        />
      )
      expect(screen.getByText("Zero records found")).toBeInTheDocument()
    })
  })

  describe("Calendar & DatePicker", () => {
    it("renders calendar and date picker with day button variations", () => {
      const date = new Date("2026-09-21T00:00:00Z")
      render(
        <div>
          <Calendar
            mode="single"
            selected={date}
            showWeekNumber
            captionLayout="dropdown"
            className="custom-cal"
          />
          <DatePicker mode="single" selected={date} />
          <CalendarDayButton
            day={{ date, displayMonth: date }}
            modifiers={{
              focused: true,
              selected: true,
              range_start: true,
              range_end: true,
              range_middle: true,
            }}
          >
            21
          </CalendarDayButton>
        </div>
      )

      expect(screen.getAllByText(/September 2026|Sep/).length).toBeGreaterThan(
        0
      )
    })
  })

  describe("Chart", () => {
    it("renders chart container, style, tooltip, and legend", () => {
      const config: ChartConfig = {
        desktop: {
          label: "Desktop",
          icon: () => <span data-testid="chart-icon">*</span>,
          color: "hsl(var(--chart-1))",
        },
        mobile: {
          label: "Mobile",
          theme: {
            light: "hsl(var(--chart-2))",
            dark: "hsl(var(--chart-3))",
          },
        },
      }

      render(
        <div>
          <ChartStyle id="empty" config={{}} />
          <ChartStyle id="test-chart" config={config} />
          <ChartContainer config={config}>
            <div data-testid="chart-child-auto-id">Auto ID Graphic</div>
          </ChartContainer>
          <ChartContainer id="test-chart" config={config}>
            <div data-testid="chart-child">Chart Graphic</div>
          </ChartContainer>
        </div>
      )

      expect(screen.getByTestId("chart-child")).toBeInTheDocument()
      expect(screen.getByTestId("chart-child-auto-id")).toBeInTheDocument()

      // Render TooltipContent & LegendContent within container
      render(
        <ChartContainer id="test-chart-2" config={config}>
          <div>
            <ChartTooltipContent active={false} />
            <ChartTooltipContent active={true} payload={[]} />
            <ChartTooltipContent
              active={true}
              payload={[
                {
                  name: "desktop",
                  value: 186,
                  color: "#3b82f6",
                  dataKey: "desktop",
                  payload: { fill: "#3b82f6" },
                },
              ]}
              indicator="dot"
            />
            <ChartTooltipContent
              active={true}
              indicator="dashed"
              payload={[
                {
                  name: "mobile",
                  value: 42,
                  color: "#10b981",
                  dataKey: "mobile",
                  payload: { fill: "#10b981" },
                },
              ]}
            />
            <ChartTooltipContent
              active={true}
              indicator="line"
              payload={[
                {
                  name: "mobile",
                  value: 55,
                  color: "#10b981",
                  dataKey: "mobile",
                  payload: { fill: "#10b981" },
                },
              ]}
            />
            <ChartTooltipContent
              active={true}
              hideLabel
              hideIndicator
              payload={[
                {
                  name: "desktop",
                  value: 12,
                  color: "#3b82f6",
                  dataKey: "desktop",
                  payload: { fill: "#3b82f6" },
                },
              ]}
            />
            <ChartTooltipContent
              active={true}
              payload={[
                {
                  name: "mobile",
                  value: 80,
                  color: "#10b981",
                  dataKey: "mobile",
                  payload: { fill: "#10b981" },
                },
              ]}
              indicator="line"
              label="Visits"
              labelFormatter={(val) => `Label: ${val}`}
              formatter={(val, name) => `${name}: ${val}`}
            />
            <ChartLegendContent payload={[]} />
            <ChartLegendContent
              verticalAlign="top"
              hideIcon
              nameKey="value"
              payload={[
                {
                  value: "ignored",
                  type: "none",
                } as any,
                {
                  value: "desktop",
                  color: "#3b82f6",
                  dataKey: "desktop",
                },
              ]}
            />
            <ChartTooltipContent active={false} payload={[null]} />
            <ChartTooltipContent
              active={true}
              payload={[
                {
                  name: "custom",
                  value: 99,
                  color: "#000",
                  dataKey: "custom",
                  payload: { fill: "#000", custom: "desktop" },
                },
                {
                  name: "directKey",
                  value: 100,
                  color: "#000",
                  dataKey: "desktop",
                  payload: { fill: "#000" },
                  desktop: "desktop",
                },
              ]}
            />
          </div>
        </ChartContainer>
      )

      expect(screen.getAllByText("Desktop").length).toBeGreaterThan(0)
      expect(screen.getByText("mobile: 80")).toBeInTheDocument()
      expect(screen.getAllByTestId("chart-icon").length).toBeGreaterThan(0)
    })

    it("throws when ChartTooltipContent is used outside ChartContainer", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {})
      expect(() => render(<ChartTooltipContent />)).toThrow(
        "useChart must be used within a <ChartContainer />"
      )
      spy.mockRestore()
    })
  })

  describe("Resizable", () => {
    it("renders resizable panels and handle", () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50}>Left</ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>Right</ResizablePanel>
        </ResizablePanelGroup>
      )

      expect(screen.getByText("Left")).toBeInTheDocument()
      expect(screen.getByText("Right")).toBeInTheDocument()
    })
  })

  describe("ScrollArea", () => {
    it("renders scroll area with vertical and horizontal scrollbars", () => {
      render(
        <ScrollArea className="h-48 w-48">
          <div className="h-96 w-96">Large Content</div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )

      expect(screen.getByText("Large Content")).toBeInTheDocument()
    })
  })

  describe("Questionnaire", () => {
    it("renders questionnaire form element", () => {
      const onSubmit = vi.fn((e) => e.preventDefault())
      render(
        <Questionnaire onSubmit={onSubmit} data-testid="q-form">
          <button type="submit">Submit Questionnaire</button>
        </Questionnaire>
      )

      const form = screen.getByTestId("q-form")
      fireEvent.submit(form)
      expect(onSubmit).toHaveBeenCalled()
    })
  })
})
