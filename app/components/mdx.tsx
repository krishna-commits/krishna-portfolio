'use client'
import { useState, Children, isValidElement } from "react";
import Image from "next/image"
import { useMDXComponent } from "next-contentlayer/hooks"
import { MermaidDiagram } from "app/research-core/components/mermaid-diagram"
import { SeniorGapChecklist } from "app/research-core/components/senior-gap-checklist"

interface CopyButtonProps {
  text: string;
}
interface PreProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: React.ReactNode;
  raw?: string;
  'data-language'?: string;
}

const CopyButton = ({ text }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 10000);
  };

  return (
    <button className="border bg-transparent h-6  text-xs hover:bg-slate-700 text-slate-300 font-mono hover:text-white px-2  border-slate-500 hover:border-transparent rounded" disabled={isCopied} onClick={copy}>
      {isCopied ? "Copied!" : "Copy"}
    </button>
  );
};

function extractTextFromPre(children: React.ReactNode): string {
	if (typeof children === 'string') return children
	if (Array.isArray(children)) return children.map(extractTextFromPre).join('')
	if (isValidElement(children) && children.props?.children) {
		return extractTextFromPre(children.props.children)
	}
	return ''
}

const Pre = ({ children, raw, ...props }: PreProps) => {
	const language = props['data-language']
	const textContent = raw ?? extractTextFromPre(children)

	if (language === 'mermaid') {
		return <MermaidDiagram chart={textContent} />
	}

  return (
    <pre {...props} className={"p-4 relative dark:bg-slate-800 "}>
      <div className={"code-header flex justify-end mr-2 mt-0 absolute right-0"}>
        <CopyButton text={textContent} />
      </div>
      {children}
    </pre>
  );
};


const components = {
  Image,
  SeniorGapChecklist,
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="mb-2 pb-0"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mb-2 pb-0 mt-2"
      {...props}
    />
  ),
  pre: Pre,
  figcaption: (props: React.HTMLAttributes<HTMLElement>) => (
    <p
      className="mb-1 rounded-md bg-zinc-900/15 dark:bg-rose-100/10 px-3 py-1 font-mono text-xs text-primary-300/70 shadow-sm"
      {...props}
    />
  ),
}

interface MdxProps {
  code: string
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code)

  return <Component components={components} />
  
}
