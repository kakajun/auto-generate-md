
import { access, readFile } from 'fs/promises';
/**
 * 解析路由文件中的路由路径。
 * @param {string} line - 路由文件中的一行。
 * @return {string} - 解析出的路由路径。
 */
export function parseRouterPath(line: string): string {
  const pathRegex = /path:\s*['"]([^'"]+)['"]/
  const match = line.match(pathRegex)
  return match ? match[1] : ''
}

/**
 * 解析路由文件中的组件路径。
 * @param {string} line - 路由文件中的一行。
 * @return {string | ''} - 解析出的组件路径或null。
 */
export function parseComponentPath(line: string): string {
  const componentRegex = /component:\s*\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)/
  const match = line.match(componentRegex)
  return match ? match[1] : ''
}

export async function getDependencies(packageJsonPath: string): Promise<string[]> {
  let dependencies: string[] = [];
  if (packageJsonPath) {
    try {
      await access(packageJsonPath);
      const pkg = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
      dependencies = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDependencies || {}));
    } catch (error) {
      console.error(error);
    }
  }
  return dependencies;
}
