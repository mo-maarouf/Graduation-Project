'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Portal from './Portal'

interface ConfirmationDialogProps {
  isOpen: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  isDangerous?: boolean
}

export default function ConfirmationDialog({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = false,
}: ConfirmationDialogProps) {
  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCancel}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Dialog */}
            <motion.div
              key="dialog"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm rounded-lg surface-card shadow-xl border border-theme"
            >
              <div className="flex items-center justify-between p-4 border-b border-theme">
                <h2 className="text-base font-bold text-theme-primary">{title}</h2>
                <button
                  onClick={onCancel}
                  className="p-1 hover:bg-surface-section rounded-md transition-colors text-theme-secondary hover:text-theme-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm text-theme-secondary leading-relaxed">{message}</p>
              </div>

              <div className="flex gap-3 p-4 border-t border-theme bg-surface-section rounded-b-lg">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold surface-card text-theme-primary hover:bg-surface-section rounded-lg transition-colors border border-theme"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors ${
                    isDangerous
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  )
}
