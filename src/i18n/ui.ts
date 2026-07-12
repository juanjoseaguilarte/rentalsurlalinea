import es from './es.json';
import en from './en.json';

export type Locale = 'es' | 'en';
export const locales: Locale[] = ['es', 'en'];
export const defaultLocale: Locale = 'es';

const dictionaries: Record<Locale, unknown> = { es, en };

/** Extrae el locale a partir de la URL (ES en la raíz, EN bajo /en/). */
export function getLocaleFromUrl(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  return first === 'en' ? 'en' : 'es';
}

/** Devuelve una función t() que resuelve claves anidadas tipo "nav.home". */
export function useTranslations(locale: Locale) {
  const dict = dictionaries[locale] ?? dictionaries[defaultLocale];
  return function t(key: string): string {
    const value = key.split('.').reduce<unknown>((acc, part) => {
      if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, dict);
    return typeof value === 'string' ? value : key;
  };
}

/** Prefija una ruta interna con el locale (ES sin prefijo, EN con /en). */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'es') return clean === '/' ? '/' : clean;
  return clean === '/' ? '/en/' : `/en${clean}`;
}

/** Dada la URL actual, devuelve la ruta equivalente en el otro idioma. */
export function alternatePath(url: URL, target: Locale): string {
  let path = url.pathname;
  // quitar prefijo /en si existe
  if (path === '/en' || path === '/en/') path = '/';
  else if (path.startsWith('/en/')) path = path.slice(3);
  return localizedPath(path, target);
}
