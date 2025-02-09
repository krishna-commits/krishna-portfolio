export default function Stroke() {
return(
    <div className="absolute inset-0 -z-10 overflow-hidden">
    <svg
      className="absolute left-[max(50%,25rem)] top-0 h-[90rem] w-[128rem] -translate-x-1/2 stroke-slate-200 dark:stroke-gray-900 [mask-image:radial-gradient(100rem_50rem_at_top,white,transparent)] "
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="e813992c-7d03-4cc4-a2bd-151760b470a0"
          width={200}
          height={200}
          x="50%"
          y={-1}
          patternUnits="userSpaceOnUse"
        >
          <path d="M100 200V.5M.5 .5H200" fill="none" />
        </pattern>
      </defs>
      <svg x="50%" y={-1} className="overflow-visible fill-slate-200 dark:fill-slate-900/10">
        <path
          d="
          M-100 0h200v200h-200Z 
          M-700 200h200v200h-200Z 
          M-300 600h200v200h-200Z 
          M-700 600h200v200h-200Z 
          "
          strokeWidth={0}
        />
      </svg>
      <rect width="100%" height="100%" strokeWidth={0} fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
    </svg>
  </div>

)
}