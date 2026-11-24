import type { Metadata } from 'next';
import { SettingsView } from '@/components/SettingsView';

export const metadata: Metadata = {
  title: 'Ayarlar',
  description: 'Nexora görünüm ve gizlilik ayarları',
};

export default function SettingsPage() {
  return <SettingsView />;
}
