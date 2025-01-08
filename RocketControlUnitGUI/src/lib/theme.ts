import { browser } from "$app/environment";

export enum ThemeType {
    LIGHT = 'light',
    DARK = 'dark',
}

export class ThemeData {
    private logo: string = '';

    get logoSrc() {
        return this.logo;
    }

    constructor(initialTheme: ThemeType) {
        this.setTheme(initialTheme);
    }

    private setTheme = (theme: ThemeType) => {
        if (!browser) {
            return;
        }

        this.logo = `/logo/soar-logo-${theme}.svg`;

        let rootStyle = document.documentElement.style;

        rootStyle.setProperty('--icon-filter', `var(--icon-filter-${theme})`);

        rootStyle.setProperty('--diagram-outline-color', `var(--diagram-outline-color-${theme})`);
        rootStyle.setProperty('--diagram-nos-color', `var(--diagram-nos-color-${theme})`);
        rootStyle.setProperty('--diagram-fill-color', `var(--diagram-fill-color-${theme})`);
        rootStyle.setProperty('--diagram-insul-color', `var(--diagram-insul-color-${theme})`);
        rootStyle.setProperty('--diagram-pv-color', `var(--diagram-pv-color-${theme})`);
        rootStyle.setProperty('--diagram-ignitor-color', `var(--diagram-ignitor-color-${theme})`);
    }
}