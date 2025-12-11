# 📝 Documentation Writing Rules (for future contributors)

## ⚡ TL;DR Checklist

- [ ] Chỉ dùng Markdown; tránh HTML thừa và React component không cần thiết.
- [ ] Mọi text hiển thị phải nằm trong `<T translationKey="...">fallback</T>`.
- [ ] Key format: `docs.{section}.{subsection}.{element}`. Thêm cả vi/en vào `lib/i18n/dictionary.ts`.
- [ ] Một `#` duy nhất cho tiêu đề trang; nội dung dùng `##` và `###` (TOC chỉ lấy tới H3).
- [ ] Code block / inline code KHÔNG dịch, nhưng mô tả/label xung quanh phải dịch.
- [ ] Không hardcode text UI (Prev/Next/TOC...) — dùng key `docs.nav.*`, `docs.toc.title`.
- [ ] File ngắn gọn, < 200 dòng nếu có thể.

## 🎯 Nguyên Tắc Chung

### 1. Ưu Tiên Markdown

- ✅ Markdown thay vì HTML/React khi có thể
- ❌ Tránh `<div>`, `<span>` không cần thiết
- ✅ Chỉ dùng component UI khi thực sự cần (Alert, Tabs, Badge…)

### 2. Respect Translation (i18n)

- ✅ BẮT BUỘC: mọi text hiển thị được wrap bằng `<T>`
- ✅ Luôn có fallback text trong children của `<T>`
- ✅ Key có cấu trúc `docs.{section}.{subsection}.{key}`
- ✅ Thêm cả bản dịch vi/en trong `lib/i18n/dictionary.ts`

### 3. Cấu Trúc File

- ✅ Import `<T>` đầu file
- ✅ Một `#` cho tiêu đề trang, các mục dùng `##`/`###`
- ✅ Giữ file ngắn gọn, dễ đọc

## 📋 Quy Tắc Chi Tiết

### Headings

```mdx
# <T translationKey="docs.section.title">Section Title</T>

## <T translationKey="docs.section.subsection.title">Subsection Title</T>
```

**✅ Đúng:**

```mdx
# <T translationKey="docs.quickStart.title">Quick Start</T>
```

**❌ Sai:**

```mdx
# Quick Start
```

### Paragraphs

```mdx
<T translationKey="docs.section.description">
  This is a paragraph that will be translated. Always provide fallback text in
  English.
</T>
```

**✅ Đúng:**

```mdx
<T translationKey="docs.usage.basic.description">
  Run the benchmark script with default settings. The script will automatically
  detect your system and run appropriate tests.
</T>
```

**❌ Sai:**

```mdx
Run the benchmark script with default settings.
```

### Lists

**✅ Đúng:**

```mdx
- <T translationKey="docs.tests.system.cpu">CPU information and cores</T>
- <T translationKey="docs.tests.system.ram">RAM size and usage</T>
- <T translationKey="docs.tests.system.os">Operating system and version</T>
```

**❌ Sai:**

```mdx
- CPU information and cores
- RAM size and usage
```

### Code Blocks

Code blocks **KHÔNG CẦN** translation (code là universal):

````mdx
```bash
bash <(curl -fsSL https://tocdovps.dev/install)
```
````

````

**✅ Đúng:**
```mdx
<T translationKey="docs.quickStart.description">
  Run the following command:
</T>

```bash
bash <(curl -fsSL https://tocdovps.dev/install)
````

````

### Inline Code

Inline code cũng **KHÔNG CẦN** translation:

```mdx
<T translationKey="docs.parameters.mode.description">
  Use the `--mode` parameter to control sharing:
</T>
````

### Links

Links có thể có text được translate:

```mdx
<T translationKey="docs.technical.readMore">
  Read more about <a href="/docs/technical">technical details</a>.
</T>
```

Hoặc link đơn giản:

```mdx
<a href="https://github.com/your-repo">GitHub</a>
```

### React Components

Chỉ dùng React components khi **THỰC SỰ CẦN THIẾT**:

**✅ Đúng (khi cần Alert, Badge, etc.):**

```mdx
import { Alert, AlertDescription } from "@/components/ui/alert";

<Alert>
  <AlertDescription>
    <T translationKey="docs.quickStart.warning">
      Make sure you have sufficient disk space before running the benchmark.
    </T>
  </AlertDescription>
</Alert>
```

**❌ Sai (lạm dụng HTML):**

```mdx
<div className="alert">
  <p>Warning message</p>
</div>
```

### Tables

Tables có thể dùng markdown syntax:

```mdx
| <T translationKey="docs.table.header1">Column 1</T>  | <T translationKey="docs.table.header2">Column 2</T>  |
| ---------------------------------------------------- | ---------------------------------------------------- |
| <T translationKey="docs.table.row1.col1">Value 1</T> | <T translationKey="docs.table.row1.col2">Value 2</T> |
```

### Blockquotes

```mdx
> <T translationKey="docs.section.note">
>   This is an important note that users should read.
> </T>
```

## 🚫 Những Điều KHÔNG Nên Làm

### ❌ Không Hardcode Text

```mdx
# Quick Start Guide ❌
```

Thay vào đó:

```mdx
# <T translationKey="docs.quickStart.title">Quick Start Guide</T> ✅
```

### ❌ Không Lạm Dụng HTML

```mdx
<div className="container">
  <span className="highlight">Text</span>
</div> ❌
```

Thay vào đó, dùng Markdown:

```mdx
**Text** ✅
```

### ❌ Không Dùng React Components Không Cần Thiết

```mdx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card> ❌ (nếu chỉ cần hiển thị text đơn giản)
```

Thay vào đó:

```mdx
## <T translationKey="docs.section.title">Title</T>

<T translationKey="docs.section.content">Content</T> ✅
```

### ❌ Không Bỏ Qua Translation

```mdx
This text will not be translated. ❌
```

Luôn wrap trong `<T>`:

```mdx
<T translationKey="docs.section.text">This text will be translated. ✅</T>
```

## ✅ Best Practices

### 1. **Translation Key Naming**

Sử dụng cấu trúc rõ ràng:

```
docs.{section}.{subsection}.{element}
```

Ví dụ:

- `docs.quickStart.title`
- `docs.usage.basic.description`
- `docs.faq.q1.question`
- `docs.faq.q1.answer`

### 2. **Fallback Text**

Luôn cung cấp fallback text bằng tiếng Anh:

```mdx
<T translationKey="docs.section.text">English fallback text here</T>
```

### 3. **Code Examples**

Code examples không cần translation, nhưng description cần:

````mdx
<T translationKey="docs.usage.example.description">Example command:</T>

```bash
curl -fsSL https://tocdovps.dev/install | bash
```
````

````

### 4. **File Organization**

- Mỗi file MDX nên tập trung vào một chủ đề
- Sử dụng headings để tổ chức nội dung
- Giữ file ngắn gọn, dễ maintain

### 5. **Component Usage**

Chỉ dùng React components khi:
- ✅ Cần Alert, Badge, Card cho visual enhancement
- ✅ Cần Tabs để organize content
- ✅ Cần interactive elements

Không dùng khi:
- ❌ Chỉ cần hiển thị text đơn giản
- ❌ Có thể dùng Markdown thay thế

## 📝 Template File

```mdx
import { T } from "@/components/docs/mdx-i18n-wrapper";

# <T translationKey="docs.section.title">Section Title</T>

<T translationKey="docs.section.intro">
  Introduction paragraph here.
</T>

## <T translationKey="docs.section.subsection.title">Subsection</T>

<T translationKey="docs.section.subsection.description">
  Description here.
</T>

- <T translationKey="docs.section.list.item1">Item 1</T>
- <T translationKey="docs.section.list.item2">Item 2</T>

```bash
# Code example (no translation needed)
command here
````

```

## 🔍 Checklist Trước Khi Commit

- [ ] Tất cả text đã được wrap trong `<T>` component
- [ ] Tất cả `<T>` components đều có fallback text
- [ ] Translation keys có cấu trúc rõ ràng
- [ ] Không có hardcoded text (trừ code blocks)
- [ ] Không lạm dụng HTML/React components
- [ ] File có cấu trúc rõ ràng với headings
- [ ] Code examples không có translation (đúng)

## 📚 Examples

Xem các file mẫu trong `content/docs/`:
- `quick-start.mdx` - Simple example
- `faq.mdx` - FAQ structure
- `usage.mdx` - Usage examples
- `parameters.mdx` - Parameter documentation

---

**Lưu ý**: Rules này đảm bảo docs dễ maintain, dễ translate, và consistent với codebase! 📝✨

```
