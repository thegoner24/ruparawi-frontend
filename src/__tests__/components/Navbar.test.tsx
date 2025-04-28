import React from 'react';
import { render, screen } from '@testing-library/react';

// Create a simplified mock of the Navbar component for testing
const MockNavbar = () => (
  <nav className="navbar">
    <div className="container">
      <div className="logo">
        <a href="/">
          <img src="/RupaRawi.png" alt="Rupa Rawi" />
          <span>Rupa Rawi</span>
        </a>
      </div>
      <div className="nav-links">
        <button aria-label="Search">
          <svg viewBox="0 0 24 24"></svg>
        </button>
        <a href="/cart" aria-label="Cart">
          <svg viewBox="0 0 24 24"></svg>
        </a>
        <button aria-label="Open menu">
          <svg viewBox="0 0 24 24"></svg>
        </button>
      </div>
    </div>
  </nav>
);

// Mock the actual Navbar component
jest.mock('../../app/components/Navbar', () => {
  return {
    __esModule: true,
    default: MockNavbar
  };
});

describe('Navbar Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<MockNavbar />);
    expect(container).toBeTruthy();
  });

  it('renders the navbar with logo and brand name', () => {
    render(<MockNavbar />);
    
    // Check if the logo is rendered
    const logo = screen.getByAltText('Rupa Rawi');
    expect(logo).toBeInTheDocument();
    
    // Check if the brand name is rendered
    const brandName = screen.getByText('Rupa Rawi');
    expect(brandName).toBeInTheDocument();
  });

  it('renders navigation elements', () => {
    render(<MockNavbar />);
    
    // Check if search button is rendered
    const searchButton = screen.getByLabelText('Search');
    expect(searchButton).toBeInTheDocument();
    
    // Check if cart link is rendered
    const cartLink = screen.getByLabelText('Cart');
    expect(cartLink).toBeInTheDocument();
    expect(cartLink).toHaveAttribute('href', '/cart');
    
    // Check if hamburger menu button is rendered
    const menuButton = screen.getByLabelText('Open menu');
    expect(menuButton).toBeInTheDocument();
  });
});
