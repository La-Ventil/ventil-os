'use server';

import { nanoid } from 'nanoid';
import {keycloakClient} from "@repo/keycloak/keycloak-client";
import {prismaClient,Prisma, Profil, ConsentementType } from "@repo/db";
import {InscriptionFormData, inscriptionFormDataSchema} from "../inscription-form-data";
import {isValidationError, zodErrorToMessage} from "../validation";

export async function inscrireUtilisateur(previousState, formData: FormData) {
    try {
        console.log(formData);
        console.log(formData.get('prenom'));
        const inscriptionFormData: InscriptionFormData = inscriptionFormDataSchema.parse(formData);

        const { id: kcSub } = await keycloakClient.creerUtilisateur({
            email: inscriptionFormData.email,
            firstName: inscriptionFormData.prenom,
            lastName: inscriptionFormData.nom,
            username: inscriptionFormData.email,
            attributs: {
                profil: [inscriptionFormData.profil],
            },
            emailVerified: false,
        });
        await keycloakClient.definirMotDePasse(kcSub, inscriptionFormData.motDePasse)

        let userCreateInput: Prisma.UserCreateInput = {
            name: inscriptionFormData.nom,
            email: inscriptionFormData.email,
            kcSub,
            pseudo: `${inscriptionFormData.prenom}${inscriptionFormData.nom}#${nanoid()}`,
            prenom: inscriptionFormData.prenom,
            nom: inscriptionFormData.nom,
            profil: Profil.eleve,
            // sousProfilEleve?: $Enums.SousProfilEleve | null
            // sousProfilExterne?: $Enums.SousProfilExterne | null
            // niveauScolaire?: string | null
            consentements: {
                create: {
                    accepte: inscriptionFormData.cgu === 'on',
                    accepteAt: new Date(),
                    type: ConsentementType.cgu
                },
            }
        }
        await prismaClient.user.create({
            data: userCreateInput
        });

        return {
            values: {
                kcSub
            },
            message: 'Inscription réussie !',
            isValid: true,
            fieldErrors: [],
        };
    } catch (e) {
        console.error(e);
        let message = 'Une erreur inattendu est survenue :(';
        if (isValidationError(e)) {
            message = zodErrorToMessage(e);
        }

        return { message, isValid: false, fieldErrors: [], values: {} };
    }
}