import type { Meta, StoryObj } from '@storybook/angular';
import { WishlistButtonComponent } from './wishlist-button.component';
import { provideStore } from '@ngrx/store';
import { wishlistReducer } from '../../state/wishlist/wishlist.reducer';
import { provideEffects } from '@ngrx/effects';
import { WishlistEffects } from '../../state/wishlist/wishlist.effects';

const meta: Meta<WishlistButtonComponent> = {
  component: WishlistButtonComponent,
  title: 'Shop/Wishlist Button',
  decorators: [
    (storyFn: any) => ({
      ...storyFn(),
      providers: [
        provideStore({ wishlist: wishlistReducer }),
        provideEffects([WishlistEffects]),
      ],
    }),
  ],
  args: {
    productId: 1,
    productName: 'Stylo Bleu',
  },
};

export default meta;
export type Story = StoryObj<WishlistButtonComponent>;

export const NotInWishlist: Story = {};

export const InWishlist: Story = {
  args: {
    productId: 1,
    productName: 'Stylo Bleu',
  },
};