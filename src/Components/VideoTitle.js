import React from 'react'

const VideoTitle = ({ title, overview }) => {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex aspect-video items-end bg-gradient-to-r from-black/80 via-black/25 to-transparent pb-[18%] pl-6 pr-6 pt-[28%] text-white sm:items-center sm:pb-[22%] sm:pl-12 md:pl-24 md:pb-[20%]">
      <div className="pointer-events-auto max-w-2xl animate-fade-in-up space-y-4 drop-shadow-lg">
       <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
        {title}
       </h1>
       <p className="line-clamp-3 text-sm leading-relaxed text-neutral-200 sm:text-base md:line-clamp-4 md:text-lg md:max-w-xl">
        {overview}
       </p>
       <div className="flex flex-wrap gap-3 pt-2">
         <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-black shadow-card transition-all duration-200 ease-out-expo hover:bg-neutral-200 active:scale-[0.98] sm:px-8 sm:py-3 sm:text-base"
         >
          <span className="text-lg leading-none" aria-hidden>▶</span>
          Play
         </button>
         <button
          type="button"
          className="rounded-md border border-white/35 bg-white/15 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 ease-out-expo hover:border-white/50 hover:bg-white/25 active:scale-[0.98] sm:px-8 sm:py-3 sm:text-base"
         >
          More info
         </button>
       </div>
      </div>
    </div>
  )
}

export default VideoTitle
