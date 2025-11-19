import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InputScreen from './InputScreen';

describe('InputScreen', () => {
    it('renders correctly with default values', () => {
        render(<InputScreen onStart={() => { }} />);
        expect(screen.getByText('Word Master')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your name...')).toHaveValue('Cheolsu');
        expect(screen.getAllByPlaceholderText(/Magic Word/)).toHaveLength(3);
    });

    it('updates hero name input', () => {
        render(<InputScreen onStart={() => { }} />);
        const input = screen.getByPlaceholderText('Enter your name...');
        fireEvent.change(input, { target: { value: 'Hero' } });
        expect(input).toHaveValue('Hero');
    });

    it('shows error when submitting with empty words', () => {
        render(<InputScreen onStart={() => { }} />);
        const button = screen.getByText('Start Adventure');
        fireEvent.click(button);
        expect(screen.getByText('Please enter all 3 magic words!')).toBeInTheDocument();
    });

    it('calls onStart with correct data when valid', () => {
        const mockOnStart = vi.fn();
        render(<InputScreen onStart={mockOnStart} />);

        // Fill inputs
        const nameInput = screen.getByPlaceholderText('Enter your name...');
        fireEvent.change(nameInput, { target: { value: 'Test Hero' } });

        const wordInputs = screen.getAllByPlaceholderText(/Magic Word/);
        fireEvent.change(wordInputs[0], { target: { value: 'Word1' } });
        fireEvent.change(wordInputs[1], { target: { value: 'Word2' } });
        fireEvent.change(wordInputs[2], { target: { value: 'Word3' } });

        // Click Start
        fireEvent.click(screen.getByText('Start Adventure'));

        expect(mockOnStart).toHaveBeenCalledWith({
            heroName: 'Test Hero',
            targetWords: ['Word1', 'Word2', 'Word3'],
            genre: 'fantasy' // Default
        });
    });
});
