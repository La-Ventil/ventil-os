import type { ReactNode } from 'react';
import Section from './section';
import type { SectionProps } from './section';

export type CardListProps = {
  children: ReactNode;
  sectionProps?: SectionProps;
};

export default function CardList({ children, sectionProps }: CardListProps) {
  return <Section {...sectionProps}>{children}</Section>;
}
