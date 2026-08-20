import React from 'react';
import Image from 'next/image';
import styles from './Avatar.module.css';

export interface AvatarProps {
  name?: string;
  initials?: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  onClick?: () => void;
  title?: string;
}

export function Avatar({
  name,
  initials,
  avatarUrl,
  size = 'md',
  color,
  className = '',
  onClick,
  title,
}: AvatarProps) {
  const displayInitials =
    initials ||
    (name
      ? name
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : 'U');

  const tooltip = title || name || '';

  return (
    <div
      className={`${styles.avatar} ${styles[size]} ${onClick ? styles.clickable : ''} ${className}`}
      style={{ backgroundColor: avatarUrl ? undefined : color || '#3b82f6' }}
      title={tooltip}
      onClick={onClick}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name || 'Avatar'}
          fill
          className={styles.image}
          sizes="40px"
          unoptimized
        />
      ) : (
        <span className={styles.initials}>{displayInitials}</span>
      )}
    </div>
  );
}
