"use client";

import { useEffect, useRef, useState } from "react";

// Isi muncul saat digulir ke layar. Tanpa JS atau saat gerak dikurangi, isi langsung tampil.
export default function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const ref = useRef(null);
  const [state, setState] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setState("siap");
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setState("tampil");
        io.disconnect();
      }
    }, { rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} data-reveal={state || undefined} {...rest}>
      {children}
    </Tag>
  );
}
