
/**
 * 解析路由文件中的路由路径。
 * @param {string} line - 路由文件中的一行。
 * @return {string | null} - 解析出的路由路径或null。
 */
export function parseRouterPath(line: string): string | null {
  const pathRegex = /path:\s*['"]([^'"]+)['"]/;
  const match = line.match(pathRegex);
  return match ? match[1] : null;
}

/**
 * 解析路由文件中的组件路径。
 * @param {string} line - 路由文件中的一行。
 * @return {string | null} - 解析出的组件路径或null。
 */
export function parseComponentPath(line: string): string | null {
  const componentRegex = /component:\s*\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)/;
  const match = line.match(componentRegex);
  return match ? match[1] : null;
}
