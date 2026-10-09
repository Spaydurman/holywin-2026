import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ArrowDown, Mic2 } from 'lucide-react'

const speakers = [
  {
    number: '01',
    description: 'The first voice of the night is on the way. Their story and introduction will be shared here soon.',
  },
  {
    number: '02',
    description: 'Another voice will join the conversation. Check back for the second speaker announcement.',
  },
] as const

function Watch({ rotation, raysOpacity, flashOpacity, activeSpeaker }: {
  rotation: MotionValue<number>
  raysOpacity: MotionValue<number>
  flashOpacity: MotionValue<number>
  activeSpeaker: number | null
}) {
  return (
    <div className="relative grid w-[min(48dvh,450px)] max-w-[82vw] aspect-square place-items-center" aria-hidden="true">
      <motion.div
        className="pointer-events-none absolute -inset-[30%] rounded-full bg-[conic-gradient(from_20deg,transparent_0deg,#b7ff3c44_30deg,transparent_65deg,#b7ff3c33_115deg,transparent_155deg,#b7ff3c44_210deg,transparent_250deg,#b7ff3c33_305deg,transparent_345deg)] blur-2xl"
        style={{ opacity: raysOpacity, rotate: rotation }}
      />
      <motion.div className="absolute inset-0 rounded-full bg-[conic-gradient(#303437_0deg,#657861_40deg,#25282b_85deg,#323538_130deg,#7f9374_175deg,#26292c_220deg,#657861_265deg,#25282b_315deg,#303437_360deg)] p-[7%] shadow-[0_0_35px_#b7ff3c55]" style={{ rotate: rotation }}>
        <div className="absolute inset-[4%] rounded-full border-[clamp(5px,1vw,10px)] border-[#171a1d]" />
        <div className="absolute inset-[11%] rounded-full border-[clamp(4px,.8vw,8px)] border-[#798c75] bg-[#2b2d30] shadow-[inset_0_0_0_5px_#17191b]" />
        <div className="absolute inset-[17%] rounded-full border-2 border-[#15191b] bg-[#373a3d] shadow-[inset_0_0_18px_#070908]" />
        {['top-[8%] left-[8%]', 'top-[8%] right-[8%]', 'bottom-[8%] left-[8%]', 'bottom-[8%] right-[8%]'].map(position => (
          <span key={position} className={`absolute ${position} grid size-[13%] place-items-center rounded-full border-[clamp(3px,.7vw,7px)] border-[#17191a] bg-[#778572] shadow-[0_0_0_2px_#9fac94]`}>
            <span className="size-[65%] rounded-full bg-[#bdff38] shadow-[0_0_12px_4px_#b7ff3caa,inset_0_0_5px_#eaff9c]" />
          </span>
        ))}
      </motion.div>

      <AnimatePresence mode="wait" initial={false}>
        {activeSpeaker === null ? (
          <motion.div key="hourglass" className="absolute inset-[22%] grid place-items-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.75 }} transition={{ duration: 0.25 }}>
            <div className="absolute inset-[4%] bg-[repeating-linear-gradient(125deg,#a3f500_0_24px,#d6ff58_24px_42px)] [clip-path:polygon(17%_0,83%_0,55%_43%,55%_57%,83%_100%,17%_100%,45%_57%,45%_43%)]" />
          </motion.div>
        ) : (
          <motion.div key="speaker" className="absolute inset-[20%] grid place-items-center" initial={{ opacity: 0, scale: 0.78 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.78 }} transition={{ duration: 0.3 }}>
            <div className="absolute inset-0 bg-[#15191b] [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]" />
            <div className="absolute inset-[6%] bg-[#748b6b] [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]" />
            <div className="absolute inset-[10%] bg-[repeating-linear-gradient(125deg,#a4f600_0_24px,#dbff58_24px_43px)] [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]" />
            <div className="relative z-10 flex flex-col items-center text-[#101410]">
              <Mic2 className="size-[clamp(40px,9vw,96px)] stroke-[3]" />
              <span className="font-['Archivo_Black'] text-[clamp(28px,5vw,56px)] leading-none">{speakers[activeSpeaker].number}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div className="pointer-events-none absolute -inset-[14%] rounded-full bg-[radial-gradient(circle,#e5ff94_0%,#b7ff3caa_24%,transparent_65%)] blur-xl" style={{ opacity: flashOpacity }} />
    </div>
  )
}

function SpeakerCaption({ activeSpeaker }: { activeSpeaker: number | null }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={activeSpeaker ?? 'idle'}
        className="flex min-h-[110px] flex-col items-center justify-center text-center min-[761px]:min-h-[124px]"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -18 }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
      >
        {activeSpeaker === null ? (
          <>
            <span className="text-[11px] font-extrabold tracking-[.2em] text-[#b7ff3c]">THE REVEAL BEGINS</span>
            <p className="mt-2 flex items-center justify-center gap-2 font-['Archivo_Black'] text-lg text-white min-[761px]:text-2xl"><ArrowDown size={20} aria-hidden="true" /> SCROLL TO MEET THE SPEAKERS</p>
          </>
        ) : (
          <>
            <span className="text-[11px] font-extrabold tracking-[.2em] text-[#b7ff3c]">SPEAKER {speakers[activeSpeaker].number} / COMING SOON</span>
            <p className="mt-2 max-w-[560px] text-sm leading-relaxed text-[#e3e8df] min-[761px]:text-base">{speakers[activeSpeaker].description}</p>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default function Speaker() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeSpeaker, setActiveSpeaker] = useState<number | null>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const rotation = useTransform(scrollYProgress, [0, 0.12, 0.3, 0.5, 0.72, 1], [0, 0, 45, 45, 135, 135])
  const raysOpacity = useTransform(scrollYProgress, [0, 0.12, 0.25, 0.45, 0.6, 0.72, 1], [0.16, 0.16, 0.7, 0.3, 0.85, 0.4, 0.4])
  const flashOpacity = useTransform(scrollYProgress, [0, 0.16, 0.21, 0.28, 0.56, 0.62, 0.7, 1], [0, 0, 0.8, 0, 0, 0.85, 0, 0])

  useMotionValueEvent(scrollYProgress, 'change', latest => {
    setActiveSpeaker(latest < 0.2 ? null : latest < 0.62 ? 0 : 1)
  })

  return (
    <section
      id="speaker"
      ref={sectionRef}
      aria-labelledby="speaker-title"
      className={`relative scroll-mt-[30px] bg-[#111] text-white ${reducedMotion ? 'py-20' : 'h-[300dvh]'}`}
    >
      <div className={`${reducedMotion ? '' : 'sticky top-0 flex h-dvh flex-col overflow-hidden'} py-6 min-[761px]:py-9`}>
        <div className="container relative z-10 flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-extrabold tracking-[.18em] text-[#b7ff3c]">04 / THE VOICES OF HOLYWIN</span>
            <h2 id="speaker-title" className="mt-2 font-['Archivo_Black'] text-[clamp(27px,4vw,50px)] leading-none tracking-[-.06em]">MEET THE <span className="text-[#b7ff3c]">SPEAKERS.</span></h2>
          </div>
          {!reducedMotion && <span className="hidden items-center gap-2 pt-2 text-xs font-extrabold tracking-[.13em] text-[#d4d9cf] min-[761px]:inline-flex"><ArrowDown size={16} aria-hidden="true" /> SCROLL TO TRANSFORM</span>}
        </div>

        {reducedMotion ? (
          <div className="container mt-12 grid gap-6 min-[761px]:grid-cols-2">
            {speakers.map(speaker => (
              <div key={speaker.number} className="border border-[#b7ff3c]/45 bg-[#121b12] p-7">
                <Mic2 className="mb-6 size-12 text-[#b7ff3c]" aria-hidden="true" />
                <h3 className="font-['Archivo_Black'] text-2xl">SPEAKER {speaker.number}</h3>
                <p className="mt-2 text-sm font-extrabold tracking-[.14em] text-[#b7ff3c]">COMING SOON</p>
                <p className="mt-4 leading-relaxed text-[#e3e8df]">{speaker.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-[#111]">
              <Watch rotation={rotation} raysOpacity={raysOpacity} flashOpacity={flashOpacity} activeSpeaker={activeSpeaker} />
            </div>
            <div className="container relative z-10">
              <SpeakerCaption activeSpeaker={activeSpeaker} />
            </div>
          </>
        )}
      </div>
    </section>
  )
}
