import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import heroAsset from "@/assets/hero-biryani.jpg.asset.json";
import { GooeyButton } from "@/components/GooeyButton";
import { GooeyNav } from "@/components/GooeyNav";

const TITLE = "Mezban — Bangladeshi Restaurant in Madinah, Open 24 Hours";
const DESCRIPTION =
  "Authentic Bangladeshi biryani, beef and chicken curries served 24 hours a day in Madinah, Saudi Arabia. Traditional recipes, rich flavors, warm hospitality.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "restaurant" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "Our Story", href: "#story" },
  { label: "Reviews", href: "#reviews" },
  { label: "Visit Us", href: "#visit" },
  { label: "Contact", href: "#contact" },
];

const FACTS = [
  { icon: "◷", title: "Open 24 Hours", body: "We are here for you, anytime you crave." },
  {
    icon: "⌁",
    title: "Authentic Recipes",
    body: "Traditional Bangladeshi recipes, cooked to perfection.",
  },
  {
    icon: "♧",
    title: "Warm Hospitality",
    body: "Because to us, you're not just a guest, you're family.",
  },
  {
    icon: "⌖",
    title: "Madinah, KSA",
    body: "Proudly serving the Madinah community and visitors.",
  },
];

import { MENU, TERMS } from "@/data/menu";

function Index() {
  useEffect(() => {
    document.body.classList.add("mezban");
    return () => document.body.classList.remove("mezban");
  }, []);

  return (
    <>
      <div className="mz-topbar">
        ✦ &nbsp; OPEN 24 HOURS EVERYDAY &nbsp; · &nbsp; AUTHENTIC BANGLADESHI CUISINE IN MADINAH
        &nbsp; ✦
      </div>

      <nav className="mz-nav">
        <div className="mz-brand">
          <span className="mz-brand-mark">ম</span>
          <span>
            MEZBAN<small>BANGLADESHI RESTAURANT</small>
          </span>
        </div>
        <GooeyNav
          items={NAV}
          particleCount={12}
          particleDistances={[72, 10]}
          particleR={90}
          initialActiveIndex={0}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />
        <GooeyButton className="mz-order" href="#menu">
          বাংলা
        </GooeyButton>
      </nav>

      <header className="mz-hero mz-hero-old" id="home">
        <div className="mz-hero-glow" aria-hidden="true" />
        <div className="mz-hero-dish">
          <img
            className="mz-heroimg"
            src={heroAsset.url}
            alt="Bangladeshi biryani served at Mezban in Madinah"
          />
        </div>
        <div className="mz-hero-skyline" aria-hidden="true">
          ♧ ︿︿︿ 𑁋 ︿︿︿ ♧
        </div>
        <div className="mz-hero-copy">
          <div className="mz-hero-kicker">চট্টগ্রামের ঐতিহ্যবাহী</div>
          <h1>মুচা</h1>
          <div className="mz-hero-subtitle">এখন মদিনার মেজবানে</div>
          <p>CHATTOGRAM'S LEGENDARY MUCHA, NOW IN MADINAH</p>
          <GooeyButton className="mz-discover mz-old-order" href="#menu">
            ORDER NOW <span>→</span>
          </GooeyButton>
        </div>
        <div className="mz-hero-rating">★ 4.8 · 500+ GOOGLE REVIEWS</div>
      </header>

      <section className="mz-promise" id="story">
        <div className="mz-promise-main">
          <div className="mz-eyebrow">Our Promise</div>
          <h2>Every dish is prepared with tradition, passion, and pride.</h2>
        </div>
        <div className="mz-facts">
          {FACTS.map((fact, i) => (
            <div
              className="mz-fact mz-reveal"
              key={fact.title}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="mz-icon">{fact.icon}</div>
              <h3>{fact.title}</h3>
              <p>{fact.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mz-section mz-dark" id="menu">
        <div className="mz-eyebrow">The Menu</div>
        <h2>
          Food worth
          <br />
          remembering.
        </h2>
        <p className="mz-menu-note">All prices in SR · S/L = Small / Large</p>
        <div className="mz-menu-grid">
          {MENU.map((group) => (
            <div className="mz-menu-group" key={group.category}>
              <div className="mz-cat">{group.category}</div>
              {group.items.map((item, ii) => (
                <div className="mz-item" key={`${item.name}-${ii}`}>
                  <div className="mz-item-main">
                    <span>
                      {item.name}
                      {item.desc && item.desc.length <= 20 && (
                        <em className="mz-item-tag">{item.desc}</em>
                      )}
                    </span>
                    {item.desc && item.desc.length > 20 && (
                      <small className="mz-item-desc">{item.desc}</small>
                    )}
                  </div>
                  <div className="mz-item-side">
                    {item.cal && <small>{item.cal} cal</small>}
                    <span className="mz-price">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mz-terms">
          <div className="mz-cat">Terms &amp; Conditions</div>
          {TERMS.map((t) => (
            <small key={t}>{t}</small>
          ))}
        </div>
      </section>

      <section className="mz-section" id="reviews">
        <div className="mz-eyebrow">Reviews</div>
        <h2>
          Straight from
          <br />
          the kitchen.
        </h2>
        <div className="mz-menu-grid">
          <img
            src={heroAsset.url}
            alt="Biryani plated at Mezban"
            style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover" }}
          />
          <img
            src={heroAsset.url}
            alt="Bangladeshi dishes at Mezban"
            style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover" }}
          />
        </div>
      </section>

      <section className="mz-section" id="visit">
        <div className="mz-visit">
          <div>
            <div className="mz-eyebrow">Visit Us</div>
            <h2>
              Come
              <br />
              hungry.
            </h2>
          </div>
          <div className="mz-visit-card">
            <strong>Mezban Hotel</strong>
            <p>
              Suq Alkhudar, Mukren Ibn Aous,
              <br />
              Al Wabra, Madinah 42371,
              <br />
              Saudi Arabia
            </p>
            <p>Open 24 hours · +966 53 941 4691</p>
            <GooeyButton
              className="mz-maps"
              href="https://maps.app.goo.gl/WBUedCUeCsHNtqEq9"
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps ↗
            </GooeyButton>
          </div>
        </div>
      </section>

      <footer className="mz-footer" id="contact">
        <strong>mezban</strong>
        <small>Bangladeshi cuisine · Madinah · Saudi Arabia</small>
      </footer>
    </>
  );
}
