'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  ArrowUpRight,
  Mail,
  Menu,
  Moon,
  Sun,
  X,

  ChevronDown,
} from 'lucide-react'

import { FaLinkedin, FaGithub  } from 'react-icons/fa';

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
    name: 'Projeto Jucerja',
    description:
      'Sistema desenvolvido para a Jucerja com foco em automação de processos e consulta de dados empresariais.',
    technologies: ['TypeScript'],
    href: 'https://github.com/matheus3881/projeto-jucerja',
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
      { threshold: 0.12 },
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

/* ─── Hero ─── */
function Hero() {
  return (
    <section
      id="home"
      className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-5 py-24 lg:px-8 lg:py-32"
    >
      {/* Availability badge */}
      <div className="animate-fade-up mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        Disponível para projetos
      </div>

      {/* Headline */}
      <h1 className="animate-fade-up text-[clamp(3rem,9vw,7rem)] font-black leading-[0.92] tracking-[-0.04em] text-foreground">
        Matheus
        <br />
        <span className="text-muted-foreground">Santos</span>
      </h1>

      {/* Sub-headline */}
      <p className="animate-fade-up mt-8 max-w-xl text-pretty text-xl leading-relaxed tracking-tight text-muted-foreground sm:text-2xl">
        Desenvolvedor Full Stack focado em{' '}
        <span className="font-semibold text-foreground">IA e automação.</span>
      </p>

      {/* Description */}
      <p className="animate-fade-up mt-4 max-w-lg text-base leading-7 text-muted-foreground">
        Construo produtos digitais e sistemas inteligentes que transformam problemas
        complexos em experiências simples.
      </p>

      {/* CTA row */}
      <div className="animate-fade-up mt-10 flex flex-wrap items-center gap-3">
        <a
          href="#projetos"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90  focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Ver projetos
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </a>

        <a
          href="mailto:contato@matheus-santos.dev"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary  focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Contato
          <Mail aria-hidden="true" className="size-4" />
        </a>

        <div className="ml-1 flex items-center gap-1 border-l border-border pl-4">
          <a
            href="https://github.com/matheus3881"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub de Matheus Santos"
            className="rounded-md p-2.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
          >
            <FaGithub aria-hidden="true" className="size-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/matheus-santos-de-lima-84916830b"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn de Matheus Santos"
            className="rounded-md p-2.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
          >
            <FaLinkedin aria-hidden="true" className="size-5" />
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#sobre"
        aria-label="Rolar para a seção Sobre"
        className="animate-fade-up absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">scroll</span>
        <ChevronDown aria-hidden="true" className="size-4 animate-bounce" />
      </a>
    </section>
  )
}

/* ─── About ─── */
function About() {
  return (
    <section id="sobre" className="border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-[1fr_1.4fr] lg:px-8 lg:py-32">
        {/* Left */}
        <div className="reveal">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
            01 / Sobre
          </p>
          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Tecnologia
            <br />
            com intenção.
          </h2>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4" role="list" aria-label="Estatísticas">
            {[
              { number: '3+', label: 'Anos' },
              { number: '10+', label: 'Projetos' },
              { number: '5+', label: 'Tecnologias' },
            ].map(({ number, label }) => (
              <div key={label} role="listitem" className="flex flex-col gap-0.5 border-l-2 border-primary pl-3">
                <span className="text-2xl font-black text-foreground">{number}</span>
                <span className="font-mono text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="reveal flex max-w-2xl flex-col gap-5 text-base leading-7 text-muted-foreground">
          <p>
            Sou um desenvolvedor apaixonado por criar soluções que unem engenharia,
            produto e inteligência artificial.
          </p>
          <p>
            Minha trajetória passa por backend, automação e construção de interfaces.
            Hoje, meu foco está em explorar como IA e LLMs podem tornar processos
            mais eficientes e experiências mais humanas.
          </p>
          <p>
            Gosto de trabalhar em problemas difíceis onde a tecnologia tem impacto real.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─── Skills ─── */
function Skills() {
  return (
    <section id="skills" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-24 lg:px-8 lg:py-32">
        <div className="reveal">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
            02 / Skills
          </p>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
            Stack técnica.
          </h2>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <div key={group.label} className="reveal">
              <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {group.label}
              </h3>
              <ul role="list" className="flex flex-col gap-2.5">
                {group.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2 text-sm text-foreground">
                    <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Project Cards ─── */
function FeaturedCard({ project }: { project: Project }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver ${project.name} no GitHub`}
      className="group relative col-span-full flex flex-col gap-8 overflow-hidden rounded-xl border border-border bg-card/40 p-8 transition-all duration-500 hover:border-primary/40 hover:bg-card/70 hover:shadow-[0_0_50px_-15px_var(--color-primary)] md:flex-row md:items-end md:justify-between md:p-12"
    >
      <div className="flex-1">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
          Projeto em destaque
        </span>
        <h3 className="mt-3 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          {project.name}
        </h3>
        <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
          {project.description}
        </p>
      </div>

      <div className="flex flex-col items-start gap-4 md:items-end">
        <div className="flex flex-wrap gap-2" role="list" aria-label="Tecnologias">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              role="listitem"
              className="rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-[11px] text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground transition-colors group-hover:text-primary">
          Ver no GitHub
          <ArrowUpRight
            aria-hidden="true"
            className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </a>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver ${project.name} no GitHub`}
      className="group flex min-h-56 flex-col justify-between rounded-xl border border-border bg-card/20 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card/50 hover:shadow-[0_8px_30px_-12px_var(--color-primary)]"
    >
      <div>
        <div className="mb-8 flex items-start justify-between gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            / projeto
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
          />
        </div>
        <h3 className="text-base font-bold tracking-tight text-foreground">
          {project.name}
        </h3>
        <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
          {project.description}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5" role="list" aria-label="Tecnologias">
        {project.technologies.map((tech) => (
          <span key={tech} role="listitem" className="font-mono text-[10px] text-muted-foreground/70">
            #{tech}
          </span>
        ))}
      </div>
    </a>
  )
}

function Projects() {
  const featured = projects.find((p) => p.featured)
  const rest     = projects.filter((p) => !p.featured)

  return (
    <section id="projetos" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-24 lg:px-8 lg:py-32">
        <div className="reveal flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
              03 / Projetos
            </p>
            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Trabalho selecionado.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-muted-foreground">
            Uma seleção de projetos que refletem minha curiosidade e forma de construir.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {featured && (
            <div className="reveal col-span-full">
              <FeaturedCard project={featured} />
          </div>
          )}

          {rest.map((project) => (
            <div key={project.name} className="reveal">
              <ProjectCard project={project} />
            </div>
          ))}
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
        <div className="reveal max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
            04 / Contato
          </p>
          <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Vamos construir
            <br />
            algo bom.
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
            Tem uma ideia, projeto ou desafio interessante? Minha caixa de entrada
            está aberta.
          </p>
        </div>

        <div className="reveal mt-12 flex flex-wrap gap-3">
          <a
            href="mailto:contato@matheus-santos.dev"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Mail aria-hidden="true" className="size-4" />
            Enviar mensagem
          </a>
          <a
            href="https://www.linkedin.com/in/matheus-santos-de-lima-84916830b"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <FaLinkedin aria-hidden="true" className="size-4" />
            LinkedIn
          </a>
          <a
            href="https://github.com/matheus3881"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <FaGithub aria-hidden="true" className="size-4" />
            GitHub
          </a>
        </div>

        <p className="reveal mt-8 font-mono text-xs text-muted-foreground">
          contato@matheus-santos.dev
        </p>
      </div>
    </section>
  )
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <span suppressHydrationWarning>© {new Date().getFullYear()} Matheus Santos. Feito com Next.js e Tailwind.</span>
        <nav aria-label="Links do rodapé" className="flex items-center gap-5">
          {NAV_LINKS.map(([label, href]) => (
            <a key={href} href={href} className="transition-colors hover:text-foreground">
              {label}
            </a>
          ))}
        </nav>
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

