'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, Camera, RotateCw, Check, AlertCircle, RefreshCw } from 'lucide-react';
import styles from './CameraModal.module.css';
import { Button } from '@/components/atoms/Button';
import { useI18n } from '@/hooks/common';

export interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photoDataUrl: string) => void;
}

export function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startStream = useCallback(async (facing: 'user' | 'environment') => {
    stopStream();
    setError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError(t.imageUploader.cameraError);
        return;
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch {
      // If environment camera fails, try fallback to any video
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch {
        setError(t.imageUploader.cameraError);
      }
    }
  }, [stopStream, t]);

  useEffect(() => {
    if (isOpen && !capturedPhoto) {
      startStream(facingMode);
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [isOpen, facingMode, capturedPhoto, startStream, stopStream]);

  const handleSnap = () => {
    const video = videoRef.current;
    if (!video) return;

    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 300);

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // If front camera, mirror image
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPhoto(dataUrl);
      stopStream();
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startStream(facingMode);
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      setCapturedPhoto(null);
      onClose();
    }
  };

  const handleSwitchCamera = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{t.imageUploader.cameraTitle}</h3>
            <p className={styles.subtitle}>{t.imageUploader.cameraSubtitle}</p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={t.common.close}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.viewfinder}>
            {error ? (
              <div className={styles.errorState}>
                <AlertCircle size={32} />
                <p>{error}</p>
              </div>
            ) : capturedPhoto ? (
              <Image
                src={capturedPhoto}
                alt="Captured"
                width={500}
                height={375}
                className={styles.capturedImage}
                unoptimized
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={styles.video}
                  style={facingMode === 'user' ? { transform: 'scaleX(-1)' } : undefined}
                />
                <div className={styles.guideFrame} />
                {isFlashing && <div className={styles.flashEffect} />}
              </>
            )}
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        <div className={styles.footer}>
          {capturedPhoto ? (
            <>
              <Button variant="outline" onClick={handleRetake} leftIcon={<RefreshCw size={15} />}>
                {t.imageUploader.retakeBtn}
              </Button>
              <Button variant="primary" onClick={handleConfirm} leftIcon={<Check size={16} />}>
                {t.imageUploader.usePhotoBtn}
              </Button>
            </>
          ) : (
            <>
              <div className={styles.controlsLeft}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSwitchCamera}
                  leftIcon={<RotateCw size={14} />}
                  title={t.imageUploader.switchCameraBtn}
                >
                  {t.imageUploader.switchCameraBtn}
                </Button>
              </div>

              <div className={styles.controlsCenter}>
                <button
                  type="button"
                  className={styles.shutterBtn}
                  onClick={handleSnap}
                  disabled={!!error}
                  title={t.imageUploader.captureBtn}
                  aria-label={t.imageUploader.captureBtn}
                >
                  <Camera size={24} />
                </button>
              </div>

              <div className={styles.controlsRight}>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  {t.common.cancel}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
