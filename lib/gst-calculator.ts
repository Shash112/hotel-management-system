export interface GSTResult {
  cgst: number
  sgst: number
  igst: number
  totalTax: number
}

export interface BillResult {
  subtotal: number
  discount: number
  taxableAmount: number
  cgst: number
  sgst: number
  igst: number
  totalTax: number
  serviceCharge: number
  finalAmount: number
}

export function calculateGST(amount: number, taxRate: number, stateType: 'same-state' | 'different-state'): GSTResult {
  if (amount === 0 || taxRate === 0) {
    return {
      cgst: 0,
      sgst: 0,
      igst: 0,
      totalTax: 0,
    }
  }

  const taxAmount = (amount * taxRate) / 100

  if (stateType === 'same-state') {
    const halfTax = taxAmount / 2
    return {
      cgst: Math.round(halfTax * 100) / 100,
      sgst: Math.round(halfTax * 100) / 100,
      igst: 0,
      totalTax: Math.round(taxAmount * 100) / 100,
    }
  } else {
    return {
      cgst: 0,
      sgst: 0,
      igst: Math.round(taxAmount * 100) / 100,
      totalTax: Math.round(taxAmount * 100) / 100,
    }
  }
}

export function calculateBillAmount(
  orderItems: Array<{ price: number; quantity: number; taxRate: number }>,
  stateType: 'same-state' | 'different-state',
  serviceChargeRate: number = 0,
  discount: number = 0
): BillResult {
  // Calculate subtotal
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Apply discount
  const taxableAmount = Math.max(0, subtotal - discount)

  // Calculate service charge on taxable amount
  const serviceCharge = (taxableAmount * serviceChargeRate) / 100

  // Calculate weighted average tax rate
  const totalTaxableAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const weightedTaxRate = totalTaxableAmount > 0 
    ? orderItems.reduce((sum, item) => sum + (item.price * item.quantity * item.taxRate), 0) / totalTaxableAmount
    : 0

  // Calculate taxes
  const taxResult = calculateGST(taxableAmount, weightedTaxRate, stateType)

  // Calculate final amount
  const finalAmount = taxableAmount + serviceCharge + taxResult.totalTax

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    taxableAmount: Math.round(taxableAmount * 100) / 100,
    cgst: taxResult.cgst,
    sgst: taxResult.sgst,
    igst: taxResult.igst,
    totalTax: taxResult.totalTax,
    serviceCharge: Math.round(serviceCharge * 100) / 100,
    finalAmount: Math.round(finalAmount * 100) / 100,
  }
}