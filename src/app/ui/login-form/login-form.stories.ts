import type { Meta, StoryObj } from '@storybook/angular';
import { LoginFormComponent } from './login-form.component';

const meta: Meta<LoginFormComponent> = {
  component: LoginFormComponent,
  title: 'Auth/Login Form',
  argTypes: {
    submit: { action: 'submit' },
  },
  args: {
    initialUsername: 'demo',
    initialPassword: 'demo',
    loading: false,
    error: null,
  },
};

export default meta;
export type Story = StoryObj<LoginFormComponent>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    error: 'Invalid credentials',
  },
};
