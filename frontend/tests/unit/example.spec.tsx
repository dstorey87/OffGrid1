import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * Example unit test for a React component
 */

// Mock component for testing
function ExampleButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} type="button">
      {children}
    </button>
  );
}

describe('ExampleButton Component', () => {
  it('renders button with text', () => {
    render(<ExampleButton onClick={() => {}}>Click Me</ExampleButton>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<ExampleButton onClick={handleClick}>Click Me</ExampleButton>);

    const button = screen.getByRole('button', { name: /click me/i });
    button.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders children correctly', () => {
    render(<ExampleButton onClick={() => {}}>Custom Text</ExampleButton>);

    expect(screen.getByText('Custom Text')).toBeInTheDocument();
  });
});
