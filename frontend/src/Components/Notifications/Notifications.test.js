import { render, screen } from '@testing-library/react';
import Notifications from './Notifications';

test('check whole component render', ()=> {
  const { getByTestId } = render(<Notifications />);
  const element = getByTestId("testing");
  expect(element).toBeInTheDocument();
});

test('check dropdown render', ()=> {
  const { getByTestId } = render(<Notifications />);
  const element = getByTestId("dropdown");
  expect(element).toBeInTheDocument();
});
