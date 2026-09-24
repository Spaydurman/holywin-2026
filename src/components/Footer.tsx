import { Logo } from './Brand'
export default function Footer() {

  return (
    <footer className="footer"><div className="container footer-inner"><Logo/><p>Plant hope. Grow joy. Shine bright.</p><a href="#top">BACK TO TOP ↑</a></div><div className="footer-bottom container"><span>© {new Date().getFullYear()} HOLYWIN CONCEPT</span><span>MADE WITH FAITH & A LITTLE FUN ✳</span></div></footer>
  )
}
