'use client';

import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  Input,
  Alert,
  Badge,
  Avatar,
  AvatarGroup,
  Table,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  Select
} from '../../../components/ui';

export default function ComponentsDemo() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  ];

  const tableColumns = [
    { key: 'name', title: 'Name', dataIndex: 'name' },
    { key: 'email', title: 'Email', dataIndex: 'email' },
    { key: 'role', title: 'Role', dataIndex: 'role' },
    { key: 'status', title: 'Status', dataIndex: 'status' },
  ];

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            SmartERP UI Components
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Professional, responsive, and accessible UI components built with Tailwind CSS
          </p>
        </div>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Buttons</h2>
          <Card>
            <CardHeader title="Button Variants" />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Variants</h3>
                  <div className="space-y-2">
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                    <Button variant="gradient">Gradient</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Sizes</h3>
                  <div className="space-y-2">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                    <Button size="xl">Extra Large</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">States</h3>
                  <div className="space-y-2">
                    <Button loading>Loading</Button>
                    <Button disabled>Disabled</Button>
                    <Button leftIcon={<span>🚀</span>}>With Icon</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader title="Basic Card" subtitle="A simple card with header and content" />
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  This is a basic card component with header, content, and footer sections.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Save</Button>
              </CardFooter>
            </Card>

            <Card variant="bordered">
              <CardHeader title="Bordered Card" subtitle="Card with border styling" />
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  This card has a bordered variant for different visual emphasis.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader title="Elevated Card" subtitle="Card with shadow styling" />
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  This card has an elevated variant with enhanced shadows.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Form Elements Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Form Elements</h2>
          <Card>
            <CardHeader title="Input Components" />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input 
                    label="Default Input" 
                    placeholder="Enter your text"
                    helperText="This is a helper text"
                  />
                  <Input 
                    label="Input with Icon" 
                    placeholder="Search..."
                    leftIcon={<span>🔍</span>}
                  />
                  <Input 
                    label="Error Input" 
                    placeholder="This has an error"
                    error="This field is required"
                  />
                </div>
                
                <div className="space-y-4">
                  <Select
                    label="Single Select"
                    options={selectOptions}
                    placeholder="Choose an option"
                    value={selectedValue}
                    onChange={setSelectedValue}
                  />
                  <Select
                    label="Multi Select"
                    options={selectOptions}
                    placeholder="Choose options"
                    multiple
                    searchable
                    clearable
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Alerts Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Alerts</h2>
          <div className="space-y-4">
            <Alert variant="success" title="Success!" description="Your action was completed successfully." />
            <Alert variant="warning" title="Warning!" description="Please review your input before proceeding." />
            <Alert variant="error" title="Error!" description="Something went wrong. Please try again." />
            <Alert variant="info" title="Information" description="Here's some useful information for you." />
            <Alert 
              variant="default" 
              title="Custom Alert" 
              description="This alert has custom actions."
              action={<Button size="sm">Action</Button>}
              closable
              onClose={() => console.log('Alert closed')}
            />
          </div>
        </section>

        {/* Badges Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Badges</h2>
          <Card>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Variants</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge size="sm">Small</Badge>
                    <Badge size="md">Medium</Badge>
                    <Badge size="lg">Large</Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">With Dots</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="success" dot>Online</Badge>
                    <Badge variant="warning" dot>Away</Badge>
                    <Badge variant="error" dot>Busy</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Avatars Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Avatars</h2>
          <Card>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Sizes</h3>
                  <div className="flex items-center gap-4">
                    <Avatar size="xs" fallback="XS" />
                    <Avatar size="sm" fallback="SM" />
                    <Avatar size="md" fallback="MD" />
                    <Avatar size="lg" fallback="LG" />
                    <Avatar size="xl" fallback="XL" />
                    <Avatar size="2xl" fallback="2XL" />
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">With Status</h3>
                  <div className="flex items-center gap-4">
                    <Avatar fallback="JD" status="online" />
                    <Avatar fallback="JS" status="away" />
                    <Avatar fallback="BJ" status="busy" />
                    <Avatar fallback="AB" status="offline" />
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Avatar Group</h3>
                  <AvatarGroup max={3}>
                    <Avatar fallback="JD" />
                    <Avatar fallback="JS" />
                    <Avatar fallback="BJ" />
                    <Avatar fallback="AB" />
                    <Avatar fallback="CD" />
                  </AvatarGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Table Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Table</h2>
          <Card>
            <CardContent>
              <Table
                data={tableData}
                columns={tableColumns}
                selectable
                striped
                hoverable
                bordered
                size="md"
              />
            </CardContent>
          </Card>
        </section>

        {/* Tabs Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Tabs</h2>
          <Card>
            <CardContent>
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Account Settings</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Manage your account settings and preferences here.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="password">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Password</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Change your password and security settings.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="settings">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Settings</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Configure your application settings.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Dialog Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Dialog</h2>
          <Card>
            <CardContent>
              <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
              
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogHeader 
                  title="Example Dialog" 
                  subtitle="This is an example dialog component"
                  action={<DialogCloseButton onClose={() => setDialogOpen(false)} />}
                />
                <DialogContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    This dialog demonstrates the various features of the Dialog component including
                    header, content, and footer sections with proper styling and animations.
                  </p>
                </DialogContent>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setDialogOpen(false)}>
                    Confirm
                  </Button>
                </DialogFooter>
              </Dialog>
            </CardContent>
          </Card>
        </section>

        {/* Responsive Grid Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Responsive Grid</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="h-32">
                <CardContent className="flex items-center justify-center h-full">
                  <p className="text-gray-600 dark:text-gray-400">Grid Item {i + 1}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
