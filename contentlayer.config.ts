import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypePrettyCode from "rehype-pretty-code"
import rehypeHighlight from 'rehype-highlight'
import {
  rehypePrettyCodeClasses,
  rehypePrettyCodeOptions,
} from "./app/lib/rehypePrettyCode"
import remarkGfm from "remark-gfm"; 

export const HEADING_LINK_ANCHOR = `before:content-['#'] before:absolute before:-ml-[1em] before:text-rose-100/0 hover:before:text-rose-100/50 pl-[1em] -ml-[1em]`

// Define document type for blog posts
export const BlogPost = defineDocumentType(() => ({
  name: "BlogPost",
  filePathPattern: `blog/**/*.mdx`, // Type of file to parse (every mdx in the blog subfolder)
  contentType: 'mdx',
  fields: {
    highlight: {
      type: "boolean",
      description: "Highlight this post in listings",
      required: false,
    },
    title: {
      type: "string",
      description: "The title of the blog post",
      required: true,
    },
    date: {
      type: "date",
      description: "The date of the blog post",
      required: true,
    },
    description: {
      type: "string",
      description: "The description of the blog post",
      required: false,
    },
    short_description: {
      type: "string",
      description: "The short description of the blog post",
      required: false,
    },
    keywords: {
      type: "list",
      of: { type: "string" },
      description: "Keywords/tags for the post",
      required: false,
    },
    link: {
      type: "string",
      description: "The link of the blog post",
      required: false,
    },
    source: {
      type: "string",
      description: "The original source of the blog post",
      required: false,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/blog/${post._raw.flattenedPath}`,
    },
    slug: {
      type: "string",
      resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
    slugAsParams: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
    },
  },
}));

// Define document type for ResearchCore
export const ResearchCore = defineDocumentType(() => ({
  name: "ResearchCore",
  filePathPattern: `research-core/**/*.mdx`, // Type of file to parse (every mdx in the ResearchCore subfolder)
  contentType: 'mdx',
  fields: {
    highlight: {
      type: "boolean",
      description: "Highlight this entry in listings",
      required: false,
    },
    title: {
      type: "string",
      description: "The title of the blog post",
      required: true,
    },
    date: {
      type: "date",
      description: "The date of the blog post",
      required: false,
    },
    description: {
      type: "string",
      description: "The description of the blog post",
      required: false,
    },
    venue: {
      type: "string",
      description: "Publication venue or context",
      required: false,
    },
    citationCount: {
      type: "number",
      description: "Number of citations",
      required: false,
    },
    collaborators: {
      type: "list",
      of: { type: "string" },
      description: "Collaborators / co-authors",
      required: false,
    },
    keywords: {
      type: "list",
      of: { type: "string" },
      description: "Keywords/tags for the entry",
      required: false,
    },
    parent: {
      type: "string",
      description: "The parent of the blog post",
      required: false,
    },
    grand_parent: {
      type: "string",
      description: "The grand parent of the blog post",
      required: false,
    },
    order: {
      type: "number",
      description: "The order of the blog post",
      required: false,
    },
    completed: {
      type: "boolean",
      description: "Denotes weather the note is completed",
      required: false,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (researchcore) => `/${researchcore._raw.flattenedPath}`,
    },
    slug: {
      type: "string",
      resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
    slugAsParams: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
    },
  },
}));

export const Mantras = defineDocumentType(() => ({
  name: "Mantras",
  filePathPattern: `mantras/**/*.mdx`, // Type of file to parse (every mdx in the ResearchCore subfolder)
  contentType: 'mdx',
  fields: {
    highlight: {
      type: "boolean",
      description: "Highlight this entry",
      required: false,
    },
    title: {
      type: "string",
      description: "The title of the blog post",
      required: true,
    },
    date: {
      type: "date",
      description: "The date of the blog post",
      required: false,
    },
    description: {
      type: "string",
      description: "The description of the blog post",
      required: false,
    },
    keywords: {
      type: "list",
      of: { type: "string" },
      description: "Keywords/tags",
      required: false,
    },
    parent: {
      type: "string",
      description: "The parent of the blog post",
      required: false,
    },
    grand_parent: {
      type: "string",
      description: "The grand parent of the blog post",
      required: false,
    },
    order: {
      type: "number",
      description: "The order of the blog post",
      required: false,
    },
    completed: {
      type: "boolean",
      description: "Denotes weather the note is completed",
      required: false,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (researchcore) => `/${researchcore._raw.flattenedPath}`,
    },
    slug: {
      type: "string",
      resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
    slugAsParams: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
    },
  },
}));



export const Projects = defineDocumentType(() => ({
  name: "Projects",
  filePathPattern: `projects/**/*.mdx`, // Type of file to parse (every mdx in the ResearchCore subfolder)
  contentType: 'mdx',
  fields: {
    highlight: {
      type: "boolean",
      description: "Highlight this project",
      required: false,
    },
    title: {
      type: "string",
      description: "The title of the blog post",
      required: true,
    },
    description: {
      type: "string",
      description: "The description of the blog post",
      required: false,
    },
    order: {
      type: "number",
      description: "The order of the blog post",
      required: false,
    },
    link: {
      type: "string",
      description: "The link of the blog post",
      required: false,
    },
    keywords: {
      type: "list",
      of: { type: "string" },
      description: "Keywords/tags for the project",
      required: false,
    },

  },
  computedFields: {
    url: {
      type: "string",
      resolve: (mantras) => `/${mantras._raw.flattenedPath}`,
    },
    slug: {
      type: "string",
      resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
    slugAsParams: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
    },
  },
}));


// Create source
export default makeSource({
  contentDirPath: "./content", // Source directory where the content is located
  documentTypes: [BlogPost, ResearchCore,Mantras, Projects],
  mdx: {
    remarkPlugins: [remarkGfm, 
    ],
    rehypePlugins: [
      [rehypePrettyCode,rehypePrettyCodeOptions] ,
      [rehypePrettyCodeClasses],
      [rehypeHighlight] as any
    ],
  },
});
