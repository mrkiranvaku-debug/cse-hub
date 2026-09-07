import { Code2, Database, Compass, Rocket } from 'lucide-react'
import { resolveFileUrl } from '../lib/apiOrigin'

const highlights = [
  { icon: Code2, label: 'Code' },
  { icon: Database, label: 'Learn' },
  { icon: Compass, label: 'Explore' },
  { icon: Rocket, label: 'Grow' },
]

interface BannerProps {
  title?: string
  tagline?: string
  imageUrl?: string
}

export default function Banner({ title = 'CSE HUB', tagline = 'LEARN · BUILD · SOLVE · REPEAT', imageUrl }: BannerProps) {
  const customImage = resolveFileUrl(imageUrl)
  const [firstWord, ...rest] = title.split(' ')
  const restOfTitle = rest.join(' ')

  return (
    <div className="relative overflow-hidden rounded-xl2 border border-night-500 bg-night-900 shadow-card">
      {customImage ? (
        <img src={customImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <DefaultHeroScene />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night-900 via-night-900/70 to-transparent" />

      {/* content */}
      <div className="relative flex min-h-[220px] flex-col justify-center gap-4 px-6 py-8 sm:min-h-[280px] sm:px-10">
        <div>
          <h1 className="text-4xl font-extrabold leading-none tracking-tight sm:text-5xl">
            <span className="text-white">{firstWord} </span>
            {restOfTitle && <span className="text-cyan-400">{restOfTitle}</span>}
          </h1>
          <p className="mt-2 text-xs font-semibold tracking-[0.35em] text-muted-400 sm:text-sm">{tagline}</p>
          <div className="mt-3 h-0.5 w-14 bg-cyan-400" />
        </div>

        <p className="max-w-sm text-sm text-muted-300 sm:text-base">
          Your Personal Computer Science Knowledge Space
        </p>

        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-300">
          {highlights.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <Icon size={15} className="text-cyan-400" />
              {label}
            </span>
          ))}
        </div>
      </div>

      {!customImage && (
        <>
          <div className="pointer-events-none absolute right-8 top-8 hidden text-right lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-500">
              Better<br />Developers<br />Brighter<br />Tomorrow
            </p>
            <div className="ml-auto mt-2 h-0.5 w-8 bg-cyan-400/70" />
          </div>
          <p className="pointer-events-none absolute bottom-6 right-8 hidden -rotate-2 font-serif text-sm italic text-muted-400 lg:block">
            One line at a time…
          </p>
        </>
      )}
    </div>
  )
}

function DefaultHeroScene() {
  return (
      <svg
        viewBox="0 0 1400 380"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="heroGlow" cx="62%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#0E3A52" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#07182A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#050B14" stopOpacity="1" />
          </radialGradient>
          <linearGradient id="nodeLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0891B2" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <rect width="1400" height="380" fill="url(#heroGlow)" />

        {/* faint circuit grid */}
        <g stroke="#12324A" strokeWidth="1" opacity="0.5">
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="380" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 48} x2="1400" y2={i * 48} />
          ))}
        </g>

        {/* central polyhedron node cluster */}
        <g transform="translate(980, 190)" stroke="url(#nodeLine)" strokeWidth="1.4" fill="none" opacity="0.9">
          <polyline points="0,-120 -95,-40 -95,60 0,120 95,60 95,-40 0,-120" />
          <polyline points="0,-120 0,120" />
          <polyline points="-95,-40 95,60" />
          <polyline points="95,-40 -95,60" />
          <polyline points="-95,-40 0,-60 95,-40" />
          <polyline points="-95,60 0,80 95,60" />
        </g>
        <g fill="#B6F3FF">
          {[
            [0, -120], [-95, -40], [95, -40], [-95, 60], [95, 60], [0, 120], [0, -60], [0, 80],
          ].map(([x, y], i) => (
            <circle key={i} cx={980 + x} cy={190 + y} r={i === 0 ? 5 : 3.4} className="glow-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </g>

        {/* base platform */}
        <g transform="translate(980, 300)" opacity="0.85">
          <polygon points="-120,0 0,-30 120,0 0,30" fill="#0B2436" stroke="#1D5A78" strokeWidth="1" />
          <polygon points="-70,0 0,-16 70,0 0,16" fill="#0E3350" stroke="#2A7FA3" strokeWidth="1" />
        </g>

        {/* floating side panels */}
        <g stroke="#1D5A78" strokeWidth="1.2" fill="#081A29" opacity="0.9">
          <rect x="700" y="100" width="115" height="110" rx="6" />
          <rect x="705" y="270" width="115" height="90" rx="6" />
          <rect x="1140" y="80" width="150" height="120" rx="6" />
          <rect x="1150" y="230" width="150" height="120" rx="6" />
        </g>
        <g stroke="#22D3EE" strokeWidth="1" fill="none" opacity="0.6">
          <circle cx="757" cy="155" r="26" />
          <path d="M757 129 L757 181 M731 155 L783 155 M739 137 L775 173 M775 137 L739 173" />
          <polyline points="715,340 735,300 755,325 775,290 795,310" strokeWidth="1.4" />
        </g>
        <g fill="#7DE6FF" opacity="0.85" fontFamily="JetBrains Mono, monospace" fontSize="11">
          <text x="1155" y="105">const future =</text>
          <text x="1170" y="122">.learn()</text>
          <text x="1170" y="139">.build()</text>
          <text x="1170" y="156">.solve()</text>
          <text x="1170" y="173">.repeat();</text>
        </g>
        <g stroke="#22D3EE" strokeWidth="1.2" fill="none" opacity="0.6">
          <rect x="1170" y="250" width="24" height="16" rx="2" />
          <rect x="1215" y="250" width="24" height="16" rx="2" />
          <rect x="1260" y="250" width="24" height="16" rx="2" />
          <rect x="1192" y="285" width="24" height="16" rx="2" />
          <rect x="1237" y="285" width="24" height="16" rx="2" />
          <path d="M1182 266 L1182 285 M1227 266 L1227 285 M1272 266 L1272 285 M1204 285 L1204 301 M1249 285 L1249 301" />
        </g>

        {/* scattered faint particles */}
        <g fill="#22D3EE" opacity="0.5">
          {Array.from({ length: 24 }).map((_, i) => (
            <circle key={i} cx={(i * 61) % 1400} cy={(i * 97) % 380} r={i % 5 === 0 ? 1.8 : 1} />
          ))}
        </g>
      </svg>
  )
}
