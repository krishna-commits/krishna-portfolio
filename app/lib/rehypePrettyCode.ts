import { type Options } from "rehype-pretty-code"
import { visit } from "unist-util-visit"


// div.BLOCK > pre.PRE > code.CODE
const BLOCK =
  "overflow-hidden rounded-lg bg-rose-100/5 shadow-surface-elevation-low ring-1 ring-rose-100/[3%] ring-inset"
const TITLE =
  "mb-0.5 rounded-md bg-green-100/10 px-3 py-1 font-mono text-xs text-green-100/70 shadow-sm"
const PRE = "overflow-x-auto py-2 text-[13px] leading-6 [color-scheme:dark]"
const CODE =
  "grid [&>span]:border-l-4 [&>span]:border-l-transparent [&>span]:pl-2 [&>span]:pr-3 pr-10"
const INLINE_BLOCK =
  "whitespace-nowrap px-1.5 pt-[0.5px] pb-[1px] text-[15px] rounded-sm bg-cyan-800/10 whitespace-nowrap text-cyan-600"
const INLINE_CODE = ""
const NUMBERED_LINES =
  "[counter-reset:line] before:[&>span]:mr-3 before:[&>span]:inline-block before:[&>span]:w-4 before:[&>span]:text-right before:[&>span]:text-white/20 before:[&>span]:![content:counter(line)] before:[&>span]:[counter-increment:line]"
const HIGHLIGHTED_LINE =
  "!border-l-rose-300/70 bg-rose-200/10 before:!text-white/70"
const YELLOW_TEXT = "text-yellow-500"
const IMAGE = "border rounded-sm max-w-2xl mx-auto bg-slate-100 mb-0"
const TEXT_CONTAINER = "text-gray-500 text-center mt-2 flex justify-center items-center font-serif italic";
const SOURCE_TEXT = "text-cyan-500 text-xs ml-2 italic hover:text-cyan-600 "; // Add margin for spacing

export function rehypePrettyCodeClasses() {
  return (tree: any) => {

    visit(
      tree,
      (node: any) => node.tagName === "img", // Check for <img> tags
      (node: any, index: number | null, parent: any) => {
        // Add classes to the image
        node.properties.className = [IMAGE];

        // Check if the image has alt text and a parent node
        if (node.properties.alt && parent && Array.isArray(parent.children) && index !== null) {
          // Create a new <p> element for the alt text and source link
          const textContainer = {
            type: "element",
            tagName: "p",
            properties: { className: TEXT_CONTAINER },
            children: [
              { type: "text", value: node.properties.alt }, // Alt text
              {
                type: "element",
                tagName: "a",
                properties: {
                  href: node.properties.src, // Use the image src as the link
                  target: "_blank", // Open the link in a new tab
                  rel: "noopener noreferrer", // Security best practices for external links
                  className: SOURCE_TEXT,
                },
                children: [
                  // { type: "text", value: "Source " },
                  // Add the provided SVG icon here
                  {
                    type: "element",
                    tagName: "svg",
                    properties: {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "24",
                      height: "24",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      className: "ml-1 w-4 h-4", // Tailwind classes for spacing
                    },
                    children: [
                      { 
                        type: "element", 
                        tagName: "path", 
                        properties: { d: "M15 3h6v6" } 
                      },
                      { 
                        type: "element", 
                        tagName: "path", 
                        properties: { d: "M10 14 21 3" } 
                      },
                      { 
                        type: "element", 
                        tagName: "path", 
                        properties: { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" } 
                      },
                    ],
                  },
                ],
              },
            ],
          };

          // Insert the text container <p> element after the <img>
          parent.children.splice(index + 1, 0, textContainer);
        }
      }
    );
    

    visit(
      tree,
      (node: any) =>
        Boolean(
          node.tagName === "code" &&
            Object.keys(node.properties).length === 0 &&
            node.children.some((n: any) => n.type === "text"),
        ),
      (node: any) => {
        const textNode = node.children.find((n: any) => n.type === "text")
        textNode.type = "element"
        textNode.tagName = "code"
        textNode.properties = { className: [INLINE_CODE] }
        textNode.children = [{ type: "text", value: textNode.value }]
        node.properties.className = [INLINE_BLOCK]
        node.tagName = "span"
      },
    )

    visit(
      tree,
      (node: any) =>
        Boolean(
          typeof node?.properties?.["data-rehype-pretty-code-fragment"] !==
            "undefined",
        ),
      (node: any) => {
        if (node.tagName === "span") {
          node.properties.className = [
            ...(node.properties.className || []),
            INLINE_BLOCK,
          ]
          node.children[0].properties.className = [
            ...(node.children[0].properties.className || []),
            INLINE_CODE,
          ]

          return node
        }

        if (node.tagName === "div") {
          node.properties.className = [
            ...(node.properties.className || []),
            BLOCK,
          ]
          node.children = node.children.map((node: any) => {
            if (
              node.tagName === "div" &&
              typeof node.properties?.["data-rehype-pretty-code-title"] !==
                "undefined"
            ) {
              node.properties.className = [
                ...(node.properties.className || []),
                TITLE,
              ]
            }

      

            if (node.tagName === "pre") {
              node.properties.className = [PRE]
              if (node.children[0].tagName === "code") {
                node.children[0].properties.className = [
                  ...(node.children[0].properties.className || []),
                  CODE,
                ]
                if (
                  typeof node.children[0].properties["data-line-numbers"] !==
                  "undefined"
                ) {
                  node.children[0].properties.className.push(NUMBERED_LINES)
                }
              }
            }

            return node
          })

          return node
        }
      },
    )
  
    visit(
      tree,
      (node: any) =>
        Boolean(
          node.tagName === "mark" &&
          typeof node.properties?.["data-highlighted-chars"] !== "undefined"
        ),
      (node: any) => {
        node.properties.className = `
          bg-rose-600 py-[0.7px] border-b border-rose-400 
        `;
        node.children[0].properties.style = `color:#fff`
      }
    )

    visit(
      tree,
      (node: any) => node.tagName === "table",
      (node: any, index: number | null, parent: any) => {
        if (index === null || !parent) return; 
        // Define the wrapper div with the class you want
        const wrapper = {
          type: "element",
          tagName: "div",
          properties: {
            className: "overflow-x-auto", // Your custom classes for responsiveness
          },
          children: [node], // Place the table inside the wrapper
        };
    
        // Apply table-specific classes
        node.properties.className = [
          "w-full",
          "text-sm",
          "text-left",
          "rtl:text-right",
          "text-gray-500",
          "dark:text-gray-400",
          "border-collapse",
          "border",
          "border-gray-300",
          "rounded-lg",
          "overflow-hidden",
        ];
    
        // Replace the original table node in the parent’s children array with the wrapper div
        parent.children[index] = wrapper;
      }
    );

    
    visit(
      tree,
      (node: any) =>
        Boolean(
          node.tagName === "table" 
        ),
      (node: any) => {
        node.properties.className = `
          w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border pt-3 my-3
        `;
      }
    )

    visit(
      tree,
      (node: any) =>
        Boolean(
          node.tagName === "thead" 
        ),
      (node: any) => {
        node.properties.className = `
          bg-slate-400
        `;
      }
    )

    visit(
      tree,
      (node: any) =>
        Boolean(
          node.tagName === "tr" 
        ),
      (node: any) => {
        node.properties.className = `
          even:bg-slate-100 odd:bg-background dark:even:bg-slate-900
        `;
      }
    )


  }
}

export const rehypePrettyCodeOptions: Partial<Options> = {
  theme: "one-dark-pro",
  // theme: {
  //   dark: "github-dark-dimmed",
  //   light: "github-light",
  // },
  keepBackground: false,
  tokensMap: {
    fn: "entity.name.function",
    objKey: "meta.object-literal.key",
  },
  filterMetaString: (string) => string.replace(/filename="[^"]*"/, ""),
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }]
    }
    node.properties.className = [""]
  },

  onVisitHighlightedLine(node) {
    node.properties.className = [HIGHLIGHTED_LINE]
  },
}