'use client';

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import styles from './ImagePreviewModal.module.css';
import { useI18n } from '@/hooks/common';

export interface ImagePreviewModalProps {
  photos: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onDelete?: (index: number) => void;
}

export function ImagePreviewModal({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  onDelete,
}: ImagePreviewModalProps) {
  const { t } = useI18n();

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      onNavigate(photos.length - 1);
    }
  }, [currentIndex, photos.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onNavigate(0);
    }
  }, [currentIndex, photos.length, onNavigate]);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(currentIndex);
      if (photos.length <= 1) {
        onClose();
      } else if (currentIndex >= photos.length - 1) {
        onNavigate(currentIndex - 1);
      }
    }
  }, [onDelete, currentIndex, photos.length, onClose, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex] || photos[0];

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.topBar}>
          <span className={styles.counter}>
            {currentIndex + 1} / {photos.length}
          </span>
          <div className={styles.topActions}>
            {onDelete && (
              <button
                type="button"
                className={styles.iconBtn}
                onClick={handleDelete}
                title={t.imageUploader.deleteTooltip}
                aria-label={t.imageUploader.deleteTooltip}
              >
                <Trash2 size={18} />
              </button>
            )}
            <button
              type="button"
              className={styles.iconBtn}
              onClick={onClose}
              title={t.common.close}
              aria-label={t.common.close}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {photos.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.navBtn} ${styles.prevBtn}`}
              onClick={handlePrev}
              title="Previous photo"
              aria-label="Previous photo"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              className={`${styles.navBtn} ${styles.nextBtn}`}
              onClick={handleNext}
              title="Next photo"
              aria-label="Next photo"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <div className={styles.imageWrapper}>
          {currentPhoto.startsWith('data:') || currentPhoto.startsWith('http') || currentPhoto.startsWith('/') ? (
            <Image
              src={currentPhoto}
              alt={`Photo ${currentIndex + 1}`}
              width={1000}
              height={750}
              className={styles.previewImage}
              unoptimized
            />
          ) : (
            <div style={{ padding: '3rem', color: '#fff' }}>📷 {currentPhoto}</div>
          )}
        </div>
      </div>
    </div>
  );
}
