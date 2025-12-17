import type { Meta, StoryObj } from '@storybook/angular';
import { PromoCodeInputComponent } from './promo-code-input.component';
import { fn } from 'storybook/test';

const meta: Meta<PromoCodeInputComponent> = {
  component: PromoCodeInputComponent,
  title: 'Shop/Promo Code Input',
  argTypes: {
    applyPromoCode: { action: 'promo code applied' },
  },
  args: {
    applyPromoCode: fn(),
  },
};

export default meta;
export type Story = StoryObj<PromoCodeInputComponent>;

export const Default: Story = {};

export const WithCode: Story = {
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    if (input) {
      input.value = 'WELCOME10';
      input.dispatchEvent(new Event('input'));
    }
  },
};