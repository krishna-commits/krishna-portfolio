'use client'
import { useEffect, useState, useRef } from "react";
import Image from "next/image"
import { useMDXComponent } from "next-contentlayer/hooks"
import mermaid from 'mermaid';

interface CopyButtonProps {
  text: string;
}
interface PreProps {
  children: any;
  raw: any;
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

const Pre = ({ children, raw, ...props }: PreProps) => {

  const textContent = Array.isArray(children) ? children.map(child => child?.props.children).join('') : children?.props.children;

  return (
    <pre {...props} className={"p-4 relative dark:bg-slate-800 "}>
      <div className={"code-header flex justify-end mr-2 mt-0 absolute right-0"}>
        <CopyButton text={textContent} /> {/* Pass raw text to CopyButton */}
      </div>
      {children}
    </pre>
  );
};


const components = {
  Image,
  h1: (props: any) => (
    <h1
      className="mb-2 pb-0"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="mb-2 pb-0 mt-2"
      {...props}
    />
  ),
  pre: Pre,
  figcaption: (props: any) => (
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