import type { Meta, StoryObj } from '@storybook/angular';
import { ReviewListComponent } from './review-list.component';

const meta: Meta<ReviewListComponent> = {
  component: ReviewListComponent,
  title: 'Shop/Review List',
  args: {
    reviews: [
      {
        id: '1',
        productId: 1,
        user: 'Alice Martin',
        rating: 5,
        comment: 'Excellent produit ! Très satisfaite de mon achat.',
        createdAt: '2025-01-20T10:00:00Z',
      },
      {
        id: '2',
        productId: 1,
        user: 'Bob Dupont',
        rating: 4,
        comment: 'Bon rapport qualité/prix. Je recommande.',
        createdAt: '2025-02-15T14:30:00Z',
      },
      {
        id: '3',
        productId: 1,
        user: 'Claire Bernard',
        rating: 3,
        comment: 'Produit correct mais rien d\'exceptionnel.',
        createdAt: '2025-03-01T09:00:00Z',
      },
    ],
  },
};

export default meta;
export type Story = StoryObj<ReviewListComponent>;

export const WithReviews: Story = {};

export const Empty: Story = {
  args: {
    reviews: [],
  },
};

export const SingleReview: Story = {
  args: {
    reviews: [
      {
        id: '1',
        productId: 1,
        user: 'Alice Martin',
        rating: 5,
        comment: 'Excellent produit ! Très satisfaite de mon achat.',
        createdAt: '2025-01-20T10:00:00Z',
      },
    ],
  },
};