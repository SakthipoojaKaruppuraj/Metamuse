import { Hero } from '@/components/landing/hero'
import { Problem, Solution } from '@/components/landing/problem-solution'
import { WhyExists } from '@/components/landing/why-exists'
import {
  ProvenancePreview,
  EvidencePreview,
  MonadPreview,
  HowItWorksStrip,
  FinalCta,
} from '@/components/landing/previews'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Solution />
      <WhyExists />
      <ProvenancePreview />
      <EvidencePreview />
      <MonadPreview />
      <HowItWorksStrip />
      <FinalCta />
    </>
  )
}
