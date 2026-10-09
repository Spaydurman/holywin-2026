import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ArrowDown, Mic2 } from 'lucide-react'

const speakers = [
  {
    number: '01',
    label: 'FIRST SPEAKER',
    description: 'The first voice of the night is on the way. Their story and introduction will be shared here soon.',
  },
  {
    number: '02',
    label: 'SECOND SPEAKER',
    description: 'Another voice will join the conversation. Check back for the second speaker announcement.',
  },
] as const

function SpeakerDetails({ speaker }: { speaker: typeof speakers[number] }) {
  return (
    <div className="w-full max-w-[530px]">
      <span className="inline-flex items-center gap-3 border border-[#b7ff3c] px-3 py-2 text-[11px] font-extrabold tracking-[.18em] text-[#b7ff3c]">
        <span className="size-2 rotate-45 bg-[#b7ff3c]" aria-hidden="true" />
        {speaker.label}
      </span>
      <p className="mt-4 font-['Archivo_Black'] text-[clamp(64px,10vw,132px)] leading-[.82] tracking-[-.09em] text-[#b7ff3c]" aria-hidden="true">
        {speaker.number}
      </p>
      <h3 className="mt-4 font-['Archivo_Black'] text-[clamp(30px,4.4vw,56px)] leading-[.98] tracking-[-.055em] text-white">
        COMING SOON.
      </h3>
      <p className="mt-5 max-w-[440px] text-sm leading-relaxed text-[#d4d9cf] min-[761px]:text-lg">
        {speaker.description}
      </p>
    </div>
  )
}

function WatchFace({ rotation, activeSpeaker }: {
  rotation: MotionValue<number>
  activeSpeaker: number
}) {
  return (
    <div className="relative mx-auto grid aspect-square w-[min(47vw,400px)] min-w-[190px] max-w-[400px] place-items-center max-[760px]:w-[min(52vw,260px)]" aria-hidden="true">
      <div className="absolute inset-0 rounded-full border-[10px] border-[#30392e] bg-[#121b12] shadow-[0_0_0_3px_#799d55,0_0_42px_#b7ff3c33]" />
      <div className="absolute inset-[7%] rounded-full border border-[#b7ff3c]/55" />
      <div className="absolute inset-[12%] rounded-full border-[14px] border-[#1f2a1e] bg-[#080b08] shadow-[inset_0_0_0_2px_#b7ff3c77]" />
      <motion.div className="absolute inset-[19%]" style={{ rotate: rotation }}>
        {[0, 90, 180, 270].map(angle => (
          <span
            key={angle}
            className="absolute top-0 left-1/2 h-[27%] w-[14%] origin-[50%_185%] -translate-x-1/2 bg-[#b7ff3c] [clip-path:polygon(50%_0,100%_32%,68%_100%,32%_100%,0_32%)]"
            style={{ rotate: `${angle}deg` }}
          />
        ))}
        <div className="absolute inset-[26%] rotate-45 border-[5px] border-[#b7ff3c] bg-[#121b12] shadow-[0_0_28px_#b7ff3c77]" />
      </motion.div>
      <div className="absolute inset-[35%] grid place-items-center rounded-full border-[3px] border-[#b7ff3c] bg-[#080b08] shadow-[0_0_24px_#b7ff3c88]">
        <span className="font-['Archivo_Black'] text-[clamp(24px,5vw,48px)] text-[#b7ff3c]">{speakers[activeSpeaker].number}</span>
      </div>
      <span className="absolute -bottom-2 left-1/2 h-5 w-20 -translate-x-1/2 rounded-b-lg border border-[#44563c] bg-[#1b261a]" />
    </div>
  )
}

export default function Speaker() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeSpeaker, setActiveSpeaker] = useState(0)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const rotation = useTransform(scrollYProgress, [0, 0.34, 0.64, 1], [0, 0, 135, 135])

  useMotionValueEvent(scrollYProgress, 'change', latest => {
    setActiveSpeaker(latest >= 0.5 ? 1 : 0)
  })

  return (
    <section
      id="speaker"
      ref={sectionRef}
      aria-labelledby="speaker-title"
      className={`relative scroll-mt-[30px] bg-[#080b08] text-white ${reducedMotion ? 'py-20' : 'h-[240dvh]'}`}
    >
      <div className={`${reducedMotion ? '' : 'sticky top-0 flex h-dvh flex-col overflow-hidden'} py-8 min-[761px]:py-12`}>
        <div className="container relative z-10 flex items-start justify-between gap-4">
          <div>
            <span className="text-[11px] font-extrabold tracking-[.18em] text-[#b7ff3c]">04 / THE VOICES OF HOLYWIN</span>
            <h2 id="speaker-title" className="mt-2 font-['Archivo_Black'] text-[clamp(31px,5vw,64px)] leading-none tracking-[-.06em]">
              MEET THE <span className="text-[#b7ff3c]">SPEAKERS.</span>
            </h2>
          </div>
          {!reducedMotion && <span className="hidden items-center gap-2 pt-2 text-xs font-extrabold tracking-[.13em] text-[#d4d9cf] min-[761px]:inline-flex"><ArrowDown size={16} aria-hidden="true" /> SCROLL TO REVEAL</span>}
        </div>

        {reducedMotion ? (
          <div className="container mt-12 grid gap-12 min-[761px]:grid-cols-2">
            {speakers.map(speaker => <div key={speaker.number} className="border border-[#b7ff3c]/45 bg-[#121b12] p-6"><Mic2 className="mb-7 text-[#b7ff3c]" aria-hidden="true" /><SpeakerDetails speaker={speaker} /></div>)}
          </div>
        ) : (
          <div className="container relative grid min-h-0 flex-1 items-center gap-4 min-[761px]:grid-cols-[1fr_1fr] min-[761px]:gap-12">
            <WatchFace rotation={rotation} activeSpeaker={activeSpeaker} />
            <div className="relative min-h-[280px] max-[760px]:self-start min-[761px]:min-h-[420px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeSpeaker}
                  className="absolute inset-0 flex items-center"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <SpeakerDetails speaker={speakers[activeSpeaker]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {!reducedMotion && (
          <div className="container relative z-10">
            <div className="flex justify-between pb-3 text-[11px] font-extrabold tracking-[.14em] text-[#d4d9cf]"><span>01 / FIRST REVEAL</span><span>02 / NEXT REVEAL</span></div>
            <div className="h-1 overflow-hidden bg-[#394636]"><motion.div className="h-full origin-left bg-[#b7ff3c]" style={{ scaleX: scrollYProgress }} /></div>
          </div>
        )}
      </div>
    </section>
  )
}
