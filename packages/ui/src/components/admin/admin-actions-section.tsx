import type { SectionProps } from '../section';
import Section from '../section';

type AdminActionsSectionProps = SectionProps;

export default function AdminActionsSection({
  pt = 0,
  pb = 2,
  direction = 'row',
  justifyContent = 'flex-start',
  ...props
}: AdminActionsSectionProps) {
  return (
    <Section pt={pt} pb={pb} direction={direction} justifyContent={justifyContent} {...props} />
  );
}
