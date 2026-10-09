import Header from '../components/ui/Header'
import Footer from '../components/ui/Footer'
import PixelTransition from '../components/ui/PixelTransition'
import Hero from '../sections/Hero'
import Details from '../sections/Details'
import PowerpuffFlight from '../sections/PowerpuffFlight'
import About from '../sections/About'
import Speaker from '../sections/Speaker'
import Moments from '../sections/Moments'
import Registration from '../sections/Registration'

export default function HomePage() {
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
      <Speaker />
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
