import { Button, Popover, PopoverContent, PopoverTrigger } from "@mivabyte/ui"

export function KeyboardTestbed() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open keyboard probe</Button>
      </PopoverTrigger>
      <PopoverContent>
        This fixture intentionally uses only the public shadcn/Radix API.
      </PopoverContent>
    </Popover>
  )
}
