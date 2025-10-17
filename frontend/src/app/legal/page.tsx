'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PortugalHeader from '@/components/PortugalHeader';
import { ChevronDown, ChevronRight, FileText, Download, ExternalLink } from 'lucide-react';

interface LegalSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  sections: {
    id: string;
    title: string;
    content: string;
    requirements?: string[];
    documents?: string[];
    timeframe?: string;
    cost?: string;
  }[];
}

export default function LegalPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>('visa-types');

  const legalSections: LegalSection[] = [
    {
      id: 'visa-types',
      title: 'Visa & Residency Options',
      description: 'Complete guide to all visa types available for UK citizens moving to Portugal',
      icon: '🛂',
      sections: [
        {
          id: 'digital-nomad',
          title: 'Digital Nomad Visa (Temp Stay Visa)',
          content:
            'Perfect for remote workers and freelancers. Allows you to live in Portugal while working for foreign companies or clients.',
          requirements: [
            'Proof of remote work or freelancing (contracts, employment letter)',
            'Monthly income of at least €3,040 (4x Portuguese minimum wage)',
            'Health insurance covering Portugal',
            'Clean criminal record certificate',
            'Proof of accommodation in Portugal',
          ],
          documents: [
            'Completed visa application form',
            'Valid passport (6+ months validity)',
            'Employment contract or freelance agreements',
            'Bank statements (last 3 months)',
            'Health insurance certificate',
            'Criminal record certificate (apostilled)',
            'Proof of accommodation',
          ],
          timeframe: '2-3 months processing time',
          cost: '€90 visa fee + document costs (~€200-400 total)',
        },
        {
          id: 'd7-visa',
          title: 'D7 Visa (Retirement/Passive Income)',
          content:
            'For retirees, pensioners, or those with passive income. Lower income requirements than other visas.',
          requirements: [
            'Monthly passive income of €700+ (Portuguese minimum wage)',
            'Proof of accommodation in Portugal',
            'Health insurance',
            'Clean criminal record',
            'No intention to work in Portugal (initially)',
          ],
          documents: [
            'Completed D7 visa application',
            'Valid passport',
            'Proof of passive income (pension, investments, rental income)',
            'Portuguese bank account proof',
            'Accommodation proof (rental/purchase)',
            'Health insurance certificate',
            'Criminal record certificate (apostilled)',
          ],
          timeframe: '3-6 months processing time',
          cost: '€90 visa fee + document costs (~€300-500 total)',
        },
        {
          id: 'd2-visa',
          title: 'D2 Visa (Entrepreneur/Investment)',
          content: 'For those starting a business or making significant investments in Portugal.',
          requirements: [
            'Business plan for Portuguese company',
            'Minimum investment €5,000-€50,000 (depending on business type)',
            'Proof of funds to support yourself',
            'Clean criminal record',
            'Health insurance',
          ],
          timeframe: '3-6 months processing time',
          cost: '€90 visa fee + business setup costs (€2,000+ total)',
        },
      ],
    },
    {
      id: 'exit-uk',
      title: 'Leaving the UK: What You Need to Do',
      description: 'Essential steps for UK residents before moving to Portugal',
      icon: '🇬🇧',
      sections: [
        {
          id: 'tax-obligations',
          title: 'Tax Obligations & HMRC',
          content:
            'You must inform HMRC when you become non-resident for tax purposes. This affects income tax, capital gains, and other obligations.',
          requirements: [
            'Complete form P85 (leaving the UK permanently)',
            'Inform HMRC of your departure date',
            'Close or transfer UK bank accounts if needed',
            'Understand tax residency rules (183-day rule)',
            'Consider Double Tax Treaty between UK-Portugal',
          ],
          timeframe: 'Complete before leaving UK',
          cost: 'Free (but may need accountant advice £200-500)',
        },
        {
          id: 'healthcare',
          title: 'Healthcare & NHS',
          content: 'Understand how your healthcare coverage changes when moving to Portugal.',
          requirements: [
            'Apply for GHIC (Global Health Insurance Card) before leaving',
            'Inform your GP of your departure',
            'Get medical records/prescriptions',
            'Understand Portuguese healthcare system (SNS)',
            'Consider private health insurance during transition',
          ],
          cost: 'GHIC is free, private insurance €50-200/month',
        },
        {
          id: 'pensions',
          title: 'Pensions & Benefits',
          content: 'How to handle UK pensions and benefits when moving abroad.',
          requirements: [
            'Inform DWP of your move abroad',
            'Understand pension payment rules (frozen/unfrozen)',
            'Set up international bank transfers',
            'Consider Portuguese tax on UK pension income',
            'Check eligibility for Portuguese benefits',
          ],
        },
      ],
    },
    {
      id: 'portugal-setup',
      title: 'Setting Up Life in Portugal',
      description: 'Practical steps for establishing residency and daily life',
      icon: '🇵🇹',
      sections: [
        {
          id: 'numero-fiscal',
          title: 'NIF (Número de Identificação Fiscal)',
          content:
            'Your Portuguese tax number - essential for everything from renting to buying property.',
          requirements: [
            'Passport or ID',
            'Proof of address (can be temporary)',
            'Tax representative if non-resident (fiscal representative)',
          ],
          timeframe: 'Same day application at Finanças office',
          cost: 'Free',
        },
        {
          id: 'bank-account',
          title: 'Portuguese Bank Account',
          content: 'Required for most financial transactions and proof of income for residency.',
          requirements: [
            'NIF (tax number)',
            'Passport',
            'Proof of address in Portugal',
            'Employment contract or proof of income',
            'Initial deposit (usually €50-200)',
          ],
          timeframe: '1-2 weeks',
          cost: '€0-30/month account fees',
        },
        {
          id: 'sns-utente',
          title: 'SNS Healthcare Registration',
          content: 'Register for Portuguese National Health Service (free healthcare).',
          requirements: [
            'Valid residency permit or EU citizen ID',
            'NIF number',
            'Proof of address',
            'Health questionnaire',
          ],
          timeframe: '2-4 weeks',
          cost: 'Free',
        },
      ],
    },
    {
      id: 'property',
      title: 'Property Purchase & Legal Requirements',
      description: 'Complete guide to buying property in Portugal as a foreigner',
      icon: '🏠',
      sections: [
        {
          id: 'property-search',
          title: 'Finding & Evaluating Property',
          content: 'What to look for and legal checks required when buying property.',
          requirements: [
            'Hire Portuguese lawyer (mandatory for foreigners)',
            'Property survey/inspection',
            'Urban planning certificate check',
            'Verify property ownership (Conservatória)',
            'Check for debts/liens on property',
          ],
          cost: 'Lawyer fees 1-2% of property value',
        },
        {
          id: 'property-taxes',
          title: 'Property Taxes & Ongoing Costs',
          content: 'Understanding IMI, IMT, and other property-related taxes.',
          requirements: [
            'IMT (Municipal Property Transfer Tax): 0-8% of value',
            'Stamp duty: 0.8% of property value',
            'Annual IMI (Municipal Property Tax): 0.3-0.8% of value',
            'Legal fees: 1-2% of property value',
            'Notary fees: €200-600',
          ],
        },
      ],
    },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <main className="renewable-gradient portugal-pattern min-h-screen">
      <div className="portugal-accent w-full"></div>
      <PortugalHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-primary">UK to Portugal Legal Guide</h1>
          <p className="text-lg text-muted-foreground">
            Complete step-by-step guidance for relocating from the UK to Portugal
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-500" />
                <div>
                  <h3 className="font-semibold">Visa Checker Tool</h3>
                  <p className="text-sm text-muted-foreground">
                    Find the right visa for your situation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Download className="h-6 w-6 text-green-500" />
                <div>
                  <h3 className="font-semibold">Document Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Download required forms and checklists
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ExternalLink className="h-6 w-6 text-purple-500" />
                <div>
                  <h3 className="font-semibold">Official Links</h3>
                  <p className="text-sm text-muted-foreground">
                    Direct links to government websites
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legal Sections */}
        <div className="space-y-6">
          {legalSections.map((section) => (
            <Card key={section.id} className="overflow-hidden">
              <CardHeader
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{section.icon}</span>
                    <div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                  </div>
                  {expandedSection === section.id ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </div>
              </CardHeader>

              {expandedSection === section.id && (
                <CardContent className="space-y-6">
                  {section.sections.map((subsection) => (
                    <div key={subsection.id} className="border-l-2 border-primary/20 pl-4">
                      <h4 className="mb-2 text-lg font-semibold text-primary">
                        {subsection.title}
                      </h4>
                      <p className="mb-4 text-muted-foreground">{subsection.content}</p>

                      <div className="grid gap-4 md:grid-cols-2">
                        {subsection.requirements && (
                          <div>
                            <h5 className="mb-2 font-medium">Requirements:</h5>
                            <ul className="space-y-1 text-sm">
                              {subsection.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-green-600">✓</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {subsection.documents && (
                          <div>
                            <h5 className="mb-2 font-medium">Required Documents:</h5>
                            <ul className="space-y-1 text-sm">
                              {subsection.documents.map((doc, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-blue-600">📄</span>
                                  <span>{doc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {(subsection.timeframe || subsection.cost) && (
                        <div className="mt-4 flex gap-4">
                          {subsection.timeframe && (
                            <Badge variant="outline" className="text-orange-600">
                              ⏱️ {subsection.timeframe}
                            </Badge>
                          )}
                          {subsection.cost && (
                            <Badge variant="outline" className="text-green-600">
                              💰 {subsection.cost}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold">Official Government Links</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="https://www.vistos.mne.pt"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Portuguese Visa Portal
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://eportugal.gov.pt"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      ePortugal Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.gov.uk/leaving-uk-moving-abroad"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      UK Gov: Moving Abroad
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.seg-social.pt"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Portuguese Social Security
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">Professional Services</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Immigration lawyers in Portugal</li>
                  <li>• UK-Portugal tax specialists</li>
                  <li>• Document translation services</li>
                  <li>• Relocation assistance companies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
