import * as React from "react"
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { MediaPlayer } from "@/components/ui/media-player"

let intersect: IntersectionObserverCallback
const disconnect = vi.fn()
const observe = vi.fn()
let nativePaused = true
let nativeEnded = false
let nativeVolume = 1
let nativeMuted = false
let nativeFullscreen: Element | null = null
let hidden = false

function notifyIntersection(visible: boolean, ratio = visible ? 1 : 0) {
  act(() =>
    intersect(
      [
        {
          isIntersecting: visible,
          intersectionRatio: ratio,
        } as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver
    )
  )
}

function video() {
  return document.querySelector("video")!
}

beforeEach(() => {
  nativePaused = true
  nativeEnded = false
  nativeVolume = 1
  nativeMuted = false
  nativeFullscreen = null
  hidden = false
  disconnect.mockClear()
  observe.mockClear()
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersect = callback
      }
      observe = observe
      disconnect = disconnect
    }
  )
  vi.spyOn(HTMLMediaElement.prototype, "paused", "get").mockImplementation(
    () => nativePaused
  )
  vi.spyOn(HTMLMediaElement.prototype, "ended", "get").mockImplementation(
    () => nativeEnded
  )
  vi.spyOn(HTMLMediaElement.prototype, "volume", "get").mockImplementation(
    () => nativeVolume
  )
  vi.spyOn(HTMLMediaElement.prototype, "volume", "set").mockImplementation(
    function (value) {
      nativeVolume = value
      this.dispatchEvent(new Event("volumechange"))
    }
  )
  vi.spyOn(HTMLMediaElement.prototype, "muted", "get").mockImplementation(
    () => nativeMuted
  )
  vi.spyOn(HTMLMediaElement.prototype, "muted", "set").mockImplementation(
    function (value) {
      nativeMuted = value
      this.dispatchEvent(new Event("volumechange"))
    }
  )
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(
    async function () {
      nativePaused = false
      this.dispatchEvent(new Event("play"))
      this.dispatchEvent(new Event("playing"))
    }
  )
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function () {
    nativePaused = true
    this.dispatchEvent(new Event("pause"))
  })
  vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden)
  Object.defineProperty(document, "fullscreenEnabled", {
    configurable: true,
    value: true,
  })
  Object.defineProperty(document, "fullscreenElement", {
    configurable: true,
    get: () => nativeFullscreen,
  })
  Object.defineProperty(HTMLElement.prototype, "requestFullscreen", {
    configurable: true,
    value: vi.fn(async function () {
      nativeFullscreen = this
      document.dispatchEvent(new Event("fullscreenchange"))
    }),
  })
  Object.defineProperty(document, "exitFullscreen", {
    configurable: true,
    value: vi.fn(async () => {
      nativeFullscreen = null
      document.dispatchEvent(new Event("fullscreenchange"))
    }),
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  delete (HTMLElement.prototype as Partial<HTMLElement>).requestFullscreen
  delete (document as Partial<Document>).fullscreenEnabled
  delete (document as Partial<Document>).fullscreenElement
  delete (document as Partial<Document>).exitFullscreen
})

describe("MediaPlayer", () => {
  it("toggles playback from the video surface and respects consumer click cancellation", () => {
    const onClick = vi.fn()
    const { rerender } = render(<MediaPlayer onClick={onClick} />)
    fireEvent.click(screen.getByRole("button", { name: "Play Video player" }))
    expect(video().paused).toBe(false)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClick.mock.calls[0][0].target).toBe(video())
    fireEvent.click(screen.getByRole("button", { name: "Pause Video player" }))
    expect(video().paused).toBe(true)
    expect(onClick).toHaveBeenCalledTimes(2)
    rerender(<MediaPlayer onClick={(event) => event.preventDefault()} />)
    fireEvent.click(video())
    expect(video().paused).toBe(true)
    expect(video().play).toHaveBeenCalledTimes(1)
  })

  it("forwards video props, callbacks, ref and source/track children", () => {
    const ref = React.createRef<HTMLVideoElement>()
    const onPlay = vi.fn()
    const onTimeUpdate = vi.fn()
    render(
      <MediaPlayer
        ref={ref}
        poster="poster.jpg"
        className="surface"
        videoClassName="video"
        aria-label="Overview"
        onPlay={onPlay}
        onTimeUpdate={onTimeUpdate}
      >
        <source src="movie.mp4" type="video/mp4" />
        <track kind="captions" src="captions.vtt" srcLang="en" default />
      </MediaPlayer>
    )
    expect(ref.current).toBe(video())
    expect(video()).toHaveAttribute("poster", "poster.jpg")
    expect(video()).toHaveAttribute("preload", "metadata")
    expect(video()).toHaveAttribute("playsinline")
    expect(video()).not.toHaveAttribute("controls")
    expect(video()).toHaveClass("video")
    expect(screen.getByRole("group", { name: "Overview" })).toHaveClass(
      "surface"
    )
    expect(video().querySelector("source")).toHaveAttribute("src", "movie.mp4")
    expect(video().querySelector("track")).toHaveAttribute("default")
    fireEvent.play(video())
    fireEvent.timeUpdate(video())
    expect(onPlay).toHaveBeenCalledTimes(1)
    expect(onTimeUpdate).toHaveBeenCalledTimes(1)
    expect(observe).toHaveBeenCalledWith(video())
  })

  it("plays, pauses and follows native ended and external playback events", async () => {
    render(<MediaPlayer src="movie.mp4" />)
    fireEvent.click(screen.getByRole("button", { name: "Play", exact: true }))
    await screen.findByRole("button", { name: "Pause", exact: true })
    expect(video().play).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole("button", { name: "Pause", exact: true }))
    expect(
      screen.getByRole("button", { name: "Play", exact: true })
    ).toBeVisible()
    act(() => {
      nativePaused = false
      fireEvent.play(video())
    })
    expect(
      screen.getByRole("button", { name: "Pause", exact: true })
    ).toBeVisible()
    act(() => {
      nativeEnded = true
      fireEvent.ended(video())
    })
    expect(
      screen.getByRole("button", { name: "Play", exact: true })
    ).toBeVisible()
  })

  it("pauses outside the viewport, preserves position and does not restart on return", async () => {
    render(<MediaPlayer />)
    const element = video()
    element.currentTime = 12
    fireEvent.click(screen.getByRole("button", { name: "Play", exact: true }))
    await screen.findByRole("button", { name: "Pause", exact: true })
    notifyIntersection(true, 0.2)
    expect(element.paused).toBe(false)
    notifyIntersection(false)
    expect(element.paused).toBe(true)
    expect(element.currentTime).toBe(12)
    notifyIntersection(true)
    expect(element.play).toHaveBeenCalledTimes(1)
    // Ref-based and autoplay attempts while outside are paused too.
    notifyIntersection(true, 0)
    await act(() => element.play())
    expect(element.paused).toBe(true)
  })

  it("pauses on hidden tabs and cleans up observers and media on unmount", async () => {
    const { unmount } = render(<MediaPlayer />)
    const element = video()
    await act(() => element.play())
    act(() => {
      hidden = true
      document.dispatchEvent(new Event("visibilitychange"))
    })
    expect(element.paused).toBe(true)
    act(() => {
      hidden = false
      document.dispatchEvent(new Event("visibilitychange"))
    })
    expect(element.play).toHaveBeenCalledTimes(1)
    await act(() => element.play())
    unmount()
    expect(element.paused).toBe(true)
    expect(disconnect).toHaveBeenCalledTimes(1)
  })

  it("supports opting out of automatic pausing and browsers without IntersectionObserver", async () => {
    vi.stubGlobal("IntersectionObserver", undefined)
    const { rerender } = render(<MediaPlayer pauseWhenOutOfView={false} />)
    await act(() => video().play())
    act(() => {
      hidden = true
      document.dispatchEvent(new Event("visibilitychange"))
    })
    expect(video().paused).toBe(false)
    rerender(<MediaPlayer />)
    expect(video().paused).toBe(true)
  })

  it("shows rejected playback and media errors and ignores intentional play aborts", async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(
      new DOMException("Blocked", "NotAllowedError")
    )
    render(<MediaPlayer />)
    fireEvent.click(screen.getByRole("button", { name: "Play", exact: true }))
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Playback could not start"
    )
    expect(
      screen.getByRole("button", { name: "Play", exact: true })
    ).toBeVisible()
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(
      new DOMException("Interrupted", "AbortError")
    )
    fireEvent.click(screen.getByRole("button", { name: "Play", exact: true }))
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull())
    fireEvent.error(video())
    expect(screen.getByRole("alert")).toHaveTextContent("could not be loaded")
    fireEvent.loadStart(video())
    expect(screen.queryByRole("alert")).toBeNull()
    fireEvent.error(video())
    fireEvent.emptied(video())
    expect(screen.queryByRole("alert")).toBeNull()
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(
      new Error("Failed")
    )
    fireEvent.click(screen.getByRole("button", { name: "Play", exact: true }))
    await screen.findByRole("alert")
    fireEvent.playing(video())
    expect(screen.queryByRole("alert")).toBeNull()
  })

  it("mutes, unmutes, changes volume with the keyboard and restores zero volume", () => {
    render(<MediaPlayer />)
    fireEvent.click(screen.getByRole("button", { name: "Mute", exact: true }))
    expect(video().muted).toBe(true)
    expect(screen.getByRole("slider", { name: "Volume" })).toHaveAttribute(
      "aria-valuenow",
      "0"
    )
    fireEvent.click(screen.getByRole("button", { name: "Unmute", exact: true }))
    expect(video().muted).toBe(false)
    fireEvent.keyDown(screen.getByRole("slider", { name: "Volume" }), {
      key: "ArrowLeft",
    })
    expect(video().volume).toBeCloseTo(0.99)
    expect(screen.getByRole("slider", { name: "Volume" })).toHaveAttribute(
      "aria-valuetext",
      "99%"
    )
    fireEvent.keyDown(screen.getByRole("slider", { name: "Volume" }), {
      key: "Home",
    })
    expect(video().volume).toBe(0)
    expect(video().muted).toBe(true)
    fireEvent.click(screen.getByRole("button", { name: "Unmute", exact: true }))
    expect(video().volume).toBeCloseTo(0.99)
    expect(video().muted).toBe(false)
    fireEvent.click(screen.getByRole("button", { name: "Mute", exact: true }))
    fireEvent.keyDown(screen.getByRole("slider", { name: "Volume" }), {
      key: "ArrowRight",
    })
    expect(video().muted).toBe(false)
  })

  it("disables unknown/live seeking, syncs duration and seeks with keyboard", () => {
    render(<MediaPlayer />)
    const seek = screen.getByRole("slider", { name: "Playback position" })
    expect(seek).toHaveAttribute("data-disabled")
    Object.defineProperty(video(), "duration", {
      configurable: true,
      value: 120,
    })
    fireEvent.loadedMetadata(video())
    expect(seek).not.toHaveAttribute("data-disabled")
    fireEvent.keyDown(seek, { key: "ArrowRight" })
    expect(video().currentTime).toBeCloseTo(0.1)
    fireEvent.keyDown(seek, { key: "End" })
    expect(video().currentTime).toBeGreaterThan(119.9)
    expect(video().currentTime).toBeLessThan(120)
    fireEvent.keyDown(seek, { key: "Home" })
    expect(video().currentTime).toBe(0)
    video().currentTime = 30
    fireEvent.timeUpdate(video())
    expect(seek).toHaveAttribute("aria-valuenow", "30")
    expect(seek).toHaveAttribute("aria-valuetext", "0:30 / 2:00")
    Object.defineProperty(video(), "duration", {
      configurable: true,
      value: 3661,
    })
    video().currentTime = 3601
    fireEvent.durationChange(video())
    expect(seek).toHaveAttribute("aria-valuetext", "1:00:01 / 1:01:01")
    Object.defineProperty(video(), "duration", {
      configurable: true,
      value: Infinity,
    })
    Object.defineProperty(video(), "currentTime", {
      configurable: true,
      value: NaN,
    })
    fireEvent.durationChange(video())
    expect(seek).toHaveAttribute("data-disabled")
    expect(seek).toHaveAttribute("aria-valuetext", "0:00 / 0:00")
  })

  it("enters/exits native fullscreen and handles Escape, hidden video and failures", async () => {
    render(<MediaPlayer />)
    fireEvent.click(screen.getByRole("button", { name: "Enter fullscreen" }))
    await screen.findByRole("button", { name: "Exit fullscreen" })
    expect(nativeFullscreen).toBe(
      screen.getByRole("group", { name: "Video player" })
    )
    await act(() => video().play())
    notifyIntersection(false)
    expect(video().paused).toBe(false)
    fireEvent.click(screen.getByRole("button", { name: "Exit fullscreen" }))
    await screen.findByRole("button", { name: "Enter fullscreen" })
    expect(video().paused).toBe(true)
    notifyIntersection(true)
    fireEvent.click(screen.getByRole("button", { name: "Enter fullscreen" }))
    await screen.findByRole("button", { name: "Exit fullscreen" })
    act(() => {
      nativeFullscreen = null
      document.dispatchEvent(new Event("fullscreenchange"))
    })
    expect(
      screen.getByRole("button", { name: "Enter fullscreen" })
    ).toBeVisible()
    vi.mocked(HTMLElement.prototype.requestFullscreen).mockRejectedValueOnce(
      new Error("Denied")
    )
    fireEvent.click(screen.getByRole("button", { name: "Enter fullscreen" }))
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Fullscreen is unavailable"
    )
  })

  it("hides unsupported/disabled fullscreen and supports native Safari fullscreen", async () => {
    Object.defineProperty(document, "fullscreenEnabled", {
      configurable: true,
      value: false,
    })
    const { unmount } = render(<MediaPlayer />)
    expect(
      screen.queryByRole("button", { name: "Enter fullscreen" })
    ).toBeNull()
    unmount()
    let webkitFullscreen = false
    Object.defineProperty(
      HTMLVideoElement.prototype,
      "webkitDisplayingFullscreen",
      { configurable: true, get: () => webkitFullscreen }
    )
    Object.defineProperty(HTMLVideoElement.prototype, "webkitEnterFullscreen", {
      configurable: true,
      value: vi.fn(function () {
        webkitFullscreen = true
        this.dispatchEvent(new Event("webkitbeginfullscreen"))
      }),
    })
    Object.defineProperty(HTMLVideoElement.prototype, "webkitExitFullscreen", {
      configurable: true,
      value: vi.fn(function () {
        webkitFullscreen = false
        this.dispatchEvent(new Event("webkitendfullscreen"))
      }),
    })
    try {
      const { rerender } = render(<MediaPlayer />)
      fireEvent.click(screen.getByRole("button", { name: "Enter fullscreen" }))
      await screen.findByRole("button", { name: "Exit fullscreen" })
      fireEvent.click(screen.getByRole("button", { name: "Exit fullscreen" }))
      await screen.findByRole("button", { name: "Enter fullscreen" })
      rerender(<MediaPlayer showFullscreen={false} />)
      expect(
        screen.queryByRole("button", { name: "Enter fullscreen" })
      ).toBeNull()
    } finally {
      for (const key of [
        "webkitDisplayingFullscreen",
        "webkitEnterFullscreen",
        "webkitExitFullscreen",
      ]) {
        delete (
          HTMLVideoElement.prototype as unknown as Record<string, unknown>
        )[key]
      }
    }
  })

  it("localizes controls and error messages", () => {
    render(
      <MediaPlayer
        muted
        labels={{
          play: "Abspielen",
          seek: "Position",
          mediaError: "Video fehlt",
        }}
      />
    )
    expect(screen.getByRole("button", { name: "Abspielen" })).toBeVisible()
    expect(screen.getByRole("slider", { name: "Position" })).toBeVisible()
    fireEvent.error(video())
    expect(screen.getByRole("alert")).toHaveTextContent("Video fehlt")
  })
})
