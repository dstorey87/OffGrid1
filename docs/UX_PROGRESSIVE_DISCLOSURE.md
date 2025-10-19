# Progressive Disclosure UX Patterns for Solar System Designer

## Core Principles (Nielsen Norman Group)

### Definition
Progressive disclosure is a UX technique that **defers advanced or rarely used features to secondary screens**, making applications easier to learn and less error-prone.

### Key Benefits
1. **Reduces Cognitive Load**: Shows only essential information initially
2. **Prevents Errors**: Novice users avoid advanced settings they don't need
3. **Signals Importance**: What appears on initial display is critical
4. **Improves Engagement**: Step-by-step progression builds user confidence

## Best Practices for Solar Calculators

### 1. Wizard-Style Step Flow
**Structure**: Linear progression with clear stages
```
Step 1: Location → Step 2: Energy Needs → Step 3: Roof Details → 
Step 4: Product Selection → Step 5: Comparison → Step 6: Checkout
```

**Implementation Tips**:
- Show progress indicator (e.g., "Step 2 of 6")
- Allow backward navigation to edit previous steps
- Save state between steps
- Provide "Skip" for advanced users

### 2. Default Values with Override Option
**Pattern**: Pre-fill common values, hide advanced settings
```
✓ Auto-fill household presets (Single, Couple, Family)
✓ Use regional defaults (optimal tilt angle for location)
✓ Hide advanced settings in expandable sections
```

**Example**:
```
Daily Energy Need: [10.5 kWh] ← Auto-filled
└─ 🔽 Advanced: Seasonal variation, future expansion
```

### 3. Contextual Help
**Pattern**: Just-in-time information when needed
- Tooltips for technical terms (kWh, kWp, BMS)
- "Learn more" links that don't interrupt flow
- Inline examples ("e.g., 10.5 kWh for average home")

### 4. Smart Recommendations
**Pattern**: Guide users to optimal choices
- "Most popular" badges on mid-range products
- "Best for your situation" based on inputs
- Comparison tables (Budget vs Mid vs Premium)

### 5. Validation & Feedback
**Pattern**: Real-time guidance
- Green checkmarks for completed steps
- Warning icons for unusual inputs ("This seems high")
- Cost impact preview ("Adding 2 panels = +€800")

## Solar System Designer Structure

### Main Page: Complete System Designer
**Layout**: Hero section with immediate action
```
┌─────────────────────────────────────┐
│  Design Your Perfect Solar System   │
│  ─────────────────────────────────  │
│  [Start System Designer →]          │
│                                      │
│  ✓ Get exact panel count            │
│  ✓ Compare products side-by-side    │
│  ✓ See multiple pricing options     │
└─────────────────────────────────────┘
```

### Step 1: Location & Energy
**Progressive Disclosure**: Start with essentials only
```
Where are you located?
└─ [Select Region ▼] Portugal → North, Central, Algarve, Azores, Madeira

How much energy do you use daily?
└─ Quick Start: [Single Person] [Couple] [Family] [Large Family]
└─ Or enter manually: [___] kWh/day
└─ 🔽 Don't know? Use Load Calculator →
```

### Step 2: Roof & Installation
**Pattern**: Show common options, hide advanced
```
Roof Orientation: [South ▼] ← Default optimal
Roof Tilt: [30° ▼] ← Auto-filled based on location

🔽 Advanced Options (click to expand)
   ├─ Shading analysis
   ├─ Multiple roof sections
   └─ Ground-mount alternative
```

### Step 3: Product Selection
**Pattern**: Tiered recommendations with comparison
```
┌─────────────┬─────────────┬─────────────┐
│   BUDGET    │  MID-RANGE  │   PREMIUM   │
│   €1,200    │   €1,850    │   €2,600    │
│ Most Basic  │ ⭐ Popular  │ Max Efficien│
│ [Details]   │ [Details]   │ [Details]   │
└─────────────┴─────────────┴─────────────┘

[Compare All Options →] ← Opens detailed side-by-side
```

### Step 4: Battery & Backup
**Pattern**: Optional step with clear value prop
```
Add Battery Storage? (Optional)
└─ ✓ Power during outages
└─ ✓ Store excess solar energy
└─ ✓ Use solar power at night

[Yes, Add Battery] [No, Grid-Tied Only]
```

### Step 5: Final Review
**Pattern**: Summary with edit links
```
Your Solar System Design
├─ 📍 Location: Algarve, Portugal [Edit]
├─ ⚡ Daily Energy: 10.5 kWh [Edit]
├─ 🔆 Panels: 7x 400W (2.8 kW) [Edit]
├─ 🔋 Battery: 10 kWh LiFePO4 [Edit]
└─ 💰 Total: €2,850 (Mid-Range Option)

[Get Shopping List] [Save Design] [Contact Installer]
```

## Navigation Structure

### Primary Navigation
```
┌─────────────────────────────────────────────────┐
│ [Logo] System Designer | DIY Guides | Shop |   │
│        Portugal Living | Services               │
└─────────────────────────────────────────────────┘
```

### System Designer Sub-navigation (Breadcrumb)
```
System Designer > Step 2: Energy Needs
```

## Consistency Guidelines
1. **Color Coding**: Green = recommended, Blue = selected, Yellow = warning
2. **Icons**: Consistent throughout (🔆 solar, 🔋 battery, 💰 cost)
3. **Button Hierarchy**: Primary CTA = bright, Secondary = outline
4. **Spacing**: Generous whitespace, clear visual grouping

## References
- Nielsen Norman Group: Progressive Disclosure (https://www.nngroup.com/articles/progressive-disclosure/)
- Interaction Design Foundation: Progressive Disclosure Patterns
- Justinmind: Progressive Disclosure for Responsive Websites

## Last Updated
October 19, 2025
