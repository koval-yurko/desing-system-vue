import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import DsButton from '../DsButton/DsButton.vue';
import DsInputText from '../DsInputText/DsInputText.vue';
import DsSelect from '../DsSelect/DsSelect.vue';
import DsTextarea from '../DsTextarea/DsTextarea.vue';
import DsModal from './DsModal.vue';

const meta = {
  title: 'Components/DsModal',
  component: DsModal,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    closable: { control: 'boolean' },
    dismissableMask: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
  },
  args: {
    title: 'Modal title',
    size: 'medium',
    closable: true,
    dismissableMask: true,
    closeOnEscape: true,
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { DsModal, DsButton },
    setup() {
      const visible = ref(true);
      return { args, visible };
    },
    template: `
      <div>
        <DsButton @click="visible = true">Open modal</DsButton>
        <DsModal v-bind="args" v-model:visible="visible">
          <p>Modal body content goes here.</p>
          <template #footer>
            <DsButton severity="outlined" @click="visible = false">Cancel</DsButton>
            <DsButton @click="visible = false">Confirm</DsButton>
          </template>
        </DsModal>
      </div>
    `,
  }),
};

export const WithDescription: Story = {
  args: {
    title: 'Confirm action',
    description: 'This change cannot be undone after you proceed.',
  },
  render: (args) => ({
    components: { DsModal, DsButton },
    setup() {
      const visible = ref(true);
      return { args, visible };
    },
    template: `
      <div>
        <DsButton @click="visible = true">Open modal</DsButton>
        <DsModal v-bind="args" v-model:visible="visible">
          <p>Body content for the dialog.</p>
          <template #footer>
            <DsButton severity="outlined" @click="visible = false">Cancel</DsButton>
            <DsButton severity="negative" @click="visible = false">Delete</DsButton>
          </template>
        </DsModal>
      </div>
    `,
  }),
};

export const Small: Story = {
  args: { size: 'small', title: 'Small modal' },
  render: (args) => ({
    components: { DsModal, DsButton },
    setup() {
      const visible = ref(true);
      return { args, visible };
    },
    template: `
      <div>
        <DsButton @click="visible = true">Open small</DsButton>
        <DsModal v-bind="args" v-model:visible="visible">
          <p>Compact dialog for short prompts.</p>
          <template #footer>
            <DsButton severity="outlined" @click="visible = false">Cancel</DsButton>
            <DsButton @click="visible = false">OK</DsButton>
          </template>
        </DsModal>
      </div>
    `,
  }),
};

export const Medium: Story = {
  args: { size: 'medium', title: 'Medium modal' },
  render: (args) => ({
    components: { DsModal, DsButton },
    setup() {
      const visible = ref(true);
      return { args, visible };
    },
    template: `
      <div>
        <DsButton @click="visible = true">Open medium</DsButton>
        <DsModal v-bind="args" v-model:visible="visible">
          <p>Standard 500px dialog. Use for most forms and confirmations.</p>
          <template #footer>
            <DsButton severity="outlined" @click="visible = false">Cancel</DsButton>
            <DsButton @click="visible = false">OK</DsButton>
          </template>
        </DsModal>
      </div>
    `,
  }),
};

export const Large: Story = {
  args: { size: 'large', title: 'Large modal' },
  render: (args) => ({
    components: { DsModal, DsButton },
    setup() {
      const visible = ref(true);
      return { args, visible };
    },
    template: `
      <div>
        <DsButton @click="visible = true">Open large</DsButton>
        <DsModal v-bind="args" v-model:visible="visible">
          <p>Wider 600px dialog for richer content.</p>
          <template #footer>
            <DsButton severity="outlined" @click="visible = false">Cancel</DsButton>
            <DsButton @click="visible = false">OK</DsButton>
          </template>
        </DsModal>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Design examples — User & Group modals from Figma
// ---------------------------------------------------------------------------

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' },
];

const userOptions = [
  { label: 'Emma Miller', value: 'emma' },
  { label: 'John Smith', value: 'john' },
  { label: 'Sara Lee', value: 'sara' },
];

/**
 * Add user — empty state form (Figma node 2791:48423).
 * Primary action is disabled until required fields are filled.
 */
export const AddUserExample: Story = {
  name: 'Example / Add user',
  parameters: {
    docs: {
      description: {
        story:
          'Composition of DsModal with DsInputText + DsSelect + DsButton, matching the "Add user" Figma design.',
      },
    },
  },
  render: () => ({
    components: { DsModal, DsButton, DsInputText, DsSelect },
    setup() {
      const visible = ref(true);
      const name = ref('');
      const email = ref('');
      const password = ref('');
      const roles = ref<string[]>([]);
      return { visible, name, email, password, roles, roleOptions };
    },
    template: `
      <div>
        <DsButton @click="visible = true">Open Add user</DsButton>
        <DsModal title="Add user" v-model:visible="visible" size="medium">
          <div style="display: flex; flex-direction: column; gap: 24px;">
            <DsInputText v-model="name" label="Name" mandatory placeholder="Enter your name" />
            <DsInputText v-model="email" label="Email" mandatory placeholder="Enter your email" />
            <DsInputText v-model="password" label="Password" mandatory type="password" placeholder="Enter your password" show-dropdown-icon />
            <DsSelect v-model="roles" label="Roles" :options="roleOptions" option-label="label" option-value="value" multiple placeholder="Select roles" />
          </div>
          <template #footer>
            <DsButton severity="outlined" @click="visible = false">Cancel</DsButton>
            <DsButton :disabled="!name || !email || !password || roles.length === 0" @click="visible = false">Add User</DsButton>
          </template>
        </DsModal>
      </div>
    `,
  }),
};

/**
 * Edit user — pre-filled form (Figma node 2791:52035).
 * Primary action uses purple severity and is enabled because all fields have values.
 */
export const EditUserExample: Story = {
  name: 'Example / Edit user',
  parameters: {
    docs: {
      description: {
        story:
          'Composition matching the "Edit user" Figma design — pre-filled fields and active "Save" button.',
      },
    },
  },
  render: () => ({
    components: { DsModal, DsButton, DsInputText, DsSelect },
    setup() {
      const visible = ref(true);
      const name = ref('Emma miller');
      const email = ref('Emmamiller@gmail.com');
      const password = ref('password');
      const roles = ref<string[]>(['admin']);
      return { visible, name, email, password, roles, roleOptions };
    },
    template: `
      <div>
        <DsButton @click="visible = true">Open Edit user</DsButton>
        <DsModal title="Edit user" v-model:visible="visible" size="medium">
          <div style="display: flex; flex-direction: column; gap: 24px;">
            <DsInputText v-model="name" label="Name" mandatory />
            <DsInputText v-model="email" label="Email" mandatory />
            <DsInputText v-model="password" label="Password" mandatory type="password" />
            <DsSelect v-model="roles" label="Roles" :options="roleOptions" option-label="label" option-value="value" multiple />
          </div>
          <template #footer>
            <DsButton severity="outlined" @click="visible = false">Cancel</DsButton>
            <DsButton @click="visible = false">Save</DsButton>
          </template>
        </DsModal>
      </div>
    `,
  }),
};

/**
 * Create group — empty state form (Figma node 2884:12938).
 * Description textarea exposes a 0/100 character counter.
 */
export const CreateGroupExample: Story = {
  name: 'Example / Create group',
  parameters: {
    docs: {
      description: {
        story:
          'Composition matching the "Create group" Figma design — empty form with character-counted description.',
      },
    },
  },
  render: () => ({
    components: { DsModal, DsButton, DsInputText, DsTextarea, DsSelect },
    setup() {
      const visible = ref(true);
      const name = ref('');
      const description = ref('');
      const users = ref<string[]>([]);
      return { visible, name, description, users, userOptions };
    },
    template: `
      <div>
        <DsButton @click="visible = true">Open Create group</DsButton>
        <DsModal
          title="Create group"
          description="Fill the users details below"
          v-model:visible="visible"
          size="medium"
        >
          <div style="display: flex; flex-direction: column; gap: 24px;">
            <DsInputText v-model="name" label="Name" mandatory placeholder="Enter your name" />
            <DsTextarea v-model="description" label="Description" mandatory placeholder="Write your reason..." :max-length="100" :rows="3" />
            <DsSelect v-model="users" label="Users" :options="userOptions" option-label="label" option-value="value" multiple placeholder="Enter your name" />
          </div>
          <template #footer>
            <DsButton severity="outlined" @click="visible = false">Cancel</DsButton>
            <DsButton :disabled="!name || !description || users.length === 0" @click="visible = false">Create group</DsButton>
          </template>
        </DsModal>
      </div>
    `,
  }),
};

/**
 * Edit group — pre-filled form (Figma node 2884:12946).
 * Description shows the live counter at 80/100.
 */
export const EditGroupExample: Story = {
  name: 'Example / Edit group',
  parameters: {
    docs: {
      description: {
        story:
          'Composition matching the "Edit group" Figma design — pre-filled name, description (80/100), and selected user.',
      },
    },
  },
  render: () => ({
    components: { DsModal, DsButton, DsInputText, DsTextarea, DsSelect },
    setup() {
      const visible = ref(true);
      const name = ref('Sales');
      const description = ref(
        'Administrators with full system access, responsible for managing user accounts, permissions, configurations, and overall platform settings.',
      );
      const users = ref<string[]>(['emma']);
      return { visible, name, description, users, userOptions };
    },
    template: `
      <div>
        <DsButton @click="visible = true">Open Edit group</DsButton>
        <DsModal
          title="Edit group"
          description="Fill the users details below"
          v-model:visible="visible"
          size="medium"
        >
          <div style="display: flex; flex-direction: column; gap: 24px;">
            <DsInputText v-model="name" label="Name" mandatory />
            <DsTextarea v-model="description" label="Description" mandatory :max-length="100" :rows="3" />
            <DsSelect v-model="users" label="Users" :options="userOptions" option-label="label" option-value="value" multiple />
          </div>
          <template #footer>
            <DsButton severity="outlined" @click="visible = false">Cancel</DsButton>
            <DsButton @click="visible = false">Save</DsButton>
          </template>
        </DsModal>
      </div>
    `,
  }),
};
