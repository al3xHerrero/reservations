'use client';
import { AppShell, Card, CartOverrideModule } from '@/ui';
import type { CartOverrideConfig } from '@/ui/CartOverride';

const noop = () => {};

const baseConfig: CartOverrideConfig = {
  enabled: false,
  onToggle: noop,
  mode: 'fixed',
  onModeChange: noop,
  action: 'reduce',
  onActionChange: noop,
  amount: '',
  onAmountChange: noop,
  concept: '',
  onConceptChange: noop,
};

export default function OverrideDocsPage() {
  return (
    <AppShell header={<h1 className="text-2xl font-semibold text-text">Override Module</h1>}>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Default (Off)">
            <CartOverrideModule config={baseConfig} />
          </Card>
          <Card title="On + Fixed">
            <CartOverrideModule
              config={{
                ...baseConfig,
                enabled: true,
                mode: 'fixed',
                action: 'reduce',
              }}
            />
          </Card>
          <Card title="On + Percentage">
            <CartOverrideModule
              config={{
                ...baseConfig,
                enabled: true,
                mode: 'percentage',
                action: 'add',
              }}
            />
          </Card>
          <Card title="Error State">
            <CartOverrideModule
              config={{
                ...baseConfig,
                enabled: true,
                errors: { amount: 'Required', concept: 'Required' },
              }}
            />
          </Card>
          <Card title="Disabled State">
            <CartOverrideModule
              config={{
                ...baseConfig,
                enabled: true,
                disabled: true,
                action: 'reduce',
              }}
            />
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
