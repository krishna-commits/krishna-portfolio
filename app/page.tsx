import HomePage from "./home/page";
import { Metadata } from 'next'
import { generatePageMetadata } from './metadata'

export const metadata: Metadata = generatePageMetadata({
	title: 'Home',
	description: 'Senior DevSecOps Engineer | Applied Security Researcher. Designing security-first cloud systems with structured research notes and production-grade automation.',
	path: '/',
})

export default function Page() {
  return <HomePage/>
}
