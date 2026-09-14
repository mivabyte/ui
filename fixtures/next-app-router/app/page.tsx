import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@mivama-digital/ui"

import { ClientShowcase } from "../components/client-showcase"

export default function Page() {
  return (
    <main className="mx-auto grid max-w-3xl gap-6 p-8">
      <header className="space-y-2">
        <Badge>shadcn/Radix distribution</Badge>
        <h1 className="text-3xl font-bold tracking-tight">
          Mivabyte UI consumer probe
        </h1>
        <p className="text-muted-foreground">
          This app imports the packed package through its public exports.
        </p>
      </header>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Server-safe composition</CardTitle>
          <CardDescription>
            Static UI imported from the package root.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>Package CSS loaded</AlertTitle>
            <AlertDescription>
              The Next App Router fixture imports{" "}
              <code>@mivama-digital/ui/styles.css</code>.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      <Accordion type="single" collapsible>
        <AccordionItem value="exports">
          <AccordionTrigger>Are subpath exports available?</AccordionTrigger>
          <AccordionContent>
            Yes — they are checked independently during packing.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <ClientShowcase />
    </main>
  )
}
