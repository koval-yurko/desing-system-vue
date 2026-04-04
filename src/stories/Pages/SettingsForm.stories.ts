import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import DsButton from '../../components/DsButton/DsButton.vue';
import DsInputText from '../../components/DsInputText/DsInputText.vue';
import DsLink from '../../components/DsLink/DsLink.vue';

const meta = {
  title: 'Pages/Settings Form',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { DsButton, DsInputText, DsLink },
    setup() {
      const fullName = ref('');
      const email = ref('');
      const company = ref('');
      const bio = ref('');
      return { fullName, email, company, bio };
    },
    template: `
      <div style="max-width: 480px; display: flex; flex-direction: column; gap: 20px;">
        <h2 style="margin: 0;">Account Settings</h2>
        <DsInputText v-model="fullName" label="Full name" :mandatory="true" />
        <DsInputText v-model="email" label="Email address" :mandatory="true" />
        <DsLink href="#">Change password</DsLink>
        <DsInputText v-model="company" label="Company" :optional="true" />
        <DsInputText v-model="bio" label="Bio" hint="Brief description for your profile" />
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <DsButton severity="outlined">Cancel</DsButton>
          <DsButton severity="primary">Save changes</DsButton>
        </div>
      </div>
    `,
  }),
};

export const WithErrors: Story = {
  render: () => ({
    components: { DsButton, DsInputText, DsLink },
    setup() {
      const fullName = ref('');
      const email = ref('not-an-email');
      const company = ref('');
      const bio = ref('');
      return { fullName, email, company, bio };
    },
    template: `
      <div style="max-width: 480px; display: flex; flex-direction: column; gap: 20px;">
        <h2 style="margin: 0;">Account Settings</h2>
        <DsInputText v-model="fullName" label="Full name" :mandatory="true" error="Full name is required" />
        <DsInputText v-model="email" label="Email address" :mandatory="true" error="Please enter a valid email" />
        <DsLink href="#">Change password</DsLink>
        <DsInputText v-model="company" label="Company" :optional="true" />
        <DsInputText v-model="bio" label="Bio" hint="Brief description for your profile" />
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <DsButton severity="outlined">Cancel</DsButton>
          <DsButton severity="primary">Save changes</DsButton>
        </div>
      </div>
    `,
  }),
};

export const Filled: Story = {
  render: () => ({
    components: { DsButton, DsInputText, DsLink },
    setup() {
      const fullName = ref('Yurii Kovalchuk');
      const email = ref('yurii@example.com');
      const company = ref('Acme Corp');
      const bio = ref('Frontend developer passionate about design systems');
      return { fullName, email, company, bio };
    },
    template: `
      <div style="max-width: 480px; display: flex; flex-direction: column; gap: 20px;">
        <h2 style="margin: 0;">Account Settings</h2>
        <DsInputText v-model="fullName" label="Full name" :mandatory="true" />
        <DsInputText v-model="email" label="Email address" :mandatory="true" />
        <DsLink href="#">Change password</DsLink>
        <DsInputText v-model="company" label="Company" :optional="true" />
        <DsInputText v-model="bio" label="Bio" hint="Brief description for your profile" />
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <DsButton severity="outlined">Cancel</DsButton>
          <DsButton severity="primary">Save changes</DsButton>
        </div>
      </div>
    `,
  }),
};
