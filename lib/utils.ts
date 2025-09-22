import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function generateBillNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  return `BILL-${year}${month}${day}-${random}`
}

export function calculateGST(amount: number, cgstRate: number, sgstRate: number, igstRate?: number): {
  cgst: number
  sgst: number
  igst: number
  totalTax: number
} {
  if (igstRate && igstRate > 0) {
    const igst = (amount * igstRate) / 100
    return {
      cgst: 0,
      sgst: 0,
      igst: Math.round(igst * 100) / 100,
      totalTax: Math.round(igst * 100) / 100
    }
  } else {
    const cgst = (amount * cgstRate) / 100
    const sgst = (amount * sgstRate) / 100
    const totalTax = cgst + sgst
    
    return {
      cgst: Math.round(cgst * 100) / 100,
      sgst: Math.round(sgst * 100) / 100,
      igst: 0,
      totalTax: Math.round(totalTax * 100) / 100
    }
  }
}

export function roundAmount(amount: number): number {
  return Math.round(amount * 100) / 100
}

export function validateGSTNumber(gstNumber: string): boolean {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  return gstRegex.test(gstNumber)
}

export function generateQRCode(text: string): string {
  // This would typically use a QR code library
  // For now, returning a placeholder
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
