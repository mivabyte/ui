"use client"

import * as React from "react"
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export interface MediaPlayerLabels {
  play: string
  pause: string
  mute: string
  unmute: string
  seek: string
  volume: string
  enterFullscreen: string
  exitFullscreen: string
  playbackError: string
  mediaError: string
  fullscreenError: string
}

export interface MediaPlayerProps extends Omit<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  "controls"
> {
  /** Pauses outside the viewport and in hidden tabs; never resumes automatically. */
  pauseWhenOutOfView?: boolean
  showFullscreen?: boolean
  /** Applied to the video; className styles the player surface. */
  videoClassName?: string
  labels?: Partial<MediaPlayerLabels>
}

const defaultLabels: MediaPlayerLabels = {
  play: "Play",
  pause: "Pause",
  mute: "Mute",
  unmute: "Unmute",
  seek: "Playback position",
  volume: "Volume",
  enterFullscreen: "Enter fullscreen",
  exitFullscreen: "Exit fullscreen",
  playbackError: "Playback could not start. Try pressing play again.",
  mediaError: "This video could not be loaded.",
  fullscreenError: "Fullscreen is unavailable. Try opening the video again.",
}

type WebKitVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void
  webkitExitFullscreen?: () => void
  webkitDisplayingFullscreen?: boolean
}

function formatTime(value: number) {
  const seconds = Math.floor(Number.isFinite(value) ? Math.max(0, value) : 0)
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainder = String(seconds % 60).padStart(2, "0")
  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${remainder}`
    : `${minutes}:${remainder}`
}

const MediaPlayer = React.forwardRef<HTMLVideoElement, MediaPlayerProps>(
  (
    {
      className,
      videoClassName,
      pauseWhenOutOfView = true,
      showFullscreen = true,
      labels: labelOverrides,
      preload = "metadata",
      playsInline = true,
      "aria-label": ariaLabel = "Video player",
      ...props
    },
    forwardedRef
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const videoRef = React.useRef<WebKitVideo>(null)
    const visibleRef = React.useRef(true)
    const lastVolumeRef = React.useRef(1)
    const [media, setMedia] = React.useState({
      playing: false,
      currentTime: 0,
      duration: 0,
      muted: Boolean(props.muted),
      volume: 1,
    })
    const [fullscreen, setFullscreen] = React.useState(false)
    const [canFullscreen, setCanFullscreen] = React.useState(false)
    const [error, setError] = React.useState<
      "playbackError" | "mediaError" | "fullscreenError" | null
    >(null)
    const labels = { ...defaultLabels, ...labelOverrides }

    React.useImperativeHandle(forwardedRef, () => videoRef.current!, [])

    // Native events are the source of truth, including changes through the ref
    // or the browser's media controls. Consumer event handlers stay intact.
    React.useEffect(() => {
      const video = videoRef.current!
      const sync = () => {
        setMedia({
          playing: !video.paused && !video.ended,
          currentTime: Number.isFinite(video.currentTime)
            ? video.currentTime
            : 0,
          duration: Number.isFinite(video.duration) ? video.duration : 0,
          muted: video.muted,
          volume: video.volume,
        })
        if (video.volume > 0) lastVolumeRef.current = video.volume
      }
      const clearError = () => setError(null)
      const mediaError = () => setError("mediaError")
      const events = [
        "play",
        "pause",
        "ended",
        "timeupdate",
        "loadedmetadata",
        "durationchange",
        "volumechange",
        "emptied",
        "loadstart",
        "error",
      ]
      events.forEach((event) => video.addEventListener(event, sync))
      video.addEventListener("loadstart", clearError)
      video.addEventListener("emptied", clearError)
      video.addEventListener("playing", clearError)
      video.addEventListener("error", mediaError)
      sync()
      return () => {
        events.forEach((event) => video.removeEventListener(event, sync))
        video.removeEventListener("loadstart", clearError)
        video.removeEventListener("emptied", clearError)
        video.removeEventListener("playing", clearError)
        video.removeEventListener("error", mediaError)
        video.pause()
      }
    }, [])

    React.useEffect(() => {
      const video = videoRef.current!
      const container = containerRef.current!
      const doc = video.ownerDocument
      const isFullscreen = () =>
        doc.fullscreenElement === container ||
        Boolean(video.webkitDisplayingFullscreen)
      const pauseIfHidden = () => {
        if (
          pauseWhenOutOfView &&
          (doc.hidden || (!visibleRef.current && !isFullscreen()))
        )
          video.pause()
      }
      const syncFullscreen = () => {
        setFullscreen(isFullscreen())
        pauseIfHidden()
      }
      setCanFullscreen(
        (typeof container.requestFullscreen === "function" &&
          doc.fullscreenEnabled !== false) ||
          typeof video.webkitEnterFullscreen === "function"
      )
      const observer =
        typeof IntersectionObserver === "undefined"
          ? undefined
          : new IntersectionObserver(
              (entries) => {
                for (const entry of entries) {
                  visibleRef.current =
                    entry.isIntersecting && entry.intersectionRatio > 0
                }
                pauseIfHidden()
              },
              { threshold: [0, 0.001] }
            )
      // Observe the video itself: a still-visible control bar must not keep it playing.
      observer?.observe(video)
      video.addEventListener("play", pauseIfHidden)
      video.addEventListener("webkitbeginfullscreen", syncFullscreen)
      video.addEventListener("webkitendfullscreen", syncFullscreen)
      doc.addEventListener("fullscreenchange", syncFullscreen)
      doc.addEventListener("visibilitychange", pauseIfHidden)
      pauseIfHidden()
      return () => {
        observer?.disconnect()
        video.removeEventListener("play", pauseIfHidden)
        video.removeEventListener("webkitbeginfullscreen", syncFullscreen)
        video.removeEventListener("webkitendfullscreen", syncFullscreen)
        doc.removeEventListener("fullscreenchange", syncFullscreen)
        doc.removeEventListener("visibilitychange", pauseIfHidden)
      }
    }, [pauseWhenOutOfView])

    const togglePlayback = async () => {
      const video = videoRef.current!
      setError(null)
      if (!video.paused) {
        video.pause()
        return
      }
      try {
        await video.play()
      } catch (cause) {
        // Scrolling away while play() is pending can intentionally abort it.
        if (!(cause instanceof DOMException && cause.name === "AbortError")) {
          setError("playbackError")
        }
      }
    }

    const toggleMute = () => {
      const video = videoRef.current!
      if (video.muted || video.volume === 0) {
        if (video.volume === 0) video.volume = lastVolumeRef.current
        video.muted = false
      } else {
        video.muted = true
      }
      setMedia((previous) => ({
        ...previous,
        muted: video.muted,
        volume: video.volume,
      }))
    }

    const toggleFullscreen = async () => {
      const video = videoRef.current!
      const container = containerRef.current!
      const doc = video.ownerDocument
      setError(null)
      try {
        if (doc.fullscreenElement === container) {
          await doc.exitFullscreen()
        } else if (video.webkitDisplayingFullscreen) {
          video.webkitExitFullscreen?.()
        } else if (
          container.requestFullscreen &&
          doc.fullscreenEnabled !== false
        ) {
          await container.requestFullscreen()
        } else {
          video.webkitEnterFullscreen?.()
        }
      } catch {
        setError("fullscreenError")
      }
    }

    const silent = media.muted || media.volume === 0
    const canSeek = media.duration > 0
    const position = Math.max(0, Math.min(media.currentTime, media.duration))

    return (
      <div
        ref={containerRef}
        data-slot="media-player"
        data-playing={media.playing}
        data-error={Boolean(error)}
        role="group"
        aria-label={ariaLabel}
        className={cn(
          "ui-media-player group/media-player relative isolate aspect-video w-full min-w-0 overflow-hidden rounded-[var(--shape-panel)] border border-border bg-background text-foreground shadow-surface fullscreen:flex fullscreen:items-center fullscreen:rounded-none fullscreen:border-0",
          className
        )}
      >
        <video
          {...props}
          ref={videoRef}
          data-slot="media-player-video"
          aria-label={ariaLabel}
          preload={preload}
          playsInline={playsInline}
          controls={false}
          onClick={(event) => {
            props.onClick?.(event)
            if (!event.defaultPrevented) void togglePlayback()
          }}
          className={cn(
            "block aspect-video max-h-full w-full bg-background object-contain",
            videoClassName
          )}
        />
        <button
          data-slot="media-player-play"
          type="button"
          className="absolute inset-0 cursor-pointer rounded-[inherit] border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring"
          aria-label={`${media.playing ? labels.pause : labels.play} ${ariaLabel}`}
          onClick={() => videoRef.current!.click()}
        >
          {!media.playing && (
            <span
              aria-hidden="true"
              className={cn(
                buttonVariants({ variant: "primary", size: "icon-lg" }),
                "pointer-events-none absolute start-1/2 top-1/3 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-overlay sm:top-1/2 [&_svg]:size-5"
              )}
            >
              <Play className="translate-x-px fill-current" />
            </span>
          )}
        </button>
        <div
          data-slot="media-player-controls"
          className="dark absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-background via-background/95 to-background/0 px-3 pt-6 pb-2 text-foreground sm:px-4"
        >
          <Slider
            className="ui-focus h-6 [&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-track]]:bg-foreground/20 [&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:size-2.5 [&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-thumb]]:bg-primary [&_[data-slot=slider-thumb]]:opacity-0 hover:[&_[data-slot=slider-thumb]]:opacity-100 focus-within:[&_[data-slot=slider-thumb]]:opacity-100 pointer-coarse:[&_[data-slot=slider-thumb]]:opacity-100"
            aria-label={labels.seek}
            aria-valuetext={`${formatTime(position)} / ${formatTime(media.duration)}`}
            min={0}
            max={canSeek ? media.duration : 1}
            step={0.1}
            value={[position]}
            disabled={!canSeek}
            onValueChange={([value]) => {
              videoRef.current!.currentTime = value
              setMedia((previous) => ({ ...previous, currentTime: value }))
            }}
          />
          <div className="flex min-w-0 items-center gap-0.5">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-10 pointer-coarse:size-11 [&_svg]:size-[18px]"
              aria-label={media.playing ? labels.pause : labels.play}
              title={media.playing ? labels.pause : labels.play}
              onClick={togglePlayback}
            >
              {media.playing ? (
                <Pause aria-hidden="true" />
              ) : (
                <Play
                  aria-hidden="true"
                  className="translate-x-px fill-current"
                />
              )}
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-10 pointer-coarse:size-11 [&_svg]:size-[18px]"
              aria-label={silent ? labels.unmute : labels.mute}
              title={silent ? labels.unmute : labels.mute}
              onClick={toggleMute}
            >
              {silent ? (
                <VolumeX aria-hidden="true" />
              ) : (
                <Volume2 aria-hidden="true" />
              )}
            </Button>
            <Slider
              className="ui-focus h-10 w-12 px-1 sm:w-20 [&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-track]]:bg-foreground/20 [&_[data-slot=slider-range]]:bg-foreground/80 [&_[data-slot=slider-thumb]]:size-6 [&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-thumb]]:bg-transparent [&_[data-slot=slider-thumb]]:after:absolute [&_[data-slot=slider-thumb]]:after:inset-[7px] [&_[data-slot=slider-thumb]]:after:rounded-full [&_[data-slot=slider-thumb]]:after:bg-foreground"
              aria-label={labels.volume}
              aria-valuetext={`${Math.round((silent ? 0 : media.volume) * 100)}%`}
              min={0}
              max={1}
              step={0.01}
              value={[silent ? 0 : media.volume]}
              onValueChange={([value]) => {
                const video = videoRef.current!
                video.volume = value
                video.muted = value === 0
                setMedia((previous) => ({
                  ...previous,
                  volume: video.volume,
                  muted: video.muted,
                }))
              }}
            />
            <span
              dir="ltr"
              className="ms-2 shrink-0 text-xs leading-none tabular-nums"
            >
              <span className="font-medium">
                {formatTime(media.currentTime)}
              </span>
              <span className="px-1.5 text-muted-foreground">/</span>
              <span className="text-muted-foreground">
                {formatTime(media.duration)}
              </span>
            </span>
            {showFullscreen && canFullscreen && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="ms-auto size-10 pointer-coarse:size-11 [&_svg]:size-[18px]"
                aria-label={
                  fullscreen ? labels.exitFullscreen : labels.enterFullscreen
                }
                title={
                  fullscreen ? labels.exitFullscreen : labels.enterFullscreen
                }
                onClick={toggleFullscreen}
              >
                {fullscreen ? (
                  <Minimize aria-hidden="true" />
                ) : (
                  <Maximize aria-hidden="true" />
                )}
              </Button>
            )}
          </div>
          {error && (
            <p role="alert" className="py-1 text-sm text-destructive">
              {labels[error]}
            </p>
          )}
        </div>
      </div>
    )
  }
)
MediaPlayer.displayName = "MediaPlayer"

export { MediaPlayer }
