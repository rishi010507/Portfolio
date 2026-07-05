import { Layout } from "./components/layout/Layout";
import { Hero } from "./components/hero/Hero";
import { IntroSection } from "./components/intro/IntroSection";
import { ProjectsSection } from "./components/projects/ProjectsSection";
import { AboutSection } from "./components/about/AboutSection";
import { TimelineSection } from "./components/timeline/TimelineSection";
import { ContactSection } from "./components/contact/ContactSection";

function App() {
  return (
    <Layout>
      <Hero />
      <IntroSection />
      <ProjectsSection />
      <AboutSection />
      <TimelineSection />
      <ContactSection />
    </Layout>
  );
}

export default App;
