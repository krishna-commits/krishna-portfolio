import { ImageResponse } from 'next/og'
import { siteConfig } from 'config/site'

export const runtime = 'edge'
export const alt = `${siteConfig.name}  Senior DevSecOps Engineer | Applied Security Researcher`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
	return new ImageResponse(
		(
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #451a03 100%)',
					padding: 64,
					fontFamily: 'system-ui, sans-serif',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
					<div
						style={{
							width: 56,
							height: 56,
							borderRadius: 14,
							background: 'linear-gradient(135deg, #fbbf24, #f97316)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 28,
						}}
					>
						🛡️
					</div>
					<span style={{ color: '#f8fafc', fontSize: 28, fontWeight: 700 }}>{siteConfig.name}</span>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
					<div
						style={{
							color: '#fbbf24',
							fontSize: 52,
							fontWeight: 800,
							lineHeight: 1.1,
							maxWidth: 900,
						}}
					>
						Senior DevSecOps Engineer
					</div>
					<div style={{ color: '#e2e8f0', fontSize: 36, fontWeight: 600, maxWidth: 900 }}>
						Applied Security Researcher
					</div>
					<div style={{ color: '#94a3b8', fontSize: 24, maxWidth: 800 }}>
						Security-first cloud infrastructure · CI/CD · threat detection
					</div>
				</div>
				<div style={{ color: '#64748b', fontSize: 22 }}>krishnaneupane.com</div>
			</div>
		),
		{ ...size },
	)
}
