import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

describe("Overlays & Popups", () => {
  describe("Dialog", () => {
    it("renders dialog with open state, subcomponents, and render props", () => {
      render(
        <Dialog open>
          <DialogTrigger render={<button>Custom Trigger</button>}>
            Open
          </DialogTrigger>
          <DialogContent showCloseButton={true} className="dialog-custom">
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>Dialog description text</DialogDescription>
            </DialogHeader>
            <div>Body</div>
            <DialogFooter>
              <DialogClose render={<button>Close Button</button>}>
                Close
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByText("Dialog Title")).toBeInTheDocument()
      expect(screen.getByText("Dialog description text")).toBeInTheDocument()
      expect(screen.getByText("Close Button")).toBeInTheDocument()

      // Render prop variations: overridden children, no child, invalid element
      render(
        <Dialog open>
          <DialogTrigger render={<button data-testid="d-trig-override" />}>
            Overridden Dialog Trigger
          </DialogTrigger>
          <DialogTrigger render={false as any}>
            Invalid Element Trigger
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogClose render={<button data-testid="d-close-override" />}>
              Overridden Close
            </DialogClose>
            <DialogClose render={false as any}>
              Invalid Element Close
            </DialogClose>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByTestId("d-trig-override")).toHaveTextContent(
        "Overridden Dialog Trigger"
      )
      expect(screen.getByTestId("d-close-override")).toHaveTextContent(
        "Overridden Close"
      )
    })

    it("renders dialog content without close button and with regular triggers", () => {
      render(
        <Dialog open>
          <DialogTrigger>Plain Open</DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogTitle>No Close Button Dialog</DialogTitle>
            <DialogClose>Plain Close</DialogClose>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByText("No Close Button Dialog")).toBeInTheDocument()
    })
  })

  describe("AlertDialog", () => {
    it("renders alert dialog subcomponents", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Trigger Alert</AlertDialogTrigger>
          <AlertDialogContent className="alert-dialog-custom">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

      expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument()
      expect(
        screen.getByText("This action cannot be undone.")
      ).toBeInTheDocument()
      expect(screen.getByText("Cancel")).toBeInTheDocument()
      expect(screen.getByText("Continue")).toBeInTheDocument()
    })
  })

  describe("Sheet", () => {
    it("renders sheet with all sides and render prop triggers", () => {
      const sides = ["top", "bottom", "left", "right"] as const
      sides.forEach((side) => {
        const { unmount } = render(
          <Sheet open>
            <SheetTrigger render={<button>Sheet Trigger</button>}>
              Open
            </SheetTrigger>
            <SheetContent
              side={side}
              showCloseButton={true}
              className="sheet-custom"
            >
              <SheetHeader>
                <SheetTitle>Sheet {side}</SheetTitle>
                <SheetDescription>Side {side} description</SheetDescription>
              </SheetHeader>
              <div>Content</div>
              <SheetFooter>
                <SheetClose render={<button>Dismiss</button>}>Done</SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )

        expect(screen.getByText(`Sheet ${side}`)).toBeInTheDocument()
        unmount()
      })

      // Test without close button and plain triggers
      render(
        <Sheet open>
          <SheetTrigger>Open Plain</SheetTrigger>
          <SheetContent showCloseButton={false}>
            <SheetTitle>No Close</SheetTitle>
            <SheetClose>Close Plain</SheetClose>
          </SheetContent>
        </Sheet>
      )
      expect(screen.getByText("No Close")).toBeInTheDocument()

      // Test sizes (full, lg, xl) and render prop variations
      render(
        <Sheet open>
          <SheetTrigger render={<button data-testid="s-trig-override" />}>
            Overridden Sheet Trigger
          </SheetTrigger>
          <SheetTrigger render={false as any}>
            Invalid Sheet Trigger
          </SheetTrigger>
          <SheetContent size="full">
            <SheetTitle>Full Sheet</SheetTitle>
            <SheetClose render={<button data-testid="s-close-override" />}>
              Overridden Sheet Close
            </SheetClose>
            <SheetClose render={false as any}>Invalid Sheet Close</SheetClose>
          </SheetContent>
        </Sheet>
      )
      expect(screen.getByTestId("s-trig-override")).toHaveTextContent(
        "Overridden Sheet Trigger"
      )
      expect(screen.getByTestId("s-close-override")).toHaveTextContent(
        "Overridden Sheet Close"
      )

      const { rerender } = render(
        <Sheet open>
          <SheetContent size="lg">
            <SheetTitle>Lg Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      )
      expect(screen.getByText("Lg Sheet")).toBeInTheDocument()

      rerender(
        <Sheet open>
          <SheetContent size="xl">
            <SheetTitle>Xl Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      )
      expect(screen.getByText("Xl Sheet")).toBeInTheDocument()
    })
  })

  describe("Drawer", () => {
    it("renders drawer subcomponents", () => {
      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent className="drawer-custom">
            <DrawerHeader>
              <DrawerTitle>Drawer Title</DrawerTitle>
              <DrawerDescription>Drawer Description</DrawerDescription>
            </DrawerHeader>
            <div>Drawer Body</div>
            <DrawerFooter>
              <DrawerClose>Close</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )

      expect(screen.getByText("Drawer Title")).toBeInTheDocument()
      expect(screen.getByText("Drawer Description")).toBeInTheDocument()
      expect(screen.getByText("Drawer Body")).toBeInTheDocument()
    })
  })

  describe("Popover", () => {
    it("renders popover content and anchor", () => {
      render(
        <Popover open>
          <PopoverAnchor />
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent className="pop-custom">
            <div>Popover details</div>
          </PopoverContent>
        </Popover>
      )

      expect(screen.getByText("Popover details")).toBeInTheDocument()
    })
  })

  describe("Tooltip", () => {
    it("renders tooltip content within provider", () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent className="tooltip-custom">
              Helpful hint
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )

      expect(screen.getByText("Helpful hint")).toBeInTheDocument()
    })
  })

  describe("HoverCard", () => {
    it("renders hover card content when open", () => {
      render(
        <HoverCard open>
          <HoverCardTrigger>Preview Link</HoverCardTrigger>
          <HoverCardContent className="hover-custom">
            Profile Card Information
          </HoverCardContent>
        </HoverCard>
      )

      expect(screen.getByText("Profile Card Information")).toBeInTheDocument()
    })
  })

  describe("DropdownMenu", () => {
    it("renders dropdown menu with all item types", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
          <DropdownMenuContent className="dd-custom">
            <DropdownMenuGroup>
              <DropdownMenuLabel inset>Manage</DropdownMenuLabel>
              <DropdownMenuItem inset>
                Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuCheckboxItem checked>
                Show Toolbar
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger inset>
                  More Tools
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Developer Tools</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuRadioGroup value="theme">
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      expect(screen.getByText("Manage")).toBeInTheDocument()
      expect(screen.getByText("Profile")).toBeInTheDocument()
      expect(screen.getByText("Show Toolbar")).toBeInTheDocument()
      expect(screen.getByText("More Tools")).toBeInTheDocument()
      expect(screen.getByText("Light")).toBeInTheDocument()
    })
  })

  describe("ContextMenu", () => {
    it("renders context menu with all item types", () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger data-testid="context-target">
            Right click here
          </ContextMenuTrigger>
          <ContextMenuContent forceMount className="cm-custom">
            <ContextMenuGroup>
              <ContextMenuLabel inset>Context Actions</ContextMenuLabel>
              <ContextMenuItem inset>
                Back <ContextMenuShortcut>⌘[</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuCheckboxItem checked>
                Bookmarked
              </ContextMenuCheckboxItem>
              <ContextMenuSeparator />
              <ContextMenuSub>
                <ContextMenuSubTrigger inset>Share</ContextMenuSubTrigger>
                <ContextMenuSubContent forceMount>
                  <ContextMenuItem>Email</ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
            </ContextMenuGroup>
            <ContextMenuRadioGroup value="sort">
              <ContextMenuRadioItem value="name">By Name</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      )

      const target = screen.getByTestId("context-target")
      fireEvent.contextMenu(target)
      expect(target).toBeInTheDocument()
    })
  })
})
