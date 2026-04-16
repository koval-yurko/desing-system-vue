import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import './styles/base.css';

// Barrel export — component re-exports will be added here
export { DsButton, type DsButtonProps } from './components/DsButton';
export { DsIcon, type IconName } from './components/DsIcon';
export { DsIconButton, type DsIconButtonProps } from './components/DsIconButton';
export { DsInputText, type DsInputTextProps } from './components/DsInputText';
export { DsLink, type DsLinkProps } from './components/DsLink';
export { DsTextarea, type DsTextareaProps } from './components/DsTextarea';
export { dsPreset, dsTheme } from './theme';
