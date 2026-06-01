'use client'

import { useEffect, useState } from 'react'
import ConfirmationDialog from './ConfirmationDialog'
import { setConfirmListener, ConfirmOptions } from '@/src/lib/utils/confirm'

export default function GlobalConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({ message: '' })
  const [resolveCallback, setResolveCallback] = useState<((val: boolean) => void) | null>(null)

  useEffect(() => {
    setConfirmListener((opts, callback) => {
      setOptions(opts)
      setResolveCallback(() => callback)
      setIsOpen(true)
    })

    return () => {
      setConfirmListener(() => {})
    }
  }, [])

  const handleConfirm = () => {
    setIsOpen(false)
    if (resolveCallback) resolveCallback(true)
  }

  const handleCancel = () => {
    setIsOpen(false)
    if (resolveCallback) resolveCallback(false)
  }

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      title={options.title}
      message={options.message}
      confirmText={options.confirmText}
      cancelText={options.cancelText}
      isDangerous={options.isDangerous}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  )
}
