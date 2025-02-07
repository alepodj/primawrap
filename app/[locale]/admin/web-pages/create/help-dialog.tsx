'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

const editorDocs = `
# 📝 Editor Features Guide

---

## 🚀 Quick Start Guide

1. **Start Editing**: Type directly in the editor area
2. **Format Text**: Use the toolbar buttons for quick formatting
3. **Preview Changes**: Switch to preview mode to see the final result
4. **Be Efficient**: Master keyboard shortcuts for faster editing

---

## ⌨️ Essential Keyboard Shortcuts

| Action | Windows/Linux | Mac | Description |
|--------|--------------|-----|-------------|
| Bold | \`Ctrl + B\` | \`⌘ + B\` | Make text bold |
| Italic | \`Ctrl + I\` | \`⌘ + I\` | Make text italic |
| Link | \`Ctrl + K\` | \`⌘ + K\` | Insert/edit link |
| Save | \`Ctrl + S\` | \`⌘ + S\` | Save changes |
| Undo | \`Ctrl + Z\` | \`⌘ + Z\` | Undo last change |
| Redo | \`Ctrl + Y\` | \`⌘ + Y\` | Redo last change |

---

## 📝 Text Formatting Guide

### Basic Text Styles

Example | Markdown | Description
--------|----------|-------------
**Bold text** | \`**Bold text**\` | Strong emphasis
*Italic text* | \`*Italic text*\` | Light emphasis
***Bold and italic*** | \`***Bold and italic***\` | Combined emphasis
~~Strikethrough~~ | \`~~Strikethrough~~\` | Crossed out text
\`Inline code\` | \`\\\`Inline code\\\`\` | Code within text

### Headers & Titles

# Heading 1
## Heading 2
### Heading 3

\`\`\`markdown
# Heading 1 - Main title
## Heading 2 - Section title
### Heading 3 - Subsection title
\`\`\`

---

## 📋 Working with Lists

### 📌 Unordered Lists

Example:
- Main item 1
  - Sub-item 1.1
  - Sub-item 1.2
    - Sub-sub-item 1.2.1
- Main item 2
  - Sub-item 2.1

Markdown:
\`\`\`markdown
- Main item 1
  - Sub-item 1.1
  - Sub-item 1.2
    - Sub-sub-item 1.2.1
- Main item 2
  - Sub-item 2.1
\`\`\`

### 🔢 Ordered Lists

Example:
1. First step
   1. Sub-step 1.1
   2. Sub-step 1.2
2. Second step
   1. Sub-step 2.1
   2. Sub-step 2.2

Markdown:
\`\`\`markdown
1. First step
   1. Sub-step 1.1
   2. Sub-step 1.2
2. Second step
   1. Sub-step 2.1
   2. Sub-step 2.2
\`\`\`

### ✅ Task Lists

Example:
- [x] Completed main task
  - [x] Completed subtask
  - [ ] Pending subtask
- [ ] Pending main task
  - [ ] Subtask 1
  - [ ] Subtask 2

Markdown:
\`\`\`markdown
- [x] Completed main task
  - [x] Completed subtask
  - [ ] Pending subtask
- [ ] Pending main task
  - [ ] Subtask 1
  - [ ] Subtask 2
\`\`\`

---

## 🎨 Special Features Guide

### 🖥️ Full-screen Mode
1. Click the expand button (↗️) in the toolbar
2. Edit in distraction-free mode
3. Press \`Esc\` to exit full-screen

### 📸 Image Upload Guide
1. Click the image button (🖼️) in the toolbar
2. Select your image file
3. Wait for upload completion
4. Image will be inserted automatically

Supported formats:
- JPG/JPEG
- PNG
- GIF
- WebP

### 😊 Emoji Support 

Click the emoji button to open picker

Popular emojis:
- 👍 Thumbs up
- ❤️ Heart
- 🎉 Celebration
- ⭐ Star
- 🔥 Fire
- ✅ Check mark

### 👀 View Modes

1. **Editor Only**
   - Full editing space
   - Maximum writing area

2. **Preview Only**
   - See final rendering
   - Check formatting

3. **Split View**
   - Edit and preview side by side
   - Real-time preview updates
`

const markdownDocs = `
# 📚 Markdown Features Guide

---

## 📊 Tables & Data

### Basic Table Example

| Name | Role | Department | Experience |
|------|------|------------|------------|
| John Smith | Developer | Engineering | 5 years |
| Sarah Johnson | Designer | UI/UX | 3 years |
| Mike Brown | Manager | Operations | 7 years |

Markdown:
\`\`\`markdown
| Name | Role | Department | Experience |
|------|------|------------|------------|
| John Smith | Developer | Engineering | 5 years |
| Sarah Johnson | Designer | UI/UX | 3 years |
\`\`\`

### Advanced Table Alignment

| Left | Center | Right | Mixed |
|:-----|:------:|------:|:------|
| Left-aligned | Centered | Right-aligned | Default |
| Text | Numbers | Currency | Content |
| **Bold** | *Italic* | \`Code\` | Mixed |

Markdown:
\`\`\`markdown
| Left | Center | Right |
|:-----|:------:|------:|
| Left | Center | Right |
\`\`\`

---

## 🧮 Mathematical Expressions

### Inline Math Examples

- Einstein's equation: $E = mc^2$
- Pythagorean theorem: $a^2 + b^2 = c^2$
- Area of a circle: $A = πr^2$

### Block Math Examples

1. **Quadratic Formula:**
   $$
   x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
   $$

2. **Matrix Multiplication:**
   $$
   \\begin{pmatrix}
   a & b \\\\
   c & d
   \\end{pmatrix}
   \\begin{pmatrix}
   x \\\\
   y
   \\end{pmatrix} =
   \\begin{pmatrix}
   ax + by \\\\
   cx + dy
   \\end{pmatrix}
   $$

3. **Calculus Example:**
   $$
   \\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
   $$

---

## 💻 Code Examples

### JavaScript/TypeScript

\`\`\`javascript
// Modern JavaScript Class Example
class ShoppingCart {
    constructor() {
        this.items = new Map();
    }

    addItem(product, quantity = 1) {
        const currentQty = this.items.get(product.id) || 0;
        this.items.set(product.id, currentQty + quantity);
        return this;
    }

    removeItem(productId) {
        this.items.delete(productId);
        return this;
    }

    getTotal() {
        let total = 0;
        for (const [productId, quantity] of this.items) {
            total += products.get(productId).price * quantity;
        }
        return total.toFixed(2);
    }
}
\`\`\`

### Python

\`\`\`python
from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime

@dataclass
class Task:
    title: str
    description: str
    due_date: datetime
    priority: int = 1
    tags: List[str] = field(default_factory=list)
    completed: bool = False

class TaskManager:
    def __init__(self):
        self.tasks: List[Task] = []
    
    def add_task(self, task: Task) -> None:
        self.tasks.append(task)
        self.tasks.sort(key=lambda x: (x.due_date, -x.priority))
    
    def get_pending_tasks(self) -> List[Task]:
        return [task for task in self.tasks if not task.completed]
    
    def mark_completed(self, task_index: int) -> None:
        if 0 <= task_index < len(self.tasks):
            self.tasks[task_index].completed = True
\`\`\`

### CSS

\`\`\`css
/* Modern CSS with Custom Properties */
:root {
    --primary-color: #4f46e5;
    --secondary-color: #7c3aed;
    --border-radius: 8px;
    --transition-speed: 0.3s;
}

.card {
    /* Modern card design */
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: var(--border-radius);
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    
    /* Glass effect */
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.1);
    
    /* Smooth transitions */
    transition: transform var(--transition-speed) ease,
                box-shadow var(--transition-speed) ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Responsive grid layout */
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;
}
\`\`\`

---

## 🎨 Advanced Styling Examples

### Custom Styled Box

<div style="padding: 1.5rem; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
  <h3 style="margin: 0 0 1rem 0; font-size: 1.5rem; font-weight: bold;">
    ✨ Custom Styled Component
  </h3>
  <p style="margin: 0; line-height: 1.6;">
    This is an example of a custom-styled box using inline HTML and CSS.
    It demonstrates advanced styling capabilities within markdown.
  </p>
</div>

### Interactive Components

<details style="margin: 1rem 0; padding: 1rem; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
  <summary style="font-weight: bold; cursor: pointer;">
    🔍 Click to View More Details
  </summary>
  <div style="padding: 1rem 0 0 1rem;">
    <p>This is an example of an interactive disclosure component.</p>
    <ul>
      <li>Can contain any markdown content</li>
      <li>Supports nested elements</li>
      <li>Fully interactive</li>
    </ul>
  </div>
</details>

### Responsive Grid Layout

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0;">
  <div style="padding: 1rem; background-color: #f1f5f9; border-radius: 8px;">
    📱 Mobile Responsive
  </div>
  <div style="padding: 1rem; background-color: #f1f5f9; border-radius: 8px;">
    💻 Adapts to Screen Size
  </div>
  <div style="padding: 1rem; background-color: #f1f5f9; border-radius: 8px;">
    🖥️ Fluid Layout
  </div>
</div>
`

const pluginsDocs = `
# 🔌 Plugin Features Guide

## 1️⃣ GitHub Flavored Markdown (remark-gfm)

GitHub Flavored Markdown extends the standard markdown syntax with additional features commonly used in documentation and technical writing.

### 📊 Extended Tables

Extended tables support alignment, formatting, and more complex layouts.

#### Basic Example:

<div class="example-container" style="display: flex; gap: 2rem; margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border-radius: 8px;">
  <div style="flex: 1;">
    <h5 style="margin-top: 0;">📝 Markdown</h5>
    
\`\`\`markdown
| Feature   | Basic | Pro  | Enterprise |
|-----------|:------|:----:|----------:|
| Users     | 10    | 100  | Unlimited |
| Storage   | 5GB   | 50GB | 500GB     |
\`\`\`
  </div>
  <div style="flex: 1;">
    <h5 style="margin-top: 0;">🖥️ Result</h5>
    
| Feature   | Basic | Pro  | Enterprise |
|-----------|:------|:----:|----------:|
| Users     | 10    | 100  | Unlimited |
| Storage   | 5GB   | 50GB | 500GB     |
  </div>
</div>

#### Advanced Features:

<div class="example-container" style="margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border-radius: 8px;">
  <h5 style="margin-top: 0;">Table Alignment Options</h5>
  
  | Syntax | Description | Example |
  |--------|-------------|---------|
  | \`:-----\` | Left-aligned | \`|:-----|\` |
  | \`:----:\` | Center-aligned | \`|:----:|\` |
  | \`-----:\` | Right-aligned | \`|-----:|\` |
</div>

### 🔗 Smart Links

GFM automatically converts text into clickable links and references.

<div class="example-container" style="display: flex; gap: 2rem; margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border-radius: 8px;">
  <div style="flex: 1;">
    <h5 style="margin-top: 0;">📝 Raw Text</h5>
    
\`\`\`markdown
- Website: https://example.com
- Issue: #123
- User: @username
- Email: contact@example.com
\`\`\`
  </div>
  <div style="flex: 1;">
    <h5 style="margin-top: 0;">🖥️ Rendered Result</h5>
    
- Website: https://example.com
- Issue: #123
- User: @username
- Email: contact@example.com
  </div>
</div>

#### Smart Link Features:

- **URLs**: Automatically detected and made clickable
- **Issues**: \`#123\` links to issue number 123
- **Users**: \`@username\` links to user profile
- **Emails**: Automatically converted to mailto links

### 📑 Footnotes

Add references and additional information with footnotes.

<div class="example-container" style="margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border-radius: 8px;">
  <div style="margin-bottom: 1.5rem;">
    <h5 style="margin-top: 0;">📝 Markdown</h5>
    
\`\`\`markdown
Here's a sentence with a footnote[^1] and another[^2].

[^1]: This is the first footnote
[^2]: This is the second footnote with **formatting**
\`\`\`
  </div>
  
  <div>
    <h5 style="margin-top: 0;">🖥️ Result</h5>
    
Here's a sentence with a footnote[^1] and another[^2].

[^1]: This is the first footnote
[^2]: This is the second footnote with **formatting**
  </div>
</div>

#### Footnote Features:

- Support for multiple footnotes
- Can include formatting within footnotes
- Automatically numbered
- Creates clickable links to jump between reference and footnote

### 💡 Tips for GFM

- Use table alignment for better data presentation
- Combine formatting within tables and footnotes
- Smart links work automatically - no special formatting needed
- Footnotes can appear anywhere in the document

---

## 2️⃣ Mathematical Expressions (remark-math)

### Basic Math Examples

Inline math: $E = mc^2$
Block math: $$y = mx + b$$

\`\`\`markdown
Inline math: $E = mc^2$
Block math: $$y = mx + b$$
\`\`\`

### Advanced Math Examples

#### Matrix Operations
$$
\\begin{pmatrix}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9
\\end{pmatrix}
\\times
\\begin{pmatrix}
a & b & c \\\\
d & e & f \\\\
g & h & i
\\end{pmatrix}
$$

#### Statistical Formulas
$$
\\bar{X} = \\frac{1}{n}\\sum_{i=1}^n X_i
\\quad
s = \\sqrt{\\frac{1}{n-1}\\sum_{i=1}^n (X_i - \\bar{X})^2}
$$

#### Calculus
$$
\\frac{d}{dx}\\left[\\int_{a}^{x} f(t)dt\\right] = f(x)
$$

---

## 3️⃣ HTML Support (rehype-raw)

### Interactive Components

#### Card Layout Example

<div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
    <div style="padding: 1.5rem; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <h3 style="margin: 0 0 1rem 0; font-size: 1.25rem;">🚀 Feature One</h3>
      <p style="margin: 0; opacity: 0.9;">Advanced component with gradient background.</p>
    </div>
    <div style="padding: 1.5rem; background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <h3 style="margin: 0 0 1rem 0; font-size: 1.25rem;">💡 Feature Two</h3>
      <p style="margin: 0; opacity: 0.9;">Responsive grid layout with modern styling.</p>
    </div>
  </div>
</div>

#### Collapsible Content

<details style="margin: 1rem 0; border: 1px solid #e2e8f0; border-radius: 8px;">
  <summary style="padding: 1rem; font-weight: 600; cursor: pointer; background-color: #f8fafc; border-radius: 8px 8px 0 0;">
    📚 Click to Expand
  </summary>
  <div style="padding: 1rem; border-top: 1px solid #e2e8f0;">
    <h4 style="margin: 0 0 0.5rem 0;">Hidden Content</h4>
    <ul>
      <li>Supports markdown formatting</li>
      <li>Can include code blocks</li>
      <li>Fully interactive</li>
    </ul>
  </div>
</details>

### HTML Code Examples

Card Layout:
\`\`\`html
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
  <div style="padding: 1.5rem; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white;">
    <h3>🚀 Feature One</h3>
    <p>Advanced component with gradient background.</p>
  </div>
</div>
\`\`\`

Collapsible Section:
\`\`\`html
<details>
  <summary>📚 Click to Expand</summary>
  <div>
    <h4>Hidden Content</h4>
    <ul>
      <li>Supports markdown formatting</li>
      <li>Can include code blocks</li>
    </ul>
  </div>
</details>
\`\`\`

---

## 4️⃣ Security Features (rehype-sanitize)

### Allowed HTML Elements

- Basic Elements: \`h1-h6\`, \`p\`, \`div\`, \`span\`
- Formatting: \`strong\`, \`em\`, \`code\`, \`pre\`
- Lists: \`ul\`, \`ol\`, \`li\`
- Tables: \`table\`, \`tr\`, \`td\`, \`th\`
- Media: \`img\`, \`figure\`
- Interactive: \`details\`, \`summary\`

### Allowed Attributes

- Global: \`class\`, \`id\`, \`style\`
- Links: \`href\`, \`target\`, \`rel\`
- Images: \`src\`, \`alt\`, \`width\`, \`height\`
- Tables: \`colspan\`, \`rowspan\`

### Security Rules

\`\`\`javascript
const securityConfig = {
    // Only allow specific HTML tags
    allowedTags: ['h1', 'h2', 'p', 'div', 'span'],
    
    // Restrict attributes
    allowedAttributes: {
        'a': ['href', 'target'],
        'img': ['src', 'alt']
    },
    
    // Safe URL schemes
    allowedSchemes: ['http', 'https', 'mailto']
}
\`\`\`

---

## 5️⃣ Syntax Highlighting (rehype-highlight)

### JavaScript Example

\`\`\`javascript
class Example {
    constructor() {
        this.value = 42;
    }
    
    getValue() {
        return this.value;
    }
}
\`\`\`

### Python Example

\`\`\`python
def example_function():
    try:
        result = perform_operation()
        return result
    except Exception as e:
        logging.error(f"Error: {e}")
        return None
\`\`\`

### CSS Example

\`\`\`css
.example {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    padding: 2rem;
}
\`\`\`
`

export function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='icon'>
          <HelpCircle className='h-5 w-5' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-7xl max-h-[85vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>
            📚 Editor Documentation
          </DialogTitle>
          <DialogDescription className='text-lg'>
            Comprehensive guide to using all features of the markdown editor.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue='editor' className='w-full'>
          <TabsList className='w-full'>
            <TabsTrigger value='editor'>🎨 Editor Features</TabsTrigger>
            <TabsTrigger value='markdown'>📝 Markdown Guide</TabsTrigger>
            <TabsTrigger value='plugins'>🔌 Plugin Features</TabsTrigger>
          </TabsList>
          <TabsContent
            value='editor'
            className='prose prose-lg dark:prose-invert max-w-none'
          >
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {editorDocs}
            </ReactMarkdown>
          </TabsContent>
          <TabsContent
            value='markdown'
            className='prose prose-lg dark:prose-invert max-w-none'
          >
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {markdownDocs}
            </ReactMarkdown>
          </TabsContent>
          <TabsContent
            value='plugins'
            className='prose prose-lg dark:prose-invert max-w-none'
          >
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {pluginsDocs}
            </ReactMarkdown>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
