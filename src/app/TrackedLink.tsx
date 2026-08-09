'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';

type WindowWithDataLayer = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: string;
  eventParams?: Record<string, unknown>;
  children: ReactNode;
};

export default function TrackedLink({
  eventName,
  eventParams,
  onClick,
  children,
  ...props
}: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        const win = window as WindowWithDataLayer;
        win.dataLayer = win.dataLayer || [];
        win.dataLayer.push({
          event: eventName,
          ...eventParams,
        });
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
