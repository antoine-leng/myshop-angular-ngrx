import type { Meta, StoryObj } from '@storybook/angular';
import { ProductCardComponent } from './product-card.component';

const meta: Meta<ProductCardComponent> = {
  component: ProductCardComponent,
  title: 'Shop/Product Card',
  args: {
    name: 'Stylo Bleu',
    price: 2.5,
    createdAt: '2025-01-10',
    avgRating: 4,
  },
};

export default meta;
export type Story = StoryObj<ProductCardComponent>;

export const Default: Story = {};
