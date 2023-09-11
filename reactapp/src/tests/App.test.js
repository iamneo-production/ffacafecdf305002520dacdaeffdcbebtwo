import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';


import { sum } from '../utils';
import { TransactionItem } from '../components/transaction-list/transaction-item/transaction-item';
import { TransactionList } from '../components/transaction-list/transaction-list';
import { Form } from '../components/form/Form';



const incomeList = [
  { id: 'a', type: 'income', description: 'Salary', value: 999 },
  { id: 'b', type: 'income', description: 'Lottery', value: 10000 },
];

describe('<List>', () => {
  it('renders_correctly', () => {
    render(<TransactionList list={incomeList} onDeleteClick={() => {}} />);

    expect(screen.getByText(/salary/i)).toBeInTheDocument();
    expect(screen.getByText(/lottery/i)).toBeInTheDocument();
  });
});

describe('sum', () => {
  it('correctly_sums_elements_of_array', () => {
    expect(sum([])).toBe(0);
    expect(sum(incomeList)).toBe(10999);
  });
});


describe('<TransactionItem>', () => {
  test('calls_onDeleteClick_with_transaction_id', () => {
    const onDeleteClick = jest.fn();
    render(
      <TransactionItem
        id="test-id"
        description="Apple"
        value={10}
        type="expense"
        onDeleteClick={onDeleteClick}
      />
    );

    userEvent.click(screen.getByRole('button'));

    expect(onDeleteClick).toBeCalledWith('test-id');
  });
});

//form
jest.mock('nanoid', () => ({
  nanoid: () => {
    let value = 0;
    return ++value;
  },
}));

describe('<Form>', () => {

  it('calls_the_onSubmit_function_with_the_form_values', () => {
    const onSubmit = jest.fn();

    render(<Form onSubmit={onSubmit} />);

    const typeInput = screen.getByRole('combobox');
    const descIpnut = screen.getByRole('textbox');
    const valueInput = screen.getByRole('spinbutton');
    const submitBtn = screen.getByRole('button');

    // form is initialized correctly
    expect(typeInput.value).toBe('income');
    expect(descIpnut.value).toBe('');
    expect(valueInput.value).toBe('');
    expect(submitBtn).toHaveAttribute('disabled');

    // user fills out the form and submits it
    fireEvent.change(typeInput, { target: { value: 'expense' } });
    fireEvent.change(descIpnut, { target: { value: 'Ticket to the Moon' } });
    fireEvent.change(valueInput, { target: { value: '9.99' } });
    fireEvent.click(submitBtn);

    // `onSubmit` should be called with the values from the form
    expect(onSubmit).toBeCalledWith({
      id: expect.any(Number),
      type: 'expense',
      description: 'Ticket to the Moon',
      value: 9.99,
    });

    // form should be reset after submitting
    expect(typeInput.value).toBe('expense');
    expect(descIpnut.value).toBe('');
    expect(valueInput.value).toBe('');
    expect(submitBtn).toHaveAttribute('disabled');

    // description input should have focus
    expect(descIpnut).toHaveFocus();
  });

  it(`doesn't_call_onSubmit_when_ref.current_is_null`, () => {
    jest.spyOn(React, 'useRef').mockReturnValue({
      get current() {
        return null;
      },
      set current(_) {},
    });
    const onSubmit = jest.fn();

    render(<Form onSubmit={onSubmit} />);

    fireEvent.submit(screen.getByTestId('form'));

    expect(onSubmit).toBeCalled();
  });
});

describe('Form Component', () => {
  it('initializes_form_correctly', () => {
    render(<Form onSubmit={jest.fn()} />);

    const typeInput = screen.getByRole('combobox');
    const descInput = screen.getByRole('textbox');
    const valueInput = screen.getByRole('spinbutton');
    const submitBtn = screen.getByRole('button');

    expect(typeInput.value).toBe('income');
    expect(descInput.value).toBe('');
    expect(valueInput.value).toBe('');
    expect(submitBtn).toHaveAttribute('disabled');
  });

  it('submits_the_form_with_valid_values', () => {
    const onSubmit = jest.fn();
    render(<Form onSubmit={onSubmit} />);

    const typeInput = screen.getByRole('combobox');
    const descInput = screen.getByRole('textbox');
    const valueInput = screen.getByRole('spinbutton');
    const submitBtn = screen.getByRole('button');

    fireEvent.change(typeInput, { target: { value: 'expense' } });
    fireEvent.change(descInput, { target: { value: 'Ticket to the Moon' } });
    fireEvent.change(valueInput, { target: { value: '9.99' } });
    fireEvent.click(submitBtn);

    expect(onSubmit).toBeCalledWith({
      id: expect.any(Number),
      type: 'expense',
      description: 'Ticket to the Moon',
      value: 9.99,
    });

    // Verify form reset
    expect(typeInput.value).toBe('expense');
    expect(descInput.value).toBe('');
    expect(valueInput.value).toBe('');
    expect(submitBtn).toHaveAttribute('disabled');
  });

});
