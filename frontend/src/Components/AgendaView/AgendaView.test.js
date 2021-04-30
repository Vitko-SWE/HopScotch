import { render, screen } from '@testing-library/react';
import AgendaView from './AgendaView';

test('check whole component render', ()=> {
  const { getByTestId } = render(<AgendaView />);
  const element = getByTestId("testing");
  expect(element).toBeInTheDocument();
});

test('check calendar render', ()=> {
  const { getByTestId } = render(<AgendaView />);
  const element = getByTestId("calendar");
  expect(element).toBeInTheDocument();
});

test('check agenda render', ()=> {
  const { getByTestId } = render(<AgendaView />);
  const element = getByTestId("agenda");
  expect(element).toBeInTheDocument();
});
