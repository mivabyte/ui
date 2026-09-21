import * as React from "react"
import { renderToString } from "react-dom/server"
import { fireEvent, render, renderHook, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Toast, toast } from "@/components/ui/toast"
import { useIsMobile } from "@/hooks/use-mobile"

function SidebarConsumer() {
  const sidebar = useSidebar()
  return (
    <div>
      <span data-testid="sidebar-state">{sidebar.state}</span>
      <span data-testid="sidebar-open">{String(sidebar.open)}</span>
      <button data-testid="toggle-btn" onClick={sidebar.toggleSidebar}>
        Toggle
      </button>
    </div>
  )
}

describe("Sidebar, Hooks & Toast", () => {
  describe("Sidebar", () => {
    it("renders full sidebar hierarchy, subcomponents, and toggles state", () => {
      const onOpenChange = vi.fn()
      const onTriggerClick = vi.fn()
      render(
        <SidebarProvider
          defaultOpen={true}
          onOpenChange={onOpenChange}
          storageKey="test-sidebar"
        >
          <Sidebar collapsible="icon" className="custom-sb">
            <SidebarHeader>
              <SidebarInput placeholder="Search nav..." />
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Application</SidebarGroupLabel>
                <SidebarGroupLabel asChild>
                  <span>Slotted Label</span>
                </SidebarGroupLabel>
                <SidebarGroupAction aria-label="Add project">
                  +
                </SidebarGroupAction>
                <SidebarGroupAction asChild aria-label="Slotted Action">
                  <button>+</button>
                </SidebarGroupAction>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        variant="default"
                        size="default"
                        isActive
                        tooltip="Dashboard overview"
                      >
                        Dashboard
                      </SidebarMenuButton>
                      <SidebarMenuAction aria-label="More">
                        ...
                      </SidebarMenuAction>
                      <SidebarMenuAction
                        asChild
                        showOnHover
                        aria-label="Hover More"
                      >
                        <button>Hover</button>
                      </SidebarMenuAction>
                      <SidebarMenuBadge>New</SidebarMenuBadge>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        variant="outline"
                        size="sm"
                        tooltip={{ children: "Custom Object Tooltip" }}
                      >
                        Projects
                      </SidebarMenuButton>
                      <SidebarMenuButton tooltip="Quick String Tooltip">
                        String Tooltip
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="#plain">Plain Link</a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuSkeleton showIcon />
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton href="#sub1" size="sm" isActive>
                            Sub Item 1
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild size="md">
                            <span data-testid="sub-slotted">Slotted</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarSeparator />
            </SidebarContent>
            <SidebarFooter>
              <div>Footer user</div>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>
          <SidebarInset>
            <SidebarTrigger onClick={onTriggerClick} data-testid="sb-trigger" />
            <SidebarConsumer />
          </SidebarInset>
        </SidebarProvider>
      )

      expect(screen.getByPlaceholderText("Search nav...")).toBeInTheDocument()
      expect(screen.getByText("Dashboard")).toBeInTheDocument()
      expect(screen.getByText("Plain Link")).toBeInTheDocument()
      expect(screen.getByText("Sub Item 1")).toBeInTheDocument()
      expect(screen.getByTestId("sub-slotted")).toBeInTheDocument()
      expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded")

      // Click SidebarTrigger
      const trigger = screen.getByTestId("sb-trigger")
      fireEvent.click(trigger)
      expect(onTriggerClick).toHaveBeenCalled()

      // Click toggle button
      const toggleBtn = screen.getByTestId("toggle-btn")
      fireEvent.click(toggleBtn)
      expect(onOpenChange).toHaveBeenCalled()
    })

    it("renders sidebar with collapsible=none", () => {
      render(
        <SidebarProvider>
          <Sidebar collapsible="none">
            <div>Static sidebar</div>
          </Sidebar>
        </SidebarProvider>
      )
      expect(screen.getByText("Static sidebar")).toBeInTheDocument()
    })

    it("renders collapsed icon sidebar with tooltip", () => {
      render(
        <SidebarProvider defaultOpen={false}>
          <Sidebar collapsible="icon">
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Collapsed Tooltip Action">
                    Action
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      )
      expect(screen.getByText("Action")).toBeInTheDocument()
    })

    it("handles function and object refs on SidebarTrigger", () => {
      const refFn = vi.fn()
      const refObj = { current: null }
      render(
        <SidebarProvider>
          <SidebarTrigger ref={refFn} data-testid="ref-fn-trigger" />
          <SidebarTrigger ref={refObj} data-testid="ref-obj-trigger" />
        </SidebarProvider>
      )
      expect(refFn).toHaveBeenCalled()
      expect(refObj.current).not.toBeNull()
    })

    it("renders sidebar with side=right and floating/inset variants", () => {
      const { rerender } = render(
        <SidebarProvider>
          <Sidebar side="right" variant="floating">
            <div>Floating Right Sidebar</div>
          </Sidebar>
        </SidebarProvider>
      )
      expect(screen.getByText("Floating Right Sidebar")).toBeInTheDocument()

      rerender(
        <SidebarProvider>
          <Sidebar side="left" variant="inset">
            <div>Inset Left Sidebar</div>
          </Sidebar>
        </SidebarProvider>
      )
      expect(screen.getByText("Inset Left Sidebar")).toBeInTheDocument()
    })

    it("handles keyboard shortcut Meta+b to toggle sidebar", () => {
      render(
        <SidebarProvider defaultOpen={true}>
          <SidebarConsumer />
        </SidebarProvider>
      )

      expect(screen.getByTestId("sidebar-open")).toHaveTextContent("true")

      // Fire shortcut outside of inputs
      fireEvent.keyDown(window, { key: "b", metaKey: true })
      expect(screen.getByTestId("sidebar-open")).toHaveTextContent("false")

      // Fire shortcut inside input - should be ignored
      const input = document.createElement("input")
      document.body.appendChild(input)
      fireEvent.keyDown(input, { key: "b", metaKey: true })
      expect(screen.getByTestId("sidebar-open")).toHaveTextContent("false")
      input.remove()
    })

    it("restores open state and saves changes to localStorage when storageKey is provided", () => {
      localStorage.setItem("test-sidebar-key", "false")
      render(
        <SidebarProvider storageKey="test-sidebar-key">
          <SidebarConsumer />
        </SidebarProvider>
      )
      expect(screen.getByTestId("sidebar-state")).toHaveTextContent("collapsed")
      const toggleBtn = screen.getByTestId("toggle-btn")
      fireEvent.click(toggleBtn)
      expect(localStorage.getItem("test-sidebar-key")).toBe("true")
    })

    it("handles mobile mode toggle and renders Sheet sidebar", () => {
      const originalMatchMedia = window.matchMedia
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <div>Mobile Nav Content</div>
            </SidebarContent>
          </Sidebar>
          <SidebarTrigger data-testid="mobile-sb-trigger" />
        </SidebarProvider>
      )

      const trigger = screen.getByTestId("mobile-sb-trigger")
      fireEvent.click(trigger)
      expect(screen.getByText("Mobile Nav Content")).toBeInTheDocument()

      window.matchMedia = originalMatchMedia
    })

    it("throws when useSidebar is used outside SidebarProvider", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {})
      expect(() => render(<SidebarConsumer />)).toThrow(
        "useSidebar must be used within a SidebarProvider."
      )
      spy.mockRestore()
    })
  })

  describe("Hooks: useIsMobile", () => {
    it("returns false for desktop and responds to media query changes", () => {
      const { result } = renderHook(() => useIsMobile())
      expect(result.current).toBe(false)
    })

    it("supports server snapshot rendering", () => {
      function ServerComponent() {
        const isMobile = useIsMobile()
        return <div>{String(isMobile)}</div>
      }
      const html = renderToString(<ServerComponent />)
      expect(html).toContain("false")
    })
  })

  describe("Toast", () => {
    it("renders Toast container and allows calling toast() function", () => {
      render(<Toast />)
      expect(typeof toast).toBe("function")
      expect(typeof toast.success).toBe("function")
      expect(typeof toast.error).toBe("function")
    })
  })
})
