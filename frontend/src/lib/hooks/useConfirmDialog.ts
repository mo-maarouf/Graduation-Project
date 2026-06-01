'use client'

import { useState } from 'react'

export interface ConfirmDialogConfig {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
}

export function useConfirmDialog() {
  const [config, setConfig] = useState<ConfirmDialogConfig | null>(null)
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null)

  const confirm = (options: ConfirmDialogConfig | string): Promise<boolean> => {
    return new Promise((resolve) => {
      const dialogConfig: ConfirmDialogConfig =
        typeof options === 'string'
          ? { message: options }
          : options

      setConfig(dialogConfig)
      setResolvePromise(() => resolve)
    })
  }

  const handleConfirm = () => {
    if (resolvePromise) {
      resolvePromise(true)
    }
    setConfig(null)
    setResolvePromise(null)
  }

  const handleCancel = () => {
    if (resolvePromise) {
      resolvePromise(false)
    }
    setConfig(null)
    setResolvePromise(null)
  }

  return {
    config,
    isOpen: config !== null,
    confirm,
    handleConfirm,
    handleCancel,
  }
}
