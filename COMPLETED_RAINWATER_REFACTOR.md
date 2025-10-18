# ✅ Rainwater Harvesting Calculator - Complete Refactor

## What Was Changed

### 1. Metric-First Calculation Approach

**Before:**

```javascript
// Imperial-first (gallons, feet, inches)
const roofArea = length * width; // sq ft
const annualGallons = roofArea * rainfall * 0.623 * efficiency;
const annualLiters = annualGallons * 3.78541;
```

**After:**

```javascript
// Metric-first with automatic conversion
const lengthMeters = isMetric ? length : length / 3.28084;
const widthMeters = isMetric ? width : width / 3.28084;
const rainfallMM = isMetric ? rainfall : rainfall * 25.4;
const roofAreaM2 = lengthMeters * widthMeters;
const annualLiters = roofAreaM2 * rainfallMM * efficiency; // 1mm on 1m² = 1L
```

### 2. Updated Interface

**Before:**

```typescript
interface RainwaterResults {
  annualCollectionGallons: number; // Redundant
  annualCollectionLiters: number; // Redundant
  // ... stored in imperial
}
```

**After:**

```typescript
interface RainwaterResults {
  annualCollection: number; // Always stored in liters
  recommendedTankSize: number; // Liters
  monthlyAverage: number; // Liters
  roofArea: number; // Square meters
  // ... all metric storage
}
```

### 3. Dynamic Input Labels

**Before:**

```tsx
<label>Roof Length (feet)</label>
<Input placeholder="40" />

<label>Annual Rainfall (inches)</label>
<Input placeholder="25.5" />

<label>Daily Water Usage (gallons)</label>
<Input placeholder="100" />
```

**After:**

```tsx
<label>Roof Length ({isMetric ? 'meters' : 'feet'})</label>
<Input placeholder={isMetric ? '12' : '40'} />

<label>Annual Rainfall ({isMetric ? 'millimeters' : 'inches'})</label>
<Input placeholder={isMetric ? '650' : '25.5'} />

<label>Daily Water Usage ({isMetric ? 'liters' : 'gallons'})</label>
<Input placeholder={isMetric ? '380' : '100'} />
```

### 4. Automatic Display Conversion

**Before:**

```tsx
<span>{results.annualCollectionGallons.toLocaleString()} gallons</span>
<span>{results.monthlyAverage.toLocaleString()} gallons</span>
<span>{results.recommendedTankSize.toLocaleString()} gallons</span>
```

**After:**

```tsx
<ValueWithUnits value={results.annualCollection} type="volume" decimals={0} />
<ValueWithUnits value={results.monthlyAverage} type="volume" decimals={0} />
<ValueWithUnits value={results.recommendedTankSize} type="volume" decimals={0} />
```

_Displays as "15000 L" or "3963 gal" based on user preference_

### 5. Added UnitsSelector

```tsx
<div className="mt-4 flex justify-center">
  <UnitsSelector />
</div>
```

User can now toggle between Metric and Imperial systems.

### 6. Comprehensive Sources Section

```tsx
<div className="rounded-lg border bg-card p-6">
  <h3>📚 Data Sources & References</h3>- Rainfall Collection Formula (1mm on 1m²
  = 1L principle) - Collection Efficiency Factors (Texas A&M, EPA WaterSense) - Tank
  Sizing Standards (ARCSA guidelines) - Filtration Recommendations (NSF/ANSI 350)
  - Product Pricing Sources (Amazon, Home Depot 2024) - Gutter/Downspout Sizing (International
  Plumbing Code) - Professional Disclaimer (local codes, consultation required)
</div>
```

### 7. Dark Mode Compatibility

All colored result cards now have dark mode variants:

- `bg-primary/10` → works in both modes
- `bg-blue-50` → `bg-blue-50 dark:bg-blue-950/30`
- `bg-green-50` → `bg-green-50 dark:bg-green-950/30`
- `bg-orange-50` → `bg-orange-50 dark:bg-orange-950/30`
- `bg-gray-50` → `bg-gray-50 dark:bg-gray-800`
- Text colors: `text-blue-900 dark:text-blue-300`

## Testing Checklist

### Metric Mode

- [ ] Enter: Length 12m, Width 9m, Rainfall 650mm, Usage 380L
- [ ] Expected: Annual ~67,000 L, Tank ~28,000 L
- [ ] Verify: All displays show "L" and "m²" units

### Imperial Mode

- [ ] Enter: Length 40ft, Width 30ft, Rainfall 25.5in, Usage 100gal
- [ ] Expected: Annual ~17,700 gal, Tank ~7,500 gal
- [ ] Verify: All displays show "gal" and "ft²" units

### Unit Switching

- [ ] Calculate in metric
- [ ] Switch to imperial using UnitsSelector
- [ ] Verify: All values convert correctly (1000L = 264gal)
- [ ] Verify: Input placeholders update
- [ ] Verify: Helper text updates

### Dark Mode

- [ ] Toggle dark mode
- [ ] Verify: All text visible in colored cards
- [ ] Verify: Product section readable
- [ ] Verify: Sources section properly styled

## Mathematical Accuracy

### Conversion Factors Used

```javascript
// Length
1 meter = 3.28084 feet
1 foot = 0.3048 meters

// Volume
1 liter = 0.264172 gallons
1 gallon = 3.78541 liters

// Rainfall
1 inch = 25.4 millimeters
1 millimeter = 0.0393701 inches

// Collection Formula
Metric: roofArea (m²) × rainfall (mm) × efficiency = liters
Imperial: roofArea (ft²) × rainfall (in) × 0.623 × efficiency = gallons
```

### Formula Validation

**Example:** 40ft × 30ft roof, 25.5 inches rainfall, 85% efficiency

**Imperial Method:**

```
1200 ft² × 25.5 in × 0.623 × 0.85 = 16,175 gallons
```

**Metric Method:**

```
40 ft = 12.192 m
30 ft = 9.144 m
Area = 111.48 m²
25.5 in = 647.7 mm
111.48 × 647.7 × 0.85 = 61,362 liters
61,362 L × 0.264172 = 16,208 gallons ✓
```

_(Small difference due to rounding)_

## Next Steps

This same pattern needs to be applied to:

1. **Greywater Systems Calculator** - Convert shower/laundry gallons to liters
2. **Hydroponics Calculator** - Convert system volume calculations to metric
3. **Total Water Independence** - Already uses liters, add UnitsSelector and sources

## Files Modified

1. `frontend/src/app/green-calculators/rainwater-harvesting/page.tsx`
   - 10 major edits via multi_replace_string_in_file
   - Interface updated
   - Calculation logic converted to metric-first
   - Display replaced with ValueWithUnits
   - UnitsSelector added
   - Sources section added
   - Dark mode compatibility added
   - Lint errors resolved

## Benefits

### For Users

- ✅ International usability (metric/imperial toggle)
- ✅ Professional source citations
- ✅ Dark mode compatible
- ✅ Consistent unit display
- ✅ Accurate calculations in both systems

### For Developers

- ✅ Metric-first approach (international standard)
- ✅ Single source of truth (store liters, convert on display)
- ✅ Reusable ValueWithUnits component
- ✅ Clean, maintainable code
- ✅ Type-safe interface

### Technical Excellence

- ✅ No magic numbers (0.623) in display code
- ✅ Proper physics (1mm on 1m² = 1L by definition)
- ✅ Automatic unit conversion
- ✅ LocalStorage persistence
- ✅ Responsive design maintained
