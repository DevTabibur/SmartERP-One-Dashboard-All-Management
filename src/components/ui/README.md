# SmartERP UI Component Library

A professional, responsive, and accessible UI component library built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Professional Design**: Enterprise-grade components with modern aesthetics
- **Fully Responsive**: Mobile-first approach with responsive breakpoints
- **Dark Mode Support**: Built-in dark mode with consistent theming
- **TypeScript**: Full TypeScript support with comprehensive type definitions
- **Accessible**: WCAG compliant components with proper ARIA attributes
- **Customizable**: Extensive customization options with variants and props
- **Performance**: Optimized components with minimal bundle impact

## 📦 Installation

The components are already included in your project. Import them directly from the UI index:

```tsx
import { Button, Card, Input, Alert } from '@/components/ui';
```

## 🎨 Components

### Button

A versatile button component with multiple variants, sizes, and states.

```tsx
import { Button } from '@/components/ui';

// Basic usage
<Button>Click me</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="gradient">Gradient</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// States
<Button loading>Loading</Button>
<Button disabled>Disabled</Button>

// With icons
<Button leftIcon={<span>🚀</span>}>With Icon</Button>
<Button rightIcon={<span>→</span>}>Next</Button>

// Full width
<Button fullWidth>Full Width</Button>
```

#### Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'link' \| 'gradient' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'icon' \| 'icon-sm' \| 'icon-lg'` | `'md'` | Button size |
| `rounded` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Border radius |
| `loading` | `boolean` | `false` | Show loading spinner |
| `leftIcon` | `ReactNode` | - | Icon before text |
| `rightIcon` | `ReactNode` | - | Icon after text |
| `fullWidth` | `boolean` | `false` | Full width button |
| `disabled` | `boolean` | `false` | Disable button |

### Card

A flexible card component with header, content, and footer sections.

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui';

<Card>
  <CardHeader 
    title="Card Title" 
    subtitle="Card subtitle"
    action={<Button size="sm">Action</Button>}
  />
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>

// Variants
<Card variant="bordered">Bordered Card</Card>
<Card variant="elevated">Elevated Card</Card>
<Card variant="outlined">Outlined Card</Card>

// Padding options
<Card padding="sm">Small padding</Card>
<Card padding="md">Medium padding</Card>
<Card padding="lg">Large padding</Card>
```

#### Card Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'bordered' \| 'elevated' \| 'outlined'` | `'default'` | Card style variant |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Internal padding |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'lg'` | Border radius |
| `shadow` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'` | Shadow size |

### Input

A comprehensive input component with various states and features.

```tsx
import { Input } from '@/components/ui';

// Basic usage
<Input label="Username" placeholder="Enter username" />

// Variants
<Input variant="outlined" label="Outlined Input" />
<Input variant="filled" label="Filled Input" />
<Input variant="unstyled" label="Unstyled Input" />

// Sizes
<Input size="sm" label="Small Input" />
<Input size="md" label="Medium Input" />
<Input size="lg" label="Large Input" />

// With icons
<Input 
  label="Search" 
  placeholder="Search..."
  leftIcon={<span>🔍</span>}
  rightIcon={<span>→</span>}
/>

// With validation
<Input 
  label="Email" 
  placeholder="Enter email"
  error="Please enter a valid email"
  helperText="We'll never share your email"
/>
```

#### Input Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text |
| `leftIcon` | `ReactNode` | - | Icon before input |
| `rightIcon` | `ReactNode` | - | Icon after input |
| `variant` | `'default' \| 'outlined' \| 'filled' \| 'unstyled'` | `'default'` | Input style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `fullWidth` | `boolean` | `false` | Full width input |

### Alert

A flexible alert component for displaying messages and notifications.

```tsx
import { Alert } from '@/components/ui';

// Variants
<Alert variant="success" title="Success!" description="Operation completed successfully." />
<Alert variant="warning" title="Warning!" description="Please review your input." />
<Alert variant="error" title="Error!" description="Something went wrong." />
<Alert variant="info" title="Information" description="Here's some useful info." />

// With actions
<Alert 
  variant="default" 
  title="Custom Alert" 
  description="This alert has custom actions."
  action={<Button size="sm">Action</Button>}
  closable
  onClose={() => console.log('Alert closed')}
/>
```

#### Alert Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'success' \| 'warning' \| 'error' \| 'info' \| 'default'` | `'default'` | Alert style variant |
| `title` | `string` | - | Alert title |
| `description` | `string` | - | Alert description |
| `closable` | `boolean` | `false` | Show close button |
| `onClose` | `() => void` | - | Close handler |
| `icon` | `ReactNode` | - | Custom icon |
| `action` | `ReactNode` | - | Action button |

### Badge

A versatile badge component for labels and status indicators.

```tsx
import { Badge } from '@/components/ui';

// Variants
<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="outline">Outline</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// With dots
<Badge variant="success" dot>Online</Badge>
<Badge variant="warning" dot>Away</Badge>

// Closable
<Badge closable onClose={() => console.log('Badge closed')}>
  Closable Badge
</Badge>
```

#### Badge Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'outline' \| 'ghost'` | `'default'` | Badge style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |
| `rounded` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'full'` | Border radius |
| `dot` | `boolean` | `false` | Show status dot |
| `closable` | `boolean` | `false` | Show close button |
| `onClose` | `() => void` | - | Close handler |

### Avatar

A flexible avatar component with image fallback and status indicators.

```tsx
import { Avatar, AvatarGroup } from '@/components/ui';

// Basic usage
<Avatar fallback="JD" />

// With image
<Avatar src="/path/to/image.jpg" alt="User Avatar" />

// Sizes
<Avatar size="xs" fallback="XS" />
<Avatar size="sm" fallback="SM" />
<Avatar size="md" fallback="MD" />
<Avatar size="lg" fallback="LG" />
<Avatar size="xl" fallback="XL" />
<Avatar size="2xl" fallback="2XL" />

// Shapes
<Avatar shape="circle" fallback="Circle" />
<Avatar shape="square" fallback="Square" />
<Avatar shape="rounded" fallback="Rounded" />

// With status
<Avatar fallback="JD" status="online" />
<Avatar fallback="JS" status="away" />
<Avatar fallback="BJ" status="busy" />

// Avatar Group
<AvatarGroup max={3}>
  <Avatar fallback="JD" />
  <Avatar fallback="JS" />
  <Avatar fallback="BJ" />
  <Avatar fallback="AB" />
  <Avatar fallback="CD" />
</AvatarGroup>
```

#### Avatar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image source URL |
| `alt` | `string` | - | Image alt text |
| `fallback` | `string` | - | Fallback text/initials |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'` | Avatar size |
| `shape` | `'circle' \| 'square' \| 'rounded'` | `'circle'` | Avatar shape |
| `status` | `'online' \| 'offline' \| 'away' \| 'busy'` | - | Status indicator |
| `bordered` | `boolean` | `false` | Show border |
| `ring` | `boolean` | `false` | Show ring |
| `ringColor` | `'primary' \| 'success' \| 'warning' \| 'error' \| 'gray'` | `'primary'` | Ring color |

### Table

A feature-rich table component with sorting, pagination, and selection.

```tsx
import { Table } from '@/components/ui';

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
];

const columns = [
  { key: 'name', title: 'Name', dataIndex: 'name' },
  { key: 'email', title: 'Email', dataIndex: 'email' },
  { key: 'role', title: 'Role', dataIndex: 'role' },
];

<Table
  data={data}
  columns={columns}
  selectable
  striped
  hoverable
  bordered
  size="md"
  pagination
  pageSize={10}
  currentPage={1}
  total={100}
  onPageChange={(page) => console.log('Page:', page)}
  sortable
  onSort={(key, direction) => console.log('Sort:', key, direction)}
/>
```

#### Table Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | - | Table data array |
| `columns` | `Column<T>[]` | - | Column definitions |
| `loading` | `boolean` | `false` | Show loading state |
| `pagination` | `boolean` | `false` | Enable pagination |
| `pageSize` | `number` | `10` | Items per page |
| `currentPage` | `number` | `1` | Current page |
| `total` | `number` | `0` | Total items |
| `onPageChange` | `(page: number) => void` | - | Page change handler |
| `sortable` | `boolean` | `false` | Enable sorting |
| `onSort` | `(key: string, direction: 'asc' \| 'desc') => void` | - | Sort handler |
| `selectable` | `boolean` | `false` | Enable row selection |
| `selectedRows` | `T[]` | `[]` | Selected rows |
| `onSelectionChange` | `(selectedRows: T[]) => void` | - | Selection change handler |
| `striped` | `boolean` | `false` | Striped rows |
| `hoverable` | `boolean` | `true` | Hover effects |
| `bordered` | `boolean` | `false` | Show borders |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Table size |

### Tabs

A flexible tabs component with multiple variants and orientations.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';

<Tabs defaultValue="account" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <div>Account content</div>
  </TabsContent>
  <TabsContent value="password">
    <div>Password content</div>
  </TabsContent>
  <TabsContent value="settings">
    <div>Settings content</div>
  </TabsContent>
</Tabs>

// Variants
<Tabs variant="pills">Pills variant</Tabs>
<Tabs variant="underline">Underline variant</Tabs>
<Tabs variant="cards">Cards variant</Tabs>

// Sizes
<Tabs size="sm">Small tabs</Tabs>
<Tabs size="md">Medium tabs</Tabs>
<Tabs size="lg">Large tabs</Tabs>

// Orientation
<Tabs orientation="vertical">Vertical tabs</Tabs>
```

#### Tabs Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | - | Default active tab |
| `value` | `string` | - | Controlled active tab |
| `onValueChange` | `(value: string) => void` | - | Value change handler |
| `variant` | `'default' \| 'pills' \| 'underline' \| 'cards'` | `'default'` | Tabs style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tabs size |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Tabs orientation |
| `fullWidth` | `boolean` | `false` | Full width tabs |

### Dialog

A modal dialog component with backdrop and animations.

```tsx
import { Dialog, DialogHeader, DialogContent, DialogFooter } from '@/components/ui';

const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogHeader 
    title="Example Dialog" 
    subtitle="This is an example dialog"
    action={<DialogCloseButton onClose={() => setOpen(false)} />}
  />
  <DialogContent>
    <p>Dialog content goes here</p>
  </DialogContent>
  <DialogFooter>
    <Button variant="outline" onClick={() => setOpen(false)}>
      Cancel
    </Button>
    <Button onClick={() => setOpen(false)}>
      Confirm
    </Button>
  </DialogFooter>
</Dialog>

// Sizes
<Dialog size="sm">Small dialog</Dialog>
<Dialog size="md">Medium dialog</Dialog>
<Dialog size="lg">Large dialog</Dialog>
<Dialog size="xl">Extra large dialog</Dialog>
<Dialog size="full">Full screen dialog</Dialog>

// Options
<Dialog 
  closeOnBackdrop={false}
  closeOnEscape={false}
  persistent={true}
>
  Persistent dialog
</Dialog>
```

#### Dialog Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Dialog open state |
| `onOpenChange` | `(open: boolean) => void` | - | Open state change handler |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Dialog size |
| `closeOnBackdrop` | `boolean` | `true` | Close on backdrop click |
| `closeOnEscape` | `boolean` | `true` | Close on escape key |
| `showCloseButton` | `boolean` | `true` | Show close button |
| `persistent` | `boolean` | `false` | Prevent closing |

### Select

A comprehensive select component with search and multiple selection.

```tsx
import { Select } from '@/components/ui';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

// Single select
<Select
  options={options}
  placeholder="Choose an option"
  value={selectedValue}
  onChange={setSelectedValue}
/>

// Multiple select
<Select
  options={options}
  placeholder="Choose options"
  multiple
  searchable
  clearable
/>

// Variants
<Select variant="outlined" />
<Select variant="filled" />

// Sizes
<Select size="sm" />
<Select size="md" />
<Select size="lg" />

// With validation
<Select
  options={options}
  label="Country"
  error="Please select a country"
  helperText="Select your country of residence"
/>
```

#### Select Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption[]` | - | Available options |
| `value` | `string \| string[]` | - | Selected value(s) |
| `onChange` | `(value: string \| string[]) => void` | - | Value change handler |
| `placeholder` | `string` | `'Select an option'` | Placeholder text |
| `disabled` | `boolean` | `false` | Disable select |
| `multiple` | `boolean` | `false` | Multiple selection |
| `searchable` | `boolean` | `false` | Enable search |
| `clearable` | `boolean` | `false` | Show clear button |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Select size |
| `variant` | `'default' \| 'outlined' \| 'filled'` | `'default'` | Select style variant |
| `error` | `string` | - | Error message |
| `label` | `string` | - | Select label |
| `helperText` | `string` | - | Helper text |
| `fullWidth` | `boolean` | `false` | Full width select |

### Progress

A progress bar component with multiple variants and animations.

```tsx
import { Progress } from '@/components/ui';

// Basic usage
<Progress value={75} />

// With label
<Progress value={75} showLabel labelPosition="top" />

// Variants
<Progress value={75} variant="success" />
<Progress value={75} variant="warning" />
<Progress value={75} variant="error" />

// Sizes
<Progress value={75} size="sm" />
<Progress value={75} size="md" />
<Progress value={75} size="lg" />

// Animations
<Progress value={75} animated />
<Progress value={75} striped />

// Label positions
<Progress value={75} showLabel labelPosition="left" />
<Progress value={75} showLabel labelPosition="right" />
<Progress value={75} showLabel labelPosition="bottom" />
```

#### Progress Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Progress value (0-100) |
| `max` | `number` | `100` | Maximum value |
| `variant` | `'default' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Progress style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Progress bar height |
| `showLabel` | `boolean` | `false` | Show progress label |
| `labelPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Label position |
| `animated` | `boolean` | `false` | Enable animations |
| `striped` | `boolean` | `false` | Show striped pattern |
| `rounded` | `boolean` | `true` | Rounded corners |

### Spinner

A loading spinner component with multiple variants and sizes.

```tsx
import { Spinner } from '@/components/ui';

// Basic usage
<Spinner />

// Sizes
<Spinner size="xs" />
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />

// Variants
<Spinner variant="primary" />
<Spinner variant="success" />
<Spinner variant="warning" />
<Spinner variant="error" />

// Thickness
<Spinner thickness="thin" />
<Spinner thickness="normal" />
<Spinner thickness="thick" />

// Speed
<Spinner speed="slow" />
<Spinner speed="normal" />
<Spinner speed="fast" />

// With label
<Spinner label="Loading..." labelPosition="bottom" />
<Spinner label="Processing..." labelPosition="right" />
```

#### Spinner Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Spinner size |
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Spinner color variant |
| `thickness` | `'thin' \| 'normal' \| 'thick'` | `'normal'` | Border thickness |
| `speed` | `'slow' \| 'normal' \| 'fast'` | `'normal'` | Animation speed |
| `label` | `string` | - | Loading label |
| `labelPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Label position |

## 🎨 Theming

All components support dark mode and can be customized using Tailwind CSS classes. The components use semantic color tokens that automatically adapt to light/dark themes.

### Custom Colors

You can customize component colors by overriding the Tailwind CSS color classes:

```css
/* In your CSS file */
:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}

.dark {
  --color-primary: #60a5fa;
  --color-success: #34d399;
  --color-warning: #fbbf24;
  --color-error: #f87171;
}
```

## 📱 Responsive Design

All components are built with a mobile-first approach and include responsive variants:

```tsx
// Responsive grid example
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* Grid items */}
</div>

// Responsive spacing
<div className="p-4 sm:p-6 lg:p-8">
  {/* Content */}
</div>
```

## ♿ Accessibility

Components are built with accessibility in mind:

- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance

## 🚀 Performance

- Lazy loading support
- Optimized re-renders
- Minimal bundle impact
- Efficient state management

## 🤝 Contributing

When adding new components:

1. Follow the existing component structure
2. Include TypeScript interfaces
3. Add comprehensive props
4. Include accessibility features
5. Add to the demo page
6. Update this documentation

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
