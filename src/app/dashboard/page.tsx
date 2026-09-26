import { DashboardApp } from '@/components/DashboardApp';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Taskit',
  description: 'Manage tasks, priorities, calendar and sprints in Taskit.',
};

export default function DashboardPage() {
  return <DashboardApp />;
}
