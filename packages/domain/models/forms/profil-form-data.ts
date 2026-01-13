import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const profilFormDataSchema = zfd.formData({
  prenom: z.string().min(1, { message: 'validation.profil.prenomRequired' }),
  nom: z.string().min(1, { message: 'validation.profil.nomRequired' }),
  niveauScolaire: z.string().min(1, { message: 'validation.profil.niveauScolaireRequired' })
});
export type ProfilFormData = z.infer<typeof profilFormDataSchema>;
