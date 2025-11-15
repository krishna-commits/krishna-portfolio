import fs from 'fs/promises';
import path from 'path';

export type ContentType = 'blog' | 'project' | 'research' | 'mantra';

interface FrontMatter {
  [key: string]: string | number | boolean | string[] | null | undefined;
}

/**
 * Generate frontmatter string from object
 */
export function generateFrontMatter(fields: FrontMatter): string {
  const lines = ['---'];
  
  Object.entries(fields).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      return; // Skip empty values
    }
    
    if (Array.isArray(value)) {
      if (value.length > 0) {
        lines.push(`${key}:`);
        value.forEach(item => {
          lines.push(`  - "${item}"`);
        });
      }
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'number') {
      lines.push(`${key}: ${value}`);
    } else {
      // String value - handle multiline
      const stringValue = String(value);
      if (stringValue.includes('\n')) {
        lines.push(`${key}: |`);
        stringValue.split('\n').forEach(line => {
          lines.push(`  ${line}`);
        });
      } else {
        lines.push(`${key}: "${stringValue.replace(/"/g, '\\"')}"`);
      }
    }
  });
  
  lines.push('---');
  return lines.join('\n');
}

/**
 * Parse frontmatter from MDX content
 */
export function parseFrontMatter(content: string): { frontmatter: FrontMatter; body: string } {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterText = match[1];
  const body = match[2];

  const frontmatter: FrontMatter = {};
  const lines = frontmatterText.split('\n');

  let currentKey = '';
  let currentArray: string[] = [];
  let isInArray = false;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Array item
    if (trimmed.startsWith('- ')) {
      if (!isInArray) {
        isInArray = true;
        currentArray = [];
      }
      const value = trimmed.substring(2).replace(/^["']|["']$/g, '');
      currentArray.push(value);
    } 
    // Key-value pair
    else if (trimmed.includes(':')) {
      // Save previous array if exists
      if (isInArray && currentKey) {
        frontmatter[currentKey] = currentArray;
        isInArray = false;
        currentArray = [];
      }

      const [key, ...valueParts] = trimmed.split(':');
      currentKey = key.trim();
      let value = valueParts.join(':').trim();

      // Remove quotes
      value = value.replace(/^["']|["']$/g, '');

      // Handle boolean and number
      if (value === 'true') {
        frontmatter[currentKey] = true;
      } else if (value === 'false') {
        frontmatter[currentKey] = false;
      } else if (!isNaN(Number(value)) && value !== '') {
        frontmatter[currentKey] = Number(value);
      } else if (value === '|') {
        // Multiline string - will be handled by next lines
        frontmatter[currentKey] = '';
      } else {
        frontmatter[currentKey] = value || null;
      }
    }
    // Multiline string continuation
    else if (currentKey && line.startsWith('  ')) {
      const existing = frontmatter[currentKey] as string || '';
      frontmatter[currentKey] = existing ? `${existing}\n${line.substring(2)}` : line.substring(2);
    }
  });

  // Save last array if exists
  if (isInArray && currentKey) {
    frontmatter[currentKey] = currentArray;
  }

  return { frontmatter, body };
}

/**
 * Get content directory path
 */
export function getContentDir(type: ContentType): string {
  const baseDir = process.cwd();
  const contentDir = path.join(baseDir, 'content');

  switch (type) {
    case 'blog':
      return path.join(contentDir, 'blog');
    case 'project':
      return path.join(contentDir, 'projects');
    case 'research':
      return path.join(contentDir, 'research-core');
    case 'mantra':
      return path.join(contentDir, 'mantras');
    default:
      return contentDir;
  }
}

/**
 * Get full file path for content
 */
export function getContentFilePath(
  type: ContentType,
  filename: string,
  subfolder?: string
): string {
  const contentDir = getContentDir(type);
  if (subfolder) {
    return path.join(contentDir, subfolder, filename);
  }
  return path.join(contentDir, filename);
}

/**
 * Read MDX file
 */
export async function readMDXFile(
  type: ContentType,
  filepath: string
): Promise<{ frontmatter: FrontMatter; body: string; fullPath: string }> {
  const contentDir = getContentDir(type);
  const fullPath = path.isAbsolute(filepath) 
    ? filepath 
    : path.join(contentDir, filepath);

  try {
    const content = await fs.readFile(fullPath, 'utf-8');
    const { frontmatter, body } = parseFrontMatter(content);
    return { frontmatter, body, fullPath };
  } catch (error) {
    throw new Error(`Failed to read file: ${error}`);
  }
}

/**
 * Write MDX file
 */
export async function writeMDXFile(
  type: ContentType,
  filepath: string,
  frontmatter: FrontMatter,
  body: string
): Promise<string> {
  const contentDir = getContentDir(type);
  const fullPath = path.isAbsolute(filepath)
    ? filepath
    : path.join(contentDir, filepath);

  // Ensure directory exists
  const dir = path.dirname(fullPath);
  await fs.mkdir(dir, { recursive: true });

  // Generate MDX content
  const frontmatterString = generateFrontMatter(frontmatter);
  const content = `${frontmatterString}\n${body}`;

  // Write file
  await fs.writeFile(fullPath, content, 'utf-8');

  return fullPath;
}

/**
 * Delete MDX file
 */
export async function deleteMDXFile(
  type: ContentType,
  filepath: string
): Promise<void> {
  const contentDir = getContentDir(type);
  const fullPath = path.isAbsolute(filepath)
    ? filepath
    : path.join(contentDir, filepath);

  try {
    await fs.unlink(fullPath);
  } catch (error) {
    throw new Error(`Failed to delete file: ${error}`);
  }
}

/**
 * List all MDX files in content directory
 */
export async function listMDXFiles(
  type: ContentType,
  subfolder?: string
): Promise<string[]> {
  const contentDir = getContentDir(type);
  const searchDir = subfolder 
    ? path.join(contentDir, subfolder)
    : contentDir;

  try {
    const files: string[] = [];
    
    const walkDir = async (dir: string, relativePath: string = '') => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relative = path.join(relativePath, entry.name);

        if (entry.isDirectory()) {
          await walkDir(fullPath, relative);
        } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
          files.push(relative);
        }
      }
    };

    await walkDir(searchDir);
    return files;
  } catch (error) {
    // Directory might not exist
    return [];
  }
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

