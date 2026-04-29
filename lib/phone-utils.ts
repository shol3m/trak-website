export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  let d = digits
  if (d.startsWith('8')) d = '7' + d.slice(1)
  if (d.startsWith('7')) d = d.slice(0, 11)
  else d = d.slice(0, 11)

  if (d.length === 0) return ''
  let result = '+7'
  if (d.length <= 1) return result
  result += ' (' + d.slice(1, 4)
  if (d.length <= 4) return result
  result += ') ' + d.slice(4, 7)
  if (d.length <= 7) return result
  result += '-' + d.slice(7, 9)
  if (d.length <= 9) return result
  result += '-' + d.slice(9, 11)
  return result
}

export function normalizePhone(formatted: string): string {
  const digits = formatted.replace(/\D/g, '')
  if (digits.startsWith('8')) return '+7' + digits.slice(1)
  if (digits.startsWith('7')) return '+' + digits
  return '+' + digits
}

export function isPhoneValid(formatted: string): boolean {
  return formatted.replace(/\D/g, '').length === 11
}
