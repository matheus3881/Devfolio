'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  ArrowUpRight,
  Mail,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react'



/* ─── Types ─── */
type Project = {
  name: string
  description: string
  technologies: string[]
  href: string
  featured?: boolean
}

/* ─── Data ─── */
const projects: Project[] = [
  {
    name: 'Chips — Multi-Agent AI Assistant',
    description:
      'Assistente de IA baseado em múltiplos agentes que colaboram para resolver tarefas complexas. Arquitetura modular com orquestração de LLMs.',
    technologies: ['Python', 'Agents', 'LLMs', 'Orchestration'],
    href: 'https://github.com/matheus3881/Chips-MultiAgent-AI-Assistant',
    featured: true,
  },
  {
    name: 'Multi App IA',
    description:
      'Conjunto de aplicações de inteligência artificial integradas em uma única plataforma unificada.',
    technologies: ['Python', 'IA aplicada'],
    href: 'https://github.com/matheus3881/multi_app_ia',
  },
  {
    name: 'Academia Inovação',
    description:
      'Aplicação completa voltada para gestão educacional e inovação acadêmica.',
    technologies: ['TypeScript'],
    href: 'https://github.com/matheus3881/academia-inovacao',
  },
  {
    name: 'OCR + RAG',
    description:
      'Sistema que combina OCR com RAG para extrair e consultar informações usando IA generativa.',
    technologies: ['Python', 'HTML', 'RAG', 'OCR'],
    href: 'https://github.com/matheus3881/ocr_e_rag',
  },
]

const skillGroups = [
  { label: 'Frontend',    skills: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS'] },
  { label: 'Backend',     skills: ['Python', 'Node.js', 'APIs REST', 'FastAPI'] },
  { label: 'AI / ML',     skills: ['LLMs', 'RAG', 'Agentes', 'OCR', 'Automação'] },
  { label: 'Ferramentas', skills: ['Git', 'Docker', 'Cloudflare', 'Vercel'] },
]

const NAV_LINKS = [
  ['Home',     '#home'],
  ['Sobre',    '#sobre'],
  ['Skills',   '#skills'],
  ['Projetos', '#projetos'],
  ['Contato',  '#contato'],
] as const

/* ─── Hooks ─── */

function useScrollReveal() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
        el.classList.add('is-visible')
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12,
        rootMargin: '0px 0px -25% 0px',
       },
    )

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function useActiveSection() {
  const [active, setActive] = useState('home')

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    let pending = ''

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) pending = entry.target.id
        })
        // batch: update state once per IO callback, not per entry
        if (pending) setActive(pending)
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return active
}

/* ─── Header ─── */
function Header() {
  // Initialize from OS preference to avoid theme flash on mount
  const [light, setLight] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: light)').matches
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const activeSection           = useActiveSection()

  useEffect(() => {
    document.documentElement.classList.toggle('light', light)
  }, [light])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = useCallback(() => setMenuOpen(false), [])


  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-border/60 bg-background/80 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <a
          href="#home"
          aria-label="Matheus Santos — início"
          className="group flex items-center gap-2 font-mono text-sm font-bold tracking-tight"
        >
          <span className="text-foreground">MS</span>
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          {NAV_LINKS.map(([label, href]) => {
            const id = href.slice(1)
            const isActive = activeSection === id
            return (
              <a
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative text-sm transition-colors after:absolute after:left-0 after:h-px after:bg-primary after:transition-[width] after:duration-300 ${
                  isActive
                    ? 'text-foreground after:w-full'
                    : 'text-muted-foreground after:w-0 hover:text-foreground hover:after:w-full'
                }`}
              >
                {label}
              </a>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={light ? 'Ativar modo escuro' : 'Ativar modo claro'}
            onClick={() => setLight((v) => !v)}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {light
              ? <Moon aria-hidden="true" className="size-4" />
              : <Sun  aria-hidden="true" className="size-4" />}
          </button>

          <button
            type="button"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-md p-2 text-muted-foreground md:hidden"
          >
            {menuOpen
              ? <X    aria-hidden="true" className="size-5" />
              : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Navegação mobile"
          className="flex flex-col gap-1 border-t border-border/60 px-5 py-4 md:hidden"
        >
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

/* ─── Hero image parallax hook ─── */
function useHeroParallax() {
  const sectionRef = useCallback((node: HTMLElement | null) => {
    if (!node) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = node.getBoundingClientRect()
      const x = ((e.clientX - left) / width  - 0.5) * 20   // ±10px
      const y = ((e.clientY - top)  / height - 0.5) * 20
      node.style.setProperty('--px', `${x}px`)
      node.style.setProperty('--py', `${y}px`)
    }
    const onLeave = () => {
      node.style.setProperty('--px', '0px')
      node.style.setProperty('--py', '0px')
    }

    node.addEventListener('mousemove', onMove)
    node.addEventListener('mouseleave', onLeave)
    return () => {
      node.removeEventListener('mousemove', onMove)
      node.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return sectionRef
}

/* ─── Hero ─── */
function Hero() {
  const parallaxRef = useHeroParallax()

  return (
    <section
      id="home"
      ref={parallaxRef}
      style={{ '--px': '0px', '--py': '0px' } as React.CSSProperties}
      className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-between overflow-hidden border-b border-border/60 px-5 py-10 lg:px-8 lg:py-12"
    >
      {/* ── Top row: badge (left) + role tag (right) ── */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        {/* Availability badge */}
        <div
          className="animate-fade-up inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-primary"
          style={{ animationDelay: '0ms' }}
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-primary opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Disponível para projetos
        </div>

        {/* Role tag */}
        <div
          className="animate-fade-up hidden items-center gap-3 md:flex"
          style={{ animationDelay: '60ms' }}
        >
          <span className="h-px w-8 bg-border/80" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Full Stack · IA · Automação
          </span>
        </div>
      </div>

      {/* ── Main content: text (left) + photo (right) ── */}
      <div className="mx-auto w-full max-w-6xl flex-1 flex flex-col justify-center gap-10 py-6 lg:flex-row lg:items-center lg:gap-16 lg:py-0">

        {/* ── Text column ── */}
        <div className="flex flex-col lg:flex-1">
          {/* Mobile photo — compact, above the name */}
          <div className="mb-8 flex items-center gap-4 lg:hidden">
            <div className="hero-img-wrapper h-16 w-16 overflow-hidden rounded-full border border-border/60">
              <img
                src="/placeholder-user.jpg"
                alt="Foto de Matheus Santos"
                className="h-full w-full object-cover object-top"
                width={64}
                height={64}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
                Desenvolvedor
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
                Full Stack · IA
              </span>
            </div>
          </div>

          {/* H1 — display type */}
          <h1
            className="animate-fade-up font-black leading-[0.88] tracking-[-0.055em] text-foreground"
            style={{
              fontSize: 'clamp(3.2rem, 11vw, 8.5rem)',
              animationDelay: '120ms',
            }}
            aria-label="Matheus Santos"
          >
            <span className="block">Matheus</span>
            <span className="block text-foreground/20">Santos</span>
          </h1>

          {/* Thin rule */}
          <div
            className="animate-fade-up mt-8 h-px w-full bg-border/50 lg:mt-10"
            style={{ animationDelay: '180ms' }}
            aria-hidden="true"
          />

          {/* Description */}
          <p
            className="animate-fade-up mt-7 max-w-sm text-sm leading-[1.8] text-muted-foreground"
            style={{ animationDelay: '220ms' }}
          >
            Desenvolvo produtos digitais e sistemas inteligentes que transformam
            problemas complexos em experiências simples — com foco em{' '}
            <span className="font-semibold text-foreground">IA e LLMs</span>.
          </p>

          {/* CTA buttons */}
          <div
            className="animate-fade-up mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '280ms' }}
          >
            <a
              href="#projetos"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Ver projetos
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <a
              href="mailto:contato@matheus-santos.dev"
              className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-transparent px-6 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/50 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Contato
              <Mail aria-hidden="true" className="size-4" />
            </a>
          </div>

          {/* Social links */}
          <div
            className="animate-fade-up mt-6 flex items-center gap-4"
            style={{ animationDelay: '340ms' }}
          >
            <a
              href="https://github.com/matheus3881"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub de Matheus Santos"
              className="font-mono text-[11px] text-muted-foreground/50 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              GitHub
            </a>
            <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
            <a
              href="https://www.linkedin.com/in/matheus-santos-de-lima-84916830b"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn de Matheus Santos"
              className="font-mono text-[11px] text-muted-foreground/50 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              LinkedIn
            </a>
            <span className="ml-1 font-mono text-[10px] text-muted-foreground/30">
              @matheus3881
            </span>
          </div>
        </div>

        {/* ── Photo column — desktop only ── */}
        <div
          className="hidden lg:flex lg:w-[340px] lg:shrink-0 xl:w-[380px]"
          aria-hidden="true"
        >
          {/*
            Parallax: translate by CSS custom props set by mousemove handler.
            Transition keeps it smooth between frames.
          */}
          <div
            className="w-full"
            style={{
              transform: 'translate(var(--px), var(--py))',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/*
              Outer decorative frame: thin border + offset accent line.
              position:relative lets us add pseudo-decorations as siblings.
            */}
            <div className="relative">
              {/* Decorative corner accent — top-left */}
              <span
                className="animate-fade-up absolute -left-3 -top-3 h-10 w-px bg-primary/40"
                style={{ animationDelay: '500ms' }}
              />
              <span
                className="animate-fade-up absolute -left-3 -top-3 h-px w-10 bg-primary/40"
                style={{ animationDelay: '500ms' }}
              />
              {/* Decorative corner accent — bottom-right */}
              <span
                className="animate-fade-up absolute -bottom-3 -right-3 h-10 w-px bg-primary/40"
                style={{ animationDelay: '600ms' }}
              />
              <span
                className="animate-fade-up absolute -bottom-3 -right-3 h-px w-10 bg-primary/40"
                style={{ animationDelay: '600ms' }}
              />

              {/*
                hero-img-wrapper  → clip-path curtain reveal (CSS class)
                hero-img-float    → continuous gentle float loop (CSS class)
                overflow-hidden   → keeps the clip-path crisp at all times
              */}
              <div className="hero-img-wrapper overflow-hidden rounded-sm border border-border/40">
                <div className="hero-img-float">
                  {/*
                    ─ SWAP YOUR PHOTO HERE ─────────────────────────────────
                    Replace "/placeholder-user.jpg" with your actual image.
                    Recommended: square or 3:4 portrait, min 760px wide.
                    Example: src="/foto.jpg"
                    ────────────────────────────────────────────────────────
                  */}
                  <img
                    src="/JE3A8420_05698.jpg"
                    alt="Foto de Matheus Santos — desenvolvedor Full Stack"
                    className="aspect-[3/4] w-full object-cover object-top grayscale-[15%]"
                    width={380}
                    height={507}
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>

              {/* Name tag overlay — bottom of the photo */}
              <div
                className="animate-fade-up absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 backdrop-blur-sm"
                style={{ animationDelay: '1200ms' }}
              >
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-primary opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                <span className="font-mono text-[10px] text-foreground/70">
                  matheus.dev
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom social row — desktop only ── */}
      <div className="mx-auto hidden w-full max-w-6xl lg:block">
        <div className="flex items-center justify-between pt-4">
          <div
            className="animate-fade-up flex items-center gap-5"
            style={{ animationDelay: '380ms' }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
              @matheus3881
            </span>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator — vertical line, right edge, desktop only ── */}
      <a
        href="#sobre"
        aria-label="Rolar para a seção Sobre"
        className="animate-fade-up absolute bottom-10 right-8 hidden flex-col items-center gap-3 lg:flex"
        style={{ animationDelay: '400ms' }}
      >
        <span
          className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/30"
          style={{ writingMode: 'vertical-rl' }}
        >
          scroll
        </span>
        <span className="relative h-14 w-px overflow-hidden bg-border/30" aria-hidden="true">
          <span className="animate-scroll-line absolute left-0 top-0 h-1/2 w-full bg-primary/50" />
        </span>
      </a>
    </section>
  )
}

/* ─── About ─── */
function About() {
  return (
    <section id="sobre" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-24 lg:px-8 lg:py-32">

        {/* ── Row 1: section label + title split layout ── */}
        <div className="reveal flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">

          {/* Left: eyebrow + display heading */}
          <div className="lg:max-w-[54%]">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
              01 / Sobre
            </p>
            <h2
              className="mt-5 font-black leading-[0.92] tracking-[-0.04em] text-foreground"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}
            >
              Tecnologia
              <br />
              <span className="text-foreground/25">com intenção.</span>
            </h2>
          </div>

          {/* Right: short tagline + CTA link */}
          <div className="flex flex-col gap-5 lg:max-w-[38%] lg:pb-2">
            <div className="flex items-start gap-3">
              <span className="mt-2 h-px w-8 shrink-0 bg-primary/50" aria-hidden="true" />
              <p className="text-sm leading-7 text-muted-foreground">
                Desenvolvedor Full Stack com foco em{' '}
                <span className="font-semibold text-foreground">IA aplicada</span>{' '}
                e construção de produtos digitais que resolvem problemas reais.
              </p>
            </div>
            <a
              href="#contato"
              className="group inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-primary transition-opacity hover:opacity-70"
            >
              Fale comigo
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="reveal my-14 h-px w-full bg-border/60" aria-hidden="true" />

        {/* ── Row 2: body text (editorial, large leading) + sidebar stats ── */}
        <div className="reveal grid gap-14 lg:grid-cols-[1fr_260px] lg:gap-20">

          {/* Body copy */}
          <div className="flex flex-col gap-6">
            <p className="font-display text-xl font-medium leading-[1.55] text-foreground sm:text-2xl">
              Sou um desenvolvedor apaixonado por criar soluções que unem{' '}
              <em className="not-italic text-primary">engenharia</em>,{' '}
              <em className="not-italic text-primary">produto</em> e{' '}
              <em className="not-italic text-primary">inteligência artificial</em>.
            </p>
            <p className="text-base leading-[1.85] text-muted-foreground">
              Minha trajetória passa por backend, automação e construção de interfaces.
              Hoje, meu foco está em explorar como{' '}
              <span className="relative inline-block text-foreground">
                IA e LLMs
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-px w-full bg-primary/40"
                />
              </span>{' '}
              podem tornar processos mais eficientes e experiências mais humanas.
            </p>
            <p className="text-base leading-[1.85] text-muted-foreground">
              Gosto de trabalhar em problemas difíceis onde a tecnologia tem impacto real
              — do primeiro commit ao produto em produção.
            </p>

            {/* ── Values / traits grid ── */}
            <div
              className="mt-4 grid grid-cols-1 gap-px border border-border/60 sm:grid-cols-3"
              role="list"
              aria-label="Valores e abordagem"
            >
              {[
                { title: 'Foco no produto', body: 'Código que serve ao usuário, não ao ego do dev.' },
                { title: 'IA com propósito', body: 'LLMs e agentes como ferramentas, não como fim.' },
                { title: 'Iteração rápida', body: 'Lançar cedo, medir, melhorar. Sempre.' },
              ].map(({ title, body }) => (
                <div
                  key={title}
                  role="listitem"
                  className="group flex flex-col gap-2.5 bg-secondary/10 p-5 transition-colors duration-300 hover:bg-accent/20"
                >
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125"
                    />
                    <span className="text-sm font-semibold text-foreground">{title}</span>
                  </span>
                  <p className="text-xs leading-[1.7] text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: stats */}
          <aside aria-label="Estatísticas" className="flex flex-row gap-6 lg:flex-col lg:gap-0">
            {[
              { number: '3+', label: 'Anos de experiência', sub: 'Backend · Frontend · IA' },
              { number: '10+', label: 'Projetos entregues', sub: 'Open-source & profissionais' },
              { number: '5+', label: 'Stacks dominadas', sub: 'TypeScript, Python, LLMs…' },
            ].map(({ number, label, sub }, i) => (
              <div
                key={label}
                className={`flex flex-1 flex-col gap-1 py-7 lg:flex-none ${
                  i > 0 ? 'border-t border-border/60' : ''
                }`}
              >
                <span className="font-display text-4xl font-black leading-none tracking-tight text-foreground lg:text-5xl">
                  {number}
                </span>
                <span className="mt-1 text-xs font-semibold text-foreground/80">{label}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/60">
                  {sub}
                </span>
              </div>
            ))}
          </aside>
        </div>

      </div>
    </section>
  )
}

/* ─── Skills ─── */
function Skills() {
  // Flatten all skills for the marquee strip
  const allSkills = skillGroups.flatMap((g) => g.skills)

  return (
    <section id="skills" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-24 lg:px-8 lg:py-32">

        {/* ── Split header: title left | description right ── */}
        <div className="reveal flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-24">

          {/* Left: sticky label + heading */}
          <div className="lg:w-[38%] lg:shrink-0">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
              02 / Skills
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Stack
              <br />
              <span className="text-foreground/30">técnica.</span>
            </h2>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">
              Ferramentas e tecnologias que uso para transformar
              ideias em produtos reais — do backend à IA.
            </p>

            {/* Total count */}
            <div className="mt-8 flex items-center gap-3">
              <span className="font-mono text-3xl font-black text-foreground">
                {allSkills.length}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                tecnologias
              </span>
            </div>
          </div>

          {/* Right: editorial skill list by category */}
          <div className="flex-1">
            {skillGroups.map((group, gi) => (
              <div
                key={group.label}
                className={`flex flex-col gap-4 py-7 sm:flex-row sm:gap-10 ${
                  gi > 0 ? 'border-t border-border/60' : ''
                }`}
              >
                {/* Category label */}
                <div className="w-28 shrink-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
                    {group.label}
                  </span>
                </div>

                {/* Skill items — inline, separated by ·  */}
                <ul
                  role="list"
                  className="flex flex-wrap items-center gap-x-5 gap-y-3"
                  aria-label={`Skills de ${group.label}`}
                >
                  {group.skills.map((skill, si) => (
                    <li
                      key={skill}
                      role="listitem"
                      className="group flex items-center gap-5"
                    >
                      <span className="relative text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-primary">
                        {skill}
                        {/* Hover underline */}
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-[width] duration-300 group-hover:w-full"
                        />
                      </span>
                      {/* Dot separator — hidden after last item */}
                      {si < group.skills.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="h-1 w-1 shrink-0 rounded-full bg-border"
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {/* Bottom border of last row */}
            <div className="border-t border-border/60" aria-hidden="true" />
          </div>
        </div>

        {/* ── Marquee strip — ambient horizontal scroll of all skills ── */}
        <div
          className="reveal mt-16 overflow-hidden"
          aria-hidden="true"  /* decorative — content already in list above */
        >
          {/* Fade masks on left/right */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

            {/* Scrolling track */}
            <div className="flex items-center gap-8 [--marquee-duration:35s] motion-reduce:[animation-play-state:paused]">
              <div className="animate-marquee flex shrink-0 items-center gap-8">
                {[...allSkills, ...allSkills].map((skill, i) => (
                  <span
                    key={`${skill}-${i}`}
                    className="flex shrink-0 items-center gap-8 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground/30"
                  >
                    {skill}
                    <span className="h-1 w-1 rounded-full bg-primary/30" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

/* ─── Projects ─── */

/** Individual project row — editorial list style inspired by Majd */
function ProjectRow({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  const [open, setOpen] = useState(false)
  const num = String(index + 1).padStart(2, '0')

  return (
    <div
      className={`group border-t border-border/60 transition-colors duration-300 ${
        project.featured ? 'border-primary/20' : ''
      }`}
    >
      {/* ── Main row ── */}
      <div
        className="flex cursor-pointer items-center gap-5 py-5 sm:py-6"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen((v) => !v)
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={`project-desc-${index}`}
      >
        {/* Index number */}
        <span className="hidden w-8 shrink-0 font-mono text-xs text-muted-foreground/40 sm:block">
          {num}
        </span>

        {/* Featured badge */}
        {project.featured && (
          <span className="hidden shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-primary sm:inline-flex">
            destaque
          </span>
        )}

        {/* Title */}
        <h3 className="flex-1 text-base font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary sm:text-lg md:text-xl">
          {project.name}
        </h3>

        {/* Tech pills — hidden on xs */}
        <div className="hidden items-center gap-2 md:flex" role="list" aria-label="Tecnologias">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              role="listitem"
              className="rounded-full border border-border/60 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Arrow toggle */}
        <span
          aria-hidden="true"
          className={`ml-2 flex size-8 shrink-0 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all duration-300 ${
            open
              ? 'border-primary/40 bg-primary/10 text-primary rotate-45'
              : 'group-hover:border-primary/30 group-hover:text-primary'
          }`}
        >
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>

      {/* ── Expandable description panel ── */}
      <div
        id={`project-desc-${index}`}
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!open}
      >
        <div className="flex flex-col gap-6 pb-7 pl-0 sm:flex-row sm:items-end sm:justify-between sm:pl-[52px]">
          {/* Description */}
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            {project.description}
          </p>

          {/* Footer: all techs + GitHub link */}
          <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
            {/* All tech pills on mobile */}
            <div className="flex flex-wrap gap-1.5" role="list" aria-label="Todas as tecnologias">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  role="listitem"
                  className="rounded-full border border-border/60 bg-secondary/30 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>

            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Ver ${project.name} no GitHub (abre em nova aba)`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/20 px-4 py-2 font-mono text-xs font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
            >
              Ver no GitHub
              <ArrowUpRight aria-hidden="true" className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function Projects() {
  return (
    <section id="projetos" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-24 lg:px-8 lg:py-32">

        {/* ── Section header ── */}
        <div className="reveal flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
              03 / Projetos
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Trabalho
              <br />
              <span className="text-foreground/30">selecionado.</span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <p className="max-w-xs text-right text-sm leading-6 text-muted-foreground">
              {projects.length} projetos que refletem minha
              forma de pensar e construir.
            </p>
            <a
              href="https://github.com/matheus3881"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              Ver todos no GitHub
              <ArrowUpRight aria-hidden="true" className="size-3" />
            </a>
          </div>
        </div>

        {/* ── Project list ── */}
        <div className="reveal mt-14">
          {projects.map((project, i) => (
            <ProjectRow key={project.name} project={project} index={i} />
          ))}
          {/* Closing border */}
          <div className="border-t border-border/60" aria-hidden="true" />
        </div>

      </div>
    </section>
  )
}

/* ─── Contact ─── */
function Contact() {
  return (
    <section id="contato" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-24 lg:px-8 lg:py-32">

        {/* ── Header row: label + availability badge ── */}
        <div className="reveal flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
            04 / Contato
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-primary">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Disponível para projetos
          </span>
        </div>

        {/* ── Display heading ── */}
        <h2
          className="reveal mt-8 font-black leading-[0.9] tracking-[-0.04em] text-foreground"
          style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}
        >
          Vamos construir
          <br />
          <span className="text-foreground/25">algo bom.</span>
        </h2>

        {/* ── Divider ── */}
        <div className="reveal my-14 h-px w-full bg-border/60" aria-hidden="true" />

        {/* ── Two-column: email CTA (left) + social links (right) ── */}
        <div className="reveal grid gap-12 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-20">

          {/* Email block */}
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-7 text-muted-foreground">
              Tem uma ideia, projeto ou desafio interessante? Minha caixa de entrada está aberta.
            </p>

            {/* Email as hero-sized animated link */}
            <a
              href="mailto:contato@matheus-santos.dev"
              className="group relative mt-2 inline-block w-fit"
              aria-label="Enviar e-mail para contato@matheus-santos.dev"
            >
              <span
                className="block font-display font-black leading-none tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary"
                style={{ fontSize: 'clamp(1.1rem, 3vw, 2rem)' }}
              >
                contato@matheus-santos.dev
              </span>
              {/* Animated underline sweep */}
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"
              />
            </a>

            {/* Primary CTA button */}
            <div className="mt-6">
              <a
                href="mailto:contato@matheus-santos.dev"
                className="inline-flex items-center gap-2.5 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Mail aria-hidden="true" className="size-4" />
                Enviar mensagem
              </a>
            </div>
          </div>

          {/* Social links — editorial list rows with arrow circles */}
          <nav
            aria-label="Redes sociais e perfis"
            className="flex flex-col divide-y divide-border/60 border-y border-border/60 lg:min-w-[260px]"
          >
            {[
              {
                label: 'GitHub',
                sub: '@matheus3881',
                href: 'https://github.com/matheus3881',
              },
              {
                label: 'LinkedIn',
                sub: 'Matheus Santos',
                href: 'https://www.linkedin.com/in/matheus-santos-de-lima-84916830b',
              },
              {
                label: 'E-mail',
                sub: 'contato@matheus-santos.dev',
                href: 'mailto:contato@matheus-santos.dev',
              },
            ].map(({ label, sub, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-center justify-between gap-4 py-4 transition-colors duration-200"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
                    {label}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground/70">{sub}</span>
                </div>
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:bg-primary/8 group-hover:text-primary"
                >
                  <ArrowUpRight className="size-3.5" />
                </span>
              </a>
            ))}
          </nav>
        </div>

      </div>
    </section>
  )
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">

          {/* Left: copyright + stack */}
          <div className="flex flex-col gap-0.5">
            <span
              className="font-mono text-xs font-semibold text-foreground/70"
              suppressHydrationWarning
            >
              © {new Date().getFullYear()} Matheus Santos
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/40">
              Feito com Next.js &amp; Tailwind CSS
            </span>
          </div>

          {/* Center: nav links */}
          <nav aria-label="Links do rodapé" className="flex flex-wrap items-center gap-5">
            {NAV_LINKS.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground/50 transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right: back to top */}
          <a
            href="#home"
            aria-label="Voltar ao topo da página"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground/50 transition-colors hover:text-foreground"
          >
            Topo
            <span
              aria-hidden="true"
              className="flex size-6 items-center justify-center rounded-full border border-border/60 text-xs transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:text-primary"
            >
              ↑
            </span>
          </a>

        </div>
      </div>
    </footer>
  )
}

/* ─── Root ─── */
export function Portfolio() {
  useScrollReveal()

  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

