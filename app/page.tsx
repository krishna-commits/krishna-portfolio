import HomePage from "./home/page";
import { Metadata } from 'next'
import { generatePageMetadata } from './metadata'

export const metadata: Metadata = generatePageMetadata({
	title: 'Home',
	description: 'DevSecOps Engineer | DevOps Enthusiast | Cybersecurity Learner | Aspiring Researcher. Designing security-first cloud systems that earn trust from academic peers and global enterprises.',
	path: '/',
})

export default function Page() {
  return <HomePage/>
}
