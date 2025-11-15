import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface MDXFile {
  slug: string;
  content: string;
  frontmatter: Record<string, any>;
  filePath: string;
}

/**
 * Parse MDX file with frontmatter
 */
export function parseMDXFile(filePath: string): MDXFile {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);
  
  return {
    slug: path.basename(filePath, '.mdx'),
    content,
    frontmatter,
    filePath,
  };
}

/**
 * Convert frontmatter object to YAML string
 */
export function stringifyFrontmatter(frontmatter: Record<string, any>): string {
  const lines: string[] = [];
  
  for (const [key, value] of Object.entries(frontmatter)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }
    
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map(v => typeof v === 'string' ? `"${v}"` : v).join(', ')}]`);
    } else if (typeof value === 'string' && (value.includes(':') || value.includes('\n'))) {
      lines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'number') {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'object') {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  
  return lines.join('\n');
}

/**
 * Create MDX file content from frontmatter and body
 */
export function createMDXContent(frontmatter: Record<string, any>, content: string): string {
  const frontmatterString = stringifyFrontmatter(frontmatter);
  return `---\n${frontmatterString}\n---\n\n${content}`;
}

/**
 * Get all MDX files in a directory recursively
 */
export function getAllMDXFiles(dirPath: string, baseDir: string = dirPath): MDXFile[] {
  const files: MDXFile[] = [];
  
  if (!fs.existsSync(dirPath)) {
    return files;
  }
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...getAllMDXFiles(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      try {
        files.push(parseMDXFile(fullPath));
      } catch (error) {
        console.error(`Error parsing ${fullPath}:`, error);
      }
    }
  }
  
  return files;
}

/**
 * Write MDX file
 */
export function writeMDXFile(filePath: string, frontmatter: Record<string, any>, content: string): void {
  const dir = path.dirname(filePath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const mdxContent = createMDXContent(frontmatter, content);
  fs.writeFileSync(filePath, mdxContent, 'utf-8');
}

/**
 * Delete MDX file
 */
export function deleteMDXFile(filePath: string): void {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

/**
 * Get relative path from content directory
 */
export function getRelativePath(filePath: string, contentDir: string = 'content'): string {
  const contentPath = path.resolve(process.cwd(), contentDir);
  return path.relative(contentPath, filePath);
}

/**
 * Get file path from relative path
 */
export function getFilePath(relativePath: string, contentDir: string = 'content'): string {
  const contentPath = path.resolve(process.cwd(), contentDir);
  return path.join(contentPath, relativePath);
}

