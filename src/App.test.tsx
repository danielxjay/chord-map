import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('guides the user from root selection into chord variations and back again', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByRole('heading', { name: 'Pick a root note' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Map chords across guitar and piano' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'G' }));

    expect(screen.getByRole('heading', { name: /choose a variation/i })).toBeInTheDocument();
    expect(screen.getAllByText('G').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /^Gmaj\b/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Gmaj' })).toBeInTheDocument();
    expect(screen.getAllByText('G • B • D').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /^Gmin\b/i }));

    expect(screen.getByRole('heading', { level: 2, name: /^Gmin\b/i })).toBeInTheDocument();
    expect(screen.getAllByText('G • Bb • D').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /change note/i }));

    expect(screen.getByRole('heading', { name: /pick a root note/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Gmin' })).toBeInTheDocument();
  });

  it('lets the user browse multiple guitar voicings for the selected chord', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: 'C' }));

    expect(screen.getByText('Open chord')).toBeInTheDocument();
    expect(screen.getByText('Voicing 1 of 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next guitar voicing/i }));

    expect(screen.getByText('Barre shape')).toBeInTheDocument();
    expect(screen.getByText('Voicing 2 of 3')).toBeInTheDocument();
  });

  it('resets to voicing 1 when the chord type changes', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: 'C' }));

    await user.click(screen.getByRole('button', { name: /next guitar voicing/i }));
    expect(screen.getByText('Voicing 2 of 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^Cmin\b/i }));

    // Switching chord type should snap back to the first voicing (the useEffect fires after render)
    expect(await screen.findByText(/Voicing 1 of/)).toBeInTheDocument();
  });

  it('keeps the selected root spelling consistent for split-note roots', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: 'C#' }));

    expect(screen.getByRole('button', { name: /^C#maj\b/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^C#min\b/i }));

    expect(screen.getByRole('heading', { level: 2, name: /^C#min\b/i })).toBeInTheDocument();
    expect(screen.getByText('(Dbmin)')).toBeInTheDocument();
    expect(screen.getByText('C-sharp minor (D-flat minor)')).toBeInTheDocument();
    expect(screen.getAllByText('C# • E • G#').length).toBeGreaterThan(0);
  });
});
