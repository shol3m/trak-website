import { describe, it, expect } from 'vitest'
import { formatPhone, normalizePhone, isPhoneValid } from './phone-utils'

describe('formatPhone', () => {
  it('returns empty string for empty input', () => {
    expect(formatPhone('')).toBe('')
  })

  it('formats a number typed digit by digit starting with 7', () => {
    expect(formatPhone('7')).toBe('+7')
    expect(formatPhone('79')).toBe('+7 (9')
    expect(formatPhone('7999')).toBe('+7 (999')
    expect(formatPhone('79991')).toBe('+7 (999) 1')
    expect(formatPhone('7999123')).toBe('+7 (999) 123')
    expect(formatPhone('79991234')).toBe('+7 (999) 123-4')
    expect(formatPhone('799912345')).toBe('+7 (999) 123-45')
    expect(formatPhone('7999123456')).toBe('+7 (999) 123-45-6')
    expect(formatPhone('79991234567')).toBe('+7 (999) 123-45-67')
  })

  it('converts a leading 8 to 7 (Russian country code convention)', () => {
    expect(formatPhone('89991234567')).toBe('+7 (999) 123-45-67')
    expect(formatPhone('8')).toBe('+7')
  })

  it('truncates anything past 11 digits instead of overflowing', () => {
    expect(formatPhone('799912345678999')).toBe('+7 (999) 123-45-67')
  })

  it('strips non-digit characters, so re-formatting an already-formatted value is a no-op', () => {
    expect(formatPhone('+7 (999) 123-45-67')).toBe('+7 (999) 123-45-67')
  })
})

describe('normalizePhone', () => {
  it('converts a formatted number to E.164-ish +7XXXXXXXXXX', () => {
    expect(normalizePhone('+7 (999) 123-45-67')).toBe('+79991234567')
  })

  it('converts a leading 8 to +7', () => {
    expect(normalizePhone('89991234567')).toBe('+79991234567')
  })
})

describe('isPhoneValid', () => {
  it('accepts a fully-typed 11-digit number', () => {
    expect(isPhoneValid('+7 (999) 123-45-67')).toBe(true)
  })

  it('rejects anything shorter than 11 digits', () => {
    expect(isPhoneValid('')).toBe(false)
    expect(isPhoneValid('+7')).toBe(false)
    expect(isPhoneValid('+7 (999) 123-45-6')).toBe(false)
  })
})
