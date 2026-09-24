import Header from './components/Header'
import Hero from './components/Hero'
import Details from './components/Details'
import About from './components/About'
import Moments from './components/Moments'
import Registration from './components/Registration'
import Footer from './components/Footer'

export default function App() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div id="top" />
    <Header />
    <main id="main">
      <Hero />
      <Details />
      <About />
      <Moments />
      <Registration />
    </main>
    <Footer />
  </>
}
