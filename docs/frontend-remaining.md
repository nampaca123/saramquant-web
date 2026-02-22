# SaramQuant Frontend — Remaining Work

Phase 1~5 completed. Below are all tasks deferred to future iterations.

---

## 1. Stock Detail Page (`/stocks/[market]/[symbol]`)

Currently a placeholder. Full implementation requires:

### 1.1 StockHeader
- Display: name, symbol, market, latestClose, priceChangePercent (color-coded), latestDate.
- API: `stockApi.detail(symbol, market)`.

### 1.2 RiskReport (5-Dimension Risk Cards)
- **Summary badge** at top: composite tier dot + Korean/English label + 1-line explanation of which dimension drove the composite tier.
- **5 RiskDimensionCard components** as designed in plan Section 6:
  - Header row: icon + dimension name + tier pill + score.
  - Progress bar: `width = score%`, colored by tier.
  - Interpretation sentence: dynamic text from `DIMENSION_META[name].interpretations[tier](components, direction)`.
  - Direction arrow for `price_heat` and `trend` dimensions.
  - Expandable details: component labels + values using `COMPONENT_LABELS` and `formatIndicator()`.
  - `data_available: false` → disabled card with "Not enough data" message.
- **Desktop layout**: 2-column grid, company_health + valuation grouped in bottom row.
- **Mobile layout**: single column stack.
- Types and constants already defined: `types/risk.types.ts`, `constants/risk-dimension.constants.ts`, `constants/risk-tier.constants.ts`.

### 1.3 PriceChart (Candlestick)
- Library: `lightweight-charts` (already installed).
- **Must use** `next/dynamic` with `ssr: false`.
- API: `stockApi.prices(symbol, market, period)`.
- Period selector: 1M / 3M / 6M / 1Y tabs.

### 1.4 BenchmarkChart
- Normalized comparison chart (base=100).
- API: `stockApi.benchmark(symbol, market, period)`.
- Same `ssr: false` dynamic import.

### 1.5 AiAnalysisSection
- Show cached LLM analysis from `stockDetail.llmAnalysis`.
- Preset selector buttons: summary | beginner | risk_assessment | financial_health.
- "Generate" button → `llmApi.analyzeStock(...)` (JWT required).
- **Inline disclaimer** below response using `response.disclaimer`.
- Usage counter: `llmApi.usage()`.

### 1.6 AddToPortfolioButton
- Opens modal to add stock to KR or US portfolio.
- Uses `portfolioApi.buy(...)`.

### 1.7 StockDetailSkeleton
- Skeleton layout: header + 5 risk cards + chart rectangle + AI section.

---

## 2. Portfolio Page (`/portfolio`)

### 2.1 Portfolio Tab Selector
- KR / US tabs (portfolios auto-created on first `portfolioApi.list()` call).

### 2.2 MetricsCards
- 4 metric cards from `portfolioApi.analysis(id)`:
  - Risk Score (tier badge + score)
  - Portfolio Volatility
  - Diversification (HHI / Effective N)
  - Max Weight

### 2.3 HoldingsList
- List of holdings from `portfolioApi.detail(id)`.
- Each row: symbol, name, shares, avgPrice, purchasedAt.
- Buy button → modal with stock search + date + shares.
- Sell button → modal with sellShares input.
- Delete button → confirmation modal.

### 2.4 DiversificationChart
- Library: `recharts` (installed). **Must use** `dynamic({ ssr: false })`.
- Bar chart showing sector concentration from `analysis.diversification`.

### 2.5 SimulationChart
- Monte Carlo fan chart from `portfolioApi.simulation(id, ...)`.
- `recharts` area chart with percentile bands (10/25/50/75/90).
- **Simulation disclaimer** below chart.

### 2.6 AiDiagnosisSection
- Preset buttons: diagnosis | reduce_risk | outlook | aggressive | financial_weakness.
- `llmApi.analyzePortfolio(...)`.
- Inline disclaimer.

### 2.7 PortfolioSkeleton

---

## 3. Settings Page (`/settings`)

### 3.1 Profile Section
- Display/edit: name, gender, birthYear, investmentExperience.
- `userApi.updateProfile(...)`.

### 3.2 Preferred Markets
- Multi-select: KR_KOSPI, KR_KOSDAQ, US_NYSE, US_NASDAQ.
- Saved to `UserProfile.preferredMarkets`.
- Screener default market = `preferredMarkets[0]` or `KR_KOSPI`.

### 3.3 Language Selection
- Reflects existing `LanguageToggle` functionality.

### 3.4 Account Management
- Logout all devices: `authApi.logoutAll()`.
- Delete account: `userApi.deleteAccount()` with confirmation modal.

---

## 4. Stock Simulation Page/Section

- Standalone simulation on individual stock page.
- API: `stockApi.simulation(symbol, params)`.
- Parameters: days, simulations, confidence, lookback, method (gbm/bootstrap).
- Display: expected return, VaR, CVaR, price percentile fan chart.
- Simulation disclaimer required.

---

## 5. Dark Mode

- v1 does not support dark mode.
- Future: add `dark:` variants to all color tokens in globals.css.
- Toggle in Settings page.
- Persist preference in localStorage.
- Use `prefers-color-scheme` for initial value.

---

## 6. PWA / Push Notifications

- Service worker for offline caching.
- Push notifications for portfolio risk tier changes.
- Web app manifest.

---

## 7. Mobile Search Overlay

- Header search icon tap → fullscreen search overlay on mobile.
- Currently `SearchCombobox` is `hidden md:block` on mobile.
- Need a mobile-specific fullscreen search view with back button.

---

## 8. Error Handling Improvements

- API error toast notification system (network errors).
- Per-section error recovery (retry buttons on individual card failures).
- 502 Calc Server unavailable → graceful degradation message.

---

## 9. Testing

- Unit tests for format utilities (format-currency, format-percent, etc.).
- Component tests for Badge, Card, Button.
- Integration tests for API client (mock fetch).
- E2E tests for critical flows (login, screener filter, stock detail).

---

## 10. Performance

- React Server Components for data-heavy pages (stock detail initial load).
- `Suspense` boundaries for streaming.
- Image optimization for logo/icons.
- Bundle analysis and code splitting verification.

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
