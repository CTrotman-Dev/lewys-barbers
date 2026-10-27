import React, { useEffect, useRef, useState } from "react";

const services = [
  {
    number: "01",
    title: "Any haircut",
    description: "A fresh cut, shaped around your style.",
    price: "£15",
    icon: "scissors",
  },
  {
    number: "02",
    title: "OAP & children's cuts",
    description: "A haircut for older customers or children.",
    price: "£10",
    icon: "fade",
  },
  {
    number: "03",
    title: "Beard trim",
    description: "Beard work is included with every haircut.",
    price: "Included",
    icon: "beard",
  },
  {
    number: "04",
    title: "Eyebrow tidy",
    description: "Eyebrows are included with every haircut.",
    price: "Included",
    icon: "spark",
  },
];

function Icon({ name, className = "" }) {
  const shared = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "scissors") {
    return (
      <svg {...shared}>
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="m8.2 8.2 11.6 11.6M14.5 9.5 20 4M8.2 15.8l4.3-4.3" />
      </svg>
    );
  }
  if (name === "fade") {
    return (
      <svg {...shared}>
        <path d="M4 20h16M6 16h12M8 12h8M10 8h4M11 4h2" />
      </svg>
    );
  }
  if (name === "beard") {
    return (
      <svg {...shared}>
        <path d="M6 8a6 6 0 0 1 12 0v3a6 6 0 0 1-12 0V8Z" />
        <path d="M6 10c0 5 2.2 9 6 10 3.8-1 6-5 6-10M9 10h.01M15 10h.01M10 14h4" />
      </svg>
    );
  }
  if (name === "spark") {
    return (
      <svg {...shared}>
        <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
        <path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
      </svg>
    );
  }
  return null;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuContrast, setMenuContrast] = useState(false);
  const [bookingPrepared, setBookingPrepared] = useState("");
  const menuToggleRef = useRef(null);

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    let frameId;
    const defaultBackground = menuToggleRef.current
      ? getComputedStyle(menuToggleRef.current).backgroundColor
      : "";

    function updateMenuContrast() {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const toggle = menuToggleRef.current;
        if (!toggle) return;

        const toggleRect = toggle.getBoundingClientRect();
        const centerX = toggleRect.left + toggleRect.width / 2;
        const centerY = toggleRect.top + toggleRect.height / 2;
        const matchingSection = Array.from(document.querySelectorAll("main section")).some((section) => {
          const sectionRect = section.getBoundingClientRect();
          return (
            centerX >= sectionRect.left &&
            centerX <= sectionRect.right &&
            centerY >= sectionRect.top &&
            centerY <= sectionRect.bottom &&
            getComputedStyle(section).backgroundColor === defaultBackground
          );
        });

        setMenuContrast(matchingSection);
      });
    }

    updateMenuContrast();
    window.addEventListener("scroll", updateMenuContrast, { passive: true });
    window.addEventListener("resize", updateMenuContrast);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateMenuContrast);
      window.removeEventListener("resize", updateMenuContrast);
    };
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const method = event.nativeEvent.submitter.value;
    const name = formData.get("name");
    const replyTo = formData.get("email");
    const service = formData.get("service");
    const message = formData.get("message");
    const emailInput = form.elements.email;
    emailInput.setCustomValidity("");
    if (method === "email" && !replyTo.trim()) {
      emailInput.setCustomValidity("Please enter your email address to continue with email.");
      emailInput.reportValidity();
      return;
    }
    const body = [
      `Name: ${name}`,
      replyTo ? `Email: ${replyTo}` : "",
      `Service: ${service}`,
      "",
      message ? `A little more about what I need: ${message}` : "",
      "",
      "Please get in touch to arrange a booking.",
    ]
      .filter(Boolean)
      .join("\n");
    if (method === "whatsapp") {
      const whatsappUrl = `https://wa.me/447950930889?text=${encodeURIComponent(body)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setBookingPrepared("Your booking enquiry is ready to review and send in WhatsApp.");
    } else {
      const subject = encodeURIComponent(`Booking enquiry from ${name}`);
      window.location.href = `mailto:lewysdixie97@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
      setBookingPrepared("Your booking enquiry is ready to send in your email app.");
    }
    form.reset();
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" onClick={closeMenu} aria-label="Lewys’ Barbering Service home">
          <span className="brand-mark" aria-hidden="true"><Icon name="scissors" /></span>
          <span className="brand-wordmark" aria-hidden="true">
            <span className="brand-name">LEWYS’</span>
            <span className="brand-service">BARBERING SERVICE</span>
          </span>
        </a>

        <button
          ref={menuToggleRef}
          className={menuContrast ? "menu-toggle is-inverted" : "menu-toggle"}
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>

        <nav id="primary-navigation" className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
          <a className="nav-cta" href="#contact" onClick={closeMenu}>
            Book an appointment <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="eyebrow"><span /> QUALIFIED BARBER · CHEPSTOW</div>
            <h1>Mobile barber<br />in <em>Chepstow.</em></h1>
            <p className="hero-intro">
              A friendly, qualified mobile barber bringing the cut to you in the comfort of your own home.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#contact">
                Book your appointment <span aria-hidden="true">↗</span>
              </a>
              <a className="text-link" href="#services">Explore services <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-note">
              <span className="note-icon" aria-hidden="true">✳</span>
              <span>YOUR LOCAL, QUALIFIED BARBER</span>
            </div>
          </div>
          <div className="hero-visual">
            <img
              className="hero-image"
              src={`${import.meta.env.BASE_URL}images/lewys-client-work.jpg`}
              alt="A collage of haircuts by Lewys’ Barbering Service"
              fetchpriority="high"
            />
            <div className="image-caption">
              <span className="caption-dot" />
              <span>REAL CUTS BY LEWYS</span>
            </div>
            <div className="hero-stamp" aria-label="Mobile barber serving Chepstow">
              <span>MOBILE</span>
              <span className="stamp-star" aria-hidden="true">✳</span>
              <span>CHEPSTOW</span>
            </div>
          </div>
        </section>

        <section className="benefits" aria-label="Why choose Lewys’ Barbering Service">
          <div className="benefit">
            <span className="benefit-number">01</span>
            <div><h2>At your place</h2><p>A mobile service at home.</p></div>
          </div>
          <div className="benefit">
            <span className="benefit-number">02</span>
            <div><h2>Qualified barber</h2><p>Professional cuts from Lewys.</p></div>
          </div>
          <div className="benefit">
            <span className="benefit-number">03</span>
            <div><h2>100% recommended</h2><p>5 reviews on Facebook.</p></div>
          </div>
        </section>

        <section className="about section-wrap" id="about">
          <div className="about-image-wrap">
            <img
              src={`${import.meta.env.BASE_URL}images/lewys-cutting-hair.jpg`}
              alt="A barber cutting a client's hair at Lewys’ Barbering Service"
              loading="lazy"
            />
            <div className="about-image-label"><span>HAIRCUTS BY LEWYS</span><span>✳</span></div>
          </div>
          <div className="about-copy">
            <div className="eyebrow"><span /> QUALIFIED · LOCAL · MOBILE</div>
            <h2>Mobile haircuts<br />in <em>Chepstow.</em></h2>
            <p>
              Lewys’ Barbering Service is a qualified mobile barber based in Chepstow, bringing professional haircuts
              to the comfort of your own home.
            </p>
            <p>
              Beards and eyebrows are included with every cut. OAP and children’s haircuts are available at a reduced price.
            </p>
            <a className="text-link about-link" href="#contact">Book your home visit <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="services" id="services">
          <div className="section-wrap">
            <div className="services-heading">
              <div>
                <div className="eyebrow"><span /> SERVICES & PRICES</div>
                <h2>Good cuts.<br /><em>Clear prices.</em></h2>
              </div>
              <div className="services-aside">
                <p>Mobile haircuts in the comfort of your home. Beard and eyebrow tidy included with every cut.</p>
              </div>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <article className="service-card" key={service.number}>
                  <div className="service-card-top">
                    <span className="service-number">{service.number}</span>
                    <Icon name={service.icon} className="service-icon" />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <span className="service-price">{service.price}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contact section-wrap" id="contact">
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-heading">
              <h3>Send a booking enquiry</h3>
              <span>WE’LL BE IN TOUCH</span>
            </div>
            <label>
              Your name
              <input name="name" type="text" placeholder="Your name" required />
            </label>
            <div className="form-row">
              <label>
                Email address <span className="optional">(required for email bookings)</span>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  onInput={(event) => event.currentTarget.setCustomValidity("")}
                />
              </label>
              <label>
                What are you after?
                <select name="service" defaultValue="" required>
                  <option value="" disabled>Choose a service</option>
                  <option>Any haircut — £15</option>
                  <option>OAP or children’s haircut — £10</option>
                  <option>Haircut with beard trim included</option>
                  <option>Haircut with eyebrow tidy included</option>
                  <option>Not sure yet</option>
                </select>
              </label>
            </div>
            <label>
              Anything else we should know? <span className="optional">(optional)</span>
              <textarea name="message" rows="3" placeholder="Your preferred day, location, or style..." />
            </label>
            <div className="booking-actions">
              <button className="button button-dark" type="submit" name="bookingMethod" value="email">
                <svg className="booking-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
                <span>Book by email</span>
              </button>
              <button className="button button-whatsapp" type="submit" name="bookingMethod" value="whatsapp">
                <svg className="booking-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20.2 11.8a8.2 8.2 0 0 1-12.1 7.1L3 20l1.2-4.8a8.2 8.2 0 1 1 16-3.4Z" />
                  <path d="M8.2 8.1c.3-.5.6-.5.9-.5h.4c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4 0 .6l-.5.7c-.2.2-.2.4 0 .6.6 1 1.4 1.8 2.4 2.3.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5 0 .3-.2 1.1-.7 1.5-.5.5-1.2.7-2 .5-1.1-.2-2.5-.9-3.8-2.1-1.6-1.4-2.6-3.2-2.8-4.1-.3-.8 0-1.5.4-1.8Z" />
                </svg>
                <span>Book by WhatsApp</span>
              </button>
            </div>
            <p className="form-note">
              Your enquiry will be prepared in your chosen app for you to review and send.
            </p>
            {bookingPrepared && <p className="form-success" role="status">{bookingPrepared}</p>}
          </form>

          <div className="contact-copy">
            <div className="eyebrow"><span /> CONTACT LEWYS</div>
            <h2>Get in<br /><em>touch.</em></h2>
            <p>Questions about a cut or your area? Get in touch directly and we’ll be happy to help.</p>
            <div className="company-contact" aria-label="Company contact information">
              <a href="tel:+447950930889">
                <span className="contact-link-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 4h3l2 5-2.5 1.5a14 14 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                  </svg>
                </span>
                <span><strong>CALL OR WHATSAPP</strong><span>07950 930889</span></span>
              </a>
              <a href="mailto:lewysdixie97@gmail.com">
                <span className="contact-link-icon" aria-hidden="true">✉</span>
                <span><strong>DROP US AN EMAIL</strong><span>lewysdixie97@gmail.com</span></span>
              </a>
              <a href="https://www.facebook.com/people/Lewys-Barbering-Service/61571392004854/" target="_blank" rel="noreferrer">
                <span className="contact-link-icon contact-facebook-icon" aria-hidden="true">f</span>
                <span><strong>MESSAGE ON FACEBOOK</strong><span>Lewys’ Barbering Service</span></span>
              </a>
            </div>
            <div className="contact-location">
              <span className="location-icon" aria-hidden="true">⌖</span>
              <div><strong>LOCAL TO CHEPSTOW</strong><span>Covering Chepstow and surrounding areas</span></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home" aria-label="Lewys’ Barbering Service home">
          <span className="brand-mark" aria-hidden="true"><Icon name="scissors" /></span>
          <span className="brand-wordmark" aria-hidden="true">
            <span className="brand-name">LEWYS’</span>
            <span className="brand-service">BARBERING SERVICE</span>
          </span>
        </a>
        <p>Qualified mobile barber. <span>Chepstow, Wales.</span></p>
        <a href="#home" className="back-top">BACK TO TOP ↑</a>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} LEWYS’ BARBERING SERVICE</span>
        </div>
      </footer>
    </>
  );
}

export default App;
