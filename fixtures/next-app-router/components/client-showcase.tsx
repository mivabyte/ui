"use client"

import { useState } from "react"

import {
  Button,
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
  Switch,
} from "@mivabyte/ui"

export function ClientShowcase() {
  const [enabled, setEnabled] = useState(false)

  return (
    <section className="space-y-4 rounded-lg border p-6">
      <div>
        <h2 className="text-xl font-semibold">Client component probe</h2>
        <p className="text-muted-foreground">
          Radix interactions compile in a Client Component.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="fixture-name">Name</Label>
          <Input id="fixture-name" placeholder="Mivabyte" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="fixture-role">Role</Label>
          <Select defaultValue="designer">
            <SelectTrigger id="fixture-role">
              <SelectValue placeholder="Choose a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={enabled}
          onCheckedChange={setEnabled}
          id="fixture-switch"
        />
        <Label htmlFor="fixture-switch">Enable notifications</Label>
        <Checkbox
          checked={enabled}
          onCheckedChange={(checked) => setEnabled(checked === true)}
          aria-label="Notification confirmation"
        />
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Package interaction works</DialogTitle>
            <DialogDescription>
              This dialog originates from the packed package.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  )
}
