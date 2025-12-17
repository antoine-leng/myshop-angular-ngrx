import type { Meta, StoryObj } from '@storybook/angular';
import { CartItemComponent } from './cart-item.component';

const meta: Meta<CartItemComponent> = {
  component: CartItemComponent,
  title: 'Shop/Cart Item',
  argTypes: {
    quantityChange: { action: 'quantity changed' },
    remove: { action: 'item removed' },
  },
  args: {
    product: {
      id: 1,
      name: 'Stylo Bleu Premium',
      price: 2.5,
      created_at: '2025-01-10T10:00:00Z',
    },
    quantity: 2,
  },
};

export default meta;
export type Story = StoryObj<CartItemComponent>;

export const Default: Story = {};

export const SingleItem: Story = {
  args: {
    quantity: 1,
  },
};

export const MultipleItems: Story = {
  args: {
    quantity: 5,
  },
};

export const ExpensiveProduct: Story = {
  args: {
    product: {
      id: 2,
      name: 'Cahier Luxe A4',
      price: 15.99,
      created_at: '2025-02-01T09:30:00Z',
    },
    quantity: 3,
  },
};