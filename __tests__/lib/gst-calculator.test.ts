import { calculateGST, calculateBillAmount } from '@/lib/gst-calculator'

describe('GST Calculator', () => {
  describe('calculateGST', () => {
    it('should calculate CGST and SGST for same state', () => {
      const result = calculateGST(1000, 9, 'same-state')
      
      expect(result).toEqual({
        cgst: 45,
        sgst: 45,
        igst: 0,
        totalTax: 90,
      })
    })

    it('should calculate IGST for different state', () => {
      const result = calculateGST(1000, 9, 'different-state')
      
      expect(result).toEqual({
        cgst: 0,
        sgst: 0,
        igst: 90,
        totalTax: 90,
      })
    })

    it('should handle zero amount', () => {
      const result = calculateGST(0, 9, 'same-state')
      
      expect(result).toEqual({
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalTax: 0,
      })
    })

    it('should handle zero tax rate', () => {
      const result = calculateGST(1000, 0, 'same-state')
      
      expect(result).toEqual({
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalTax: 0,
      })
    })

    it('should handle decimal amounts', () => {
      const result = calculateGST(1234.56, 9, 'same-state')
      
      expect(result.cgst).toBeCloseTo(55.56, 2)
      expect(result.sgst).toBeCloseTo(55.56, 2)
      expect(result.totalTax).toBeCloseTo(111.11, 2)
    })
  })

  describe('calculateBillAmount', () => {
    it('should calculate complete bill with all components', () => {
      const orderItems = [
        { price: 100, quantity: 2, taxRate: 9 },
        { price: 200, quantity: 1, taxRate: 18 },
      ]
      
      const result = calculateBillAmount(orderItems, 'same-state', 5)
      
      expect(result.subtotal).toBe(400) // (100*2) + (200*1)
      expect(result.serviceCharge).toBe(20) // 5% of 400
      expect(result.cgst).toBeCloseTo(27, 2) // weighted average tax
      expect(result.sgst).toBeCloseTo(27, 2) // weighted average tax
      expect(result.igst).toBe(0)
      expect(result.totalTax).toBeCloseTo(54, 2)
      expect(result.finalAmount).toBeCloseTo(474, 2) // 400 + 20 + 54
    })

    it('should calculate bill with different state (IGST)', () => {
      const orderItems = [
        { price: 100, quantity: 1, taxRate: 18 },
      ]
      
      const result = calculateBillAmount(orderItems, 'different-state', 0)
      
      expect(result.subtotal).toBe(100)
      expect(result.serviceCharge).toBe(0)
      expect(result.cgst).toBe(0)
      expect(result.sgst).toBe(0)
      expect(result.igst).toBe(18) // 18% of 100
      expect(result.totalTax).toBe(18)
      expect(result.finalAmount).toBe(118)
    })

    it('should handle empty order items', () => {
      const result = calculateBillAmount([], 'same-state', 0)
      
      expect(result.subtotal).toBe(0)
      expect(result.serviceCharge).toBe(0)
      expect(result.cgst).toBe(0)
      expect(result.sgst).toBe(0)
      expect(result.igst).toBe(0)
      expect(result.totalTax).toBe(0)
      expect(result.finalAmount).toBe(0)
    })

    it('should apply discount correctly', () => {
      const orderItems = [
        { price: 100, quantity: 1, taxRate: 9 },
      ]
      
      const result = calculateBillAmount(orderItems, 'same-state', 0, 10)
      
      expect(result.subtotal).toBe(100)
      expect(result.discount).toBe(10)
      expect(result.taxableAmount).toBe(90) // 100 - 10
      expect(result.cgst).toBeCloseTo(4.05, 2) // 9% of 90
      expect(result.sgst).toBeCloseTo(4.05, 2) // 9% of 90
      expect(result.finalAmount).toBeCloseTo(98.1, 2) // 90 + 8.1
    })

    it('should handle mixed tax rates', () => {
      const orderItems = [
        { price: 100, quantity: 1, taxRate: 5 },
        { price: 100, quantity: 1, taxRate: 18 },
      ]
      
      const result = calculateBillAmount(orderItems, 'same-state', 0)
      
      expect(result.subtotal).toBe(200)
      // Weighted average tax calculation
      expect(result.cgst).toBeCloseTo(11.5, 2) // (5% of 100 + 18% of 100) / 2
      expect(result.sgst).toBeCloseTo(11.5, 2)
      expect(result.totalTax).toBeCloseTo(23, 2)
    })
  })
})
