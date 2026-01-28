'use client';

import { useState } from 'react';
import {
  AppShell,
  Card,
  FieldCheckbox,
  FieldRadioGroup,
  FieldSelect,
  FieldSwitch,
  Badge,
  Banner,
  Button,
  Link,
  FieldInput,
  FieldTextarea,
  Modal,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from '@/ui';

const showcaseOptions = [
  { value: 'candlelight', label: 'Candlelight: A Tribute to Beyoncé at the Church of Heavenly Rest' },
  { value: 'dinner', label: 'Dinner & Dancing Under The Stars on The Hudson River!' },
  { value: 'dinos', label: 'Dinos Alive: An Immersive Experience - Waitlist' },
  { value: 'shipwreck', label: "Shipwreck'd Party Cruise" },
  { value: 'everson', label: 'Everson Museum of Art Tickets' },
  { value: 'regal', label: 'Regal Cinemas Tickets' },
  { value: 'snow', label: 'Snow Tubing & Beer Garden' },
  { value: 'bike', label: 'Electric Bike Tour of Central Park' },
];

export default function UiDocsPage() {
  const [defaultValue, setDefaultValue] = useState<string>('');
  const [filledValue, setFilledValue] = useState<string>('dinner');
  const [openValue, setOpenValue] = useState<string>('');
  const [errorValue, setErrorValue] = useState<string>('');
  const [multiValue, setMultiValue] = useState<string[]>(['candlelight', 'bike']);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option-1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');

  return (
    <AppShell header={<h1 className="text-2xl font-semibold text-text">UI Showcase</h1>}>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Field Select */}
        <Card title="Field Select" data-testid="ds-card">
          <div className="grid gap-6 lg:grid-cols-2">
            <FieldSelect
              label="Business"
              placeholder="Select an option"
              value={defaultValue}
              onChange={(next) => setDefaultValue(next as string)}
              options={showcaseOptions}
              helperText="Helper text"
              testId="ds-select-closed"
            />
            <FieldSelect
              label="Business"
              value={filledValue}
              onChange={(next) => setFilledValue(next as string)}
              options={showcaseOptions}
            />
            <FieldSelect
              label="Business"
              placeholder="Select an option"
              value={openValue}
              onChange={(next) => setOpenValue(next as string)}
              options={showcaseOptions}
              defaultOpen
              helperText="Open state"
              testId="ds-select-open"
            />
            <FieldSelect
              label="Business"
              placeholder="Select an option"
              value={errorValue}
              onChange={(next) => setErrorValue(next as string)}
              options={showcaseOptions}
              error="Error message"
            />
            <FieldSelect
              label="Business"
              placeholder="Select an option"
              value="dinos"
              onChange={() => {}}
              options={showcaseOptions}
              disabled
            />
            <FieldSelect
              label="Business"
              placeholder="Select one or more"
              value={multiValue}
              onChange={(next) => setMultiValue(next as string[])}
              options={showcaseOptions}
              multiple
              defaultOpen
            />
          </div>
        </Card>

        {/* Selection controls */}
        <Card title="Selection controls">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-text">Switch</p>
              <FieldSwitch
                checked={switchChecked}
                onChange={setSwitchChecked}
                testId="ds-switch"
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-text">Checkbox</p>
              <FieldCheckbox
                checked={checkboxChecked}
                onChange={setCheckboxChecked}
                label="Use business balance"
                testId="ds-checkbox"
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-text">Radio group</p>
              <FieldRadioGroup
                value={radioValue}
                onChange={setRadioValue}
                testId="ds-radio"
                options={[
                  { value: 'option-1', label: 'Bank card' },
                  { value: 'option-2', label: 'Payment link' },
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Badges */}
        <Card title="Badges">
          <div className="flex flex-wrap gap-4" data-testid="ds-badges">
            <Badge variant="neutral" data-testid="ds-badge-neutral">Neutral</Badge>
            <Badge variant="success" data-testid="ds-badge-success">Success</Badge>
            <Badge variant="warning" data-testid="ds-badge-warning">Warning</Badge>
            <Badge variant="danger" data-testid="ds-badge-danger">Danger</Badge>
          </div>
        </Card>

        {/* Banners */}
        <Card title="Banners">
          <div className="space-y-4" data-testid="ds-banners">
            <Banner variant="info" data-testid="ds-banner-info">
              This is an info banner with important information.
            </Banner>
            <Banner variant="warning" data-testid="ds-banner-warning">
              This is a warning banner to alert users.
            </Banner>
            <Banner variant="danger" data-testid="ds-banner-danger">
              This is a danger banner for critical errors.
            </Banner>
            <Banner variant="success" data-testid="ds-banner-success">
              This is a success banner for positive feedback.
            </Banner>
          </div>
        </Card>

        {/* Buttons */}
        <Card title="Buttons">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" data-testid="ds-button-primary">Primary</Button>
              <Button variant="secondary" data-testid="ds-button-secondary">Secondary</Button>
              <Button variant="tertiary" data-testid="ds-button-tertiary">Tertiary</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" sentiment="danger">Danger Primary</Button>
              <Button variant="secondary" sentiment="danger">Danger Secondary</Button>
              <Button variant="tertiary" sentiment="danger">Danger Tertiary</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" sentiment="success">Success Primary</Button>
              <Button variant="secondary" sentiment="success">Success Secondary</Button>
              <Button variant="tertiary" sentiment="success">Success Tertiary</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" disabled>Disabled Primary</Button>
              <Button variant="secondary" disabled>Disabled Secondary</Button>
              <Button variant="tertiary" disabled>Disabled Tertiary</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="sm">Small Primary</Button>
              <Button variant="secondary" size="sm">Small Secondary</Button>
            </div>
          </div>
        </Card>

        {/* Links */}
        <Card title="Links">
          <div className="flex flex-wrap gap-4" data-testid="ds-links">
            <Link href="#" data-testid="ds-link">Link to page</Link>
            <Link onClick={() => alert('Clicked!')}>Button link</Link>
          </div>
        </Card>

        {/* Form fields */}
        <Card title="Form Fields">
          <div className="grid gap-6 lg:grid-cols-2">
            <FieldInput
              placeholder="Enter text..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              testId="ds-input"
            />
            <FieldInput
              placeholder="Disabled input"
              value="Disabled value"
              onChange={() => {}}
              disabled
              testId="ds-input-disabled"
            />
            <FieldInput
              placeholder="Error input"
              value=""
              onChange={() => {}}
              error="This field is required"
              testId="ds-input-error"
            />
            <FieldInput
              placeholder="With helper text"
              value=""
              onChange={() => {}}
              helperText="This is helper text"
              testId="ds-input-helper"
            />
            <div className="lg:col-span-2">
              <FieldTextarea
                placeholder="Enter description..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                data-testid="ds-textarea"
              />
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card title="Table">
          <div data-testid="ds-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Event ticket #1</TableCell>
                  <TableCell><Badge variant="success">Paid</Badge></TableCell>
                  <TableCell>$120.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Event ticket #2</TableCell>
                  <TableCell><Badge variant="warning">Pending</Badge></TableCell>
                  <TableCell>$85.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Event ticket #3</TableCell>
                  <TableCell><Badge variant="danger">Cancelled</Badge></TableCell>
                  <TableCell>$200.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Modal */}
        <Card title="Modal">
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Example Modal"
            footer={
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                  Confirm
                </Button>
              </div>
            }
          >
            <p className="text-[var(--text/main/default)]">
              This is an example modal dialog that uses design system tokens for styling.
            </p>
          </Modal>
        </Card>
      </div>
    </AppShell>
  );
}
