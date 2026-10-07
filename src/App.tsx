import Header from './components/Header'
import Hero from './components/Hero'
import Details from './components/Details'
import PowerpuffFlight from './components/PowerpuffFlight'
import About from './components/About'
import PixelTransition from './components/PixelTransition'
import Moments from './components/Moments'
import Registration from './components/Registration'
import Footer from './components/Footer'
import { AdminDashboard, AdminLogin, AdminRegistrations } from './components/Admin'

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '')
  if (path === '/holywin/2026/admin/login') return <AdminLogin />
  if (path === '/holywin/2026/admin/dashboard') return <AdminDashboard />
  if (path === '/holywin/2026/admin/registrations') return <AdminRegistrations />

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div id="top" />
    <Header />
    <main id="main">
      <Hero />
      <Details />
      <PowerpuffFlight />
      <About />
      <PixelTransition />
      <Moments />
      <Registration />
      <div className="pointer-events-none relative h-16 overflow-x-clip bg-[#f7f5ed]" role="img" aria-label="Ice Bear walking with Panda and Grizz on his back">
        <div className="absolute -bottom-0.5 left-0 h-32 w-[82px] animate-bear-cross md:h-44 md:w-[112px] motion-reduce:left-4 motion-reduce:animate-none">
          <div className="h-full w-full animate-bear-legs bg-[url('/bear-walk-sprite.png')] bg-[length:400%_100%] bg-no-repeat motion-reduce:animate-none" />
        </div>
      </div>
    </main>
    <Footer />
  </>
}
