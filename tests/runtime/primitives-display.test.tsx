import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Attachment } from "@/components/ui/attachment"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { Bubble } from "@/components/ui/bubble"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Container, containerVariants } from "@/components/ui/container"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Item } from "@/components/ui/item"
import { Marker } from "@/components/ui/marker"
import { Message } from "@/components/ui/message"
import { MessageScroller } from "@/components/ui/message-scroller"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Eyebrow,
  Heading,
  Text,
  Typography,
  headingVariants,
  textVariants,
} from "@/components/ui/typography"

describe("Primitives: Display & Content", () => {
  describe("Badge", () => {
    it("renders all badge variants and custom render prop", () => {
      const variants = [
        "default",
        "secondary",
        "destructive",
        "accent",
        "success",
        "warning",
        "info",
        "outline",
      ] as const

      variants.forEach((variant) => {
        const { unmount } = render(<Badge variant={variant}>{variant}</Badge>)
        expect(screen.getByText(variant)).toBeInTheDocument()
        unmount()
      })

      // Test with render prop
      render(
        <Badge variant="accent" render={<span data-testid="custom-badge" />}>
          Custom Badge
        </Badge>
      )
      expect(screen.getByTestId("custom-badge")).toHaveTextContent(
        "Custom Badge"
      )

      // Test with render prop without explicit children (fallback to render.props.children)
      render(
        <Badge
          variant="secondary"
          render={<span data-testid="fallback-badge">Fallback Badge Text</span>}
        />
      )
      expect(screen.getByTestId("fallback-badge")).toHaveTextContent(
        "Fallback Badge Text"
      )
      expect(badgeVariants({ variant: "outline" })).toContain("text-foreground")
    })
  })

  describe("Avatar", () => {
    it("renders avatar with image and fallback", () => {
      render(
        <Avatar className="custom-avatar">
          <AvatarImage src="https://example.com/photo.png" alt="User Avatar" />
          <AvatarFallback>UA</AvatarFallback>
        </Avatar>
      )
      expect(screen.getByText("UA")).toBeInTheDocument()
    })
  })

  describe("Card", () => {
    it("renders all card variants and subcomponents", () => {
      const variants = [
        "default",
        "surface",
        "outline",
        "elevated",
        "interactive",
        "accent",
        "glass",
        "highlighted",
      ] as const

      variants.forEach((variant) => {
        const { unmount } = render(
          <Card variant={variant} data-testid={`card-${variant}`}>
            <CardHeader>
              <CardTitle>Title</CardTitle>
              <CardDescription>Description</CardDescription>
            </CardHeader>
            <CardContent>Content</CardContent>
            <CardFooter>Footer</CardFooter>
          </Card>
        )
        const card = screen.getByTestId(`card-${variant}`)
        expect(card).toHaveAttribute("data-variant", variant)
        expect(screen.getByText("Title")).toBeInTheDocument()
        expect(screen.getByText("Description")).toBeInTheDocument()
        expect(screen.getByText("Content")).toBeInTheDocument()
        expect(screen.getByText("Footer")).toBeInTheDocument()
        unmount()
      })
    })
  })

  describe("Container", () => {
    it("renders container with sizes and asChild", () => {
      const { rerender } = render(
        <Container size="wide" gutter={true} className="container-custom">
          <span>Inside container</span>
        </Container>
      )
      expect(screen.getByText("Inside container")).toBeInTheDocument()
      expect(containerVariants({ size: "reading", gutter: false })).toContain(
        "max-w-[var(--reading-width)]"
      )

      rerender(
        <Container asChild size="standard">
          <section data-testid="section-container">Slotted Container</section>
        </Container>
      )
      expect(screen.getByTestId("section-container")).toHaveClass("mx-auto")
    })
  })

  describe("Separator", () => {
    it("renders horizontal and vertical separators", () => {
      const { rerender } = render(
        <Separator orientation="horizontal" className="sep-custom" />
      )
      expect(screen.getByRole("none")).toHaveClass("h-[1px]")

      rerender(<Separator orientation="vertical" decorative={false} />)
      expect(screen.getByRole("separator")).toHaveAttribute(
        "aria-orientation",
        "vertical"
      )
    })
  })

  describe("Skeleton & Spinner", () => {
    it("renders Skeleton with classes", () => {
      render(<Skeleton className="h-4 w-20" data-testid="skeleton" />)
      expect(screen.getByTestId("skeleton")).toHaveClass("animate-pulse")
    })

    it("renders Spinner icon", () => {
      render(<Spinner className="size-6 text-primary" />)
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Loading"
      )
    })
  })

  describe("Table", () => {
    it("renders complete table structure", () => {
      render(
        <Table className="custom-table">
          <TableCaption>Invoice summary</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>INV-001</TableCell>
              <TableCell>$250.00</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total: $250.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )

      expect(screen.getByText("Invoice summary")).toBeInTheDocument()
      expect(screen.getByText("INV-001")).toBeInTheDocument()
      expect(screen.getByText("$250.00")).toBeInTheDocument()
      expect(screen.getByText("Total: $250.00")).toBeInTheDocument()
    })
  })

  describe("Typography, Heading, Text, Eyebrow", () => {
    it("renders all typography variants and heading tag options", () => {
      const headingVariantsList = [
        "h1",
        "h2",
        "h3",
        "h4",
        "hero",
        "display",
        "statement",
        "page",
        "section",
        "title",
        "card",
      ] as const

      headingVariantsList.forEach((variant) => {
        const { unmount } = render(
          <Heading variant={variant} tone="inherit">
            Heading {variant}
          </Heading>
        )
        expect(screen.getByText(`Heading ${variant}`)).toBeInTheDocument()
        unmount()
      })

      // Heading with render prop and asChild
      render(
        <Heading variant="h1" render={<h1 data-testid="custom-h1" />}>
          Custom H1
        </Heading>
      )
      expect(screen.getByTestId("custom-h1")).toHaveTextContent("Custom H1")

      render(
        <Heading asChild variant="h3">
          <span data-testid="slotted-h3">Slotted H3</span>
        </Heading>
      )
      expect(screen.getByTestId("slotted-h3")).toHaveTextContent("Slotted H3")

      // Text variants
      const textVariantsList = [
        "p",
        "lead",
        "small",
        "body",
        "meta",
        "eyebrow",
        "signal",
      ] as const
      textVariantsList.forEach((variant) => {
        const { unmount } = render(
          <Text variant={variant} tone="inherit">
            Text {variant}
          </Text>
        )
        expect(screen.getByText(`Text ${variant}`)).toBeInTheDocument()
        unmount()
      })

      // Text with render prop and asChild
      render(<Text render={<p data-testid="custom-p" />}>Custom P</Text>)
      expect(screen.getByTestId("custom-p")).toHaveTextContent("Custom P")

      render(
        <Text asChild>
          <span data-testid="slotted-p">Slotted P</span>
        </Text>
      )
      expect(screen.getByTestId("slotted-p")).toHaveTextContent("Slotted P")

      // Eyebrow and Typography component
      render(<Eyebrow data-testid="eyebrow-comp">KICKER</Eyebrow>)
      expect(screen.getByTestId("eyebrow-comp")).toHaveTextContent("KICKER")

      const typoVariants = [
        "h1",
        "h2",
        "h3",
        "h4",
        "p",
        "lead",
        "small",
      ] as const
      typoVariants.forEach((variant) => {
        const { unmount } = render(
          <Typography variant={variant} data-testid={`typo-${variant}`}>
            Typo {variant}
          </Typography>
        )
        expect(screen.getByTestId(`typo-${variant}`)).toBeInTheDocument()
        unmount()
      })

      render(
        <Typography asChild>
          <strong data-testid="typo-strong">Strong Typo</strong>
        </Typography>
      )
      expect(screen.getByTestId("typo-strong")).toBeInTheDocument()

      expect(headingVariants()).toContain("ui-heading")
      expect(textVariants()).toContain("ui-text")
    })
  })

  describe("Item, Marker, Bubble, Attachment", () => {
    it("renders item, marker, bubble, and attachment", () => {
      render(
        <div>
          <Item data-testid="item">Item content</Item>
          <Marker data-testid="marker">Highlighted</Marker>
          <Bubble variant="sent" data-testid="bubble-sent">
            Sent message
          </Bubble>
          <Bubble variant="received" data-testid="bubble-received">
            Received message
          </Bubble>
          <Attachment data-testid="attachment">file.pdf</Attachment>
        </div>
      )

      expect(screen.getByTestId("item")).toHaveTextContent("Item content")
      expect(screen.getByTestId("marker")).toHaveTextContent("Highlighted")
      expect(screen.getByTestId("bubble-sent")).toHaveTextContent(
        "Sent message"
      )
      expect(screen.getByTestId("bubble-received")).toHaveTextContent(
        "Received message"
      )
      expect(screen.getByTestId("attachment")).toHaveTextContent("file.pdf")
    })
  })

  describe("Progress", () => {
    it("renders progress bar with value", () => {
      render(<Progress value={65} max={100} className="custom-progress" />)
      const prog = screen.getByRole("progressbar")
      expect(prog).toHaveAttribute("aria-valuenow", "65")
      expect(prog).toHaveClass("custom-progress")

      // Fallback when value is undefined
      const { unmount } = render(<Progress data-testid="default-prog" />)
      expect(screen.getByTestId("default-prog")).toBeInTheDocument()
      unmount()
    })
  })

  describe("Empty", () => {
    it("renders empty state component and subcomponents", () => {
      const { rerender } = render(
        <Empty className="empty-custom">
          <EmptyHeader>
            <EmptyMedia variant="icon" data-testid="empty-media">
              <span data-testid="icon">Icon</span>
            </EmptyMedia>
            <EmptyTitle>No items found</EmptyTitle>
            <EmptyDescription>
              Try searching for something else.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <button>Create Item</button>
          </EmptyContent>
        </Empty>
      )

      expect(screen.getByText("No items found")).toBeInTheDocument()
      expect(
        screen.getByText("Try searching for something else.")
      ).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: "Create Item" })
      ).toBeInTheDocument()

      rerender(
        <Empty>
          <EmptyMedia variant="default" data-testid="empty-media-default" />
        </Empty>
      )
      expect(screen.getByTestId("empty-media-default")).toBeInTheDocument()
    })
  })

  describe("Message & MessageScroller", () => {
    it("renders message with and without date, and message scroller", () => {
      const { rerender } = render(
        <Message date={new Date("2026-09-21T12:00:00Z")} data-testid="msg">
          <span>Hello there</span>
        </Message>
      )
      expect(screen.getByText("Hello there")).toBeInTheDocument()
      expect(screen.getByTestId("msg")).toBeInTheDocument()

      rerender(
        <Message data-testid="msg-no-date">
          <span>Simple message</span>
        </Message>
      )
      expect(screen.getByText("Simple message")).toBeInTheDocument()

      render(
        <MessageScroller data-testid="scroller">
          <div>Scroller content</div>
        </MessageScroller>
      )
      expect(screen.getByTestId("scroller")).toBeInTheDocument()
    })
  })

  describe("Typography", () => {
    it("renders Heading with variants, tag, asChild, and render prop fallbacks", () => {
      expect(headingVariants()).toContain("ui-heading")
      expect(
        headingVariants({ variant: "h1", tone: "inherit", className: "extra" })
      ).toContain("text-inherit")
      expect(headingVariants({ variant: "unknown-variant" as any })).toContain(
        "ui-heading"
      )

      render(
        <div>
          <Heading variant="h1">Heading 1</Heading>
          <Heading variant="h2" tag="h3">
            Heading Custom Tag
          </Heading>
          <Heading variant="h3" asChild>
            <h3>Slotted Heading</h3>
          </Heading>
          <Heading
            render={<h2 data-testid="render-h-fallback">Render Fallback</h2>}
          />
          <Heading render={<h2 data-testid="render-h-override" />}>
            Overridden Content
          </Heading>
        </div>
      )

      expect(screen.getByText("Heading 1")).toBeInTheDocument()
      expect(screen.getByText("Heading Custom Tag")).toBeInTheDocument()
      expect(screen.getByText("Slotted Heading")).toBeInTheDocument()
      expect(screen.getByTestId("render-h-fallback")).toHaveTextContent(
        "Render Fallback"
      )
      expect(screen.getByTestId("render-h-override")).toHaveTextContent(
        "Overridden Content"
      )
    })

    it("renders Text with variants, asChild, and render prop fallbacks", () => {
      expect(textVariants()).toContain("ui-text")
      expect(
        textVariants({ variant: "lead", tone: "inherit", className: "extra" })
      ).toContain("text-inherit")
      expect(textVariants({ variant: "unknown-variant" as any })).toContain(
        "ui-text"
      )

      render(
        <div>
          <Text variant="p">Standard Paragraph</Text>
          <Text variant="lead">Lead Text</Text>
          <Text variant="small">Small Text</Text>
          <Text asChild>
            <span>Slotted Span</span>
          </Text>
          <Text render={<p data-testid="render-t-fallback">Text Fallback</p>} />
          <Text render={<p data-testid="render-t-override" />}>
            Text Overridden
          </Text>
          <Eyebrow>Section Eyebrow</Eyebrow>
          <Typography>Full Typography Box</Typography>
        </div>
      )

      expect(screen.getByText("Standard Paragraph")).toBeInTheDocument()
      expect(screen.getByText("Lead Text")).toBeInTheDocument()
      expect(screen.getByText("Small Text")).toBeInTheDocument()
      expect(screen.getByText("Slotted Span")).toBeInTheDocument()
      expect(screen.getByTestId("render-t-fallback")).toHaveTextContent(
        "Text Fallback"
      )
      expect(screen.getByTestId("render-t-override")).toHaveTextContent(
        "Text Overridden"
      )
      expect(screen.getByText("Section Eyebrow")).toBeInTheDocument()
      expect(screen.getByText("Full Typography Box")).toBeInTheDocument()
    })
  })
})
