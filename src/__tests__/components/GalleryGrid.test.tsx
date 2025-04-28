import React from 'react';
import { render } from '@testing-library/react';
import GalleryGrid from '../../app/components/GalleryGrid';

describe('GalleryGrid Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<GalleryGrid />);
    expect(container).toBeTruthy();
  });
  
  it('renders the main section with correct structure', () => {
    const { container } = render(<GalleryGrid />);
    
    // Check if the main section is rendered
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    
    // Check if the grid layout is present
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    
    // Check if there are product images
    const images = container.querySelectorAll('img');
    expect(images.length).toBeGreaterThan(0);
    
    // Check if there are product titles
    const productTitles = container.querySelectorAll('.font-bold.text-lg');
    expect(productTitles.length).toBeGreaterThan(0);
    
    // Check if there are product prices
    const productPrices = container.querySelectorAll('.text-gray-700.text-base');
    expect(productPrices.length).toBeGreaterThan(0);
  });
  
  it('renders the Shop now and VIEW ALL PRODUCTS buttons', () => {
    const { container } = render(<GalleryGrid />);
    
    // Find links/buttons
    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
    
    // Check if at least one link has the Shop now text
    const shopNowLink = Array.from(links).find(link => 
      link.textContent?.includes('Shop now')
    );
    expect(shopNowLink).toBeInTheDocument();
    
    // Check if at least one link has the VIEW ALL PRODUCTS text
    const viewAllLink = Array.from(links).find(link => 
      link.textContent?.includes('VIEW ALL PRODUCTS')
    );
    expect(viewAllLink).toBeInTheDocument();
  });
});
