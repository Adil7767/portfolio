import type { Metadata } from "next";
import AnalyticsBeacon from "@/components/AnalyticsBeacon";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import { getPortfolioData, getProfile } from "@/lib/data";
import { buildPortfolioMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return buildPortfolioMetadata(profile);
}

export default async function HomePage() {
  const data = await getPortfolioData();

  return (
    <div className="mesh-bg min-h-screen">
      <AnalyticsBeacon />
      <Navbar name={data.profile?.name ?? "Adil Mustafa"} />
      <main>
        <Hero
          profile={data.profile}
          socialLinks={data.socialLinks}
          projectCount={data.projects.length}
        />
        <About profile={data.profile} skills={data.skills} />
        <Services services={data.services} profile={data.profile} />
        <Projects projects={data.projects} profile={data.profile} />
        <Contact profile={data.profile} socialLinks={data.socialLinks} />
      </main>
    </div>
  );
}
