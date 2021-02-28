import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const appelem = render(<App />);
  expect(appelem.baseElement).toBeInTheDocument();
});
