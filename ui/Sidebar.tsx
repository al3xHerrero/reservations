'use client';

import React, { useState } from 'react';
import {
  IconCalendarDays,
  IconShareNodes,
  IconWarehouse,
  IconCircleCheck,
  IconClipboardList,
  IconBullhorn,
  IconStore,
  IconCalendarCheck,
  IconChartLine,
  IconGear,
  IconBuilding,
  IconArrowRightFromBracket,
  IconChevronDown,
  IconPlus,
} from './Icons';

// Design tokens from Figma
const TOKENS = {
  // Colors
  background: '#06232c',
  borderColor: '#536b75',
  itemBgActive: '#2c4751',
  itemBgHover: 'rgba(44, 71, 81, 0.5)',
  textColor: '#ffffff',
  // Dimensions
  width: '256px',
  paddingInline: '24px',
  paddingBlock: '24px',
  menuGap: '4px',
  itemHeight: '40px',
  itemPadding: '12px',
  itemRadius: '8px',
  itemGap: '4px',
  // Sub-menu
  sectionPaddingStart: '24px',
  sectionPaddingBlockEnd: '4px',
  sectionBorderColor: '#536b75',
};

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: { id: string; label: string; href: string }[];
  expandable?: boolean;
  actionHref?: string; // Optional action button (e.g., "+" for creating new items)
};

const navItems: NavItem[] = [
  { id: 'events', label: 'Events', icon: <IconCalendarDays size={18} color="#F2F3F3" />, expandable: true },
  { id: 'channels', label: 'Channels', icon: <IconShareNodes size={18} color="#F2F3F3" />, expandable: true },
  { id: 'inventory', label: 'Inventory', icon: <IconWarehouse size={18} color="#F2F3F3" />, expandable: true },
  { id: 'validation', label: 'Validation', icon: <IconCircleCheck size={18} color="#F2F3F3" />, href: '/validation' },
  { id: 'orders', label: 'Orders', icon: <IconClipboardList size={18} color="#F2F3F3" />, href: '/orders' },
  { id: 'marketing', label: 'Marketing', icon: <IconBullhorn size={18} color="#F2F3F3" />, href: '/marketing' },
  { id: 'box-office', label: 'Box Office', icon: <IconStore size={18} color="#F2F3F3" />, expandable: true },
  {
    id: 'reservations',
    label: 'Reservations',
    icon: <IconCalendarCheck size={18} color="#F2F3F3" />,
    href: '/reservations',
    expandable: true,
    actionHref: '/reservations/new/business',
    children: [
      { id: 'overview', label: 'Overview', href: '/reservations' },
      { id: 'rules', label: 'Rules', href: '/reservations/rules' },
      { id: 'businesses', label: 'Businesses', href: '/reservations/businesses' },
    ],
  },
  { id: 'finance', label: 'Finance', icon: <IconChartLine size={18} color="#F2F3F3" />, href: '/finance' },
  { id: 'settings', label: 'Settings', icon: <IconGear size={18} color="#F2F3F3" />, expandable: true },
  { id: 'organizations', label: 'Organizations', icon: <IconBuilding size={18} color="#F2F3F3" />, href: '/organizations' },
  { id: 'logout', label: 'Log out', icon: <IconArrowRightFromBracket size={18} color="#F2F3F3" />, href: '/logout' },
];

interface SidebarProps {
  activeItem?: string;
  activeChild?: string;
}

export function Sidebar({ activeItem = 'reservations', activeChild = 'overview' }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(activeItem ? [activeItem] : []);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = item.id === activeItem;
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        {/* Main menu item */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: TOKENS.itemGap,
            height: TOKENS.itemHeight,
            padding: TOKENS.itemPadding,
            borderRadius: TOKENS.itemRadius,
            backgroundColor: isActive ? TOKENS.itemBgActive : 'transparent',
            cursor: 'pointer',
            textDecoration: 'none',
            width: '100%',
            transition: 'background-color 0.15s ease',
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
          {/* Clickable area for navigation/expand */}
          <a
            href={!hasChildren && !item.expandable ? item.href : undefined}
            onClick={(e) => {
              if (hasChildren || item.expandable) {
                e.preventDefault();
                toggleExpand(item.id);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: TOKENS.itemGap,
              flex: 1,
              textDecoration: 'none',
              minWidth: 0,
            }}
          >
            {/* Icon */}
            <span style={{ flexShrink: 0, width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon}
            </span>
            {/* Label */}
            <span
              style={{
                flex: 1,
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontSize: '16px',
                lineHeight: '24px',
                fontWeight: 400,
                color: TOKENS.textColor,
              }}
            >
              {item.label}
            </span>
          </a>
          {/* Action button (e.g., "+") */}
          {item.actionHref && (
            <a
              href={item.actionHref}
              onClick={(e) => e.stopPropagation()}
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                textDecoration: 'none',
              }}
            >
              <IconPlus size={18} color="#F2F3F3" />
            </a>
          )}
          {/* Chevron for expandable items */}
          {item.expandable && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(item.id);
              }}
              style={{
                flexShrink: 0,
                transition: 'transform 0.2s ease',
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <IconChevronDown size={18} color="#F2F3F3" />
            </span>
          )}
        </div>

        {/* Sub-menu section with transition */}
        {hasChildren && (
          <div
            style={{
              display: 'grid',
              gridTemplateRows: isExpanded ? '1fr' : '0fr',
              opacity: isExpanded ? 1 : 0,
              transition: 'grid-template-rows 0.2s ease, opacity 0.2s ease',
            }}
          >
            <div
              style={{
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  paddingLeft: TOKENS.sectionPaddingStart,
                  paddingTop: TOKENS.menuGap,
                  paddingBottom: TOKENS.sectionPaddingBlockEnd,
                  borderBottom: `1px dashed ${TOKENS.sectionBorderColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: TOKENS.menuGap,
                }}
              >
                {item.children?.map((child) => {
                  const isChildActive = child.id === activeChild;
                  return (
                    <a
                      key={child.id}
                      href={child.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: TOKENS.itemGap,
                        height: TOKENS.itemHeight,
                        paddingLeft: TOKENS.itemPadding,
                        paddingRight: TOKENS.itemPadding,
                        paddingTop: '4px',
                        paddingBottom: '4px',
                        borderRadius: TOKENS.itemRadius,
                        backgroundColor: isChildActive ? TOKENS.itemBgActive : 'transparent',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isChildActive) {
                          e.currentTarget.style.backgroundColor = TOKENS.itemBgHover;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isChildActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 400,
                      color: TOKENS.textColor,
                    }}
                  >
                    {child.label}
                  </span>
                </a>
              );
            })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      style={{
        marginTop: '40px',
        width: TOKENS.width,
        height: '100%',
        backgroundColor: TOKENS.background,
        borderRight: `1px solid ${TOKENS.borderColor}`,
        paddingLeft: TOKENS.paddingInline,
        paddingRight: TOKENS.paddingInline,
        paddingTop: `calc(${TOKENS.paddingBlock} + 24px)`,
        paddingBottom: TOKENS.paddingBlock,
        overflowY: 'auto',
        overflowX: 'hidden',
        flexShrink: 0,
      }}
    >
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: TOKENS.menuGap,
        }}
      >
        {navItems.map(renderNavItem)}
      </nav>
    </aside>
  );
}
