/** The supplied PNGs are sprite sheets; each window shows one intact frame. */
export default function HeroCharacters({ active }: { active: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5]">
      <div className="absolute -left-[5%] -top-[12%] aspect-[476/720] w-[clamp(105px,9vw,142px)] overflow-hidden drop-shadow-[3px_4px_0_#111] transition-transform duration-300 ease-out motion-safe:group-hover/heroart:-translate-y-3 motion-safe:group-hover/heroart:-rotate-6 motion-reduce:transition-none min-[761px]:max-[1100px]:left-[4%] max-[760px]:-left-[3%] max-[760px]:-top-[8%] max-[760px]:w-[clamp(88px,23vw,118px)]">
        <img className={`absolute left-0 top-0 w-full max-w-none transition-opacity duration-150 motion-reduce:transition-none ${active ? 'opacity-0' : 'opacity-100'}`} src="/finn-sprite.png" alt="" draggable={false} />
        <img className={`absolute -top-full left-0 w-full max-w-none transition-opacity duration-150 motion-reduce:transition-none ${active ? 'opacity-100' : 'opacity-0'}`} src="/finn-sprite.png" alt="" draggable={false} />
      </div>

      <div className="absolute -bottom-[17%] left-[8%] aspect-[362/522] w-[clamp(115px,10vw,150px)] drop-shadow-[3px_4px_0_#111] transition-transform duration-300 ease-out motion-safe:group-hover/heroart:-translate-y-2 motion-safe:group-hover/heroart:rotate-6 motion-reduce:transition-none max-[760px]:-bottom-[19%] max-[760px]:-left-[4%] max-[760px]:w-[clamp(92px,25vw,112px)]">
        <div className={`absolute bottom-0 left-0 aspect-[362/522] w-[90%] overflow-hidden transition-opacity duration-150 motion-reduce:transition-none ${active ? 'opacity-0' : 'opacity-100'}`}>
          <img className="absolute bottom-0 left-0 w-[186.19%] max-w-none!" src="/jake-sprite.png" alt="" draggable={false} />
        </div>
        <div className={`absolute bottom-0 left-0 aspect-[674/720] w-[135%] overflow-hidden transition-opacity duration-150 motion-reduce:transition-none ${active ? 'opacity-100' : 'opacity-0'}`}>
          <img className="absolute -top-full left-0 w-full max-w-none" src="/jake-sprite.png" alt="" draggable={false} />
        </div>
      </div>
    </div>
  )
}
