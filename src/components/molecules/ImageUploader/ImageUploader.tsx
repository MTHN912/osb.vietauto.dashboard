'use client';

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import { Camera, ImagePlus, UploadCloud, Trash2, Maximize2, Plus } from 'lucide-react';
import styles from './ImageUploader.module.css';
import { CameraModal } from '@/components/molecules/CameraModal';
import { ImagePreviewModal } from '@/components/molecules/ImagePreviewModal';
import { useI18n } from '@/hooks/common';

export interface ImageUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
  title?: string;
  className?: string;
}

export function ImageUploader({
  photos,
  onChange,
  maxPhotos = 12,
  title,
  className = '',
}: ImageUploaderProps) {
  const { t, interpolate } = useI18n();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxPhotos - photos.length;
    if (remainingSlots <= 0) return;

    const filesArray = Array.from(files).slice(0, remainingSlots);

    filesArray.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onChange([...photos, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (e.target) e.target.value = '';
  };

  const handleCameraCapture = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (e.target) e.target.value = '';
  };

  const handleWebcamCapture = (dataUrl: string) => {
    if (photos.length < maxPhotos) {
      onChange([...photos, dataUrl]);
    }
  };

  const handleDeletePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleCameraBtnClick = () => {
    // Detect mobile touch device
    const isMobile =
      typeof window !== 'undefined' &&
      (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
        window.innerWidth <= 768 ||
        'ontouchstart' in window);

    if (isMobile && cameraInputRef.current) {
      // Direct mobile native camera launch
      cameraInputRef.current.click();
    } else {
      // Desktop webcam modal
      setIsCameraModalOpen(true);
    }
  };

  const countText = interpolate(t.imageUploader.photosCount, {
    count: photos.length,
    max: maxPhotos,
  });

  const supportsText = interpolate(t.imageUploader.supports, {
    max: maxPhotos,
  });

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title || t.imageUploader.title}</h3>
        <span className={styles.countBadge}>{countText}</span>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileInputChange}
        className={styles.hiddenInput}
        id="image-gallery-input"
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        className={styles.hiddenInput}
        id="mobile-camera-input"
      />

      {/* Primary Action Buttons */}
      <div className={styles.actionRow}>
        <button
          type="button"
          className={styles.cameraBtn}
          onClick={handleCameraBtnClick}
          disabled={photos.length >= maxPhotos}
          title={t.imageUploader.openCamera}
        >
          <Camera size={18} />
          <span>{t.imageUploader.takePhoto}</span>
        </button>

        <button
          type="button"
          className={styles.galleryBtn}
          onClick={() => fileInputRef.current?.click()}
          disabled={photos.length >= maxPhotos}
          title={t.imageUploader.chooseFiles}
        >
          <ImagePlus size={18} />
          <span>{t.imageUploader.chooseFiles}</span>
        </button>
      </div>

      {/* Drag and Drop Zone if empty or few photos */}
      {photos.length === 0 && (
        <div
          className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud size={32} className={styles.dropIcon} />
          <p className={styles.dropText}>{t.imageUploader.dragDrop}</p>
          <p className={styles.dropSubtext}>{supportsText}</p>
        </div>
      )}

      {/* Photos Grid */}
      {photos.length > 0 && (
        <div className={styles.photoGrid}>
          {photos.map((photo, index) => {
            const isDataOrUrl =
              photo.startsWith('data:') || photo.startsWith('http') || photo.startsWith('/');

            return (
              <div key={index} className={styles.photoCard}>
                <span className={styles.photoIndex}>#{index + 1}</span>

                {isDataOrUrl ? (
                  <Image
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    width={200}
                    height={150}
                    className={styles.photoThumb}
                    unoptimized
                    onClick={() => setPreviewIndex(index)}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <div
                    className={styles.photoPlaceholder}
                    onClick={() => setPreviewIndex(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    📷 {photo}
                  </div>
                )}

                <div className={styles.photoOverlay}>
                  <button
                    type="button"
                    className={styles.thumbActionBtn}
                    onClick={() => setPreviewIndex(index)}
                    title={t.imageUploader.previewTooltip}
                    aria-label={t.imageUploader.previewTooltip}
                  >
                    <Maximize2 size={14} />
                  </button>

                  <button
                    type="button"
                    className={`${styles.thumbActionBtn} ${styles.deleteBtn}`}
                    onClick={() => handleDeletePhoto(index)}
                    title={t.imageUploader.deleteTooltip}
                    aria-label={t.imageUploader.deleteTooltip}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add more button tile in grid */}
          {photos.length < maxPhotos && (
            <button
              type="button"
              className={styles.addMoreCard}
              onClick={() => fileInputRef.current?.click()}
              title={t.imageUploader.chooseFiles}
            >
              <Plus size={20} />
              <span>{t.common.add}</span>
            </button>
          )}
        </div>
      )}

      {/* Live Camera Modal (Desktop Webcam) */}
      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleWebcamCapture}
      />

      {/* Image Preview Lightbox Modal */}
      {previewIndex !== null && (
        <ImagePreviewModal
          photos={photos}
          currentIndex={previewIndex}
          isOpen={previewIndex !== null}
          onClose={() => setPreviewIndex(null)}
          onNavigate={setPreviewIndex}
          onDelete={handleDeletePhoto}
        />
      )}
    </div>
  );
}
