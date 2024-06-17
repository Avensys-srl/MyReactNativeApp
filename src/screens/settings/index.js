// src/screens/settings/index.js
import ChangeLanguage from './ChangeLanguage';
import ChangeWiFi from './ChangeWiFi';

const settingsRoutes = [
  { name: 'ChangeLanguage', component: ChangeLanguage, labelKey: 'ChangeLanguage' },
  { name: 'ChangeWiFi', component: ChangeWiFi, labelKey: 'ChangeWiFi' },
];

export default settingsRoutes;
