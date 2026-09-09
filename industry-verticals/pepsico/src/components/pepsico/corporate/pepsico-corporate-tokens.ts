/** PepsiCo corporate homepage design tokens (pepsico.com reference). */
export const PEPSICO_CORPORATE = {
  blue: '#0076BE',
  blueBright: '#009CDE',
  blueMid: '#1E88C7',
  navy: '#002D62',
  navyDeep: '#001E44',
  green: '#004C3F',
  greenBright: '#A3D400',
  greenPill: '#C5E86C',
  yellow: '#FFB81C',
  peach: '#F4A582',
  white: '#FFFFFF',
  greyText: '#4A4A4A',
} as const;

export type PepsiCoWordColor = 'blue' | 'green' | 'yellow' | 'peach' | 'orange';

export const PEPSICO_WORD_COLORS: Record<PepsiCoWordColor, string> = {
  blue: PEPSICO_CORPORATE.blue,
  green: PEPSICO_CORPORATE.green,
  yellow: PEPSICO_CORPORATE.yellow,
  peach: PEPSICO_CORPORATE.peach,
  orange: '#E87722',
};
