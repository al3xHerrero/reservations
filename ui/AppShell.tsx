import React from 'react';

interface AppShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
  sidebarClassName?: string;
  headerClassName?: string;
  mainClassName?: string;
}

export function AppShell({
  children,
  sidebar,
  header,
  className = '',
  sidebarClassName = '',
  headerClassName = '',
  mainClassName = '',
}: AppShellProps) {
  return (
    <div
      className={`flex min-h-screen h-screen overflow-hidden ${className}`}
      style={{ backgroundColor: 'var(--shell/color/bg/main)' }}
    >
      {/* Sidebar */}
      {sidebar && (
        <aside
          className={`flex-shrink-0 border-r border-[var(--shell/color/border/default)] ${sidebarClassName}`}
          style={{
            width: 'var(--shell/sidebar/width)',
            backgroundColor: 'var(--shell/color/bg/sidebar)',
          }}
        >
          {sidebar}
        </aside>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        {header && (
          <header
            className={`flex-shrink-0 border-b border-[var(--shell/color/border/default)] ${headerClassName}`}
            style={{
              backgroundColor: 'var(--shell/color/bg/header)',
              paddingInline: 'var(--shell/dimensions/padding)',
              paddingBlock: 'var(--shell/dimensions/header/padding/block)',
            }}
          >
            {header}
          </header>
        )}

        {/* Main content */}
        <main
          className={`flex-1 overflow-y-scroll overflow-x-hidden ${mainClassName}`}
          style={{ padding: 'var(--shell/dimensions/padding)' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
