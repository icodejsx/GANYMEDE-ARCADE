"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function HomeMotion({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;
      if (reduce) return;

      const heroItems = gsap.utils.toArray<HTMLElement>("[data-animate='hero']");
      gsap.from(heroItems, {
        opacity: 0,
        y: 28,
        duration: 1.15,
        ease: "power2.out",
        stagger: 0.16,
        delay: 0.12,
      });

      gsap.to(".home-hero__orb--a", {
        y: 24,
        x: -12,
        duration: 8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(".home-hero__orb--b", {
        y: -18,
        x: 16,
        duration: 10,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.utils.toArray<HTMLElement>("[data-animate='section']").forEach((section) => {
        const targets = section.querySelectorAll(
          ".section-kicker, .section-title, .section-lead, .about-points li, .flow-item, .pillar, .home-stellar__actions, .about-visual__frame, .about-visual__chip, .floor__intro, .floor__featured, .floor__row, .game-card, .featured-tile, .empty-state, .site-footer__inner, .site-footer__bottom",
        );
        gsap.from(targets, {
          opacity: 0,
          y: 36,
          duration: 1,
          ease: "power2.out",
          stagger: 0.08,
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      });

      gsap.to(".about-visual__orbit--outer", {
        rotation: 360,
        duration: 48,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });
      gsap.to(".about-visual__orbit--inner", {
        rotation: -360,
        duration: 32,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });

      const floor = document.querySelector("#floor");
      if (floor) {
        gsap.from(floor, {
          opacity: 0,
          y: 40,
          duration: 1.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: floor,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="home-motion">
      {children}
    </div>
  );
}
