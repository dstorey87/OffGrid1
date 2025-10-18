import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('renders calculator links', () => {
    render(<Home />);
    const rainwaterLink = screen.getByText(/Rainwater Calculator/i);
    expect(rainwaterLink).toBeInTheDocument();
  });
});
