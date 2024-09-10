import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from './page';
import axios from 'axios';

jest.mock('axios');

describe('Page Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: [
        { id: 1, item_name: 'Coffee', purchased: false },
        { id: 2, item_name: 'Beans', purchased: true },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the initial items from server', async () => {
    render(<Page />);

    const items = await waitFor(() => screen.getAllByRole('listitem'));
    expect(items).toHaveLength(2);
    expect(screen.getByText('Coffee')).toBeInTheDocument();
    expect(screen.getByText('Beans')).toBeInTheDocument();
  });

  it('adds a new item', async () => {
    render(<Page />);

    axios.post.mockResolvedValue({
      data: { id: 3, item_name: 'Butter', purchased: false },
    });

    const input = screen.getByPlaceholderText('Apples');
    const addButton = screen.getByRole('button', { name: '+' });

    fireEvent.change(input, { target: { value: 'Butter' } });
    fireEvent.click(addButton);

    await waitFor(() => expect(screen.getByText('Butter')).toBeInTheDocument());
  });

  it('toggles purchased items status ', async () => {
    render(<Page />);

    axios.put.mockResolvedValue({
      data: { purchased: true },
    });

    const items = await waitFor(() => screen.getAllByRole('listitem'));

    const toggleCheckbox = items[0].querySelector('input[type="checkbox"]');

    fireEvent.click(toggleCheckbox);

    await waitFor(() => expect(toggleCheckbox).toBeChecked());
  });

  it('deletes an item', async () => {
    render(<Page />);

    axios.delete.mockResolvedValue({});

    const items = await waitFor(() => screen.getAllByRole('listitem'));
    const deleteButton = items[0].querySelector('button');

    fireEvent.click(deleteButton);

    await waitFor(() => expect(screen.queryByText('Coffee')).not.toBeInTheDocument());
  });

  it('edits an item', async () => {
    render(<Page />);

    axios.put.mockResolvedValue({
      data: { item_name: 'Instant Coffee' },
    });

    const items = await waitFor(() => screen.getAllByRole('listitem'));
    const itemText = screen.getByText('Coffee');

    fireEvent.click(itemText);

    const input = screen.getByDisplayValue('Coffee');
    fireEvent.change(input, { target: { value: 'Instant Coffee' } });

    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => expect(screen.getByText('Instant Coffee')).toBeInTheDocument());
  });
});
