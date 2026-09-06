// ponytail: local-first Devicon SVG map. Add entries here when new skills use
// icons not yet downloaded to public/icons/devicon/; unknown icons fall back
// to the JSDelivr CDN URL so nothing ever breaks.
const CDN_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const LOCAL_ICONS: Record<string, string> = {
  "react-original": "/icons/devicon/react-original.svg",
  "nextjs-plain": "/icons/devicon/nextjs-plain.svg",
  "typescript-plain": "/icons/devicon/typescript-plain.svg",
  "tailwindcss-original": "/icons/devicon/tailwindcss-original.svg",
  "javascript-plain": "/icons/devicon/javascript-original.svg",
  "html5-plain": "/icons/devicon/html5-plain.svg",
  "css3-plain": "/icons/devicon/css3-plain.svg",
  "nodejs-plain": "/icons/devicon/nodejs-original.svg",
  "express-original": "/icons/devicon/express-original.svg",
  "postgresql-plain": "/icons/devicon/postgresql-plain.svg",
  "supabase-plain": "/icons/devicon/supabase-original.svg",
  "fastapi-plain": "/icons/devicon/fastapi-original.svg",
  "graphql-plain": "/icons/devicon/graphql-plain.svg",
  "git-plain": "/icons/devicon/git-original.svg",
  "docker-plain": "/icons/devicon/docker-plain.svg",
  "vscode-plain": "/icons/devicon/vscode-original.svg",
  "vercel-original": "/icons/devicon/vercel-original.svg",
  "github-original": "/icons/devicon/github-original.svg",
  "npm-original-wordmark": "/icons/devicon/npm-original-wordmark.svg",
  "amazonwebservices-original-wordmark":
    "/icons/devicon/amazonwebservices-original-wordmark.svg",
  "blazor-original": "/icons/devicon/blazor-original.svg",
  "bootstrap-original": "/icons/devicon/bootstrap-original.svg",
  "csharp-original": "/icons/devicon/csharp-original.svg",
  "css3-original": "/icons/devicon/css3-original.svg",
  "docker-original": "/icons/devicon/docker-original.svg",
  "dotnetcore-original": "/icons/devicon/dotnetcore-original.svg",
  "flask-original": "/icons/devicon/flask-original.svg",
  "go-original": "/icons/devicon/go-original.svg",
  "googlecloud-original": "/icons/devicon/googlecloud-original.svg",
  "html5-original": "/icons/devicon/html5-original.svg",
  "laravel-original": "/icons/devicon/laravel-original.svg",
  "mariadb-original": "/icons/devicon/mariadb-original.svg",
  "mysql-original": "/icons/devicon/mysql-original.svg",
  "nextjs-original": "/icons/devicon/nextjs-original.svg",
  "notion-original": "/icons/devicon/notion-original.svg",
  "php-original": "/icons/devicon/php-original.svg",
  "postgresql-original": "/icons/devicon/postgresql-original.svg",
  "postman-original": "/icons/devicon/postman-original.svg",
  "python-original": "/icons/devicon/python-original.svg",
  "sqlite-original": "/icons/devicon/sqlite-original.svg",
  "supabase-original": "/icons/devicon/supabase-original.svg",
  "typescript-original": "/icons/devicon/typescript-original.svg",
  "vitejs-original": "/icons/devicon/vitejs-original.svg",
  "vuejs-original": "/icons/devicon/vuejs-original.svg",
};

function parseDeviconKey(icon?: string | null): {
  name: string;
  variant: string;
} | null {
  if (!icon) return null;
  const match = icon.match(/^devicon-([a-z0-9-]+?)-([a-z0-9-]+)(?:\s|$)/i);
  if (!match) return null;
  return { name: match[1].toLowerCase(), variant: match[2].toLowerCase() };
}

/** Local-first Devicon SVG URL from a devicon font class. */
export function getDeviconSvgUrl(icon?: string | null): string | null {
  const parsed = parseDeviconKey(icon);
  if (!parsed) return null;
  const key = `${parsed.name}-${parsed.variant}`;
  if (LOCAL_ICONS[key]) return LOCAL_ICONS[key];
  return `${CDN_BASE}/${parsed.name}/${key}.svg`;
}

/** Rewrite a stored icon_svg URL to its local copy when available. */
export function localizeIconSvgUrl(iconSvg?: string | null): string | null {
  if (!iconSvg) return null;
  if (iconSvg.startsWith("/icons/devicon/")) return iconSvg;
  const match = iconSvg.match(/\/icons\/([a-z0-9-]+)\/\1-([a-z0-9-]+)\.svg/i);
  if (!match) return iconSvg;
  const key = `${match[1]}-${match[2]}`.toLowerCase();
  return LOCAL_ICONS[key] || iconSvg;
}
