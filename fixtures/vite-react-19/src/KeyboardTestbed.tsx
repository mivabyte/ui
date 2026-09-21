import * as React from "react"
import {
  Button,
  Calendar,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  DataTable,
  DatePicker,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@mivabyte/ui"

interface TableItem {
  id: string
  name: string
  role: string
}

const tableData: TableItem[] = [
  { id: "1", name: "Alice", role: "Developer" },
  { id: "2", name: "Bob", role: "Designer" },
]

const tableColumns = [
  { id: "name", header: "Name", cell: (row: TableItem) => row.name },
  { id: "role", header: "Role", cell: (row: TableItem) => row.role },
]

export function KeyboardTestbed() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date(2026, 8, 7)
  )
  const [pickerDate, setPickerDate] = React.useState<Date | undefined>()
  const [otpValue, setOtpValue] = React.useState("")
  const [menuAction, setMenuAction] = React.useState("")

  return (
    <div
      data-mivabyte-theme="product"
      data-density="comfortable"
      className="p-8 space-y-8 min-h-screen bg-background text-foreground"
    >
      <h1 className="text-2xl font-bold">Keyboard Testbed</h1>

      {/* 1. Menus */}
      <section data-testid="section-menu">
        <h2 className="text-lg font-semibold mb-2">Menu Family</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open dropdown menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onSelect={() => setMenuAction("profile")}
              onClick={() => setMenuAction("profile")}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setMenuAction("settings")}
              onClick={() => setMenuAction("settings")}
            >
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {menuAction && <span data-testid="menu-action">{menuAction}</span>}
      </section>

      {/* 2. Navigation */}
      <section data-testid="section-navigation">
        <h2 className="text-lg font-semibold mb-2">Navigation Family</h2>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Nav Products</NavigationMenuTrigger>
              <NavigationMenuContent className="p-4">
                <a href="#prod-1" data-testid="nav-link">
                  Product Overview
                </a>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </section>

      {/* 3. Calendar */}
      <section data-testid="section-calendar">
        <h2 className="text-lg font-semibold mb-2">Calendar Family</h2>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
        />
      </section>

      {/* 4. Combobox */}
      <section data-testid="section-combobox">
        <h2 className="text-lg font-semibold mb-2">Combobox Family</h2>
        <Command
          label="Framework search"
          className="rounded-lg border shadow-md w-64"
        >
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem value="React">React</CommandItem>
              <CommandItem value="Vue">Vue</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </section>

      {/* 5. Carousel */}
      <section data-testid="section-carousel" className="px-16">
        <h2 className="text-lg font-semibold mb-2">Carousel Family</h2>
        <Carousel className="w-64">
          <CarouselContent>
            <CarouselItem>
              <div className="p-4 border">Slide 1</div>
            </CarouselItem>
            <CarouselItem>
              <div className="p-4 border">Slide 2</div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious aria-label="Previous slide" />
          <CarouselNext aria-label="Next slide" />
        </Carousel>
      </section>

      {/* 6. Resizable */}
      <section data-testid="section-resizable">
        <h2 className="text-lg font-semibold mb-2">Resizable Family</h2>
        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-[100px] border rounded"
        >
          <ResizablePanel defaultSize={50} id="left-panel">
            Panel A
          </ResizablePanel>
          <ResizableHandle
            withHandle
            aria-label="Resize panels"
            id="resize-handle"
          />
          <ResizablePanel defaultSize={50} id="right-panel">
            Panel B
          </ResizablePanel>
        </ResizablePanelGroup>
      </section>

      {/* 7. Date Picker */}
      <section data-testid="section-datepicker">
        <h2 className="text-lg font-semibold mb-2">Date Picker Family</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Select custom date</Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <DatePicker
              mode="single"
              selected={pickerDate}
              onSelect={setPickerDate}
            />
          </PopoverContent>
        </Popover>
      </section>

      {/* 8. Input OTP */}
      <section data-testid="section-otp">
        <h2 className="text-lg font-semibold mb-2">Input OTP Family</h2>
        <InputOTP
          maxLength={4}
          value={otpValue}
          onChange={setOtpValue}
          aria-label="One-time code"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
        <span data-testid="otp-display">{otpValue}</span>
      </section>

      {/* 9. Drawer */}
      <section data-testid="section-drawer">
        <h2 className="text-lg font-semibold mb-2">Drawer Family</h2>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open test drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drawer Title</DrawerTitle>
              <DrawerDescription>Drawer Description</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close drawer</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </section>

      {/* 10. Data Table */}
      <section data-testid="section-datatable">
        <h2 className="text-lg font-semibold mb-2">Data Table Family</h2>
        <DataTable columns={tableColumns} data={tableData} />
      </section>
    </div>
  )
}
