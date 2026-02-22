# SaramQuant Frontend — Remaining Work

Phase 1~5 + Phase A~E completed. Below are tasks deferred to future iterations.

---

## Completed (Phase A~E)

- **Phase A**: lucide-react migration, simulation types, API return types, translations
- **Phase B**: Stock Detail page (StockHeader, RiskReport, RiskDimensionCard, PriceChart, BenchmarkChart, AiAnalysisSection, StockSimulationSection, AddToPortfolioButton, StockDetailSkeleton, Popover, SimulationFanChart)
- **Phase C**: Portfolio page (TabSelector, MetricsCards, HoldingsList + Buy/Sell/Delete modals, DiversificationChart, SimulationChart, AiDiagnosisSection, PortfolioSkeleton)
- **Phase D**: Settings page (ProfileSection, PreferredMarkets, AccountSection, Language toggle)
- **Phase E**: Mobile Search Overlay + Header mobile search button

---

## 1. Admin Panel

- Admin-only dashboard for user management, stock data monitoring, system health.
- Requires `UserRole.ADMIN` gating.
- Gateway endpoints: `/api/admin/*` (not yet implemented in frontend).

---

## 2. Dark Mode

- v1 does not support dark mode.
- Future: add `dark:` variants to all color tokens in globals.css.
- SimulationFanChart "white overlay trick" will need revision for dark backgrounds.
- Toggle in Settings page.
- Persist preference in localStorage.
- Use `prefers-color-scheme` for initial value.

---

## 3. PWA / Push Notifications

- Service worker for offline caching.
- Push notifications for portfolio risk tier changes.
- Web app manifest.

---

## 4. Error Handling Improvements

- API error toast notification system (network errors).
- Per-section error recovery (retry buttons on individual card failures).
- 502 Calc Server unavailable → graceful degradation message with specific wording.

---

## 5. Testing

- Unit tests for format utilities (format-currency, format-percent, etc.).
- Component tests for Badge, Card, Button.
- Integration tests for API client (mock fetch).
- E2E tests for critical flows (login, screener filter, stock detail).

---

## 6. Performance

- React Server Components for data-heavy pages (stock detail initial load).
- `Suspense` boundaries for streaming.
- Image optimization for logo/icons.
- Bundle analysis and code splitting verification.

---

## 7. Screener Advanced Filters

- Backend already accepts `betaMin`, `rsiMin`, etc. params in `DashboardStocksParams`.
- UI sliders/inputs for these filters (currently not exposed in FilterPanel).
- Consider adding disabled state UI with "coming soon" label for params Gateway doesn't yet support.

---

## 8. Onboarding Flow Enhancement

- Current: simple login page.
- Future: 3-step intro cards → preferred market selection → home entry.
- Preferred market selection currently available in Settings.

---

## API Endpoints Reference (Quick)

All endpoints defined in `lib/api/endpoints/`:

| File | Endpoints |
|---|---|
| `auth.api.ts` | signup, login, refresh, logout, logoutAll, oauthUrl |
| `user.api.ts` | me, updateProfile, deleteAccount |
| `home.api.ts` | summary |
| `dashboard.api.ts` | stocks, search, sectors |
| `stock.api.ts` | detail, prices, benchmark, simulation |
| `llm.api.ts` | getStockAnalysis, analyzeStock, analyzePortfolio, usage |
| `portfolio.api.ts` | list, detail, buy, sell, deleteHolding, reset, analysis, simulation |

All types defined in `features/*/types/*.types.ts` and `types/*.types.ts`.
