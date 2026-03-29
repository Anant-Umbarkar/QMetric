import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Users, Lightbulb, Code2, Layout, Shield, ChevronRight, Star } from 'lucide-react';

const sections = [
  {
    id: 'governing',
    icon: <Shield className="w-6 h-6" />,
    title: 'Governing & Advisory Layer',
    subtitle: 'Strategic oversight, academic rigor, and compliance',
    color: 'from-blue-500 to-blue-600',
    lightColor: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    members: [
      {
        name: 'Dr. Anant J. Umbarkar',
        role: 'Founder / Chief Mentor (Academic Lead / PI)',
        contributions: [
          'Vision and mission alignment',
          'Research ethics, IP, and policy compliance',
          'Strategic partnerships and funding guidance',
        ],
        badge: 'PI',
      },
    ],
  },
  {
    id: 'research',
    icon: <Lightbulb className="w-6 h-6" />,
    title: 'Research & Innovation Leadership',
    subtitle: 'Core research direction and innovation pipeline',
    color: 'from-purple-500 to-purple-600',
    lightColor: 'from-purple-50 to-purple-100',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600',
    members: [
      { name: 'Dr. Anant J. Umbarkar', role: 'Founder / Chief Mentor', badge: 'PI' },
      { name: 'Admuthe Sir', role: 'Co-PI', badge: 'Co-PI' },
      { name: 'Pranali Seth Ma\'am', role: 'Co-PI', badge: 'Co-PI' },
      { name: 'Mr. Virendra Patil', role: 'Team Lead (2025 Batch)', badge: 'Lead' },
      { name: 'Ms. Kranti Varekar', role: 'Team Lead (2026 Batch)', badge: 'Lead' },
    ],
    responsibilities: [
      'Defining research themes and problems',
      'Patent strategy, IP creation, and commercialization',
    ],
    patent: {
      inventors: ['Dr. Anant J. Umbarkar', 'Admuthe Sir'],
      applicants: ['Dr. Anant J. Umbarkar', 'Admuthe Sir', 'Pranali Seth Ma\'am', 'Mr. Virendra Patil'],
      subContributors: ['Dr. Anant J. Umbarkar', 'Admuthe Sir', 'Mr. Virendra Patil', 'Ms. Kranti Varekar'],
    },
  },
  {
    id: 'product',
    icon: <Award className="w-6 h-6" />,
    title: 'Product & Program Management',
    subtitle: 'Translating research into deployable products',
    color: 'from-indigo-500 to-indigo-600',
    lightColor: 'from-indigo-50 to-indigo-100',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-600',
    members: [
      { name: 'Dr. Anant J. Umbarkar', role: 'Founder / Chief Mentor', badge: 'PI' },
      { name: 'Admuthe Sir', role: 'Co-PI', badge: 'Co-PI' },
      { name: 'Pranali Seth Ma\'am', role: 'Co-PI', badge: 'Co-PI' },
      { name: 'Mr. T. B. Patil', role: 'Contributor', badge: null },
      { name: 'Mr. N. Sheikh', role: 'Contributor', badge: null },
      { name: 'Mr. Kalash Patil', role: 'Team Lead (2025 Batch)', badge: 'Lead' },
      { name: 'Mr. Virendra Patil', role: 'Team Lead (2025 Batch)', badge: 'Lead' },
      { name: 'Ms. Kranti Varekar', role: 'Team Lead (2026 Batch)', badge: 'Lead' },
    ],
    responsibilities: [
      'Requirement analysis from research outcomes',
      'Roadmap and milestone planning',
      'Coordination between research and engineering teams',
    ],
  },
  {
    id: 'design',
    icon: <Layout className="w-6 h-6" />,
    title: 'Design & User Experience Team',
    subtitle: 'Interface design, accessibility, and user validation',
    color: 'from-pink-500 to-rose-500',
    lightColor: 'from-pink-50 to-rose-100',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-600',
    members: [
      { name: 'Mr. Virendra Patil', role: 'Improved algorithm logic (Flexible Bloom\'s Level)', badge: 'Dev' },
      { name: 'Ms. Kranti A. Varekar', role: 'Corrected optimal result equation', badge: 'Dev' },
      { name: 'Mr. Utkarsh', role: 'Lead Web Developer', badge: 'Lead' },
      { name: 'Mr. Om R. Kulsange', role: 'Lead Web Developer', badge: 'Lead' },
      { name: 'Ms. Elizabeth S. Pawar', role: 'Lead Web Developer', badge: 'Lead' },
    ],
    responsibilities: [
      'User studies and validation',
      'Interface design and accessibility',
      'Academic, industry, and end-user alignment',
    ],
  },
  {
    id: 'engineering',
    icon: <Code2 className="w-6 h-6" />,
    title: 'Engineering & Development Team',
    subtitle: 'Building scalable, secure, and modular systems',
    color: 'from-teal-500 to-cyan-600',
    lightColor: 'from-teal-50 to-cyan-100',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-600',
    members: [
      { name: 'Mr. Virendra Patil', role: 'Full-stack Developer', badge: 'Full-stack' },
      { name: 'Ms. Kranti A. Varekar', role: 'Frontend Developer', badge: 'Frontend' },
      { name: 'Mr. Utkarsh', role: 'Full-stack Developer', badge: 'Full-stack' },
      { name: 'Mr. Om R. Kulsange', role: 'Backend Developer', badge: 'Backend' },
      { name: 'Ms. Elizabeth S. Pawar', role: 'Backend Developer', badge: 'Backend' },
    ],
    responsibilities: [
      'Translating research algorithms into software',
      'Scalable, secure, and modular development',
      'Integration of experimental models into production',
    ],
  },
];

function BadgePill({ label, colorClass }) {
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${colorClass} ml-2 whitespace-nowrap`}>
      {label}
    </span>
  );
}

function SectionCard({ section, isOpen, onToggle }) {
  return (
    <div className={`rounded-2xl border ${section.borderColor} bg-white/70 backdrop-blur-sm shadow-md overflow-hidden transition-all`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/80 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${section.color} text-white shadow`}>
            {section.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{section.title}</h3>
            <p className="text-sm text-gray-500">{section.subtitle}</p>
          </div>
        </div>
        <ChevronRight
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Body */}
      {isOpen && (
        <div className={`px-6 pb-6 bg-gradient-to-br ${section.lightColor}`}>
          {/* Members grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {section.members.map((m, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white/80 rounded-xl p-3 border border-white shadow-sm"
              >
                <div className={`mt-0.5 w-2 h-2 rounded-full bg-gradient-to-br ${section.color} flex-shrink-0 mt-2`} />
                <div>
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-sm font-semibold text-gray-800">{m.name}</span>
                    {m.badge && (
                      <BadgePill
                        label={m.badge}
                        colorClass={`${section.textColor} bg-white border border-current/20`}
                      />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{m.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Responsibilities */}
          {section.responsibilities && (
            <div className="mb-4">
              <h4 className={`text-xs font-bold uppercase tracking-widest ${section.textColor} mb-2`}>
                Responsibilities
              </h4>
              <ul className="space-y-1">
                {section.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <Star className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${section.textColor}`} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Patent block */}
          {section.patent && (
            <div className="mt-2 bg-white/90 rounded-xl p-4 border border-purple-100 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-3">
                Patent Details
              </h4>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Inventors</p>
                  {section.patent.inventors.map((n, i) => (
                    <p key={i} className="text-gray-500 text-xs">{n}</p>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Applicants</p>
                  {section.patent.applicants.map((n, i) => (
                    <p key={i} className="text-gray-500 text-xs">{n}</p>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Sub-Contributors</p>
                  {section.patent.subContributors.map((n, i) => (
                    <p key={i} className="text-gray-500 text-xs">{n}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Single member contributions (governing section) */}
          {section.members[0]?.contributions && (
            <ul className="space-y-1 mt-2">
              {section.members[0].contributions.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <Star className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${section.textColor}`} />
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function CreditsPage() {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({ governing: true, research: true });

  const toggle = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 mb-6 shadow-sm">
            <Users className="w-4 h-4 text-blue-500" />
            QMetric Team
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Credits &{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Contributions
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            QMetric is the result of collaborative effort across research, design, and engineering.
            This page recognizes every individual who made it possible.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-4">
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            isOpen={!!openSections[section.id]}
            onToggle={() => toggle(section.id)}
          />
        ))}

        {/* Declaration */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm shadow-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4 shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Declaration</h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm leading-relaxed">
            This Major Academic Project has been carried out under the guidance and supervision
            of the above-mentioned contributors. All work complies with institutional academic
            standards, ethical research practices, and originality requirements.
          </p>
        </div>

        {/* Back link */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </section>
    </div>
  );
}