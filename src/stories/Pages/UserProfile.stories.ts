import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import DsAvatar from '../../components/DsAvatar/DsAvatar.vue';
import DsBadge from '../../components/DsBadge/DsBadge.vue';
import DsChip from '../../components/DsChip/DsChip.vue';
import DsCodeInput from '../../components/DsCodeInput/DsCodeInput.vue';
import DsLink from '../../components/DsLink/DsLink.vue';
import DsSearchField from '../../components/DsSearchField/DsSearchField.vue';
import DsSelect from '../../components/DsSelect/DsSelect.vue';
import DsTextarea from '../../components/DsTextarea/DsTextarea.vue';

const meta = {
  title: 'Pages/User Profile',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const TIMEZONE_OPTIONS = [
  'UTC−08:00 — Pacific',
  'UTC−05:00 — Eastern',
  'UTC+00:00 — UTC',
  'UTC+01:00 — Central European',
  'UTC+02:00 — Eastern European',
  'UTC+05:30 — India',
  'UTC+09:00 — Japan',
];

export const Default: Story = {
  render: () => ({
    components: {
      DsAvatar,
      DsBadge,
      DsChip,
      DsCodeInput,
      DsLink,
      DsSearchField,
      DsSelect,
      DsTextarea,
    },
    setup() {
      const bio = ref(
        'Frontend developer focused on design systems, component libraries, and accessibility.',
      );
      const search = ref('');
      const timezone = ref('UTC+02:00 — Eastern European');
      const verifyCode = ref('');
      const skills = ref(['Vue 3', 'TypeScript', 'Tailwind', 'Storybook', 'PrimeVue']);

      const removeSkill = (skill: string) => {
        skills.value = skills.value.filter((s) => s !== skill);
      };

      return {
        bio,
        search,
        timezone,
        verifyCode,
        skills,
        timezoneOptions: TIMEZONE_OPTIONS,
        removeSkill,
      };
    },
    template: `
      <div style="max-width: 720px; padding: 24px; font-family: Inter, sans-serif; color: var(--p-gray-900);">
        <header style="display: flex; align-items: center; gap: 16px; margin-bottom: 32px;">
          <DsAvatar variant="initials-colored" color="purple" initials="YK" size="large" />
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 600;">Yurii Kovalchuk</h1>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 14px; color: var(--p-gray-600);">Senior Frontend Engineer</span>
              <DsBadge type="accepted">Active</DsBadge>
            </div>
          </div>
        </header>

        <section style="margin-bottom: 28px;">
          <h2 style="margin: 0 0 12px; font-size: 16px; font-weight: 600;">Skills</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <DsChip
              v-for="skill in skills"
              :key="skill"
              size="small"
              :removable="true"
              @remove="removeSkill(skill)"
            >
              {{ skill }}
            </DsChip>
          </div>
        </section>

        <section style="margin-bottom: 28px;">
          <DsTextarea
            v-model="bio"
            label="Bio"
            hint="Brief description shown on your public profile"
            :maxLength="200"
          />
        </section>

        <section style="margin-bottom: 28px;">
          <DsSelect
            v-model="timezone"
            :options="timezoneOptions"
            label="Time zone"
            hint="Used for scheduling and notifications"
            placeholder="Select your time zone"
          />
        </section>

        <section style="margin-bottom: 28px;">
          <h2 style="margin: 0 0 12px; font-size: 16px; font-weight: 600;">Find a teammate</h2>
          <DsSearchField
            v-model="search"
            placeholder="Search teammates by name or email"
            ariaLabel="Search teammates"
            :helpIcon="true"
          />
        </section>

        <section style="margin-bottom: 8px;">
          <p style="margin: 0 0 12px; font-size: 13px; color: var(--p-gray-600);">
            We sent a 6-digit code to your email address.
            <DsLink href="#">Resend</DsLink>
          </p>
          <DsCodeInput v-model="verifyCode" label="Verify your email" :length="6" />
        </section>
      </div>
    `,
  }),
};

export const Filled: Story = {
  render: () => ({
    components: {
      DsAvatar,
      DsBadge,
      DsChip,
      DsCodeInput,
      DsLink,
      DsSearchField,
      DsSelect,
      DsTextarea,
    },
    setup() {
      const bio = ref(
        'Lead frontend engineer building the desing-system-vue library and shipping accessible Vue 3 components.',
      );
      const search = ref('alice');
      const timezone = ref('UTC−05:00 — Eastern');
      const verifyCode = ref('482915');
      const skills = ref(['Vue 3', 'TypeScript', 'Accessibility', 'Design Systems']);

      const removeSkill = (skill: string) => {
        skills.value = skills.value.filter((s) => s !== skill);
      };

      return {
        bio,
        search,
        timezone,
        verifyCode,
        skills,
        timezoneOptions: TIMEZONE_OPTIONS,
        removeSkill,
      };
    },
    template: `
      <div style="max-width: 720px; padding: 24px; font-family: Inter, sans-serif; color: var(--p-gray-900);">
        <header style="display: flex; align-items: center; gap: 16px; margin-bottom: 32px;">
          <DsAvatar
            variant="initials-colored"
            color="green"
            initials="AM"
            alt="Alex Morgan"
            size="large"
          />
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 600;">Alex Morgan</h1>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 14px; color: var(--p-gray-600);">Staff Engineer</span>
              <DsBadge type="interesting">Lead</DsBadge>
            </div>
          </div>
        </header>

        <section style="margin-bottom: 28px;">
          <h2 style="margin: 0 0 12px; font-size: 16px; font-weight: 600;">Skills</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <DsChip
              v-for="skill in skills"
              :key="skill"
              type="selected"
              size="small"
              :removable="true"
              @remove="removeSkill(skill)"
            >
              {{ skill }}
            </DsChip>
          </div>
        </section>

        <section style="margin-bottom: 28px;">
          <DsTextarea v-model="bio" label="Bio" :maxLength="200" />
        </section>

        <section style="margin-bottom: 28px;">
          <DsSelect
            v-model="timezone"
            :options="timezoneOptions"
            label="Time zone"
            placeholder="Select your time zone"
          />
        </section>

        <section style="margin-bottom: 28px;">
          <h2 style="margin: 0 0 12px; font-size: 16px; font-weight: 600;">Find a teammate</h2>
          <DsSearchField
            v-model="search"
            placeholder="Search teammates"
            ariaLabel="Search teammates"
            :helpIcon="true"
          />
        </section>

        <section style="margin-bottom: 8px;">
          <p style="margin: 0 0 12px; font-size: 13px; color: var(--p-gray-600);">
            Code accepted -
            <DsBadge type="accepted">Verified</DsBadge>
          </p>
          <DsCodeInput v-model="verifyCode" label="Verify your email" :length="6" />
        </section>
      </div>
    `,
  }),
};
