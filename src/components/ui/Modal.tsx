'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useAudioSFX } from './AudioSFXProvider';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-4xl',
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { playClose } = useAudioSFX();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (dialog.open) {
        dialog.close();
        document.body.style.overflow = 'unset';
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    playClose();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;

    if (!isInDialog) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={handleClose}
      className={`backdrop:bg-black/80 backdrop:backdrop-blur-md bg-transparent p-0 m-auto w-full ${maxWidth} rounded-2xl border border-cyan-500/30 text-white shadow-2xl focus:outline-none z-50`}
    >
      <div className="bg-[#090e1f] border border-cyan-500/20 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <h2 className="text-base font-mono font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded bg-cyan-400 animate-pulse" />
            {title || 'INSPECT INTERFACE'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-rose-950/60 hover:border-rose-500/40 border border-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {children}
        </div>
      </div>
    </dialog>
  );
}
