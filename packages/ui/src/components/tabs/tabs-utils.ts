import { createElement, type ReactNode } from 'react';

export type TabItem = {
  value: string;
  label: string;
  href: string;
  controlsId?: string;
  disabled?: boolean;
};

export type TabsProps = {
  ariaLabel: string;
  activeValue: string;
  baseId: string;
  tabs: TabItem[];
  fullWidth?: boolean;
};

export type TabPanelRenderProps<T extends string = string> = {
  value: T;
  id: string;
  tabId: string;
  hidden: boolean;
};

export const getTabId = (baseId: string, value: string) => `${baseId}-tab-${value}`;
export const getPanelId = (baseId: string, value: string) => `${baseId}-panel-${value}`;

export const buildTabs = <T extends string>(config: {
  baseId: string;
  tabs: readonly T[];
  getLabel: (value: T) => string;
  getHref: (value: T) => string;
}) => {
  const tabItems = config.tabs.map((value) => ({
    value,
    label: config.getLabel(value),
    href: config.getHref(value),
    controlsId: getPanelId(config.baseId, value)
  }));

  return {
    tabs: tabItems,
    getTabId: (value: T) => getTabId(config.baseId, value),
    getPanelId: (value: T) => getPanelId(config.baseId, value)
  };
};

export const renderPanels = <T extends string>(config: {
  baseId: string;
  tabs: readonly T[];
  activeValue: T;
  render: (value: T, panelProps: TabPanelRenderProps<T>) => ReactNode;
}) =>
  config.tabs.map((value) => {
    const panel = config.render(value, {
      value,
      id: getPanelId(config.baseId, value),
      tabId: getTabId(config.baseId, value),
      hidden: value !== config.activeValue
    });

    return panel ? createElement(PanelKey, { key: value }, panel) : null;
  });

const PanelKey = ({ children }: { children: ReactNode }) => children;
