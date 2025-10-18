# AI Product Discovery - Setup Checklist

## Today (Phase 1 - Foundation)

### Prerequisites

- [ ] Windows 10/11 with PowerShell
- [ ] Python 3.10 or 3.11 installed
- [ ] NVIDIA GPU with 11GB+ VRAM
- [ ] 20GB+ free disk space
- [ ] Internet connection (for downloads)

### Installation (15-20 minutes)

- [ ] Open PowerShell as Administrator
- [ ] Navigate to: `cd C:\OffGrid1\OffGrid1\ai-service`
- [ ] Run setup script: `.\setup-ai.ps1`
- [ ] Wait for completion (downloads Qwen2.5 ~4GB + embeddings ~2GB)
- [ ] Verify all steps show ✓ green checkmarks

### Validation (2 minutes)

- [ ] Run tests: `python test_ai_system.py`
- [ ] Confirm: `✓ PASS: Embeddings`
- [ ] Confirm: `✓ PASS: ChromaDB`
- [ ] Confirm: `✓ PASS: Ollama`
- [ ] Confirm: `✓ PASS: Full RAG Pipeline`
- [ ] Confirm: `Passed: 4/4`
- [ ] Check VRAM usage: `nvidia-smi` (should show ~8-9GB used)

### Start Services (2 terminals)

- [ ] Terminal 1: Start Ollama server: `ollama serve`
- [ ] Terminal 2: Start AI service: `cd C:\OffGrid1\OffGrid1\ai-service`
- [ ] Terminal 2: Run FastAPI: `uvicorn app.main:app --reload --port 8001`
- [ ] Verify startup: "✓ AI Service Ready!" in logs
- [ ] Test health endpoint: Open browser to http://localhost:8001/ai/health
- [ ] Confirm response: `{"status": "healthy", "ollama": "connected", ...}`
- [ ] Test API docs: http://localhost:8001/docs

### Documentation Review (30 minutes)

- [ ] Read `AI_PRODUCT_DISCOVERY_SYSTEM.md` (600+ lines, full technical spec)
- [ ] Review `README_AI_QUICKSTART.md` (quick start guide)
- [ ] Check `IMPLEMENTATION_STATUS.md` (what was created)
- [ ] Review `AI_SYSTEM_COMPLETE.md` (this file's parent document)

---

## Week 2: Web Scraping (5-7 days)

### Setup Playwright

- [ ] Install: `pip install playwright beautifulsoup4 lxml`
- [ ] Install browsers: `python -m playwright install chromium`
- [ ] Test: `python -m playwright codegen autosolar.pt`

### Create Scrapers (1 scraper per day)

- [ ] Day 1: AutoSolar.pt scraper (`app/scrapers/autosolar.py`)

  - [ ] Solar panels (~150 products)
  - [ ] Batteries (~50 products)
  - [ ] Inverters (~40 products)
  - [ ] Test: Extract 10 products, verify data quality

- [ ] Day 2: Amazon.es scraper (`app/scrapers/amazon_es.py`)

  - [ ] Off-grid products (~500 products)
  - [ ] Use Amazon PA-API 5.0 (register first)
  - [ ] Test: Extract 10 products from each category

- [ ] Day 3: Leroy Merlin scraper (`app/scrapers/leroy_merlin.py`)

  - [ ] Water systems (~100 products)
  - [ ] Pumps (~50 products)
  - [ ] Tools (~50 products)
  - [ ] Test: Extract 10 products

- [ ] Day 4: ManoMano scraper (`app/scrapers/manomano.py`)
  - [ ] DIY products (~150 products)
  - [ ] Garden equipment (~50 products)
  - [ ] Test: Extract 10 products

### Product Pipeline (Day 5-6)

- [ ] Create scraper orchestrator (`app/scrapers/orchestrator.py`)
- [ ] Implement parallel scraping (4 suppliers simultaneously)
- [ ] Add LLM enrichment step (Qwen2.5 generates tags, categories, summaries)
- [ ] Add embedding generation step (multilingual-e5)
- [ ] Store in PostgreSQL (product table) + ChromaDB (embeddings)
- [ ] Test: Run full pipeline for 100 products
- [ ] Measure: Should complete 1000 products in ~90 minutes

### Scheduling (Day 7)

- [ ] Create cron job script (`app/scrapers/cron_scrape.py`)
- [ ] Schedule daily run at 2 AM
- [ ] Add logging and error handling
- [ ] Add email notifications on failure
- [ ] Test: Run manually, verify completion

### Validation

- [ ] Confirm: 1000+ products in database
- [ ] Confirm: All products have embeddings in ChromaDB
- [ ] Confirm: All products have categories, tags, summaries
- [ ] Confirm: No duplicate products
- [ ] Test search: Query "painel solar 400W", verify top 10 results relevant

---

## Week 3: Affiliate Integration (5-7 days)

### Register Affiliate Programs (Day 1-2)

- [ ] **Amazon Associates**

  - [ ] Sign up: https://afiliados.amazon.es/
  - [ ] Get approved (48 hours)
  - [ ] Apply for PA-API 5.0 access
  - [ ] Get credentials: Access Key, Secret Key, Partner Tag
  - [ ] Store in Vault: `offgrid/affiliate/amazon`

- [ ] **Awin**

  - [ ] Sign up: https://www.awin.com/gb/publishers
  - [ ] Get approved (72 hours)
  - [ ] Search for Portuguese merchants
  - [ ] Join relevant programs (AutoSolar, Leroy Merlin if available)
  - [ ] Get API credentials
  - [ ] Store in Vault: `offgrid/affiliate/awin`

- [ ] **ShareASale**

  - [ ] Sign up: https://www.shareasale.com/
  - [ ] Get approved (48 hours)
  - [ ] Join relevant programs
  - [ ] Get API credentials
  - [ ] Store in Vault: `offgrid/affiliate/shareasale`

- [ ] **Direct Programs**
  - [ ] Contact AutoSolar sales: partnerships@autosolar.pt
  - [ ] Contact Leroy Merlin corporate: affiliates@leroymerlin.pt
  - [ ] Negotiate commission rates (aim for 15-20%)

### Implement Affiliate Link Generation (Day 3-4)

- [ ] Create `app/services/affiliate.py`
- [ ] Implement Amazon PA-API client
  - [ ] Product search by ASIN
  - [ ] Affiliate link generation
  - [ ] Product data enrichment (images, reviews, price history)
- [ ] Implement Awin link generation
- [ ] Implement ShareASale link generation
- [ ] Add affiliate metadata to product table (network, commission_rate, tracking_id)

### Commission Tracking (Day 5)

- [ ] Create `app/api/v1/tracking.py`
- [ ] Implement click tracking endpoint: `POST /api/tracking/click`
- [ ] Implement conversion webhook: `POST /api/tracking/conversion`
- [ ] Store in database: clicks, conversions, revenue
- [ ] Create analytics dashboard query functions

### Update Product Recommendations (Day 6)

- [ ] Modify `app/api/v1/ai_products.py`
- [ ] Add affiliate link to all product responses
- [ ] Add UTM parameters for tracking: `?utm_source=offgrid&utm_medium=recommendation&utm_campaign=calculator`
- [ ] Test: Verify affiliate links work, redirect correctly

### Testing & Validation (Day 7)

- [ ] Test Amazon affiliate links (10 products)
- [ ] Test Awin affiliate links (5 products)
- [ ] Test ShareASale affiliate links (5 products)
- [ ] Test click tracking (simulate 20 clicks)
- [ ] Verify clicks appear in database
- [ ] Test conversion tracking (Amazon Order ID)

---

## Week 4: RAG Pipeline (5-7 days)

### LangChain Integration (Day 1-2)

- [ ] Install: `pip install langchain langchain-community`
- [ ] Create `app/core/rag_pipeline.py`
- [ ] Implement RAG chain:
  - [ ] Query understanding (Qwen2.5 extracts requirements)
  - [ ] Embedding generation (multilingual-e5)
  - [ ] Vector search (ChromaDB retrieval)
  - [ ] Result filtering (metadata: price, stock, shipping)
  - [ ] Product ranking (Qwen2.5 evaluates compatibility)
  - [ ] Response generation (explain recommendations)

### Prompt Engineering (Day 3)

- [ ] Create `app/core/prompts.py`
- [ ] Define system prompts for:
  - [ ] Requirement extraction (power, voltage, price, intent)
  - [ ] Product ranking (relevance, value, compatibility)
  - [ ] Explanation generation (why recommended)
- [ ] Test prompts on 20 sample queries
- [ ] Iterate based on quality

### Quality Optimization (Day 4-5)

- [ ] Create test dataset (50 queries with expected results)
- [ ] Run RAG pipeline on test dataset
- [ ] Calculate precision@10 (% of top 10 results relevant)
- [ ] Target: >0.80 precision
- [ ] If <0.80, tune:
  - [ ] Embedding model (try paraphrase-multilingual-mpnet-base-v2)
  - [ ] ChromaDB similarity threshold
  - [ ] LLM temperature (lower = more deterministic)
  - [ ] Prompt engineering (more specific instructions)

### Conversational Features (Day 6)

- [ ] Add follow-up question handling
- [ ] Implement: "Why is this recommended?"
- [ ] Implement: "Show me cheaper alternatives"
- [ ] Implement: "What's compatible with this?"
- [ ] Implement: "Compare these two products"

### API Endpoint Enhancement (Day 7)

- [ ] Update `POST /ai/recommend` endpoint
- [ ] Add explanation field to response
- [ ] Add alternative_products field
- [ ] Add compatibility_notes field
- [ ] Add bundle_suggestions field
- [ ] Test: Verify response includes all fields

---

## Week 5: Calculator Integration (5-7 days)

### Frontend Integration (Day 1-2)

- [ ] Update calculator components in `frontend/src/components/calculators/`
- [ ] Add "Buy Recommended Products" button to results page
- [ ] Add loading state (spinner while AI generates recommendations)
- [ ] Add error handling (show friendly message if AI fails)
- [ ] Test: Click button, verify API call to `/ai/recommend`

### Calculator-Specific Recommendations (Day 3-4)

- [ ] **Solar Panel Sizing Calculator**

  - [ ] Send calculator results: `{recommended_panel_power: 800, battery_capacity_ah: 200}`
  - [ ] AI recommends: 2x 400W panels + 200Ah battery + charge controller + inverter
  - [ ] Show bundle: "Complete 800W Off-Grid System" (€2,500)
  - [ ] Show individual products with affiliate links

- [ ] **Battery Sizing Calculator**

  - [ ] Send results: `{battery_capacity_ah: 200, system_voltage: 12}`
  - [ ] AI recommends: 200Ah LiFePO4 battery + BMS + cables
  - [ ] Show bundle + individual products

- [ ] **Inverter Sizing Calculator**

  - [ ] Send results: `{inverter_power: 3000, input_voltage: 24}`
  - [ ] AI recommends: 3000W pure sine inverter + safety equipment
  - [ ] Show bundle + individual products

- [ ] **Water Independence Calculator**

  - [ ] Send results: `{storage_needed_liters: 5000, daily_consumption: 150}`
  - [ ] AI recommends: 5000L tank + pump + filter + pipes
  - [ ] Show bundle + individual products

- [ ] Repeat for all 15+ calculators

### UI/UX Enhancements (Day 5)

- [ ] Create product card component (`ProductCard.tsx`)
  - [ ] Product image
  - [ ] Name, price, rating
  - [ ] Affiliate "Buy Now" button
  - [ ] "Why recommended?" explanation
  - [ ] Supplier logo
- [ ] Create comparison table component (`ProductComparison.tsx`)
  - [ ] Compare 2-3 products side-by-side
  - [ ] Highlight best value
- [ ] Add mobile-responsive design (Tailwind breakpoints)

### Analytics Integration (Day 6)

- [ ] Add event tracking (Google Analytics or custom)
- [ ] Track: `calculator_completed` event
- [ ] Track: `product_recommended_viewed` event
- [ ] Track: `product_clicked` event (with product ID, price, calculator type)
- [ ] Track: `bundle_viewed` event
- [ ] Set up conversion tracking (30-day attribution)

### Testing & Validation (Day 7)

- [ ] Test all 15+ calculators → product recommendations flow
- [ ] Measure click-through rate (CTR): Target >20%
- [ ] Measure conversion rate: Target >10% (simulate purchases)
- [ ] A/B test: Single products vs. bundles (which converts better?)
- [ ] Fix any bugs or UX issues

---

## Week 6: Launch & Optimization (5-7 days)

### End-to-End Testing (Day 1-2)

- [ ] Create test scenarios (50+ user journeys)
- [ ] Test: User searches "painel solar 400W" → clicks result → purchases
- [ ] Test: User completes calculator → clicks recommendation → purchases
- [ ] Test: User browses directory → clicks product → purchases
- [ ] Measure latency (should be <2s perceived)
- [ ] Measure accuracy (relevance >4.0/5.0)
- [ ] Fix any issues

### Performance Optimization (Day 3-4)

- [ ] **Embedding Caching**

  - [ ] Implement Redis caching for frequent queries
  - [ ] Cache embeddings for 1 hour
  - [ ] Measure: Reduce embedding generation time by 50%

- [ ] **Batch Processing**

  - [ ] Batch embed 10 products at once (instead of 1 by 1)
  - [ ] Reduce ChromaDB search calls (single query for multiple categories)

- [ ] **LLM Optimization**

  - [ ] Reduce max_tokens from 512 to 256 (faster generation)
  - [ ] Lower temperature from 0.3 to 0.2 (more deterministic, faster)
  - [ ] Cache LLM responses for identical queries (1 hour TTL)

- [ ] **Database Indexing**
  - [ ] Add indexes on: product.category, product.price, product.in_stock
  - [ ] Measure: Reduce query time by 30%

### Price Monitoring (Day 5)

- [ ] Create `app/scrapers/price_monitor.py`
- [ ] Daily re-scrape top 100 most-clicked products
- [ ] Update prices in database
- [ ] Alert on price drops >10% (send email notification)
- [ ] Update affiliate links if supplier changes

### Revenue Analytics Dashboard (Day 6)

- [ ] Create `app/api/v1/analytics.py`
- [ ] Endpoints:
  - [ ] `GET /api/analytics/revenue` - Total revenue by month
  - [ ] `GET /api/analytics/top-products` - Top 10 products by clicks/revenue
  - [ ] `GET /api/analytics/top-suppliers` - Top suppliers by revenue
  - [ ] `GET /api/analytics/conversion-funnel` - Calculator → click → purchase
- [ ] Create simple dashboard UI (can use existing admin panel)

### Launch Preparation (Day 7)

- [ ] Update main README.md with AI product discovery feature
- [ ] Create user documentation: "How to use product recommendations"
- [ ] Announce feature to users (email, blog post, social media)
- [ ] Monitor first 24 hours: clicks, conversions, errors
- [ ] Celebrate launch! 🎉

---

## Ongoing (Months 2-12)

### Monthly Tasks

- [ ] Monitor revenue (target: €225 → €6,750 over 12 months)
- [ ] Track metrics: CTR >20%, conversion >10%, precision@10 >0.80
- [ ] Review top products (promote high-performers)
- [ ] Review low-performers (improve descriptions, tags)
- [ ] Add new suppliers (expand to 10+ suppliers)
- [ ] Add new products (maintain 15,000+ products by month 12)
- [ ] Optimize prompts (improve recommendation quality)
- [ ] A/B test (different UI layouts, bundle vs. single products)

### Quarterly Goals

- [ ] **Q1 2025**: Launch, 1000+ products, €225-648/month
- [ ] **Q2 2025**: Optimize, 5000+ products, €1,400-2,800/month
- [ ] **Q3 2025**: Scale, 10,000+ products, €4,050-5,400/month
- [ ] **Q4 2025**: Expand, 15,000+ products, €6,750+/month

### Expansion Ideas

- [ ] Add more suppliers: WORTEN, DAMIA Solar, Tecnosol
- [ ] Expand to other markets: Germany (amazon.de), France (amazon.fr)
- [ ] Add price comparison feature (show cheapest option)
- [ ] Implement customer reviews/ratings (scrape or user-generated)
- [ ] Add product availability alerts ("Email me when in stock")
- [ ] Create mobile app (React Native)
- [ ] Add voice search (speech-to-text → product recommendations)

---

## Success Metrics (Track Weekly)

### Technical

- [ ] VRAM usage: <11GB ✅
- [ ] Embedding latency: <40ms ✅
- [ ] Search latency: <100ms ✅
- [ ] Full RAG pipeline: <15s ✅
- [ ] API uptime: >99.5% ⏳
- [ ] Precision@10: >0.80 ⏳

### Business

- [ ] Products indexed: 1,000+ (month 1) → 15,000+ (month 12) ⏳
- [ ] Monthly visitors: 500+ (month 1) → 10,000+ (month 12) ⏳
- [ ] Click-through rate: >20% ⏳
- [ ] Conversion rate: >10% ⏳
- [ ] Revenue per user: >€2 ⏳
- [ ] Monthly revenue: €225 (month 1) → €6,750 (month 12) ⏳
- [ ] Break-even: Month 2 ⏳

### User Experience

- [ ] Relevance rating: >4.0/5.0 ⏳
- [ ] Response time: <2s perceived ⏳
- [ ] Mobile responsive: Works on all devices ⏳
- [ ] Accessibility: WCAG AA compliant ⏳
- [ ] User feedback: Positive (>80%) ⏳

---

## Notes

- ✅ = Completed
- ⏳ = In Progress / Waiting
- ❌ = Blocked / Issue

**Start Date**: ****\_****
**Target Launch Date**: ****\_**** (6 weeks from start)
**Actual Launch Date**: ****\_****

**Total Investment**: €1,275 (hardware depreciation €975 + electricity €300)
**Expected Annual Revenue**: €67,725 (average €5,644/month)
**Expected Annual Profit**: €66,450
**ROI**: 5,213%

---

## Quick Reference

**Setup Command**:

```powershell
cd C:\OffGrid1\OffGrid1\ai-service
.\setup-ai.ps1
```

**Test Command**:

```powershell
python test_ai_system.py
```

**Start Ollama**:

```powershell
ollama serve
```

**Start AI Service**:

```powershell
uvicorn app.main:app --reload --port 8001
```

**Health Check**:
http://localhost:8001/ai/health

**API Docs**:
http://localhost:8001/docs

**Monitor VRAM**:

```powershell
nvidia-smi
```

---

**Good luck! You've got everything you need to succeed. 🚀**
