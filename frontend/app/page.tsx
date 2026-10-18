import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { SearchBar } from '@/components/SearchBar'
import { LogoStrip } from '@/components/LogoStrip'
import { CardCarousel } from '@/components/CardCarousel'
import { FooterOutro } from '@/components/FooterOutro'
import { MainPanel } from '@/components/MainPanel'
import { landingContent } from '@/data/landing-content'

export default function HomePage() {
  const c = landingContent

  return (
    <div id="top" className="relative min-h-screen">
      {/* TODO: Replace with XMUM campus background photography */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${c.pageBackgroundSrc})` }}
        role="img"
        aria-label={c.pageBackgroundAlt}
      />

      <Header
        wordmark={c.brand.wordmark}
        navLinks={c.navLinks}
        ghostCta={c.headerGhostCta}
        accentCta={c.headerAccentCta}
      />

      <main className="pb-0 pt-[72px]">
        <div className="mx-auto max-w-panel px-0 pb-16 pt-6 md:px-6 md:pt-8">
          <MainPanel>
            <div className="relative pb-16">
              <Hero
                imageSrc={c.heroImageSrc}
                imageAlt={c.heroImageAlt}
                headlineLine1={c.hero.headlineLine1}
                headlineLine2={c.hero.headlineLine2}
                subtext={c.hero.subtext}
                ctaLabel={c.hero.ctaLabel}
              />
              <SearchBar fields={c.search.fields} submitLabel={c.search.submitLabel} />
            </div>
            <LogoStrip items={c.logoStrip} />
            <CardCarousel
              heading={c.featured.heading}
              subtext={c.featured.subtext}
              cards={c.featured.cards}
            />
          </MainPanel>
        </div>

        <FooterOutro
          wordmark={c.footer.wordmark}
          tagline={c.footer.tagline}
          scriptLines={c.footer.scriptLines}
          badgeText={c.footer.badgeText}
        />
      </main>
    </div>
  )
}
