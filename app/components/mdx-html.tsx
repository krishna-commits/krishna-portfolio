/** Server-rendered HTML body for admin-edited MDX stored in the database. */
export function MdxHtmlBody({ html }: { html: string }) {
	return (
		<div
			className="prose dark:prose-invert max-w-none"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	)
}
