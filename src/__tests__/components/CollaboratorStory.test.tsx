import React from 'react';
import { render } from '@testing-library/react';
import CollaboratorStory from '../../app/components/CollaboratorStory';

describe('CollaboratorStory Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<CollaboratorStory />);
    expect(container).toBeTruthy();
  });
  
  it('renders the main section with correct structure', () => {
    const { container } = render(<CollaboratorStory />);
    
    // Check if the main section is rendered
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    
    // Check if the grid layout is present
    const grid = section?.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    
    // Check if there's an image
    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    
    // Check if there's a button or link
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
  });
});
