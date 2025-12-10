# 🎨 Nguồn Tham Khảo Cải Thiện UI Docs

## 📚 Documentation Sites Nổi Tiếng (Tham Khảo Design)

### 1. **shadcn/ui Documentation**
- **URL**: https://ui.shadcn.com
- **Tại sao**: 
  - Sử dụng chính shadcn UI components
  - Layout và spacing patterns
  - Code examples styling
  - Sidebar navigation
- **Áp dụng**: Copy layout structure, spacing, component usage

### 2. **Vercel Documentation**
- **URL**: https://vercel.com/docs
- **Tại sao**:
  - Next.js best practices
  - Clean, modern design
  - Excellent typography
  - Great code block styling
- **Áp dụng**: Typography scale, code block design, page structure

### 3. **Next.js Documentation**
- **URL**: https://nextjs.org/docs
- **Tại sao**:
  - Official Next.js docs
  - MDX implementation
  - Navigation patterns
  - Search functionality
- **Áp dụng**: MDX patterns, navigation UX, content organization

### 4. **Tailwind CSS Documentation**
- **URL**: https://tailwindcss.com/docs
- **Tại sao**:
  - Excellent sidebar design
  - Search implementation
  - Code examples
  - Responsive design
- **Áp dụng**: Sidebar UX, search UI, responsive patterns

### 5. **Radix UI Documentation**
- **URL**: https://www.radix-ui.com
- **Tại sao**:
  - Component API documentation
  - Props tables
  - Examples layout
  - Accessibility patterns
- **Áp dụng**: Component documentation patterns, props tables

### 6. **Fumadocs Examples**
- **URL**: https://fumadocs.dev
- **Tại sao**:
  - Modern docs framework
  - Great UI/UX
  - MDX patterns
  - Theme customization
- **Áp dụng**: Layout ideas, component patterns

### 7. **Stripe Documentation**
- **URL**: https://stripe.com/docs
- **Tại sao**:
  - Professional design
  - Excellent code examples
  - Clear hierarchy
  - Great navigation
- **Áp dụng**: Professional polish, code example styling

## 🎨 Component Libraries & Frameworks

### 1. **shadcn/ui Components**
- **URL**: https://ui.shadcn.com/docs/components
- **Components hữu ích cho docs**:
  - `Tabs` - Cho code examples với multiple languages
  - `Accordion` - Cho FAQ sections
  - `Table` - Cho props/API documentation
  - `Separator` - Cho visual separation
  - `ScrollArea` - Đã dùng cho sidebar
  - `Tooltip` - Cho additional info
- **Cách dùng**: `npx shadcn@latest add [component-name]`

### 2. **Fumadocs UI Components**
- **URL**: https://fumadocs.dev/docs/ui/components
- **Components**:
  - `Tabs` - Multi-tab interface
  - `Callout` - Alert/Info boxes
  - `Card` - Content cards
  - `Steps` - Step-by-step guides
- **Note**: Có thể lấy ideas và implement với shadcn

### 3. **Nextra Components**
- **URL**: https://nextra.site
- **Features**:
  - TOC (Table of Contents)
  - Search
  - Theme switcher
  - Code highlighting
- **Áp dụng**: Lấy ideas cho TOC, search implementation

## 🎯 Design Patterns Cụ Thể

### 1. **Sidebar Navigation**
**Tham khảo từ**:
- shadcn/ui docs
- Tailwind CSS docs
- Vercel docs

**Cải thiện có thể**:
- Active state highlighting
- Nested navigation (nếu có subsections)
- Collapsible groups
- Breadcrumbs

### 2. **Code Blocks**
**Tham khảo từ**:
- shadcn/ui docs
- Vercel docs
- Stripe docs

**Cải thiện có thể**:
- Syntax highlighting (đã có)
- Copy button (đã có)
- Line numbers
- Language tabs
- File name display

### 3. **Content Layout**
**Tham khảo từ**:
- Next.js docs
- Tailwind CSS docs

**Cải thiện có thể**:
- Max-width cho readability
- Better spacing between sections
- Visual hierarchy với typography
- Anchor links cho headings

### 4. **Alerts/Callouts**
**Tham khảo từ**:
- Fumadocs Callout
- shadcn/ui Alert

**Cải thiện có thể**:
- Multiple variants (info, warning, error, success)
- Icons cho từng type
- Better styling

### 5. **Tables**
**Tham khảo từ**:
- Radix UI docs
- shadcn/ui Table

**Cải thiện có thể**:
- Responsive tables
- Sortable columns
- Better styling

## 🛠️ Tools & Resources

### 1. **Design Inspiration**
- **Dribbble**: Search "documentation design"
- **Behance**: Search "tech documentation"
- **Awwwards**: Best website designs

### 2. **Color & Typography**
- **Tailwind CSS Colors**: https://tailwindcss.com/docs/customizing-colors
- **Google Fonts**: https://fonts.google.com
- **Inter Font**: Đang dùng Nunito, có thể thử Inter

### 3. **Icons**
- **Lucide Icons**: Đang dùng ✅
- **Heroicons**: Alternative
- **Radix Icons**: Match với Radix UI

### 4. **Code Highlighting**
- **shiki**: Better syntax highlighting
- **Prism.js**: Alternative
- **rehype-pretty-code**: MDX plugin

## 📖 Specific Improvements Có Thể Áp Dụng

### 1. **Typography Scale**
```tsx
// Cải thiện heading hierarchy
h1: "text-4xl md:text-5xl font-bold"
h2: "text-3xl md:text-4xl font-semibold"
h3: "text-2xl md:text-3xl font-semibold"
```

### 2. **Spacing System**
```tsx
// Consistent spacing
section: "mb-16 md:mb-24"
card: "mb-6 md:mb-8"
```

### 3. **Code Block Enhancements**
- Line numbers
- Language indicator
- Copy button (đã có)
- File name display

### 4. **Interactive Elements**
- Tabs cho multiple code examples
- Accordion cho FAQ
- Tooltips cho technical terms
- Collapsible sections

### 5. **Visual Enhancements**
- Gradient backgrounds
- Icons cho sections
- Badges cho status
- Progress indicators

## 🎨 Quick Wins (Dễ Áp Dụng)

### 1. **Add Tabs Component**
```bash
npx shadcn@latest add tabs
```
Dùng cho code examples với multiple languages

### 2. **Add Accordion Component**
```bash
npx shadcn@latest add accordion
```
Dùng cho FAQ sections

### 3. **Improve Code Blocks**
- Add line numbers
- Add file name
- Better syntax highlighting

### 4. **Add Table Component**
```bash
npx shadcn@latest add table
```
Dùng cho parameters/props documentation

### 5. **Add Separator Component**
```bash
npx shadcn@latest add separator
```
Dùng cho visual separation

## 🔗 Useful Links

### Documentation Frameworks
- [Fumadocs](https://fumadocs.dev) - Modern docs framework
- [Nextra](https://nextra.site) - Next.js docs framework
- [Mintlify](https://mintlify.com) - Docs builder
- [Docusaurus](https://docusaurus.io) - React docs framework

### Design Systems
- [shadcn/ui](https://ui.shadcn.com) - Component library (đang dùng)
- [Radix UI](https://www.radix-ui.com) - Headless components
- [Chakra UI](https://chakra-ui.com) - Component library

### Inspiration Sites
- [Stripe Docs](https://stripe.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com/docs)

## 💡 Recommendations

### Priority 1 (Quick Wins)
1. ✅ Add Tabs component cho code examples
2. ✅ Improve code block styling
3. ✅ Add better spacing
4. ✅ Add icons cho sections

### Priority 2 (Medium Effort)
1. Add Accordion cho FAQ
2. Add Table component cho parameters
3. Improve typography scale
4. Add tooltips

### Priority 3 (Long Term)
1. Add search functionality
2. Add TOC (Table of Contents)
3. Add breadcrumbs
4. Add dark mode improvements

## 🎯 Action Plan

1. **Tham khảo**: Xem các docs sites trên, note patterns bạn thích
2. **Chọn components**: Quyết định components nào cần thêm
3. **Implement**: Bắt đầu với quick wins
4. **Iterate**: Test và improve dần

---

**Note**: Tất cả các nguồn trên đều có thể áp dụng vào project Next.js + shadcn UI của bạn!

