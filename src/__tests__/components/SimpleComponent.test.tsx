import React from 'react';
import { render, screen } from '@testing-library/react';

// A simple component to test
const SimpleComponent = ({ title, description }: { title: string; description: string }) => (
  <div>
    <h1>{title}</h1>
    <p>{description}</p>
  </div>
);

describe('SimpleComponent', () => {
  it('renders the title and description correctly', () => {
    render(<SimpleComponent title="Test Title" description="Test Description" />);
    
    expect(screen.getByRole('heading')).toHaveTextContent('Test Title');
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});
