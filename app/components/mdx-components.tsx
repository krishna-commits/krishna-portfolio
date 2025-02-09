// import Image from "next/image"
// import { useMDXComponent } from "next-contentlayer/hooks"

// const components = {
//   Image,
// }

// interface MdxProps {
//   code: string
// }

// export function Mdx({ code }: MdxProps) {
//   const Component = useMDXComponent(code)

//   return <Component components={components} />
// }

import dynamic from 'next/dynamic';
import { useMDXComponent } from 'next-contentlayer/hooks';

const components = {
  Image: dynamic(() => import('next/image'), { ssr: false }),
};

interface MdxProps {
  code: string;
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code);

  return <Component components={components} />;
}
