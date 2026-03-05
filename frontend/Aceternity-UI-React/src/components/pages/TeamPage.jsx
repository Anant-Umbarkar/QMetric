import React, { useState } from 'react';

// ── Data ──────────────────────────────────────────────────────────────────────

const sections = [
  {
    id: 'governing',
    icon: '🏛️',
    title: 'Governing & Advisory Layer',
    role: 'Strategic oversight, academic rigor, and compliance',
    color: 'from-indigo-500 to-purple-600',
    border: 'border-indigo-500/30',
    glow: 'shadow-indigo-500/20',
    contributors: [
      { name: 'Dr. Anant J. Umbarkar', position: 'Founder / Chief Mentor (Academic Lead / PI)' },
    ],
    responsibilities: [
      'Vision and mission alignment',
      'Research ethics, IP, and policy compliance',
      'Strategic partnerships and funding guidance',
    ],
  },
  {
    id: 'research',
    icon: '🔬',
    title: 'Research & Innovation Leadership',
    role: 'Core research direction and innovation pipeline',
    color: 'from-blue-500 to-cyan-500',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20',
    contributors: [
      { name: 'Dr. Anant J. Umbarkar', position: 'Founder / Chief Mentor' },
      { name: 'Admuthe Sir', position: 'Co-PI' },
      { name: 'Pranali Seth Ma\'am', position: 'Co-PI' },
      { name: 'Mr. Virendra Patil', position: 'Team Lead (2025 Batch)' },
      { name: 'Ms. Kranti Varekar', position: 'Team Lead (2026 Batch)' },
    ],
    responsibilities: [
      'Defining research themes and problems',
      'Patent strategy, IP creation, and commercialization',
    ],
    extras: [
      {
        label: 'Ideation — Main Contributors',
        names: ['Dr. Anant J. Umbarkar', 'Admuthe Sir'],
      },
      {
        label: 'Patent — Inventors',
        names: ['Dr. Anant J. Umbarkar', 'Admuthe Sir'],
      },
      {
        label: 'Patent — Applicants',
        names: ['Dr. Anant J. Umbarkar', 'Admuthe Sir', 'Pranali Seth Ma\'am', 'Mr. Virendra Patil'],
      },
      {
        label: 'Sub-Contributors in Innovation',
        names: ['Dr. Anant J. Umbarkar', 'Admuthe Sir', 'Mr. Virendra Patil', 'Ms. Kranti Varekar'],
      },
    ],
  },
  {
    id: 'product',
    icon: '📋',
    title: 'Product & Program Management',
    role: 'Translating research into deployable products',
    color: 'from-violet-500 to-purple-500',
    border: 'border-violet-500/30',
    glow: 'shadow-violet-500/20',
    contributors: [
      { name: 'Dr. Anant J. Umbarkar', position: 'Founder / Chief Mentor' },
      { name: 'Admuthe Sir', position: 'Co-PI' },
      { name: 'Pranali Seth Ma\'am', position: 'Co-PI' },
      { name: 'Mr. T. B. Patil', position: '' },
      { name: 'Mr. N. Sheikh', position: '' },
      { name: 'Mr. Kalash Patil', position: '' },
      { name: 'Mr. Virendra Patil', position: 'Team Lead (2025 Batch)' },
      { name: 'Ms. Kranti Varekar', position: 'Team Lead (2026 Batch)' },
    ],
    responsibilities: [
      'Requirement analysis from research outcomes',
      'Roadmap and milestone planning',
      'Coordination between research and engineering teams',
    ],
  },
  {
    id: 'design',
    icon: '🎨',
    title: 'Design & User Experience Team',
    role: 'Research-informed design and usability',
    color: 'from-pink-500 to-rose-500',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/20',
    contributors: [
      { name: 'Mr. Virendra Patil', position: 'Team Lead (2025 Batch)', note: 'Improved the algorithm logic (Added feature of flexible Bloom\'s level)' },
      { name: 'Ms. Kranti A. Varekar', position: 'Team Lead (2026 Batch)', note: 'Improved the algorithm design (Corrected the final equation to calculate optimal results)' },
      { name: 'Mr. Utkarsh', position: 'Lead Web Developer' },
      { name: 'Mr. Om R. Kulsange', position: 'Lead Web Developer' },
      { name: 'Ms. Elizabeth S. Pawar', position: 'Lead Web Developer' },
    ],
    responsibilities: [
      'User studies and validation',
      'Interface design and accessibility',
      'Academic, industry, and end-user alignment',
    ],
  },
  {
    id: 'engineering',
    icon: '⚙️',
    title: 'Engineering & Development Team',
    role: 'Technical implementation and system building',
    color: 'from-orange-500 to-amber-500',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/20',
    contributors: [
      { name: 'Mr. Virendra Patil', position: 'Full-stack Developer' },
      { name: 'Ms. Kranti A. Varekar', position: 'Frontend Developer' },
      { name: 'Mr. Utkarsh', position: 'Full-stack Developer' },
      { name: 'Mr. Om R. Kulsange', position: 'Backend Developer' },
      { name: 'Ms. Elizabeth S. Pawar', position: 'Backend Developer' },
    ],
    responsibilities: [
      'Translating research algorithms into software',
      'Scalable, secure, and modular development',
      'Integration of experimental models into production',
    ],
  },
  {
    id: 'scholars',
    icon: '🎓',
    title: 'Research Scholars & Student Team',
    role: 'Research execution and experimentation',
    color: 'from-teal-500 to-emerald-500',
    border: 'border-teal-500/30',
    glow: 'shadow-teal-500/20',
    contributors: [
      { name: 'Mr. Virendra Patil', position: 'Team Lead (2025 Batch)', note: 'Improved the algorithm logic (Added feature of flexible Bloom\'s level)' },
      { name: 'Ms. Kranti A. Varekar', position: 'Team Lead (2026 Batch)', note: 'Improved the algorithm design (Corrected the final equation to calculate optimal results)' },
      { name: 'Mr. N. Sheikh', position: 'PG Student' },
      { name: 'Mr. Utkarsh', position: 'Lead Web Developer' },
      { name: 'Mr. Om R. Kulsange', position: 'Lead Web Developer' },
      { name: 'Ms. Elizabeth S. Pawar', position: 'Lead Web Developer' },
    ],
    responsibilities: [
      'Experiments, simulations, and data analysis',
      'Prototype development',
      'Publications, reports, and documentation',
    ],
  },
  {
    id: 'testing',
    icon: '🧪',
    title: 'Testing, Validation & Ethics',
    role: 'Quality, validation, and research integrity',
    color: 'from-cyan-500 to-blue-500',
    border: 'border-cyan-500/30',
    glow: 'shadow-cyan-500/20',
    contributors: [
      { name: 'Mr. Virendra Patil', position: 'Full-stack Developer' },
      { name: 'Ms. Kranti A. Varekar', position: 'Frontend Developer' },
      { name: 'Mr. N. Sheikh', position: 'Full-stack Developer' },
      { name: 'Mr. Utkarsh', position: 'Full-stack Developer' },
      { name: 'Mr. Om R. Kulsange', position: 'Backend Developer' },
      { name: 'Ms. Elizabeth S. Pawar', position: 'Backend Developer' },
    ],
    responsibilities: [
      'Functional and performance testing',
      'Validation of research outcomes',
      'Ethical compliance and reproducibility',
    ],
  },
  {
    id: 'devops',
    icon: '🚀',
    title: 'Deployment, DevOps & Infrastructure',
    role: 'Research-to-production deployment',
    color: 'from-yellow-500 to-orange-500',
    border: 'border-yellow-500/30',
    glow: 'shadow-yellow-500/20',
    contributors: [
      { name: 'Mr. Virendra Patil', position: 'Full-stack Developer' },
      { name: 'Ms. Kranti A. Varekar', position: 'Frontend Developer' },
      { name: 'Mr. N. Sheikh', position: 'Full-stack Developer' },
      { name: 'Mr. Utkarsh', position: 'DevOps Lead' },
      { name: 'Mr. Om R. Kulsange', position: 'Backend Developer' },
      { name: 'Ms. Elizabeth S. Pawar', position: 'Backend Developer' },
    ],
    responsibilities: [
      'CI/CD pipelines',
      'Research prototype deployment',
      'Monitoring and scalability',
    ],
  },
  {
    id: 'maintenance',
    icon: '🔧',
    title: 'Maintenance, Support & Knowledge Transfer',
    role: 'Sustainability and continuous improvement',
    color: 'from-slate-400 to-gray-500',
    border: 'border-slate-500/30',
    glow: 'shadow-slate-500/20',
    contributors: [
      { name: 'Mr. Virendra Patil', position: 'Full-stack Developer' },
      { name: 'Ms. Kranti A. Varekar', position: 'Frontend Developer' },
      { name: 'Mr. N. Sheikh', position: 'Full-stack Developer' },
      { name: 'Mr. Utkarsh', position: 'Full-stack Developer' },
      { name: 'Mr. Om R. Kulsange', position: 'Backend Developer' },
      { name: 'Ms. Elizabeth S. Pawar', position: 'Backend Developer' },
    ],
    responsibilities: [
      'System updates and support',
      'Knowledge transfer to users and stakeholders',
      'Long-term system sustainability',
    ],
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

const ContributorCard = ({ name, position, note, color }) => (
  <div className={`relative bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/90 hover:border-opacity-80 transition-all duration-300 group`}>
    {/* Gradient accent bar */}
    <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl bg-gradient-to-b ${color} opacity-70 group-hover:opacity-100 transition-opacity`} />
    <div className="pl-2">
      <p className="text-white font-semibold text-sm">{name}</p>
      {position && (
        <p className="text-gray-400 text-xs mt-0.5">{position}</p>
      )}
      {note && (
        <p className="text-gray-500 text-xs mt-1.5 italic border-t border-gray-700/50 pt-1.5">{note}</p>
      )}
    </div>
  </div>
);

const SectionCard = ({ section }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className={`bg-gray-900/70 border ${section.border} rounded-2xl overflow-hidden shadow-xl ${section.glow} transition-all duration-300`}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
            {section.icon}
          </div>
          <div>
            <h2 className={`text-lg font-bold bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}>
              {section.title}
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">{section.role}</p>
          </div>
        </div>
        <span className={`text-gray-400 text-xl transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {/* Body */}
      {open && (
        <div className="px-6 pb-6 space-y-6">
          {/* Contributors grid */}
          <div>
            <h3 className="text-gray-300 text-xs font-semibold uppercase tracking-widest mb-3">Contributors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.contributors.map((c, i) => (
                <ContributorCard key={i} {...c} color={section.color} />
              ))}
            </div>
          </div>

          {/* Extras (patent, ideation groupings) */}
          {section.extras && (
            <div className="space-y-3">
              {section.extras.map((extra, i) => (
                <div key={i} className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30">
                  <p className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">{extra.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {extra.names.map((name, j) => (
                      <span key={j} className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${section.color} bg-opacity-10 text-white border border-white/10`}>
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Responsibilities */}
          <div>
            <h3 className="text-gray-300 text-xs font-semibold uppercase tracking-widest mb-3">Responsibilities</h3>
            <ul className="space-y-2">
              {section.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                  <span className={`mt-1 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${section.color} flex-shrink-0`} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const TeamPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        {/* Background glow blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-14 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-widest mb-6">
            <span>🏅</span> Credits & Contribution Structure
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight mb-4">
            Our Team
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-3">
            <span className="text-white font-semibold">Question Paper Quality Analysis and Recommendation System</span>
          </p>
          <p className="text-base text-gray-500 max-w-xl mx-auto">
            Meet the researchers, engineers, designers, and innovators who built QMetric from the ground up.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {[
              { label: 'Sections', value: sections.length },
              { label: 'Core Contributors', value: '10+' },
              { label: 'Batches', value: '2025 & 2026' },
            ].map((s, i) => (
              <div key={i} className="bg-gray-800/60 border border-gray-700/50 rounded-2xl px-6 py-3 text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{s.value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sections ── */}
      <div className="max-w-5xl mx-auto px-6 pb-16 space-y-6">
        {sections.map(section => (
          <SectionCard key={section.id} section={section} />
        ))}

        {/* ── Declaration ── */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-2xl p-8 mt-10 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📜</span>
            <h2 className="text-xl font-bold text-white">Declaration</h2>
          </div>
          <p className="text-gray-400 leading-relaxed text-sm">
            This Major Academic Project has been carried out under the guidance and supervision of the above-mentioned contributors.
            All work complies with institutional academic standards, ethical research practices, and originality requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
