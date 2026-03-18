import { expect, type Locator, type Page } from '@playwright/test';

const selectAllShortcut = process.platform === 'darwin' ? 'Meta+A' : 'Control+A';

export async function openAutocompleteOptions(page: Page, field: Locator): Promise<Locator> {
  await field.click();
  const listbox = page.getByRole('listbox');
  await expect(listbox).toBeVisible();
  return listbox;
}

export async function replaceAutocompleteQuery(args: { page: Page; field: Locator; query: string }): Promise<Locator> {
  const { page, field, query } = args;

  await field.click();
  await field.press(selectAllShortcut);
  await field.press('Backspace');
  await field.pressSequentially(query);

  const listbox = page.getByRole('listbox');
  await expect(listbox).toBeVisible();
  return listbox;
}

export async function selectFirstAutocompleteOption(args: { page: Page; field: Locator }): Promise<void> {
  const listbox = await openAutocompleteOptions(args.page, args.field);
  await listbox.getByRole('option').first().click();
}
