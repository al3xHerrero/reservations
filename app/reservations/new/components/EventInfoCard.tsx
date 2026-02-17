'use client';

import { IconLocationDot } from '@/ui';

const DEFAULT_EVENT_IMAGE =
  'https://applications-media.feverup.com/image/upload/f_auto,w_720,h_720/fever2/plan/photo/977e38cc-1f0d-11ee-82d1-120342c26c11.jpg';

type EventInfoCardProps = {
  title?: string;
  venue?: string;
  address?: string;
  thumbnail?: string;
  fallbackName?: string;
  fallbackVenue?: string;
  fallbackAddress?: string;
  fallbackThumbnail?: string;
};

const EventInfoCard = ({
  title,
  venue,
  address,
  thumbnail,
  fallbackName,
  fallbackVenue,
  fallbackAddress,
  fallbackThumbnail,
}: EventInfoCardProps) => {
  const cardTitle = title || fallbackName || 'LIV Golf Chicago 2025 - Hospitality';
  const venueLabel = venue || fallbackVenue || 'Bolingbrook Golf Club';
  const addressLabel = address || fallbackAddress || '12...';
  const locationParts = [venueLabel, addressLabel].filter(Boolean);
  const locationText = locationParts.join(', ');

  const imageSrc = thumbnail || fallbackThumbnail || DEFAULT_EVENT_IMAGE;

  return (
    <div
      style={{
        backgroundColor: 'var(--background-main-default)',
        border: '1px solid var(--border-main-default)',
        borderRadius: '8px',
        padding: 'var(--space-4)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: 'var(--palette-neutral-100)',
          flexShrink: 0,
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={cardTitle}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="lazy"
          />
        ) : (
          <span
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            🎫
          </span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 'var(--size-h6)',
            lineHeight: 'var(--leading-h6)',
            fontWeight: 'var(--weight-semibold)',
            color: 'var(--text-main-default)',
            margin: 0,
          }}
        >
          {cardTitle}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
          <IconLocationDot size={12} color="#536B75" />
          <span
            style={{
              fontSize: 'var(--size-caption)',
              color: 'var(--text-subtle-default)',
            }}
          >
            {locationText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventInfoCard;
