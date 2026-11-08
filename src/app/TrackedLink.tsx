'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { getAttribution } from './AttributionCapture';

type WindowWithDataLayer = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  clarity?: (...args: unknown[]) => void;
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
          ...getAttribution(),
          ...eventParams,
        });
        // GTM이 지연되거나 설정되지 않은 환경에서도 Clarity에서 CTA 행동을 식별한다.
        if (typeof win.clarity === 'function') {
          win.clarity('event', eventName);
          const placement = eventParams?.placement;
          if (placement) win.clarity('set', 'cta_placement', String(placement));
        }
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
