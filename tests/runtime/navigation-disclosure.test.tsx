import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

describe("Navigation & Disclosure", () => {
  describe("Accordion", () => {
    it("renders accordion and toggles items", () => {
      render(
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="acc-item">
            <AccordionTrigger className="acc-trigger">
              Section 1
            </AccordionTrigger>
            <AccordionContent className="acc-content">
              Content 1
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Section 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

      const trigger1 = screen.getByRole("button", { name: "Section 1" })
      expect(trigger1).toHaveAttribute("aria-expanded", "true")
      expect(screen.getByText("Content 1")).toBeInTheDocument()

      const trigger2 = screen.getByRole("button", { name: "Section 2" })
      fireEvent.click(trigger2)
      expect(trigger2).toHaveAttribute("aria-expanded", "true")
    })
  })

  describe("Collapsible", () => {
    it("renders collapsible and toggles state", () => {
      render(
        <Collapsible defaultOpen className="collapsible-root">
          <CollapsibleTrigger>Toggle Details</CollapsibleTrigger>
          <CollapsibleContent>Secret Details</CollapsibleContent>
        </Collapsible>
      )

      expect(screen.getByText("Toggle Details")).toBeInTheDocument()
      expect(screen.getByText("Secret Details")).toBeInTheDocument()
    })
  })

  describe("Tabs", () => {
    it("renders tabs with default and ghost variants and switches tabs", async () => {
      const { rerender } = render(
        <Tabs defaultValue="account" className="tabs-root">
          <TabsList variant="default">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Account settings</TabsContent>
          <TabsContent value="password">Password form</TabsContent>
        </Tabs>
      )

      const tabAccount = screen.getByRole("tab", { name: "Account" })
      const tabPassword = screen.getByRole("tab", { name: "Password" })
      expect(tabAccount).toHaveAttribute("data-state", "active")
      expect(screen.getByText("Account settings")).toBeInTheDocument()

      const user = userEvent.setup()
      await user.click(tabPassword)
      expect(tabPassword).toHaveAttribute("data-state", "active")
      expect(screen.getByText("Password form")).toBeInTheDocument()

      rerender(
        <Tabs defaultValue="account">
          <TabsList variant="ghost">
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
        </Tabs>
      )
      expect(screen.getByRole("tablist")).toHaveAttribute(
        "data-variant",
        "ghost"
      )
    })
  })

  describe("Breadcrumb", () => {
    it("renders breadcrumb trail with links, pages, and separators", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" asChild>
                <span>Home</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <span>/</span>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Components</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )

      expect(screen.getByText("Home")).toBeInTheDocument()
      expect(screen.getByText("Docs")).toBeInTheDocument()
      expect(screen.getByText("/")).toBeInTheDocument()
      expect(screen.getByText("More")).toBeInTheDocument()
      expect(screen.getByText("Components")).toBeInTheDocument()
    })
  })

  describe("Pagination", () => {
    it("renders pagination controls and links", () => {
      render(
        <Pagination className="pag-custom">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#prev" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#1" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#2">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#next" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )

      expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument()
      expect(screen.getByLabelText("Go to next page")).toBeInTheDocument()
      expect(screen.getByRole("link", { name: "1" })).toHaveAttribute(
        "aria-current",
        "page"
      )
      expect(screen.getByText("More pages")).toBeInTheDocument()
    })
  })

  describe("NavigationMenu", () => {
    it("renders navigation menu elements and classes", () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Item 1</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href="/link1">Sublink 1</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuIndicator />
          <NavigationMenuViewport />
        </NavigationMenu>
      )

      expect(screen.getByText("Item 1")).toBeInTheDocument()
      expect(navigationMenuTriggerStyle()).toContain("group inline-flex")
    })
  })

  describe("Menubar", () => {
    it("renders menubar structure and items", () => {
      render(
        <Menubar className="menubar-custom" value="file">
          <MenubarMenu value="file">
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarLabel inset>Actions</MenubarLabel>
                <MenubarItem inset>
                  New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarCheckboxItem checked>Always on Top</MenubarCheckboxItem>
                <MenubarSeparator />
                <MenubarSub open>
                  <MenubarSubTrigger inset>More Options</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>Deep Setting</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
              </MenubarGroup>
              <MenubarRadioGroup value="first">
                <MenubarRadioItem value="first">First</MenubarRadioItem>
                <MenubarRadioItem value="second">Second</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
            <MenubarPortal>
              <div data-testid="menubar-portal-content">Portal Content</div>
            </MenubarPortal>
          </MenubarMenu>
        </Menubar>
      )

      const fileTrigger = screen.getByText("File")
      expect(fileTrigger).toBeInTheDocument()
      expect(screen.getByText("Actions")).toBeInTheDocument()
      expect(screen.getByText("New Tab")).toBeInTheDocument()
      expect(screen.getByText("⌘T")).toBeInTheDocument()
      expect(screen.getByText("Always on Top")).toBeInTheDocument()
      expect(screen.getByText("More Options")).toBeInTheDocument()
      expect(screen.getByText("Deep Setting")).toBeInTheDocument()
      expect(screen.getByText("First")).toBeInTheDocument()
    })
  })
})
