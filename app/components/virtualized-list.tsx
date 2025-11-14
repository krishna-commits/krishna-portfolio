'use client'

import { useMemo, ReactNode } from 'react'
import { FixedSizeGrid, FixedSizeList } from 'react-window'

interface VirtualizedGridProps {
	items: any[]
	columns: number
	rowHeight: number
	height: number
	width: number
	renderItem: (item: any, index: number) => ReactNode
	gap?: number
}

/**
 * Virtualized Grid component for large lists
 */
export function VirtualizedGrid({
	items,
	columns,
	rowHeight,
	height,
	width,
	renderItem,
	gap = 16,
}: VirtualizedGridProps) {
	const rows = Math.ceil(items.length / columns)

	const Cell = ({ columnIndex, rowIndex, style }: any) => {
		const index = rowIndex * columns + columnIndex
		if (index >= items.length) return null

		return (
			<div
				style={{
					...style,
					padding: gap / 2,
				}}
			>
				{renderItem(items[index], index)}
			</div>
		)
	}

	return (
		<FixedSizeGrid
			columnCount={columns}
			columnWidth={width / columns}
			height={height}
			rowCount={rows}
			rowHeight={rowHeight + gap}
			width={width}
		>
			{Cell}
		</FixedSizeGrid>
	)
}

interface VirtualizedListProps {
	items: any[]
	itemHeight: number
	height: number
	width: number
	renderItem: (item: any, index: number) => ReactNode
}

/**
 * Virtualized List component for long lists
 */
export function VirtualizedList({
	items,
	itemHeight,
	height,
	width,
	renderItem,
}: VirtualizedListProps) {
	const Row = ({ index, style }: any) => {
		return (
			<div style={style}>
				{renderItem(items[index], index)}
			</div>
		)
	}

	return (
		<FixedSizeList
			height={height}
			itemCount={items.length}
			itemSize={itemHeight}
			width={width}
		>
			{Row}
		</FixedSizeList>
	)
}

