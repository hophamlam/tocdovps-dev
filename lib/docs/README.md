# Documentation System - MDX Approach

## 📋 Tổng Quan

Docs system sử dụng **MDX (Markdown + JSX)** để viết documentation. Đây là approach industry-standard, dễ maintain và mở rộng.

## 🏗️ Cấu Trúc

```
content/docs/
├── quick-start.mdx         # Quick start guide
├── usage.mdx               # Usage examples
├── parameters.mdx          # Parameters documentation
├── technical.mdx           # Technical details
├── tests.mdx               # Test categories
└── faq.mdx                 # FAQ section

components/docs/
├── docs-mdx-section.tsx    # Component render MDX files
└── docs-sidebar.tsx        # Sidebar navigation
```

## ✨ Lợi Ích

1. **Dễ Viết**: Viết bằng Markdown, không cần code
2. **Dễ Maintain**: Non-developers có thể edit
3. **Flexible**: Có thể dùng React components trong Markdown
4. **SEO Tốt**: Better HTML structure
5. **Industry Standard**: Được dùng bởi nhiều docs frameworks

## 📝 Cách Sử Dụng

### Thêm Section Mới

1. Tạo file MDX mới: `content/docs/new-section.mdx`

```mdx
# New Section Title

Content here...

<Card>
  <CardContent>
    You can use React components!
  </CardContent>
</Card>
```

2. Import trong `components/docs/docs-mdx-section.tsx`:

```typescript
import NewSection from "@/content/docs/new-section.mdx";
```

3. Render trong component:

```typescript
<div id="new-section" className="mb-12 scroll-mt-20">
  <NewSection />
</div>
```

4. Thêm vào sidebar trong `components/docs/docs-sidebar.tsx` (nếu cần)

### Thêm Code Example

Trong MDX file:

````mdx
## Example Title

Description here:

```bash
your-command-here
```
````

Code blocks tự động có copy button!

### Thêm Parameter

Trong MDX file, sử dụng Card component:

```mdx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

<Card>
  <CardHeader>
    <CardTitle>newParam</CardTitle>
    <Badge>Optional</Badge>
    <CardDescription>Parameter description</CardDescription>
  </CardHeader>
  <CardContent>
    Options here...
  </CardContent>
</Card>
```

### Thêm FAQ

Trong MDX file:

```mdx
<Card>
  <CardHeader>
    <CardTitle>Question here?</CardTitle>
  </CardHeader>
  <CardContent>
    <CardDescription>Answer here...</CardDescription>
  </CardContent>
</Card>
```

## 🔧 Component Structure

Component `docs-mdx-section.tsx` import và render MDX files:

- Import tất cả MDX files
- Render từng section với proper IDs cho anchor links
- Sidebar navigation tự động scroll đến sections

## 📚 MDX Components

Các components có sẵn trong MDX (đã config trong `mdx-components.tsx`):

- `Alert`, `AlertDescription`, `AlertTitle`
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
- `Badge`
- `Button`
- Code blocks (tự động có copy button)
- Standard HTML elements (h1-h6, p, ul, ol, li, a, etc.)

## 🎯 Best Practices

1. **Sử dụng React components**: Import và dùng shadcn UI components
2. **Code blocks**: Sử dụng triple backticks với language tag
3. **Consistent structure**: Follow pattern của các MDX files hiện có
4. **Anchor links**: Mỗi section cần có `id` attribute để sidebar navigation hoạt động

## 📖 Examples

Xem các MDX files trong `content/docs/`:
- `quick-start.mdx` - Quick start với Alert component
- `usage.mdx` - Usage examples với code blocks
- `parameters.mdx` - Parameters với Card component
- `technical.mdx` - Technical details với multiple cards
- `tests.mdx` - Test categories với grid layout
- `faq.mdx` - FAQ với Card components

## 🔗 Resources

- [MDX Setup Guide](./MDX_SETUP.md) - Chi tiết setup MDX
- [Migration Complete](./MIGRATION_COMPLETE.md) - Migration summary
- [Next.js MDX Docs](https://nextjs.org/docs/app/guides/mdx) - Official docs
- [MDX Website](https://mdxjs.com/) - MDX documentation

