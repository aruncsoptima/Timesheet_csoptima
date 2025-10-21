import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Home from '../pages/Home'

describe('Home', () => {
    it('renders welcome text', () => {
        const { getByText } = render(<Home />)
        expect(getByText(/Welcome to Timesheet/i)).toBeTruthy()
    })
})
