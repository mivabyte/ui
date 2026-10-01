import type { Meta, StoryObj } from "@storybook/react-vite"
import { useForm } from "react-hook-form"

import { Button } from "../src/components/ui/button.js"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../src/components/ui/form.js"
import { Input } from "../src/components/ui/input.js"

const meta = {
  title: "Forms/Form",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Composes form primitives with react-hook-form field state, ids and validation messages.",
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

type ProfileValues = {
  username: string
  email: string
}

function ProfileForm({ withMessage }: { withMessage?: boolean }) {
  const form = useForm<ProfileValues>({
    defaultValues: { username: "", email: "" },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          // eslint-disable-next-line no-console
          console.log("submitted", values)
        })}
        className="grid w-80 gap-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="ada-lovelace" {...field} />
              </FormControl>
              {withMessage ? (
                <FormDescription>
                  This is your public display name.
                </FormDescription>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="ada@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-fit">
          Save profile
        </Button>
      </form>
    </Form>
  )
}

export const Basic: Story = {
  render: () => <ProfileForm />,
}

export const WithDescription: Story = {
  render: () => <ProfileForm withMessage />,
}
