import type { Meta, StoryObj } from '@storybook/angular';
import { ProductsListComponent } from './products-list.component';

const meta: Meta<ProductsListComponent> = {
  component: ProductsListComponent,
  title: 'Shop/Products List',
  args: {
    products: [
      {
        id: 1,
        name: 'Stylo Bleu',
        price: 2.5,
        created_at: '2025-01-10',
        avgRating: 4,
      },
      {
        id: 2,
        name: 'Carnet A5',
        price: 7.9,
        created_at: '2025-02-01',
        avgRating: 3.5,
      },
      {
        id: 3,
        name: 'Gomme',
        price: 1.2,
        created_at: '2025-02-10',
        avgRating: 4.5,
      },
    ],
  },
};

export default meta;
export type Story = StoryObj<ProductsListComponent>;

export const Default: Story = {};
