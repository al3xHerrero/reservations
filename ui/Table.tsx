import React from 'react';

type TableWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  className?: string;
};

type TableElementProps<T> = React.HTMLAttributes<T> & {
  children: React.ReactNode;
  className?: string;
};

type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  children: React.ReactNode;
  className?: string;
};

type TableHeaderCellProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
  children: React.ReactNode;
  className?: string;
};

export function Table({ children, className = '' }: TableWrapperProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={`min-w-full text-[length:var(--size-small)] leading-[var(--leading-small)] ${className}`}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHead({
  children,
  className = '',
  ...props
}: TableElementProps<HTMLTableSectionElement>) {
  return (
    <thead
      className={`border-b border-[var(--table/color/border/default)] ${className}`}
      style={{ backgroundColor: 'var(--table/color/bg/header)' }}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  children,
  className = '',
  ...props
}: TableElementProps<HTMLTableSectionElement>) {
  return (
    <tbody
      className={`divide-y divide-[var(--table/color/border/default)] ${className}`}
      style={{ backgroundColor: 'var(--table/color/bg/body)' }}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TableRow({
  children,
  className = '',
  ...props
}: TableElementProps<HTMLTableRowElement>) {
  return (
    <tr className={`hover:bg-[var(--table/color/bg/hover)] ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHeaderCell({ children, className = '', ...props }: TableHeaderCellProps) {
  return (
    <th
      className={`text-left text-[length:var(--size-caption)] font-[var(--weight-semibold)] leading-[var(--leading-caption)] uppercase tracking-wide ${className}`}
      style={{
        paddingInline: 'var(--table/dimensions/padding/inline)',
        paddingBlock: 'var(--table/dimensions/padding/block/header)',
        color: 'var(--table/color/fg/header)',
      }}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = '', ...props }: TableCellProps) {
  return (
    <td
      className={`text-[length:var(--size-small)] leading-[var(--leading-small)] align-top ${className}`}
      style={{
        paddingInline: 'var(--table/dimensions/padding/inline)',
        paddingBlock: 'var(--table/dimensions/padding/block/body)',
        color: 'var(--table/color/fg/body)',
      }}
      {...props}
    >
      {children}
    </td>
  );
}
