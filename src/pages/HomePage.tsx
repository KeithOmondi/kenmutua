import Contact from "../components/Layout/Contact"
import Coverage from "../components/Layout/Coverage"
import Header from "../components/Layout/Header"
import Hero from "../components/Layout/Hero"
import MyStory from "../components/Layout/MyStory"
import Services from "../components/Layout/Services"

const HomePage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <MyStory />
      <Services />
      <Coverage />
      <Contact />
    
    </div>
  )
}

export default HomePage