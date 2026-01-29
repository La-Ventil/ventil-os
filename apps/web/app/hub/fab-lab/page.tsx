import type { JSX } from 'react';
import { listMachines } from '@repo/application';
import FabLabClient from './fab-lab-client';

export default async function Page(): Promise<JSX.Element> {
  const machines = await listMachines();
  return <FabLabClient machines={machines} />;
}
