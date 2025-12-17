import type { Meta, StoryObj } from '@storybook/angular';
import { ReviewFormComponent } from './review-form.component';
import { fn } from 'storybook/test';

const meta: Meta<ReviewFormComponent> = {
  component: ReviewFormComponent,
  title: 'Shop/Review Form',
  argTypes: {
    submitReview: { action: 'review submitted' },
  },
  args: {
    submitReview: fn(),
  },
};

export default meta;
export type Story = StoryObj<ReviewFormComponent>;

export const Default: Story = {};