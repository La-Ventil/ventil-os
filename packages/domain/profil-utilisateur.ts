export interface ProfilUtilisateur {
    id: string;
    profil: string;
    email: string;
    pseudo: string;
    niveauScolaire?: string | null;
    nom?: string;
    prenom: string;
    adminGlobal: boolean;
    adminPedagogique: boolean;
}