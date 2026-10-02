import * as React from "react"

/**
 * Merges an explicitly rendered child element into a Radix `asChild` slot.
 *
 * Both `dialog` and `sheet` expose trigger/close primitives that accept an
 * optional `render` element in addition to ordinary children. When it is
 * present the primitive switches to Radix's `asChild` mode so the caller keeps
 * full control of the trigger's markup and props.
 *
 * Two rules apply, and both are load-bearing:
 *
 * 1. The element's own children win over the `children` prop. A caller that
 *    writes `<DialogTrigger render={<a href="/x">Open</a>}>ignored</DialogTrigger>`
 *    gets "Open"; falling back to `children` only when the element has none.
 * 2. `cloneElement` receives `undefined` as props so the rendered element keeps
 *    the attributes it was authored with. Passing `props` here would silently
 *    overwrite them.
 *
 * Not a React element (a string or fragment) is returned untouched, which
 * matches how Radix itself treats invalid `asChild` values.
 */
export function mergeRenderedChild(
  render: React.ReactElement,
  children: React.ReactNode
): React.ReactNode {
  if (!React.isValidElement(render)) return render

  return React.cloneElement(
    render,
    undefined,
    (render.props as { children?: React.ReactNode }).children ?? children
  )
}
