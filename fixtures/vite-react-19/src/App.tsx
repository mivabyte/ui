import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mivabyte/ui"

export function App() {
  const [accepted, setAccepted] = useState(false)

  return (
    <main className="mx-auto grid max-w-2xl gap-6 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Vite consumer probe</CardTitle>
          <CardDescription>
            Imports the packed @mivabyte/ui public API.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Mivabyte" />
          </div>
          <Select defaultValue="design">
            <SelectTrigger>
              <SelectValue placeholder="Select a discipline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
            </SelectContent>
          </Select>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={accepted}
              onCheckedChange={(value) => setAccepted(value === true)}
            />
            I accept the terms
          </label>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Vite works</DialogTitle>
                <DialogDescription>
                  The package also works in a Vite React consumer.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      <Accordion type="single" collapsible>
        <AccordionItem value="api">
          <AccordionTrigger>Does the public API resolve?</AccordionTrigger>
          <AccordionContent>Yes, from the packed tarball.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  )
}
