import type { Meta, StoryObj } from '@storybook/angular';
import { CartSummaryComponent } from './cart-summary.component';

const meta: Meta<CartSummaryComponent> = {
  component: CartSummaryComponent,
  title: 'Shop/Cart Summary',
  argTypes: {
    checkout: { action: 'checkout clicked' },
  },
};

export default meta;
export type Story = StoryObj<CartSummaryComponent>;

export const Default: Story = {
  args: {
    summary: {
      itemsTotal: 45.80,
      discount: 0,
      shipping: 5.99,
      taxes: 10.36,
      grandTotal: 62.15,
    },
    loading: false,
    checkoutDisabled: false,
  },
};

export const WithDiscount: Story = {
  args: {
    summary: {
      itemsTotal: 120.50,
      discount: 12.05,
      shipping: 0,
      taxes: 21.69,
      grandTotal: 130.14,
    },
    loading: false,
    checkoutDisabled: false,
  },
};

export const FreeShipping: Story = {
  args: {
    summary: {
      itemsTotal: 75.00,
      discount: 0,
      shipping: 0,
      taxes: 15.00,
      grandTotal: 90.00,
    },
    loading: false,
    checkoutDisabled: false,
  },
};

export const Loading: Story = {
  args: {
    summary: null,
    loading: true,
    checkoutDisabled: true,
  },
};

export const Empty: Story = {
  args: {
    summary: null,
    loading: false,
    checkoutDisabled: true,
  },
};

export const SimpleSummary: Story = {
  args: {
    summary: {
      itemsTotal: 29.99,
      grandTotal: 29.99,
    },
    loading: false,
    checkoutDisabled: false,
    checkoutLabel: 'Continuer',
  },
};