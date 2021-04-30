import { render, screen } from '@testing-library/react';
import Root from './Root';

test('smoke test', () => {
  const { baseElement } = render(<Root />);
  expect(baseElement).toBeInTheDocument();
});