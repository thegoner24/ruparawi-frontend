import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { act } from 'react';
jest.mock('../../app/api/products', () => ({
  fetchProducts: jest.fn(() => Promise.resolve([
    { id: 1, name: 'Product 1', price: 10000, primary_image_url: 'img1.jpg' },
    { id: 2, name: 'Product 2', price: 20000, primary_image_url: 'img2.jpg' },
    { id: 3, name: 'Product 3', price: 30000, primary_image_url: 'img3.jpg' },
    { id: 4, name: 'Product 4', price: 40000, primary_image_url: 'img4.jpg' }
  ]))
}));

import ProductContainer from '../../app/components/ProductContainer';

describe('ProductContainer Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<ProductContainer />);
    expect(container).toBeTruthy();
  });
  
  it('renders the main section with correct structure', async () => {
    let container: HTMLElement | undefined = undefined;
    await act(async () => {
      ({ container } = render(<ProductContainer />));
    });
    expect(container).toBeDefined();
    await waitFor(() => {
      const section = container!.querySelector('section');
      expect(section).toBeInTheDocument();
    });
    // Check if the grid layouts are present
    const grids = container!.querySelectorAll('.grid');
    expect(grids.length).toBeGreaterThanOrEqual(1);
    // Check if there are product images
    const images = container!.querySelectorAll('img');
    expect(images.length).toBeGreaterThan(0);
    // Check if there are product titles
    const productTitles = container!.querySelectorAll('.font-bold.text-lg');
    expect(productTitles.length).toBeGreaterThan(0);
    // Check if there are product prices
    const productPrices = container!.querySelectorAll('.text-gray-700.text-base');
    expect(productPrices.length).toBeGreaterThan(0);
  });
  
  it('renders the Shop Now and VIEW ALL PRODUCTS buttons', async () => {
    let container: HTMLElement | undefined = undefined;
    await act(async () => {
      ({ container } = render(<ProductContainer />));
    });
    expect(container).toBeDefined();
    await waitFor(() => {
      const links = container!.querySelectorAll('a');
      expect(links.length).toBeGreaterThan(0);
      // Check if at least one link has the Shop Now text
      const shopNowLink = Array.from(links).find(link => 
        (link as HTMLAnchorElement).textContent?.includes('Shop Now')
      );
      expect(shopNowLink).toBeInTheDocument();
      // Check if at least one link has the VIEW ALL PRODUCTS text
      const viewAllLink = Array.from(links).find(link => 
        (link as HTMLAnchorElement).textContent?.includes('VIEW ALL PRODUCTS')
      );
      expect(viewAllLink).toBeInTheDocument();
      expect((viewAllLink as HTMLAnchorElement).getAttribute('href')).toBe('/shop');
    });
  });
});
