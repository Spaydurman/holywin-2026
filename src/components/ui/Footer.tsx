import { Logo } from './Brand'
export default function Footer() {

  return (
    <footer className="footer"><div className="container footer-inner"><Logo/><p>Receive Jesus. Believe in his name. Become a child of God.</p><a href="#top">BACK TO TOP ↑</a></div><div className="footer-bottom container"><span>© {new Date().getFullYear()} HOLYWIN CONCEPT</span><span>ROOTED IN JOHN 1:12 ✳</span></div></footer>
  )
}
