import { expect, type Page } from "@playwright/test"
import axe from "axe-core"

type AxeViolationSummary = {
  id: string
  impact: string | null
  help: string
  targets: string[][]
}

type AxeViolation = Omit<AxeViolationSummary, "targets"> & {
  nodes: Array<{ target: string[] }>
}

const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]

export async function expectNoAxeViolations(page: Page) {
  const alreadyInjected = await page.evaluate(
    () => typeof (window as any).__axeInjected !== "undefined"
  )
  if (!alreadyInjected) {
    await page.addScriptTag({ content: axe.source })
    await page.evaluate(() => {
      ;(window as any).__axeInjected = true
    })
  }

  const violations = await page.evaluate(async (tags) => {
    const runtime = (
      window as typeof window & {
        axe: {
          run: (
            context: Document,
            options: {
              runOnly: { type: "tag"; values: string[] }
              resultTypes: ["violations"]
            }
          ) => Promise<{ violations: AxeViolation[] }>
        }
      }
    ).axe

    let result: { violations: AxeViolation[] } | null = null
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        result = await runtime.run(document, {
          runOnly: { type: "tag", values: tags },
          resultTypes: ["violations"],
        })
        break
      } catch (err: any) {
        if (
          err &&
          typeof err.message === "string" &&
          err.message.includes("Axe is already running") &&
          attempt < 4
        ) {
          await new Promise((resolve) => setTimeout(resolve, 250))
          continue
        }
        throw err
      }
    }

    if (!result) {
      throw new Error("Axe failed to produce results after retries")
    }

    return result.violations.map(({ id, impact, help, nodes }) => ({
      id,
      impact,
      help,
      targets: nodes.map((node) => node.target),
    }))
  }, wcagTags)

  expect(
    violations,
    `Browser accessibility violations:\n${JSON.stringify(violations, null, 2)}`
  ).toEqual([])
}
