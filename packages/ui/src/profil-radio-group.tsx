"use client";

import * as React from "react";
import {useTranslations} from 'next-intl';
import MuiRadioGroup, {RadioGroupProps as MuiRadioGroupProps} from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import { styled } from "@mui/material/styles";
import {
    FormControlLabel,
    FormControlLabelProps,
    FormGroup,
    FormLabel,
    Typography
} from "@mui/material";
import {ProfilType} from "@repo/domain/profil-type";


export interface ProfilRadioProps extends Omit<FormControlLabelProps, 'control'> {
    label: string;
    caption: string;
}

export function ProfilRadio({ label, caption, value, ...props  }: ProfilRadioProps) {
    return (
        <FormControlLabel {...props} value={value} control={<Radio />} label={<div>
            <Typography variant="body1">{label}</Typography>
            <Typography variant="caption">{caption}</Typography>
        </div>} disableTypography/>
    );
}

export const StyledRadioGroup = styled(MuiRadioGroup)<MuiRadioGroupProps>(
  ({ theme }) => ({
    color: theme.palette.success.main,
  }),
);

export default function ProfilRadioGroup() {
    const [value, setValue] = React.useState("recents");
    const t = useTranslations("recents");

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <FormGroup>
            <FormLabel id="profil-label">Profil d’utilisation</FormLabel>
            <Typography variant="body1">Sélectionnez le profil correspondant à votre usage du lieu</Typography>
            <StyledRadioGroup
                aria-labelledby="profil-label"
                defaultValue="ventilacteur"
                name="profil"
            >
                {Object.keys(ProfilType).map((key) => {
                    const label = t(`option.${key}.label`);
                    const description = t(`option.${key}.description`);
                    const active = value === key;

                    return (<ProfilRadio key={key} label={label} value="ventilacteur" caption={description} />)
                })}
            </StyledRadioGroup>
        </FormGroup>
    );
}
