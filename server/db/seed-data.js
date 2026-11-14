import { loudounSources } from './loudoun-sources.js';

export const CATEGORIES = [
  'Food',
  'Health',
  'Housing',
  'Youth',
  'Education',
  'Jobs',
  'Seniors',
  'Legal Aid',
  'Environment',
];

export const seedResources = loudounSources.map(({ name, description, url }) => ({
  name,
  category: 'Environment',
  description,
  neighborhood: 'Loudoun County, Virginia',
  address: '',
  phone: '',
  website: url,
  hours: '',
  languages: 'English',
}));
