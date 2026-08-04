const absoluteUrlPattern = /^(?:[a-z]+:)?\/\//i;

export function publicAssetPath(path: string, basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""): string {
  if (!path || absoluteUrlPattern.test(path)) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const trimmedBasePath = basePath === "/" ? "" : basePath.replace(/\/$/, "");
  const normalizedBasePath = trimmedBasePath && !trimmedBasePath.startsWith("/")
    ? `/${trimmedBasePath}`
    : trimmedBasePath;

  if (!normalizedBasePath || normalizedPath === normalizedBasePath || normalizedPath.startsWith(`${normalizedBasePath}/`)) {
    return normalizedPath;
  }

  return `${normalizedBasePath}${normalizedPath}`;
}
