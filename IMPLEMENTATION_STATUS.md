# Implementation Status - Multi-Unit & Sources Update

## ✅ Completed Tasks

### 1. Units System Infrastructure

- ✅ Created `UnitsContext.tsx` with:

  - Volume conversion (liters ↔ gallons: 0.264172)
  - Area conversion (m² ↔ ft²: 10.7639)
  - Length conversion (meters ↔ feet: 3.28084)
  - Weight conversion (kg ↔ lbs: 2.20462)
  - Format functions with unit labels
  - LocalStorage persistence
  - isMetric helper

- ✅ Created `UnitsSelector.tsx`:

  - Dropdown with "Metric (L, m², kg)" / "Imperial (gal, ft², lbs)"
  - System-wide toggle (changes all 4 unit types)
  - Dark mode compatible

- ✅ Created `ValueWithUnits.tsx`:

  - Reusable display component
  - Automatic unit conversion
  - Props: value (metric), type, decimals, className

- ✅ Integrated into `layout.tsx`:
  - UnitsProvider wraps entire app
  - Available globally via useUnits hook

### 2. Load Analysis Calculator (Template Implementation)

- ✅ Added UnitsSelector alongside CurrencySelector
- ✅ Changed "Pricing Options" → "Pricing & Units"
- ✅ Added comprehensive "Data Sources & References" section:
  - Equipment specifications (Renogy, Victron, Battle Born, Aims Power)
  - Pricing data sources (Amazon, eBay, specialists, MSRPs)
  - Calculation methods (NREL guidelines, IEEE standards)
  - Efficiency factors (SEI, 20% system losses, DOD margins)
  - Professional disclaimer

### 3. Dark Mode Fixes

- ✅ `wind-power/page.tsx`: text-gray-600 → text-gray-600 dark:text-gray-400
- ✅ `hydroponics/page.tsx`: text-gray-600 → text-gray-600 dark:text-gray-400
- ✅ `total-water-independence/page.tsx`: text-gray-600 → text-gray-600 dark:text-gray-400
- ✅ `blog/page.tsx`: bg-gray-100 text-gray-800 → dark:bg-gray-800 dark:text-gray-200

### 4. Image Collection

- ✅ Already implemented - all pages use Unsplash images with proper attribution

---

## 🚧 In Progress

### Rainwater Harvesting Calculator ✅ COMPLETE

- ✅ Added imports (useUnits, UnitsSelector, ValueWithUnits)
- ✅ Converted calculations from imperial to metric-first approach
  - Old formula: `roofArea * rainfall * 0.623 * efficiency` (imperial)
  - New formula: `roofAreaM2 * rainfallMM * efficiency` (metric - 1mm on 1m² = 1L)
  - Automatically converts user inputs based on their preferred units
- ✅ Updated interface to store liters only (metric-first storage)
- ✅ Replaced all hardcoded "gallons" display with ValueWithUnits
- ✅ Added UnitsSelector to header UI
- ✅ Added comprehensive sources section:
  - Rainfall collection formula explanation
  - Collection efficiency factors (Texas A&M, EPA WaterSense)
  - Tank sizing standards (ARCSA guidelines)
  - Filtration recommendations (NSF/ANSI 350)
  - Product pricing sources (Amazon, Home Depot, 2024)
  - Gutter/downspout sizing (International Plumbing Code)
  - Professional disclaimer about local codes and consultation
- ✅ Added dark mode compatibility to all colored cards

---

## 📋 Pending Tasks

### Priority 1: Water Calculators Units Conversion

#### Greywater Systems Calculator

- Add imports (useUnits, UnitsSelector, ValueWithUnits)
- Convert calculations from gallons to liters:
  - Shower: 17 gal → 64 L per shower
  - Laundry: Convert daily gallons to liters
  - Sinks: Convert daily gallons to liters
- Update display with ValueWithUnits
- Add UnitsSelector to UI
- Add sources section:
  - EPA water usage data
  - Greywater treatment standards
  - Irrigation guidelines
  - System manufacturers

#### Hydroponics Calculator

- Add imports (useUnits, UnitsSelector, ValueWithUnits)
- Convert volume calculations to metric:
  - System volume (gallons → liters)
  - Reservoir size (gallons → liters)
  - Daily water usage (gallons → liters per plant)
- Update display with ValueWithUnits
- Add UnitsSelector to UI
- Add sources section:
  - Hydroponic system specifications
  - Nutrient solution guidelines
  - Plant spacing standards
  - Equipment manufacturers

#### Total Water Independence Calculator

- Already uses liters internally ✅
- Add UnitsSelector to UI
- Ensure display uses ValueWithUnits
- Add sources section:
  - Multi-source calculation methods
  - Portugal rainfall data sources
  - Water treatment standards

### Priority 2: Solar Calculators Sources Sections

#### Panel Sizing Calculator

Add "Data Sources & References" section:

- **Solar Irradiance Data**: NREL Solar Resource Database, NASA Surface meteorology and Solar Energy (SSE)
- **Panel Specifications**: Manufacturer datasheets (efficiency, temperature coefficients, warranties)
- **Derating Factors**: Temperature losses (0.5%/°C above 25°C), soiling losses (2-5%), shading analysis
- **Calculation Methods**: PVWatts methodology, IEC 61215 standards
- **Mounting & Orientation**: Optimal tilt calculations, azimuth adjustments
- **Disclaimer**: Planning purposes, site-specific assessment recommended

#### Battery Sizing Calculator

Add "Data Sources & References" section:

- **Battery Specifications**: Manufacturer datasheets (capacity, DOD limits, cycle life)
- **Chemistry Types**: Lead-acid (AGM, Flooded), Lithium (LiFePO4, NMC), comparison data
- **Capacity Calculations**: Ah to kWh conversions, temperature derating, voltage considerations
- **Days of Autonomy**: Climate-based recommendations, backup power standards
- **Depth of Discharge**: Manufacturer guidelines (50% lead-acid, 80-100% lithium)
- **Efficiency Losses**: Charge/discharge inefficiencies, self-discharge rates
- **Disclaimer**: Professional installation recommended, ventilation requirements

#### Inverter Calculator

Add "Data Sources & References" section:

- **Inverter Specifications**: Manufacturer datasheets (continuous power, surge ratings, efficiency)
- **Waveform Types**: Pure sine wave vs modified sine wave, UL standards
- **Efficiency Ratings**: CEC weighted efficiency, European efficiency
- **Surge Requirements**: Motor starting currents (3-7x rated), inductive loads
- **Safety Standards**: UL 1741, IEEE 1547 grid-tie requirements
- **Sizing Guidelines**: 125% continuous load capacity, temperature derating
- **Disclaimer**: Licensed electrician required for installation

#### System Designer Calculator

Add "Data Sources & References" section:

- **System Integration**: Complete off-grid system design principles
- **Wire Sizing**: NEC Article 690, voltage drop calculations (3% max)
- **Safety Equipment**: Fuses, breakers, disconnects (NEC requirements)
- **Grounding**: Equipment grounding, surge protection (IEEE C62 standards)
- **Monitoring**: System monitoring recommendations, data logging
- **Component Compatibility**: Voltage matching, communication protocols
- **Installation Standards**: NEC compliance, local code requirements
- **Disclaimer**: Professional design review and installation required

### Priority 3: Green Calculators Sources Sections

#### Wind Power Calculator

Add "Data Sources & References" section:

- **Turbine Specifications**: Manufacturer datasheets (power curves, cut-in/out speeds)
- **Wind Speed Data**: Weather station data, wind resource maps
- **Tower Height**: Wind shear calculations, height recommendations
- **Power Curves**: Manufacturer power output vs wind speed data
- **Zoning & Permits**: Local regulations, setback requirements
- **Installation Standards**: IEC 61400 series, safety requirements
- **Disclaimer**: Site assessment required, professional installation

#### Total Water Independence Calculator

- Add comprehensive sources for multi-source calculations
- Portugal-specific rainfall data sources
- Water treatment and quality standards
- Storage tank sizing guidelines

---

## 🧪 Testing & Validation Needed

### Units System Testing

- [ ] Test metric → imperial conversion accuracy
- [ ] Verify all conversion factors mathematically correct:
  - 1000 L = 264.17 gal ✓
  - 100 m² = 1076.39 ft² ✓
  - 10 m = 32.81 ft ✓
  - 50 kg = 110.23 lbs ✓
- [ ] Test localStorage persistence across sessions
- [ ] Verify calculations remain correct in both unit systems
- [ ] Check decimal place formatting appropriate

### Responsive Design Testing

- [ ] Test Currency + Units dual selectors on mobile (320px-768px)
- [ ] Verify flexbox wrapping works correctly
- [ ] Check touch targets adequate for mobile use
- [ ] Validate spacing and alignment on all screen sizes

### Dark Mode Validation

- [ ] Verify all text visible in dark mode
- [ ] Check all calculator pages
- [ ] Test card components
- [ ] Validate badge colors
- [ ] Ensure form inputs styled correctly

### Cross-Calculator Consistency

- [ ] All calculators with units have UnitsSelector
- [ ] All calculators with product recommendations have sources
- [ ] Format consistency across all sources sections
- [ ] Unit label consistency (L vs l, m² vs sqm, etc.)

---

## 📊 Progress Summary

**Completed**: 10 tasks

- ✅ UnitsContext infrastructure (3 files)
- ✅ Layout integration
- ✅ Load Analysis template with sources
- ✅ Rainwater Harvesting complete refactor with sources
- ✅ Dark mode fixes (5 files - added rainwater calculator)

**In Progress**: 0 tasks

**Pending**: 7 major tasks

- 3 Water calculator conversions
- 4 Solar calculator sources sections
- 1 Wind power sources section
- Comprehensive testing & validation

**Total Files Modified**: 12 files
**Total Files Pending**: ~8 calculator files

---

## 🎯 Next Steps (Priority Order)

1. **Complete Rainwater Harvesting** - User can't use without metric support
2. **Greywater Systems** - Second critical water calculator
3. **Hydroponics** - Third water calculator
4. **Solar Calculator Sources** - Add credibility to recommendations
5. **Green Calculator Sources** - Complete attribution
6. **Comprehensive Testing** - Validate accuracy and usability

---

## 📝 Technical Notes

### Unit Conversion Formulas

```javascript
// Volume
liters * 0.264172 = gallons
gallons / 0.264172 = liters

// Area
m² * 10.7639 = ft²
ft² / 10.7639 = m²

// Length
meters * 3.28084 = feet
feet / 3.28084 = meters

// Weight
kg * 2.20462 = lbs
lbs / 2.20462 = kg
```

### Rainwater Collection Formula Conversion

**Imperial (current)**: `roofArea (ft²) × rainfall (inches) × 0.623 × efficiency = gallons`

**Metric (needed)**: `roofArea (m²) × rainfall (mm) × 0.001 × efficiency = liters`

_Note: 1mm rain on 1m² = 1 liter (by definition)_

### Standard Display Pattern

```tsx
// Instead of:
<p>{results.volume} gallons</p>

// Use:
<ValueWithUnits value={results.volume} type="volume" decimals={0} />

// Or:
<p>{formatVolume(results.volume, 0)}</p>
```
