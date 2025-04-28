import React from 'react';
import { render } from '@testing-library/react';
import Footer from '../../app/components/Footer';

describe('Footer Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Footer />);
    expect(container).toBeTruthy();
  });
  
  it('renders the footer with correct structure', () => {
    const { container } = render(<Footer />);
    
    // Check if the footer is rendered
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
    
    // Check if the brand name is rendered
    const brandName = container.querySelector('.font-serif.font-bold');
    expect(brandName).toBeInTheDocument();
    expect(brandName?.textContent).toBe('Rupa Rawi');
    
    // Check if the tagline is rendered
    const tagline = container.querySelector('.mb-4.text-gray-600');
    expect(tagline).toBeInTheDocument();
    expect(tagline?.textContent).toBe('Wujud yang membawa cerita');
  });
  
  it('renders navigation links and social media icons', () => {
    const { container } = render(<Footer />);
    
    // Check if there are navigation links
    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(5); // At least 5 links (nav + social)
    
    // Check if there are social media icons (SVGs)
    const socialIcons = container.querySelectorAll('svg');
    expect(socialIcons.length).toBeGreaterThanOrEqual(3); // At least 3 social icons
  });
  
  it('renders the copyright notice with current year', () => {
    const { container } = render(<Footer />);
    
    // Check if the copyright section exists
    const copyrightSection = container.querySelector('.text-sm.text-gray-400');
    expect(copyrightSection).toBeInTheDocument();
    
    // Check if the current year is in the copyright text
    const currentYear = new Date().getFullYear().toString();
    expect(copyrightSection?.textContent).toContain(currentYear);
    expect(copyrightSection?.textContent).toContain('Rupa Rawi');
    expect(copyrightSection?.textContent).toContain('All rights reserved');
  });
});
