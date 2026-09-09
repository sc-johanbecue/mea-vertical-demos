export const bcRegisterJobRoleOptions = [
  'Teacher',
  'Student',
  'Librarian',
  'Education manager',
  'School administrator',
  'Policy maker',
  'Researcher',
  'Partner organisation',
  'Other',
] as const;

export const bcRegisterSectorOptions = [
  'Primary education',
  'Secondary education',
  'Higher education',
  'English language learning',
  'Arts and culture',
  'Public sector',
  'Not for profit',
  'Corporate',
  'Other',
] as const;

export const bcRegisterAnnualTurnoverOptions = [
  'Less than £5 million',
  '£5 million - £25 million',
  '£25 million - £50 million',
  '£50 million - £100 million',
  'More than £100 million',
  'Not applicable',
] as const;

export function joinMultilineOptions(options: readonly string[]): string {
  return options.join('\n');
}
