export function Logo() {
  return <a className="logo" href="#top" aria-label="Holywin home"><span className="logo-mark"><span>H</span><span>W</span></span><span className="logo-name">HOLYWIN<span className="logo-dot">.</span></span></a>
}

export function Star({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 72 72" fill="none" aria-hidden="true"><path d="M36 1.5 43 27l26.5 9L43 45 36 70.5 29 45 2.5 36 29 27 36 1.5Z" fill="currentColor" stroke="currentColor" strokeWidth="2"/></svg>
}
