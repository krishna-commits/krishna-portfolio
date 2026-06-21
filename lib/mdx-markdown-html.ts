// Plugin types conflict across nested unified versions — runtime pipeline is valid.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

/** Render MDX/markdown body to HTML for admin-edited DB content at runtime. */
export async function markdownBodyToHtml(body: string): Promise<string> {
	const file = await remark()
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeStringify)
		.process(body)
	return String(file)
}
