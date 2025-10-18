# Development Workflow

## Standard Operating Procedure for All Code Changes

### 1. Requirements Gathering

- [ ] Understand user's exact request
- [ ] Identify affected files and components
- [ ] List specific features to implement
- [ ] Note any constraints or dependencies

### 2. Implementation

- [ ] Read existing code structure
- [ ] Make changes using appropriate tools (replace_string_in_file, multi_replace_string_in_file)
- [ ] Follow TypeScript/React best practices
- [ ] Use existing UI components from @/components/ui

### 3. Error Resolution

- [ ] Run `get_errors` on modified files
- [ ] Fix all TypeScript compilation errors
- [ ] Fix all ESLint errors
- [ ] Verify imports and dependencies exist
- [ ] Re-check until zero errors

### 4. **MANDATORY: Playwright Validation** ⚠️

**See [COPILOT_VALIDATION_GUIDELINES.md](./COPILOT_VALIDATION_GUIDELINES.md) for complete details**

Minimum validation steps:

```typescript
// 1. Navigate
mcp_playwright_playwright_navigate({
  url: "http://localhost:3000/page-path",
  headless: false,
  width: 1920,
  height: 1080,
});

// 2. Screenshot initial
mcp_playwright_playwright_screenshot({
  name: "initial-state",
  savePng: true,
});

// 3. Test interactions
mcp_playwright_playwright_click({ selector: "button:has-text('Button')" });

// 4. Screenshot results
mcp_playwright_playwright_screenshot({
  name: "after-interaction",
  savePng: true,
});
```

### 5. Memory Documentation

```typescript
mcp_memory_create_entities({
  entities: [
    {
      name: "Feature Name",
      entityType: "project_feature",
      observations: [
        "Implementation details",
        "Components modified",
        "Validation results with screenshots",
        "Date: YYYY-MM-DD",
      ],
    },
  ],
});
```

### 6. User Presentation

Only after steps 1-5 are complete:

- Summarize what was implemented
- Reference specific screenshots as proof
- Note any limitations or next steps
- Provide file paths for reference

---

## Tool Selection Guide

### File Operations

- **read_file**: Understand existing code
- **create_file**: New files only
- **replace_string_in_file**: Single focused edit with 3-5 lines context
- **multi_replace_string_in_file**: Multiple related changes in same or different files
- **get_errors**: Check for TypeScript/ESLint issues

### Validation (CRITICAL)

- **mcp_playwright_playwright_navigate**: Load pages
- **mcp_playwright_playwright_click**: Test buttons
- **mcp_playwright_playwright_fill**: Test inputs
- **mcp_playwright_playwright_screenshot**: Visual proof
- **mcp_playwright_playwright_evaluate**: DOM manipulation/scrolling

### Documentation

- **mcp_memory_create_entities**: New features/concepts
- **mcp_memory_add_observations**: Update existing entities
- **mcp_memory_search_nodes**: Find relevant context

### Terminal Operations

- **run_in_terminal**: Execute commands
  - Use `isBackground: true` for long-running processes (dev server)
  - Use `isBackground: false` for quick commands
- **get_terminal_output**: Check background process status

---

## Project Structure

```
OffGrid1/
├── .github/
│   ├── COPILOT_VALIDATION_GUIDELINES.md  # Validation requirements
│   └── DEVELOPMENT_WORKFLOW.md            # This file
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/                    # Auth pages
│   │   │   ├── green-calculators/         # Calculator pages
│   │   │   ├── water-independence-guide/  # Water guide
│   │   │   └── page.tsx                   # Home page
│   │   ├── components/
│   │   │   └── ui/                        # Shadcn components
│   │   └── lib/
│   │       └── utils.ts                   # Utilities
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## Common Patterns

### Adding New UI Component

1. Check if Shadcn component exists in `@/components/ui`
2. If not, create using Shadcn CLI or manual implementation
3. Install required Radix UI dependency: `npm install @radix-ui/react-[component]`
4. Import and use in page/component

### Region-Specific Features

```typescript
// State
const [region, setRegion] = useState<Region>("uk");

// Conditional rendering
{
  region === "portugal" && <PortugalSpecificContent />;
}

// Config-based values
const config = regionConfigs[region];
const price = config.IBCPrice; // €35 for Portugal, £75 for UK
```

### Custom Price Override Pattern

```typescript
// State
const [customPrices, setCustomPrices] = useState<CustomPrices>({});

// Get effective price
const getPrice = (id: string, defaultPrice: number) => {
  const custom = customPrices[id];
  return custom !== undefined && custom !== null ? custom : defaultPrice;
};

// Handle input change
const handlePriceChange = (id: string, value: string) => {
  const numValue = value === "" ? null : parseFloat(value);
  setCustomPrices((prev) => ({ ...prev, [id]: numValue }));
};
```

### Local Supplier Integration

```typescript
interface Supplier {
  name: string;
  location: string;
  website?: string;
  phone?: string;
  notes: string;
}

// In RegionConfig
localSuppliers?: {
  category: Supplier[];
}

// Render
{config.localSuppliers?.category.map(supplier => (
  <SupplierCard key={supplier.name} {...supplier} />
))}
```

---

## Quality Standards

### TypeScript

- ✅ Zero compilation errors before validation
- ✅ Proper type annotations for all props
- ✅ No `any` types unless absolutely necessary
- ✅ Interface definitions for all data structures

### React

- ✅ Use 'use client' for components with useState/useEffect
- ✅ No metadata exports from client components
- ✅ Proper key props for mapped elements
- ✅ Accessible button/input labels

### Validation

- ✅ All interactive elements tested
- ✅ Screenshots prove functionality
- ✅ Region switching verified if applicable
- ✅ Edge cases tested (€0 input, empty state, etc.)

### Documentation

- ✅ Memory entities created for new features
- ✅ Observations include validation proof
- ✅ Screenshots referenced by name
- ✅ Implementation date recorded

---

## Emergency Procedures

### Dev Server Won't Start

1. Check if port 3000 is in use: `Get-NetTCPConnection -LocalPort 3000`
2. Kill process if found: `Stop-Process -Id [PID]`
3. Verify package.json exists in frontend folder
4. Start with: `cd frontend; npm run dev` (background: true)
5. Wait 5 seconds before navigation

### Playwright Connection Refused

1. Confirm dev server is running
2. Check terminal output for errors
3. Try manual navigation: http://localhost:3000
4. Restart dev server if needed
5. Wait longer (5-10 seconds) before retry

### TypeScript Errors Not Resolving

1. Check for stale error cache - wait 2 seconds
2. Re-run `get_errors` to refresh
3. Verify imports exist: check package.json dependencies
4. Install missing packages: `npm install [package]`
5. Check for circular dependencies

### Screenshots Not Capturing Content

1. Use `window.scrollTo(0, Y)` instead of PageDown
2. Wait after scroll: short sleep or evaluate
3. Ensure element is visible before screenshot
4. Check viewport dimensions (1920x1080 standard)

---

## Validation Examples

### Water Independence Guide (2025-10-17)

✅ **Feature**: Custom pricing + local Portuguese suppliers  
✅ **Files Modified**: `app/water-independence-guide/page.tsx`, `components/ui/label.tsx`  
✅ **Tests Performed**:

- Portugal button clicked → € prices confirmed
- Edit Prices button → input fields appeared
- Show Local Suppliers → all 4 categories displayed
- Custom price input → €0 accepted, total updated
  ✅ **Screenshots**: 6 total covering all states  
  ✅ **Memory**: 2 entities created with 22 observations  
  ✅ **Result**: All features working, user can now customize prices and see local suppliers

---

## Future Enhancements Tracking

When user requests features, document them:

```typescript
mcp_memory_create_entities({
  entities: [
    {
      name: "Future Enhancement: [Feature Name]",
      entityType: "feature_request",
      observations: [
        "User request: [exact quote]",
        "Requested date: YYYY-MM-DD",
        "Priority: high/medium/low",
        "Dependencies: [list]",
        "Implementation notes: [ideas]",
      ],
    },
  ],
});
```

---

## Conclusion

**Every change must be validated. No exceptions.**

This workflow ensures:

- Code actually works (Playwright proof)
- No regressions (error checking)
- Knowledge preserved (memory documentation)
- User confidence (screenshot evidence)

Follow this process religiously and you'll never ship broken code again.
