import type { JSX } from 'react';
import { getTranslations } from 'next-intl/server';
import BugReportIcon from '@mui/icons-material/BugReport';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import Link from '@repo/ui/link';
import MenuList, { MenuListItem } from '@repo/ui/menu-list';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';

export default async function Page(): Promise<JSX.Element> {
  const tSettings = await getTranslations('pages.hub.settings');
  return (
    <>
      <SectionTitle>{tSettings('title')}</SectionTitle>
      <Section>  
        <SectionSubtitle>{tSettings('subtitle')}</SectionSubtitle>
        <Typography variant="body1">{tSettings('intro')}</Typography>
      </Section>
      <MenuList>
        <MenuListItem
          icon={<SendIcon />}
          label={tSettings('profileLink')}
          href="/hub/settings/profile"
          linkComponent={Link}
        />
        <MenuListItem
          icon={<DraftsIcon />}
          label={tSettings('avatarLink')}
          href="/hub/settings/avatar"
          linkComponent={Link}
        />
        <MenuListItem
          icon={<BugReportIcon />}
          label={tSettings('supportLink')}
          href="/hub/support"
          linkComponent={Link}
        />
      </MenuList>
    </>
  );
}
