import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders button with default variant', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary')
  })

  it('renders button with secondary variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    
    const button = screen.getByRole('button', { name: /secondary button/i })
    expect(button).toHaveClass('bg-secondary')
  })

  it('renders button with outline variant', () => {
    render(<Button variant="outline">Outline Button</Button>)
    
    const button = screen.getByRole('button', { name: /outline button/i })
    expect(button).toHaveClass('border')
  })

  it('renders button with ghost variant', () => {
    render(<Button variant="ghost">Ghost Button</Button>)
    
    const button = screen.getByRole('button', { name: /ghost button/i })
    expect(button).toHaveClass('hover:bg-accent')
  })

  it('renders disabled button', () => {
    render(<Button disabled>Disabled Button</Button>)
    
    const button = screen.getByRole('button', { name: /disabled button/i })
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:pointer-events-none')
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders button with custom size', () => {
    render(<Button size="lg">Large Button</Button>)
    
    const button = screen.getByRole('button', { name: /large button/i })
    expect(button).toHaveClass('h-11')
  })

  it('renders button with icon', () => {
    render(
      <Button>
        <span data-testid="icon">+</span>
        Add Item
      </Button>
    )
    
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('Add Item')).toBeInTheDocument()
  })
})
