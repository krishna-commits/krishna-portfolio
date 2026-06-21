import { allProjects, allResearchCores } from 'contentlayer/generated'

/** Server-only counts — do not import from client components. */
export const RESEARCH_CORE_COUNT = allResearchCores.length
export const PROJECT_COUNT = allProjects.length
