/**
 * Centralized Icons Library
 * Based on Font Awesome 6 (Light style)
 * 
 * All icons follow the FA6 design system with consistent sizing and stroke weights.
 * Default size is 20x20 (scale=base), but icons can be scaled via size prop.
 */

import React from 'react';

// =============================================================================
// Icon Types
// =============================================================================

export type IconScale = 'caption' | 'sm' | 'base' | 'h4' | 'h3' | 'h2' | 'h1' | 'display';

export interface IconProps {
  /** Icon size scale following the DS typography scale */
  scale?: IconScale;
  /** Custom size in pixels (overrides scale) */
  size?: number;
  /** Icon color (defaults to currentColor for inheritance) */
  color?: string;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

// Size mapping based on DS icon dimensions
const ICON_SIZES: Record<IconScale, number> = {
  caption: 16,
  sm: 18,
  base: 20,
  h4: 24,
  h3: 26,
  h2: 30,
  h1: 36,
  display: 60,
};

const getIconSize = (scale?: IconScale, size?: number): number => {
  if (size !== undefined) return size;
  return ICON_SIZES[scale || 'base'];
};

// =============================================================================
// Navigation Icons (Sidebar)
// =============================================================================

/** Calendar with days - for Events section */
export const IconCalendarDays = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H96C43 64 0 107 0 160v16 48V448c0 53 43 96 96 96H352c53 0 96-43 96-96V224 176 160c0-53-43-96-96-96H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 224H400V448c0 26.5-21.5 48-48 48H96c-26.5 0-48-21.5-48-48V224zm0-48V160c0-26.5 21.5-48 48-48H352c26.5 0 48 21.5 48 48v16H48zm80 112v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V288c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V288c0-8.8-7.2-16-16-16H272zm-144 96c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V384c0-8.8-7.2-16-16-16H144zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V384c0-8.8-7.2-16-16-16H272c-8.8 0-16 7.2-16 16z" fill={color}/>
    </svg>
  );
};

/** Share nodes - for Channels section */
export const IconShareNodes = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.9-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.9 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224zm0-144c26.5 0 48 21.5 48 48s-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48zM96 304c-26.5 0-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48s-21.5 48-48 48zm256 80c26.5 0 48 21.5 48 48s-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48z" fill={color}/>
    </svg>
  );
};

/** Warehouse - for Inventory section */
export const IconWarehouse = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 640 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M0 488V171.3c0-17 6.7-33.3 18.7-45.3L114.8 29.7C126.8 17.7 143 11 160 11h0c17 0 33.3 6.7 45.3 18.7L301.5 126c12 12 18.7 28.3 18.7 45.3V488c0 13.3-10.7 24-24 24s-24-10.7-24-24V376H48v112c0 13.3-10.7 24-24 24s-24-10.7-24-24zM48 328H272V224H48v104zM272 176V171.3c0-4.2-1.7-8.3-4.7-11.3L171.1 63.8c-3-3-7.1-4.7-11.3-4.7h0c-4.2 0-8.3 1.7-11.3 4.7L52.4 160c-3 3-4.7 7.1-4.7 11.3V176H272zM616 328H344v-48h96V200c0-13.3 10.7-24 24-24s24 10.7 24 24v80h128V200c0-13.3 10.7-24 24-24s24 10.7 24 24v80h0c0 26.5-21.5 48-48 48v160c0 13.3-10.7 24-24 24s-24-10.7-24-24V376H392v112c0 13.3-10.7 24-24 24s-24-10.7-24-24V376c-26.5 0-48-21.5-48-48h320z" fill={color}/>
    </svg>
  );
};

/** Circle check - for Validation section */
export const IconCircleCheck = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" fill={color}/>
    </svg>
  );
};

/** Clipboard list - for Orders section */
export const IconClipboardList = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 384 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48zM112 256c0-8.8 7.2-16 16-16s16 7.2 16 16s-7.2 16-16 16s-16-7.2-16-16zm48-16h96c8.8 0 16 7.2 16 16s-7.2 16-16 16H160c-8.8 0-16-7.2-16-16s7.2-16 16-16zm-48 80c0-8.8 7.2-16 16-16s16 7.2 16 16s-7.2 16-16 16s-16-7.2-16-16zm48-16h96c8.8 0 16 7.2 16 16s-7.2 16-16 16H160c-8.8 0-16-7.2-16-16s7.2-16 16-16zm-48 80c0-8.8 7.2-16 16-16s16 7.2 16 16s-7.2 16-16 16s-16-7.2-16-16zm48-16h96c8.8 0 16 7.2 16 16s-7.2 16-16 16H160c-8.8 0-16-7.2-16-16s7.2-16 16-16z" fill={color}/>
    </svg>
  );
};

/** Bullhorn - for Marketing section */
export const IconBullhorn = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M480 32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9L381.7 53c-48 48-113.1 75-181 75H88c-26.5 0-52.1 10.5-70.9 29.3C6.4 168 0 187.2 0 208s6.4 40 17.1 54.7C6.4 278 0 297.2 0 320c0 26.5 10.5 52.1 29.3 70.9C40 401.5 53.4 409.3 68 413.5V464c0 26.5 21.5 48 48 48h64c26.5 0 48-21.5 48-48V416c67.9 0 133 27 181 75l43.6 43.6c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V32zM200 368H88c-8.8 0-17.3-3.5-23.6-9.8C58.2 351.9 48 336.6 48 320c0-19.1 14.4-34.8 32.9-36.8l10-1.1-8.3-5.5C67 266.3 48 245.2 48 208c0-35.3 28.7-64 64-64h88v224zm280 97.7l-43.6-43.6C378.8 364.5 301.9 336 220.8 336c-3.3 0-6.6 .1-9.9 .2l-10.1 .3-.8-10.1c-.1-1.1-.1-2.3-.1-3.4V176h0c0-1.2 0-2.3 .1-3.4l.8-10.1 10.1 .3c3.3 .1 6.6 .2 9.9 .2c81.2 0 158-28.5 215.6-86.1L480 33.3V465.7zM116 224a20 20 0 1 1 0 40 20 20 0 1 1 0-40z" fill={color}/>
    </svg>
  );
};

/** Store - for Box Office section */
export const IconStore = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 576 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M547.6 103.8L490.3 13.1C485.2 5 476.1 0 466.4 0H109.6C99.9 0 90.8 5 85.7 13.1L28.4 103.8c-29.6 46.8-3.4 111.9 51.9 119.4c4 .5 8.1 .8 12.1 .8c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29s49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c4.1 0 8.1-.3 12.1-.8c55.5-7.4 81.8-72.5 52.1-119.4zM483.7 176c-.3 0-.5 0-.8 0c-12.3-.4-23.6-5.5-32.1-13.8c-1.3-1.3-2.5-2.6-3.7-4c-7.3-8.7-11.7-19.8-11.7-32c0-7-1.4-13.6-3.9-19.6l30.6-48.4H528l46 72.8c10.8 17.1 3.3 40.5-17.1 43.3c-2.5 .3-5 .5-7.5 .5c-21.7 0-40.6-13.1-48.9-31.7l0 0c-.9-2-3-3.2-5.2-3c-2.2 .2-4 1.7-4.7 3.8C485 159.8 485.4 168 483.7 176zM96 126.3l0 0c1.3 1.4 2.5 2.7 3.7 4c8.5 8.3 19.8 13.4 32.1 13.8c.3 0 .5 0 .8 0c-1.7-8-1.3-16.2 1.4-24.1c.7-2.1-.4-4.4-2.6-5.4l0 0C113.5 105.8 100.7 90.2 97 72L48 128l46-72.8L124.6 104c-2.5 6-3.9 12.6-3.9 19.6c0 12.3-4.4 23.3-11.7 32zM399.1 176c-.3 0-.6 0-.8 0c-12.3-.4-23.6-5.5-32.1-13.8c-1.3-1.3-2.5-2.6-3.7-4c-7.3-8.7-11.7-19.8-11.7-32c0-7-1.4-13.6-3.9-19.6l30.6-48.4h65.9L413.8 130.5c-.9 1.7-1.2 3.7-.7 5.6c3.4 12.8 2.5 26.5-3.1 38.7l0 0c-.6 1.3-.6 2.8 .1 4c.7 1.2 1.9 2 3.3 2.2c16.2 1.6 30.5 9.5 40.2 21.3C437.7 188.7 419.6 176 399.1 176zM268.5 106.3l30.6 48.4c-2.5 6-3.9 12.6-3.9 19.6c0 12.2 4.4 23.2 11.7 31.9c1.2 1.4 2.4 2.8 3.7 4.1c8.5 8.3 19.8 13.4 32.1 13.8c.3 0 .5 0 .8 0c-20.6 0-38.6 12.7-54.4 26.3c9.8-11.8 24-19.7 40.2-21.3c1.4-.2 2.6-1 3.3-2.2c.7-1.2 .7-2.7 .1-4l0 0c-5.6-12.2-6.5-25.9-3.1-38.7c.5-1.9 .2-3.9-.7-5.6L298.5 106.3c-2.5 6-3.9 12.6-3.9 19.6c0 12.3-4.4 23.3-11.7 32c-1.2 1.4-2.4 2.8-3.7 4.1c-8.5 8.3-19.8 13.4-32.1 13.8c-.3 0-.6 0-.8 0c-20.4 0-38.4-12.6-54.3-26.2c9.8 11.8 24.1 19.7 40.3 21.3c1.4 .2 2.6 1 3.3 2.2c.7 1.2 .7 2.7 .1 4l0 0c-5.6 12.2-6.5 25.9-3.1 38.7c.5 1.9 .2 3.9-.7 5.6L173.5 154.8l30.6-48.4h64.4zM92.2 272c.3 0 .5 0 .8 0c-1.7-8-1.3-16.2 1.4-24.1c.7-2.1-.4-4.4-2.6-5.4l0 0c-8.9-4-16.2-10.7-21-19.6l-23.2 36.7c-10.8 17.1-3.3 40.5 17.1 43.3c2.5 .3 5 .5 7.5 .5c21.7 0 40.6-13.1 48.9-31.7l0 0c.9-2 3-3.2 5.2-3c2.2 .2 4 1.7 4.7 3.8c1.7 5.1 2.4 10.5 2 15.9l0 .1c-4.2 3.7-8.2 7.3-12 10.8C101.7 311.7 96.4 320 92.2 272zM48 464V288h35.2c-21.8 42.5 2.6 95.2 49.6 101.5c0 0 0 0 0 0l0 0c.6 .1 1.2 .2 1.8 .2c.1 0 .3 0 .4 0c1.9 .2 3.8 .3 5.7 .3c25.5 0 48.3-11.2 63.9-28.9c.5-.6 1-1.1 1.5-1.7c1-1.2 2-2.4 2.9-3.6c.5-.6 .9-1.2 1.4-1.9c16 18.8 39.4 30.7 65.6 31.9c1.1 .1 2.2 .1 3.4 .1c1.1 0 2.2 0 3.3-.1c26.2-1.2 49.6-13.1 65.6-31.9c.4 .6 .9 1.2 1.4 1.9c.9 1.2 1.9 2.4 2.9 3.6c.5 .6 1 1.1 1.5 1.7c15.6 17.7 38.4 28.9 63.9 28.9c1.9 0 3.8-.1 5.7-.3c.1 0 .3 0 .4 0c.6-.1 1.2-.2 1.8-.2l0 0c0 0 0 0 0 0c47-6.3 71.3-59 49.6-101.5H528v176H48zM0 464c0 26.5 21.5 48 48 48H528c26.5 0 48-21.5 48-48V256H0V464z" fill={color}/>
    </svg>
  );
};

/** Calendar check - for Reservations section */
export const IconCalendarCheck = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M128 0c13.3 0 24 10.7 24 24V64H296V24c0-13.3 10.7-24 24-24s24 10.7 24 24V64h40c35.3 0 64 28.7 64 64v16 48V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192 144 128C0 92.7 28.7 64 64 64h40V24c0-13.3 10.7-24 24-24zM400 192H48V448c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V192zM329 297c9.4 9.4 9.4 24.6 0 33.9l-96 96c-9.4 9.4-24.6 9.4-33.9 0l-48-48c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l31 31 79-79c9.4-9.4 24.6-9.4 33.9 0z" fill={color}/>
    </svg>
  );
};

/** Chart line - for Finance section */
export const IconChartLine = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M48 56c0-13.3-10.7-24-24-24S0 42.7 0 56V408c0 39.8 32.2 72 72 72H488c13.3 0 24-10.7 24-24s-10.7-24-24-24H72c-13.3 0-24-10.7-24-24V56zM473 169c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-119 119-63-63c-9.4-9.4-24.6-9.4-33.9 0l-104 104c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l87-87 63 63c9.4 9.4 24.6 9.4 33.9 0L473 169z" fill={color}/>
    </svg>
  );
};

/** Gear - for Settings section */
export const IconGear = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M256 0c17 0 33.6 1.7 49.8 4.8c7.9 1.5 21.8 6.1 29.4 20.1c2 3.7 3.6 7.6 4.6 11.8l9.3 38.5c1.8 7.6 8.1 13.4 15.6 15.6c16.9 5 32.9 12.1 47.6 21.1c6.5 4 14.7 4 21.1 .4L469.9 91c3.7-2 7.6-3.6 11.8-4.6c8.3-2.1 17.1-.5 24.2 4.4c24.4 16.8 45.4 38.1 61.6 62.8c4.7 7.2 6 15.9 3.5 24.1c-1.3 4.2-3.2 8.2-5.5 11.8l-21.6 34.3c-4.2 6.7-4.4 15-.4 21.8c8.2 14 14.5 29.2 18.5 45.3c1.9 7.6 7.7 13.8 15.2 16l38.5 9.3c4.2 1 8.2 2.7 11.8 4.6c7.4 3.9 12.7 10.8 14.4 18.9c3.1 15 4.7 30.5 4.7 46.4c0 17-1.7 33.6-4.8 49.8c-1.5 7.9-6.1 21.8-20.1 29.4c-3.7 2-7.6 3.6-11.8 4.6l-38.5 9.3c-7.6 1.8-13.4 8.1-15.6 15.6c-5 16.9-12.1 32.9-21.1 47.6c-4 6.5-4 14.7-.4 21.1l21.2 36.5c2 3.7 3.6 7.6 4.6 11.8c2.1 8.3 .5 17.1-4.4 24.2c-16.8 24.4-38.1 45.4-62.8 61.6c-7.2 4.7-15.9 6-24.1 3.5c-4.2-1.3-8.2-3.2-11.8-5.5L400.8 554c-6.7-4.2-15-4.4-21.8-.4c-14 8.2-29.2 14.5-45.3 18.5c-7.6 1.9-13.8 7.7-16 15.2l-9.3 38.5c-1 4.2-2.7 8.2-4.6 11.8c-3.9 7.4-10.8 12.7-18.9 14.4c-15 3.1-30.5 4.7-46.4 4.7c-17 0-33.6-1.7-49.8-4.8c-7.9-1.5-21.8-6.1-29.4-20.1c-2-3.7-3.6-7.6-4.6-11.8l-9.3-38.5c-1.8-7.6-8.1-13.4-15.6-15.6c-16.9-5-32.9-12.1-47.6-21.1c-6.5-4-14.7-4-21.1-.4L42.1 565.6c-3.7 2-7.6 3.6-11.8 4.6c-8.3 2.1-17.1 .5-24.2-4.4C-18.4 548.9-39.4 527.7-55.6 503c-4.7-7.2-6-15.9-3.5-24.1c1.3-4.2 3.2-8.2 5.5-11.8l21.6-34.3c4.2-6.7 4.4-15 .4-21.8c-8.2-14-14.5-29.2-18.5-45.3c-1.9-7.6-7.7-13.8-15.2-16L-103.8 340c-4.2-1-8.2-2.7-11.8-4.6c-7.4-3.9-12.7-10.8-14.4-18.9c-3.1-15-4.7-30.5-4.7-46.4c0-17 1.7-33.6 4.8-49.8c1.5-7.9 6.1-21.8 20.1-29.4c3.7-2 7.6-3.6 11.8-4.6l38.5-9.3c7.6-1.8 13.4-8.1 15.6-15.6c5-16.9 12.1-32.9 21.1-47.6c4-6.5 4-14.7 .4-21.1L-43.6 56.2c-2-3.7-3.6-7.6-4.6-11.8c-2.1-8.3-.5-17.1 4.4-24.2C-27 -4.3-5.7-25.3 18.9-41.5c7.2-4.7 15.9-6 24.1-3.5c4.2 1.3 8.2 3.2 11.8 5.5l34.3 21.6c6.7 4.2 15 4.4 21.8 .4c14-8.2 29.2-14.5 45.3-18.5c7.6-1.9 13.8-7.7 16-15.2L182-89.8c1-4.2 2.7-8.2 4.6-11.8c3.9-7.4 10.8-12.7 18.9-14.4C220.5-119.1 236-120.7 252.9-120.7h3.1zm0 156a100 100 0 1 0 0 200 100 100 0 1 0 0-200z" fill={color}/>
    </svg>
  );
};

/** Building - for Organizations section */
export const IconBuilding = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 384 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M64 48c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16h80V400c0-26.5 21.5-48 48-48s48 21.5 48 48v64h80c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64zM0 64C0 28.7 28.7 0 64 0H320c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm88 40c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v48c0 8.8-7.2 16-16 16H104c-8.8 0-16-7.2-16-16V104zM232 88h48c8.8 0 16 7.2 16 16v48c0 8.8-7.2 16-16 16H232c-8.8 0-16-7.2-16-16V104c0-8.8 7.2-16 16-16zM88 232c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v48c0 8.8-7.2 16-16 16H104c-8.8 0-16-7.2-16-16V232zm144-16h48c8.8 0 16 7.2 16 16v48c0 8.8-7.2 16-16 16H232c-8.8 0-16-7.2-16-16V232c0-8.8 7.2-16 16-16z" fill={color}/>
    </svg>
  );
};

/** Arrow right from bracket - for Logout */
export const IconArrowRightFromBracket = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M505 273c9.4-9.4 9.4-24.6 0-33.9L377 111c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l87 87L184 232c-13.3 0-24 10.7-24 24s10.7 24 24 24l246.1 0-87 87c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0L505 273zM168 80c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 32C39.4 32 0 71.4 0 120L0 392c0 48.6 39.4 88 88 88l80 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-80 0c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l80 0z" fill={color}/>
    </svg>
  );
};

// =============================================================================
// Common Action Icons
// =============================================================================

/** Calendar - design system calendar icon */
export const IconCalendar = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path
        d="M3.5 0C3.75 0 4 0.25 4 0.5V2H10V0.5C10 0.25 10.2188 0 10.5 0C10.75 0 11 0.25 11 0.5V2H12C13.0938 2 14 2.90625 14 4V14C14 15.125 13.0938 16 12 16H2C0.875 16 0 15.125 0 14V4C0 2.90625 0.875 2 2 2H3V0.5C3 0.25 3.21875 0 3.5 0ZM13 6H1V14C1 14.5625 1.4375 15 2 15H12C12.5312 15 13 14.5625 13 14V6ZM12 3H2C1.4375 3 1 3.46875 1 4V5H13V4C13 3.46875 12.5312 3 12 3Z"
        fill={color}
      />
    </svg>
  );
};

/** File lines - document with text */
export const IconFileLines = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 384 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M64 464c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80V448c0 8.8-7.2 16-16 16H64zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120z" fill={color}/>
    </svg>
  );
};

/** Ticket */
export const IconTicket = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 576 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M64 64C28.7 64 0 92.7 0 128v64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320v64c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V320c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6V128c0-35.3-28.7-64-64-64H64zm64 112l0 160c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16V176c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16z" fill={color}/>
    </svg>
  );
};

/** Ban - cancel/prohibit */
export const IconBan = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" fill={color}/>
    </svg>
  );
};

/** Link */
export const IconLink = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 640 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M580.3 267.2c56.2-56.2 56.2-147.3 0-203.5C526.8 10.2 440.9 7.3 383.9 57.2l-6.1 5.4c-10 8.7-11 23.9-2.3 33.9s23.9 11 33.9 2.3l6.1-5.4c38-33.2 95.2-31.3 130.9 4.4c37.4 37.4 37.4 98.1 0 135.6L433.1 346.6c-37.4 37.4-98.2 37.4-135.6 0c-35.7-35.7-37.6-92.9-4.4-130.9l4.7-5.4c8.7-10 7.7-25.1-2.3-33.9s-25.1-7.7-33.9 2.3l-4.7 5.4c-49.8 57-46.9 142.9 6.6 196.4c56.2 56.2 147.3 56.2 203.5 0L580.3 267.2zM59.7 244.8C3.5 301 3.5 392.1 59.7 448.2c53.6 53.6 139.5 56.4 196.5 6.5l6.1-5.4c10-8.7 11-23.9 2.3-33.9s-23.9-11-33.9-2.3l-6.1 5.4c-38 33.2-95.2 31.3-130.9-4.4c-37.4-37.4-37.4-98.1 0-135.6L206.9 165.4c37.4-37.4 98.1-37.4 135.6 0c35.7 35.7 37.6 92.9 4.4 130.9l-5.4 6.1c-8.7 10-7.7 25.1 2.3 33.9s25.1 7.7 33.9-2.3l5.4-6.1c49.9-57 47-142.9-6.5-196.5c-56.2-56.2-147.3-56.2-203.5 0L59.7 244.8z" fill={color}/>
    </svg>
  );
};

/** Triangle exclamation - warning */
export const IconTriangleExclamation = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M248.4 84.3c1.6-2.7 4.5-4.3 7.6-4.3s6 1.6 7.6 4.3L461.9 410c1.4 2.3 2.1 4.9 2.1 7.5c0 8-6.5 14.5-14.5 14.5H62.5c-8 0-14.5-6.5-14.5-14.5c0-2.7 .7-5.3 2.1-7.5L248.4 84.3zm-41-25L9.1 385c-6 9.8-9.1 21-9.1 32.5C0 452 28 480 62.5 480h387c34.5 0 62.5-28 62.5-62.5c0-11.5-3.2-22.7-9.1-32.5L304.6 59.3C294.3 42.4 275.9 32 256 32s-38.3 10.4-48.6 27.3zM288 368a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm-8-184c0-13.3-10.7-24-24-24s-24 10.7-24 24v96c0 13.3 10.7 24 24 24s24-10.7 24-24V184z" fill={color}/>
    </svg>
  );
};

/** User */
export const IconUser = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" fill={color}/>
    </svg>
  );
};

/** User plus - add user */
export const IconUserPlus = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 640 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M352 128A128 128 0 1 0 96 128a128 128 0 1 0 256 0zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" fill={color}/>
    </svg>
  );
};

/** Circle user - user avatar in circle */
export const IconCircleUser = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M406.5 399.6C387.4 352.9 341.5 320 288 320H224c-53.5 0-99.4 32.9-118.5 79.6C69.9 362.2 48 311.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208c0 55.7-21.9 106.2-57.5 143.6zm-40.1 32.7C334.4 452.4 296.6 464 256 464s-78.4-11.6-110.5-31.7c7.3-36.7 39.7-64.3 78.5-64.3h64c38.8 0 71.2 27.6 78.5 64.3zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-272a40 40 0 1 1 0-80 40 40 0 1 1 0 80zm-88-40a88 88 0 1 0 176 0 88 88 0 1 0 -176 0z" fill={color}/>
    </svg>
  );
};

/** Badge percent - discount/promo */
export const IconBadgePercent = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M200 144a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm112 224a24 24 0 1 0 0-48 24 24 0 1 0 0 48zM337 119c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L143 247c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0L337 119zM200 96a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm88 224a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM256 32c14.7 0 27.5 10 31 24.2l6.2 25c1.2 4.8 4.4 8.9 8.8 11.2l22.6 11.7c4.1 2.1 8.8 2.6 13.2 1.4l24.6-6.7c14-3.8 28.8 3.3 35 16.4l6.6 14.1c2 4.2 5.5 7.6 9.8 9.5l22.1 9.7c12.8 5.6 19.6 19.3 16.2 32.5l-6.1 23.6c-1.2 4.7-.6 9.8 1.7 14.1l11.3 21.3c6.8 12.8 3.6 28.6-7.5 37.6l-19.8 16.1c-3.8 3.1-6.3 7.4-7 12.2l-3.6 24.1c-2.1 14.4-14 25.1-28.5 25.6l-25.9 1c-4.9 .2-9.6 2.1-13.1 5.4l-17.8 17c-10.3 9.9-26.2 10.5-37.2 1.4l-19.6-16.3c-3.7-3.1-8.4-4.7-13.2-4.4l-24.2 1.5c-14.5 .9-27.6-9.1-31.2-23.3l-6.4-25.2c-1.2-4.8-4.2-8.9-8.4-11.5l-21.5-13.1c-12.4-7.6-17.4-22.9-11.9-36.3l9.8-23.8c1.9-4.5 2-9.5 .5-14.2l-8.1-24.5c-4.5-13.8 2.1-28.8 15.4-35.1l23.6-11.2c4.4-2.1 7.8-5.8 9.4-10.4l8.1-24.1c4.6-13.6 18.6-21.5 32.6-18.4l25 5.5c4.8 1.1 9.8 .3 14-2l22-12.4c12.5-7.1 28.2-4.2 37.4 6.8l16.4 19.6c3.2 3.8 7.6 6.3 12.4 6.8l25.4 2.7c14.4 1.5 25.5 13.3 26.3 27.8l1.6 25.9c.3 4.9 2.3 9.6 5.7 13.1l17.6 17.4c10.2 10.1 11.2 26 2.4 37.3l-15.6 20.1c-3 3.8-4.4 8.5-4.1 13.3l2.3 24.1c1.4 14.4-8.3 27.6-22.5 31.5l-25.3 6.9c-4.7 1.3-8.9 4.2-11.5 8.4l-13.6 21.2c-7.8 12.2-23.2 17-36.5 11.2l-23.6-10.3c-4.5-2-9.5-2.2-14.1-.6l-24.3 8.6c-13.7 4.9-28.8-1.4-35.6-14.8l-12-23.7c-2.3-4.5-6.2-8-10.8-9.7l-24.3-9c-13.6-5-21-19.8-17.3-33.9l6.6-25.1c1.2-4.7 .6-9.7-1.6-14l-11.8-23c-6.6-12.9-2.9-28.7 8.7-37.5l20.6-15.6c3.9-2.9 6.6-7.2 7.4-12l4.5-24c2.5-14.3 14.7-24.7 29.2-24.9l26-.3c4.9-.1 9.6-1.9 13.2-5.1l18.2-16.5c10.5-9.5 26.4-9.8 37.2-.6z" fill={color}/>
    </svg>
  );
};

/** Angle down - dropdown arrow */
export const IconAngleDown = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" fill={color}/>
    </svg>
  );
};

/** Chevron up */
export const IconChevronUp = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" fill={color}/>
    </svg>
  );
};

/** Chevron down */
export const IconChevronDown = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" fill={color}/>
    </svg>
  );
};

/** Chevron left */
export const IconChevronLeft = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 320 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" fill={color}/>
    </svg>
  );
};

/** Chevron right */
export const IconChevronRight = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 320 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" fill={color}/>
    </svg>
  );
};

/** Print */
export const IconPrint = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M112 160V64c0-8.8 7.2-16 16-16H357.5c4.2 0 8.3 1.7 11.3 4.7l26.5 26.5c3 3 4.7 7.1 4.7 11.3V160h48V90.5c0-17-6.7-33.3-18.7-45.3L402.7 18.7C390.7 6.7 374.5 0 357.5 0H128C92.7 0 64 28.7 64 64v96h48zm0 256H64V352h48v64zm304 0V352h48v64H416zM64 304v-48c0-26.5 21.5-48 48-48H400c26.5 0 48 21.5 48 48v48H64zm80 48H368v96c0 8.8-7.2 16-16 16H160c-8.8 0-16-7.2-16-16V352zm-48 0v96c0 35.3 28.7 64 64 64H352c35.3 0 64-28.7 64-64V352h48c26.5 0 48-21.5 48-48V256c0-44.2-35.8-80-80-80H80c-44.2 0-80 35.8-80 80v48c0 26.5 21.5 48 48 48h48z" fill={color}/>
    </svg>
  );
};

/** Pen - design system pen icon */
export const IconPen = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path
        d="M5 1V2H9V1C9 0.46875 9.4375 0 10 0C10.5312 0 11 0.46875 11 1V2H12.5C13.3125 2 14 2.6875 14 3.5V5H0V3.5C0 2.6875 0.65625 2 1.5 2H3V1C3 0.46875 3.4375 0 4 0C4.53125 0 5 0.46875 5 1ZM0 6H14V14.5C14 15.3438 13.3125 16 12.5 16H1.5C0.65625 16 0 15.3438 0 14.5V6ZM9.625 8.34375C9.1875 7.90625 8.4375 7.90625 7.96875 8.34375L7.5 8.8125L9.15625 10.5L9.625 10.0312C10.0938 9.5625 10.0938 8.8125 9.625 8.34375ZM4.28125 12.25L4 13.375C3.96875 13.5625 4 13.75 4.125 13.875C4.25 14 4.4375 14.0312 4.59375 14L5.75 13.7188C5.9375 13.6562 6.09375 13.5625 6.21875 13.4375L8.46875 11.1875L6.78125 9.53125L4.5625 11.7812C4.40625 11.9062 4.34375 12.0625 4.28125 12.25Z"
        fill={color}
      />
    </svg>
  );
};

/** Override icon inspired by the deposit design */
export const IconOverride = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path
        d="M14.0625 2.71875C14.8438 1.9375 16.125 1.9375 16.9062 2.71875L17.2812 3.09375C18.0625 3.875 18.0625 5.15625 17.2812 5.9375L10.4062 12.8125C10.125 13.0938 9.78125 13.25 9.4375 13.3438L6.59375 14C6.4375 14.0312 6.25 14 6.125 13.875C6 13.75 5.96875 13.5625 6 13.4062L6.65625 10.5625C6.75 10.2188 6.90625 9.875 7.1875 9.59375L14.0625 2.71875ZM16.1875 3.4375C15.8125 3.03125 15.1562 3.03125 14.7812 3.4375L13.9375 4.25L15.75 6.0625L16.5625 5.21875C16.9688 4.84375 16.9688 4.1875 16.5625 3.8125L16.1875 3.4375ZM7.625 10.7812L7.15625 12.8438L9.1875 12.375C9.375 12.3438 9.5625 12.25 9.6875 12.0938L15.0312 6.75L13.25 4.96875L7.90625 10.3125C7.75 10.4375 7.65625 10.625 7.625 10.7812ZM8.5 4C8.75 4 9 4.25 9 4.5C9 4.78125 8.75 5 8.5 5H4.5C3.65625 5 3 5.6875 3 6.5V15.5C3 16.3438 3.65625 17 4.5 17H13.5C14.3125 17 15 16.3438 15 15.5V11.5C15 11.25 15.2188 11 15.5 11C15.75 11 16 11.25 16 11.5V15.5C16 16.9062 14.875 18 13.5 18H4.5C3.09375 18 2 16.9062 2 15.5V6.5C2 5.125 3.09375 4 4.5 4H8.5Z"
        fill={color}
      />
    </svg>
  );
};

/** QR Code */
export const IconQrcode = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M48 32C21.5 32 0 53.5 0 80v96c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48H48zM80 176V112h32v64H80zM48 288c-26.5 0-48 21.5-48 48v96c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48V336c0-26.5-21.5-48-48-48H48zm32 80v64H80V368h32zM304 32c-26.5 0-48 21.5-48 48v96c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48H304zm32 144V112h32v64H336zM256 336v48H304v48h48v48h48v-48h48V336H400v48H352V336H256zm48 96V384h48v48H304zm96 32v48h48V464H400z" fill={color}/>
    </svg>
  );
};

/** Paper plane - send/resend */
export const IconPaperPlane = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" fill={color}/>
    </svg>
  );
};

/** Check - checkmark */
export const IconCheck = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M441 103c9.4 9.4 9.4 24.6 0 33.9L177 401c-9.4 9.4-24.6 9.4-33.9 0L7 265c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l119 119L407 103c9.4-9.4 24.6-9.4 33.9 0z" fill={color}/>
    </svg>
  );
};

/** Plus */
export const IconPlus = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M248 72c0-13.3-10.7-24-24-24s-24 10.7-24 24V232H40c-13.3 0-24 10.7-24 24s10.7 24 24 24H200V440c0 13.3 10.7 24 24 24s24-10.7 24-24V280H408c13.3 0 24-10.7 24-24s-10.7-24-24-24H248V72z" fill={color}/>
    </svg>
  );
};

/** Minus */
export const IconMinus = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M432 256c0 13.3-10.7 24-24 24L40 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l368 0c13.3 0 24 10.7 24 24z" fill={color}/>
    </svg>
  );
};

/** Circle exclamation - error/warning */
export const IconCircleExclamation = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c-13.3 0-24 10.7-24 24V264c0 13.3 10.7 24 24 24s24-10.7 24-24V152c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" fill={color}/>
    </svg>
  );
};

/** Lock */
export const IconLock = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M144 128v64H304V128c0-44.2-35.8-80-80-80s-80 35.8-80 80zM96 192V128C96 57.3 153.3 0 224 0s128 57.3 128 128v64h32c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H96zM48 256V448c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V256c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16z" fill={color}/>
    </svg>
  );
};

/** Location dot - map pin */
export const IconLocationDot = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 384 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M352 192c0-88.4-71.6-160-160-160S32 103.6 32 192c0 15.6 5.4 37 16.6 63.4c10.9 25.9 26.2 54 43.6 82.1c34.1 55.3 74.4 108.2 99.9 140c25.4-31.8 65.8-84.7 99.9-140c17.3-28.1 32.7-56.3 43.6-82.1C346.6 229 352 207.6 352 192zm32 0c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192zm-240 0a48 48 0 1 0 96 0 48 48 0 1 0 -96 0zm48 80a80 80 0 1 1 0-160 80 80 0 1 1 0 160z" fill={color}/>
    </svg>
  );
};

/** List */
export const IconList = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z" fill={color}/>
    </svg>
  );
};

/** Rotate right - refresh/resend */
export const IconRotateRight = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 177c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z" fill={color}/>
    </svg>
  );
};

/** Xmark - close */
export const IconXmark = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 384 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" fill={color}/>
    </svg>
  );
};

/** Arrow left - back */
export const IconArrowLeft = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M7.4 273.4C2.7 268.8 0 262.6 0 256s2.7-12.8 7.4-17.4l176-168c9.6-9.2 24.8-8.8 33.9 .8s8.8 24.8-.8 33.9L83.9 232 424 232c13.3 0 24 10.7 24 24s-10.7 24-24 24L83.9 280l132.7 126.6c9.6 9.2 10 24.3 .8 33.9s-24.3 10-33.9 .8l-176-168z" fill={color}/>
    </svg>
  );
};

/** Arrow right */
export const IconArrowRight = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M440.6 273.4c4.7-4.5 7.4-10.8 7.4-17.4s-2.7-12.8-7.4-17.4l-176-168c-9.6-9.2-24.8-8.8-33.9 .8s-8.8 24.8 .8 33.9L364.1 232 24 232c-13.3 0-24 10.7-24 24s10.7 24 24 24l340.1 0L231.4 406.6c-9.6 9.2-10 24.3-.8 33.9s24.3 10 33.9 .8l176-168z" fill={color}/>
    </svg>
  );
};

/** Credit card */
export const IconCreditCard = ({ scale, size, color = 'currentColor', className, style }: IconProps) => {
  const s = getIconSize(scale, size);
  return (
    <svg width={s} height={s} viewBox="0 0 576 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z" fill={color}/>
    </svg>
  );
};

// =============================================================================
// Alias exports for backward compatibility
// =============================================================================

/** @deprecated Use IconTriangleExclamation instead */
export const IconWarning = IconTriangleExclamation;

/** @deprecated Use IconPen instead */
export const IconModify = IconPen;

/** @deprecated Use IconPaperPlane instead */
export const IconResend = IconPaperPlane;

/** @deprecated Use IconLocationDot instead */
export const IconLocation = IconLocationDot;

/** @deprecated Use IconCalendarDays instead */
export const IconEvents = IconCalendarDays;

/** @deprecated Use IconShareNodes instead */
export const IconChannels = IconShareNodes;

/** @deprecated Use IconWarehouse instead */
export const IconInventory = IconWarehouse;

/** @deprecated Use IconCircleCheck instead */
export const IconValidation = IconCircleCheck;

/** @deprecated Use IconClipboardList instead */
export const IconOrders = IconClipboardList;

/** @deprecated Use IconBullhorn instead */
export const IconMarketing = IconBullhorn;

/** @deprecated Use IconStore instead */
export const IconBoxOffice = IconStore;

/** @deprecated Use IconCalendarCheck instead */
export const IconReservations = IconCalendarCheck;

/** @deprecated Use IconChartLine instead */
export const IconFinance = IconChartLine;

/** @deprecated Use IconGear instead */
export const IconSettings = IconGear;

/** @deprecated Use IconBuilding instead */
export const IconOrganizations = IconBuilding;

/** @deprecated Use IconArrowRightFromBracket instead */
export const IconLogout = IconArrowRightFromBracket;
