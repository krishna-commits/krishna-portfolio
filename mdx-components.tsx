import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/callout";
import { FlowDiagram } from "@/components/flow-diagram";

// Components available in every .mdx file without importing.
const components: MDXComponents = {
  Callout,
  FlowDiagram,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
