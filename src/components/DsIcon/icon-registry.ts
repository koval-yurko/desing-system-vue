import type { IconName } from './icon-names';

const svgModules = import.meta.glob('../../assets/icons/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const icons = {} as Record<IconName, string>;
for (const [path, svg] of Object.entries(svgModules)) {
  const name = path.split('/').pop()?.replace('.svg', '') as IconName;
  icons[name] = svg as string;
}

export function getIcon(name: IconName): string | undefined {
  return icons[name];
}

export type { IconName };
export { icons };
