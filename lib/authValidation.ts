export const AUTH_LIMITS = {
  nameMax: 100,
  phoneMax: 20,
  emailMax: 150,
  passwordMin: 6,
  passwordMax: 72,
} as const

type LoginInput = {
  email?: string
  password?: string
}

type RegisterInput = LoginInput & {
  name?: string
  lastName?: string
  phone?: string
}

type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

export type LoginFieldErrors = Partial<Record<keyof LoginInput, string>>
export type RegisterFieldErrors = LoginFieldErrors & Partial<Record<'name' | 'lastName' | 'phone', string>>

export type ValidLoginInput = {
  email: string
  password: string
}

export type ValidRegisterInput = ValidLoginInput & {
  name: string
  lastName: string
  phone: string
}

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

function countDigits(value: string) {
  return value.replace(/\D/g, '').length
}

function validateName(value: string, label: string) {
  if (!value) return `${label} es requerido.`
  if (value.length > AUTH_LIMITS.nameMax) return `${label} no debe exceder ${AUTH_LIMITS.nameMax} caracteres.`
  if (value.length < 2) return `${label} debe tener al menos 2 caracteres.`
  if (/[0-9]/.test(value)) return `${label} no debe contener numeros.`
  return null
}

function validatePhone(phone: string) {
  if (!phone) return 'El telefono es requerido.'
  if (phone.length > AUTH_LIMITS.phoneMax) return `El telefono no debe exceder ${AUTH_LIMITS.phoneMax} caracteres.`
  if (!/^[+()0-9\s-]+$/.test(phone)) return 'El telefono solo puede incluir numeros, espacios, +, - y parentesis.'

  const digits = countDigits(phone)
  if (digits < 7 || digits > 15) return 'El telefono debe tener entre 7 y 15 digitos.'

  return null
}

function validateEmail(email: string) {
  if (!email) return 'El correo es requerido.'
  if (email.length > AUTH_LIMITS.emailMax) return `El correo no debe exceder ${AUTH_LIMITS.emailMax} caracteres.`
  if (!isValidEmail(email)) return 'Ingresa un correo valido.'
  return null
}

function validatePassword(password: string) {
  if (!password) return 'La contrasena es requerida.'
  if (password.length < AUTH_LIMITS.passwordMin) {
    return `La contrasena debe tener al menos ${AUTH_LIMITS.passwordMin} caracteres.`
  }
  if (password.length > AUTH_LIMITS.passwordMax) {
    return `La contrasena no debe exceder ${AUTH_LIMITS.passwordMax} caracteres.`
  }
  return null
}

export function validateLoginFields(input: LoginInput): LoginFieldErrors {
  const email = clean(input.email).toLowerCase()
  const password = clean(input.password)
  const errors: LoginFieldErrors = {}
  const emailError = validateEmail(email)
  const passwordError = validatePassword(password)

  if (emailError) errors.email = emailError
  if (passwordError) errors.password = passwordError

  return errors
}

export function validateRegisterFields(input: RegisterInput): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {
    ...validateLoginFields(input),
  }
  const name = clean(input.name)
  const lastName = clean(input.lastName)
  const phone = clean(input.phone)
  const nameError = validateName(name, 'El nombre')
  const lastNameError = validateName(lastName, 'El apellido')
  const phoneError = validatePhone(phone)

  if (nameError) errors.name = nameError
  if (lastNameError) errors.lastName = lastNameError
  if (phoneError) errors.phone = phoneError

  return errors
}

export function hasValidationErrors(errors: Record<string, string | undefined>) {
  return Object.values(errors).some(Boolean)
}

export function validateLoginInput(input: LoginInput): ValidationResult<ValidLoginInput> {
  const email = clean(input.email).toLowerCase()
  const password = clean(input.password)
  const errors = validateLoginFields(input)
  const firstError = Object.values(errors).find(Boolean)

  if (firstError) return { ok: false, error: firstError }

  return {
    ok: true,
    data: { email, password },
  }
}

export function validateRegisterInput(input: RegisterInput): ValidationResult<ValidRegisterInput> {
  const name = clean(input.name)
  const lastName = clean(input.lastName)
  const phone = clean(input.phone)
  const loginResult = validateLoginInput(input)
  const errors = validateRegisterFields(input)
  const firstError = Object.values(errors).find(Boolean)

  if (!loginResult.ok) return loginResult
  if (firstError) return { ok: false, error: firstError }

  return {
    ok: true,
    data: {
      ...loginResult.data,
      name,
      lastName,
      phone,
    },
  }
}
