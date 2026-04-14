import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('guides the user from root selection into chord variations and back again', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByRole('heading', { name: /pick a root note to begin/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pick a root note' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'G' }));

    expect(screen.getByRole('heading', { name: /choose a chord variation/i })).toBeInTheDocument();
    expect(screen.getByText('Root note: G')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Gmaj\b/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Gmaj' })).toBeInTheDocument();
    expect(screen.getAllByText('G • B • D').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /^Gmin\b/i }));

    expect(screen.getByRole('heading', { level: 2, name: 'Gmin' })).toBeInTheDocument();
    expect(screen.getAllByText('G • Bb • D').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /change note/i }));

    expect(screen.getByRole('heading', { name: /pick a root note/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Gmin' })).toBeInTheDocument();
  });
});
