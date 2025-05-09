import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { act } from 'react';
jest.mock('../../app/api/publicVendorProducts', () => ({
  fetchPublicVendorProducts: jest.fn(() => Promise.resolve([
    { id: 1, name: 'Vendor Product 1', price: 15000, images: [{ image_url: 'img1.jpg', is_primary: true }] },
    { id: 2, name: 'Vendor Product 2', price: 25000, images: [{ image_url: 'img2.jpg', is_primary: true }] },
    { id: 3, name: 'Vendor Product 3', price: 35000, images: [{ image_url: 'img3.jpg', is_primary: true }] },
    { id: 4, name: 'Vendor Product 4', price: 45000, images: [{ image_url: 'img4.jpg', is_primary: true }] }
  ]))
}));

import GalleryGrid from '../../app/components/GalleryGrid';

describe('GalleryGrid Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<GalleryGrid />);
    expect(container).toBeTruthy();
  });
  
  it('renders the main section with correct structure', async () => {
    let container: HTMLElement | undefined = undefined;
    await act(async () => {
      ({ container } = render(<GalleryGrid />));
    });
    expect(container).toBeDefined();
    await waitFor(() => {
      const section = container!.querySelector('section');
      expect(section).toBeInTheDocument();
      // Check if the grid layout is present
      const grid = container!.querySelector('.grid');
      expect(grid).toBeInTheDocument();
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
  });
  
  it('renders the Shop now and VIEW ALL PRODUCTS buttons', async () => {
    let container: HTMLElement | undefined = undefined;
    await act(async () => {
      ({ container } = render(<GalleryGrid />));
    });
    await waitFor(() => {
      expect(container).toBeDefined();
      const links = container!.querySelectorAll('a');
      expect(links.length).toBeGreaterThan(0);
      // Check if at least one link has the Shop now text
      const shopNowLink = Array.from(links).find(link => 
        (link as HTMLAnchorElement).textContent?.includes('Shop now')
      );
      expect(shopNowLink).toBeInTheDocument();
      // Check if at least one link has the VIEW ALL PRODUCTS text
      const viewAllLink = Array.from(links).find(link => 
        (link as HTMLAnchorElement).textContent?.includes('VIEW ALL PRODUCTS')
      );
      expect(viewAllLink).toBeInTheDocument();
      // Check if at least one link has the VIEW ALL PRODUCTS href
      expect((viewAllLink as HTMLAnchorElement).getAttribute('href')).toBe('/vendor-products');
    });
  });
});
