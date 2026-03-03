import clsx from 'clsx';
import Section, { type SectionProps } from './section';
import styles from './table-section.module.css';

export type TableSectionProps = SectionProps;

export default function TableSection({ className, ...props }: TableSectionProps) {
  return <Section className={clsx(styles.root, className)} {...props} />;
}
