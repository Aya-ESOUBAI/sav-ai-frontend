import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

// Mock next/navigation router used by the app
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

// Mock authService
vi.mock('@/lib/auth-service', () => ({
  authService: {
    login: vi.fn(),
  },
}))

import LoginPage from '@/app/login/page'

describe('LoginPage', () => {
  beforeEach(() => {
    // reset location
    delete (window as any).location
    ;(window as any).location = { href: 'http://localhost/' }
  })

  it('renders login form fields', () => {
    render(<LoginPage />)

    expect(screen.getByText(/3LM SOLUTIONS/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/email@example.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/\u2022+/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Connexion/i })).toBeInTheDocument()
  })

  it('submits the form and redirects on success', async () => {
    const { authService } = await import('@/lib/auth-service')
    ;(authService.login as unknown as jest.Mock) = vi.fn().mockResolvedValue({ access_token: 'tok', user: { id: 'u1' } })

    render(<LoginPage />)

    const email = screen.getByPlaceholderText(/email@example.com/i)
    const password = screen.getByPlaceholderText(/•+/i)
    const role = screen.getByRole('combobox')
    const submit = screen.getByRole('button', { name: /Connexion/i })

    fireEvent.change(email, { target: { value: 'test@example.com' } })
    fireEvent.change(password, { target: { value: 'password123' } })
    fireEvent.change(role, { target: { value: 'CLIENT' } })

    fireEvent.click(submit)

    await waitFor(() => {
      expect(window.location.href).toContain('/dashboard')
    })
  })

  it('is responsive-friendly (renders on small viewport)', () => {
    // simulate mobile viewport
    global.innerWidth = 375
    global.innerHeight = 812
    render(<LoginPage />)

    expect(screen.getByText(/Plateforme IA SAV & Support Technique/i)).toBeInTheDocument()
  })
})
