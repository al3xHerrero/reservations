'use client';

import React, { useState } from 'react';

// Design tokens from Figma
const TOKENS = {
  background: '#06232c',
  borderColor: '#536b75',
  itemBgActive: '#2c4751',
  itemBgHover: 'rgba(44, 71, 81, 0.5)',
  textColor: 'white',
  textColorMuted: '#f2f3f3',
  gap: '4px',
  padding: '12px',
  radius: '8px',
  containerPadding: '24px',
};

// Icon components based on Figma design
const IconEvents = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="16" height="14" rx="2" stroke="white" strokeWidth="1.5"/>
    <path d="M2 7H18" stroke="white" strokeWidth="1.5"/>
    <path d="M6 1V4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 1V4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconChannels = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="6" height="6" rx="1" stroke="#f2f3f3" strokeWidth="1.5"/>
    <rect x="11" y="1" width="6" height="6" rx="1" stroke="#f2f3f3" strokeWidth="1.5"/>
    <rect x="1" y="11" width="6" height="6" rx="1" stroke="#f2f3f3" strokeWidth="1.5"/>
    <rect x="11" y="11" width="6" height="6" rx="1" stroke="#f2f3f3" strokeWidth="1.5"/>
  </svg>
);

const IconInventory = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="3" width="16" height="13" rx="2" stroke="#f2f3f3" strokeWidth="1.5"/>
    <path d="M1 7H17" stroke="#f2f3f3" strokeWidth="1.5"/>
    <path d="M6 3V1H12V3" stroke="#f2f3f3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconValidation = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="1" width="14" height="16" rx="2" stroke="#f2f3f3" strokeWidth="1.5"/>
    <path d="M6 6L8 8L12 4" stroke="#f2f3f3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 12H12" stroke="#f2f3f3" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconOrders = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="1" width="14" height="16" rx="2" stroke="#f2f3f3" strokeWidth="1.5"/>
    <path d="M6 5H12" stroke="#f2f3f3" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 9H12" stroke="#f2f3f3" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 13H9" stroke="#f2f3f3" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconMarketing = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5" cy="9" r="3" stroke="#f2f3f3" strokeWidth="1.5"/>
    <path d="M8 9L16 5V13L8 9Z" stroke="#f2f3f3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconBoxOffice = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="3" width="16" height="12" rx="2" stroke="#f2f3f3" strokeWidth="1.5"/>
    <path d="M1 7H17" stroke="#f2f3f3" strokeWidth="1.5"/>
    <rect x="4" y="10" width="4" height="2" rx="0.5" stroke="#f2f3f3" strokeWidth="1"/>
  </svg>
);

const IconReservations = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="2" width="16" height="14" rx="2" stroke="#f2f3f3" strokeWidth="1.5"/>
    <path d="M1 6H17" stroke="#f2f3f3" strokeWidth="1.5"/>
    <path d="M5 0V3" stroke="#f2f3f3" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M13 0V3" stroke="#f2f3f3" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 10L8 12L12 8" stroke="#f2f3f3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconFinance = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="7" stroke="#f2f3f3" strokeWidth="1.5"/>
    <path d="M9 5V13" stroke="#f2f3f3" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M11.5 7C11.5 6 10.5 5 9 5C7.5 5 6.5 6 6.5 7C6.5 8 7.5 8.5 9 9C10.5 9.5 11.5 10 11.5 11C11.5 12 10.5 13 9 13C7.5 13 6.5 12 6.5 11" stroke="#f2f3f3" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="2.5" stroke="white" strokeWidth="1.5"/>
    <path d="M9 1V3M9 15V17M17 9H15M3 9H1M14.5 3.5L13 5M5 13L3.5 14.5M14.5 14.5L13 13M5 5L3.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconOrganizations = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="14" height="14" rx="1" stroke="#f2f3f3" strokeWidth="1.5"/>
    <path d="M6 3V1H12V3" stroke="#f2f3f3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="5" y="7" width="3" height="3" stroke="#f2f3f3" strokeWidth="1"/>
    <rect x="10" y="7" width="3" height="3" stroke="#f2f3f3" strokeWidth="1"/>
    <rect x="5" y="12" width="3" height="3" stroke="#f2f3f3" strokeWidth="1"/>
    <rect x="10" y="12" width="3" height="3" stroke="#f2f3f3" strokeWidth="1"/>
  </svg>
);

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2H3C2.44772 2 2 2.44772 2 3V15C2 15.5523 2.44772 16 3 16H6" stroke="#f2f3f3" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 13L16 9L12 5" stroke="#f2f3f3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 9H6" stroke="#f2f3f3" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconChevronDown = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 7.5L10 12.5L15 7.5" stroke="#f2f3f3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: { id: string; label: string; href: string }[];
  expandable?: boolean;
  addable?: boolean;
};

const navItems: NavItem[] = [
  { id: 'events', label: 'Events', icon: <IconEvents />, href: '/events' },
  { id: 'channels', label: 'Channels', icon: <IconChannels />, expandable: true },
  { id: 'inventory', label: 'Inventory', icon: <IconInventory />, expandable: true },
  { id: 'validation', label: 'Validation', icon: <IconValidation />, href: '/validation' },
  { id: 'orders', label: 'Orders', icon: <IconOrders />, href: '/orders' },
  { id: 'marketing', label: 'Marketing', icon: <IconMarketing />, href: '/marketing' },
  { id: 'box-office', label: 'Box Office', icon: <IconBoxOffice />, expandable: true },
  {
    id: 'reservations',
    label: 'Reservations',
    icon: <IconReservations />,
    href: '/reservations',
    expandable: true,
    addable: true,
    children: [
      { id: 'overview', label: 'Overview', href: '/reservations' },
      { id: 'rules', label: 'Rules', href: '/reservations/rules' },
      { id: 'businesses', label: 'Businesses', href: '/reservations/businesses' },
    ],
  },
  { id: 'finance', label: 'Finance', icon: <IconFinance />, href: '/finance' },
  { id: 'settings', label: 'Settings', icon: <IconSettings />, expandable: true },
  { id: 'organizations', label: 'Organizations', icon: <IconOrganizations />, href: '/organizations' },
  { id: 'logout', label: 'Log out', icon: <IconLogout />, href: '/logout' },
];

interface SidebarProps {
  activeItem?: string;
  activeChild?: string;
}

export function Sidebar({ activeItem = 'events', activeChild }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(activeItem ? [activeItem] : []);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = item.id === activeItem && !item.children;
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <a
          href={!hasChildren && !item.expandable ? item.href : undefined}
          onClick={(e) => {
            if (hasChildren || item.expandable) {
              e.preventDefault();
              toggleExpand(item.id);
            }
          }}
          className="flex items-center h-10 w-full cursor-pointer transition-colors"
          style={{
            gap: TOKENS.gap,
            padding: TOKENS.padding,
            borderRadius: TOKENS.radius,
            backgroundColor: isActive ? TOKENS.itemBgActive : 'transparent',
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = TOKENS.itemBgHover;
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <span className="shrink-0">{item.icon}</span>
          <span
            className="flex-1 font-['Montserrat',sans-serif] text-base leading-6"
            style={{ color: TOKENS.textColor }}
          >
            {item.label}
          </span>
          {item.addable && (
            <button
              className="flex h-5 w-5 items-center justify-center rounded hover:bg-white/10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <span className="text-white text-sm">+</span>
            </button>
          )}
          {item.expandable && (
            <span
              className={`shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            >
              <IconChevronDown />
            </span>
          )}
        </a>
        {hasChildren && isExpanded && (
          <div className="ml-[26px] mt-1 space-y-0.5 border-l border-[#536b75] pl-3">
            {item.children?.map((child) => (
              <a
                key={child.id}
                href={child.href}
                className="flex items-center h-9 px-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: child.id === activeChild ? TOKENS.itemBgActive : 'transparent',
                  color: TOKENS.textColor,
                }}
                onMouseEnter={(e) => {
                  if (child.id !== activeChild) {
                    e.currentTarget.style.backgroundColor = TOKENS.itemBgHover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (child.id !== activeChild) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span className="font-['Montserrat',sans-serif] text-base leading-6">
                  {child.label}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className="flex h-full flex-col border-r"
      style={{
        width: '220px',
        backgroundColor: TOKENS.background,
        borderColor: TOKENS.borderColor,
        padding: TOKENS.containerPadding,
      }}
    >
      <nav
        className="flex flex-col"
        style={{ gap: TOKENS.gap }}
      >
        {navItems.map(renderNavItem)}
      </nav>
    </aside>
  );
}
