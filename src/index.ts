import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import './styles/base.css';

// Barrel export — component re-exports will be added here
export {
  DsAvatar,
  type DsAvatarColor,
  type DsAvatarProps,
  type DsAvatarSize,
  type DsAvatarVariant,
} from './components/DsAvatar';
export { DsBadge, type DsBadgeProps, type DsBadgeType } from './components/DsBadge';
export { DsButton, type DsButtonProps } from './components/DsButton';
export { DsChip, type DsChipProps } from './components/DsChip';
export { DsCodeInput, type DsCodeInputProps } from './components/DsCodeInput';
export { DsIcon, type IconName } from './components/DsIcon';
export { DsIconButton, type DsIconButtonProps } from './components/DsIconButton';
export { DsInputText, type DsInputTextProps } from './components/DsInputText';
export { DsLink, type DsLinkProps } from './components/DsLink';
export {
  DsSearchField,
  type DsSearchFieldClearBehavior,
  type DsSearchFieldProps,
  type DsSearchFieldSize,
} from './components/DsSearchField';
export { DsSelect, type DsSelectProps } from './components/DsSelect';
export { DsTextarea, type DsTextareaProps } from './components/DsTextarea';
export { dsPreset, dsTheme } from './theme';
