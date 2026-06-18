'use client'

import { motion } from 'framer-motion'
import {
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Tooltip,
	RadialBarChart,
	RadialBar,
	Legend,
} from 'recharts'
import { cn } from 'app/theme/lib/utils'
import { PAGE_CARD } from 'lib/page-layout'

export function EnhancedDonutChart({
	data,
	colors,
	centerValue,
	centerLabel,
	title,
}: {
	data: { name: string; value: number }[]
	colors: string[]
	centerValue?: string | number
	centerLabel?: string
	title: string
}) {
	const total = data.reduce((sum, item) => sum + item.value, 0)

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.98 }}
			whileInView={{ opacity: 1, scale: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.4 }}
			className={cn(PAGE_CARD, 'relative p-4 transition-shadow hover:shadow-md sm:p-5')}
		>
			<h4 className="mb-3 text-center text-xs font-semibold text-foreground sm:mb-4 sm:text-sm">{title}</h4>
			<div className="relative h-48 sm:h-56">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							innerRadius={50}
							outerRadius={80}
							paddingAngle={4}
							dataKey="value"
							animationBegin={0}
							animationDuration={600}
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${entry.name}`} fill={colors[index]} stroke="transparent" />
							))}
						</Pie>
						<Tooltip
							formatter={(value: number, name: string) => {
								const percent = ((value / total) * 100).toFixed(1)
								return [`${value.toLocaleString()} (${percent}%)`, name]
							}}
							contentStyle={{
								backgroundColor: 'hsl(var(--card))',
								border: '1px solid hsl(var(--border))',
								borderRadius: '8px',
								padding: '8px 12px',
								fontSize: '12px',
							}}
						/>
					</PieChart>
				</ResponsiveContainer>

				{centerValue !== undefined && (
					<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
						<div className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
							{typeof centerValue === 'number' ? centerValue.toLocaleString() : centerValue}
						</div>
						{centerLabel && (
							<div className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">{centerLabel}</div>
						)}
					</div>
				)}
			</div>

			<div className="mt-3 flex flex-wrap justify-center gap-2 sm:mt-4 sm:gap-3">
				{data.map((entry, index) => (
					<div key={entry.name} className="flex items-center gap-1.5">
						<div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[index] }} />
						<span className="text-xs font-medium text-muted-foreground">{entry.name}</span>
					</div>
				))}
			</div>
		</motion.div>
	)
}

export function RadialProgressChart({
	data,
	colors,
	title,
}: {
	data: { name: string; value: number }[]
	colors: string[]
	title: string
}) {
	const maxValue = Math.max(...data.map((item) => item.value))

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.98 }}
			whileInView={{ opacity: 1, scale: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.4 }}
			className={cn(PAGE_CARD, 'relative p-4 transition-shadow hover:shadow-md sm:p-5')}
		>
			<h4 className="mb-3 text-center text-xs font-semibold text-foreground sm:mb-4 sm:text-sm">{title}</h4>
			<div className="h-48 sm:h-56">
				<ResponsiveContainer width="100%" height="100%">
					<RadialBarChart
						innerRadius="40%"
						outerRadius="90%"
						data={data.map((item, index) => ({
							...item,
							fill: colors[index],
							max: maxValue,
						}))}
						startAngle={90}
						endAngle={-270}
					>
						<RadialBar dataKey="value" cornerRadius={6} animationDuration={800} />
						<Tooltip
							formatter={(value: number) => value.toLocaleString()}
							contentStyle={{
								backgroundColor: 'hsl(var(--card))',
								border: '1px solid hsl(var(--border))',
								borderRadius: '8px',
								padding: '8px 12px',
								fontSize: '12px',
							}}
						/>
						<Legend
							verticalAlign="bottom"
							height={24}
							formatter={(value) => (
								<span style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}>{value}</span>
							)}
						/>
					</RadialBarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	)
}

export function StatsChartPanel({
	chartType,
	chartData,
	colors,
	totalValue,
}: {
	chartType: 'donut' | 'radial'
	chartData: { name: string; value: number }[]
	colors: string[]
	totalValue: number
}) {
	if (chartType === 'donut') {
		return (
			<EnhancedDonutChart
				data={chartData}
				colors={colors}
				centerValue={totalValue}
				centerLabel="Total"
				title="Distribution"
			/>
		)
	}

	return <RadialProgressChart data={chartData} colors={colors} title="Distribution" />
}
