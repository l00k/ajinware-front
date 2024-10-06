export async function loadI18nMessages (languages : string[]) : Promise<any>
{
    const messages : any = {};
    for (const language of languages) {
        const module = await import(`@/i18n/${language}.json`);
        messages[language] = module.default;
    }
    return messages;
}
