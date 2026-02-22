import { commonTexts, navTexts, errorTexts } from './common.i18n';
import { authTexts } from './auth.i18n';
import { riskTexts, disclaimerTexts } from './risk.i18n';
import { homeTexts } from './home.i18n';
import { onboardingTexts } from './onboarding.i18n';
import { screenerTexts } from './screener.i18n';
import { stockTexts, simulationTexts } from './stock.i18n';
import { portfolioTexts } from './portfolio.i18n';
import { settingsTexts } from './settings.i18n';
import { landingTexts } from './landing.i18n';

export const t = {
  common: commonTexts,
  nav: navTexts,
  error: errorTexts,
  auth: authTexts,
  risk: riskTexts,
  disclaimer: disclaimerTexts,
  home: homeTexts,
  onboarding: onboardingTexts,
  screener: screenerTexts,
  stock: stockTexts,
  simulation: simulationTexts,
  portfolio: portfolioTexts,
  settings: settingsTexts,
  landing: landingTexts,
} as const;
