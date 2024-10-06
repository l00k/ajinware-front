/* eslint-disable @typescript-eslint/consistent-type-imports */
declare module '@vue/runtime-core'
{
    interface ComponentCustomProperties
    {
        // fix bug https://github.com/intlify/vue-i18n/issues/1403
        $t : (key : string) => string;
        $tm : (key : string) => [] | { [p : string] : any };
    }
}
/* eslint-enable @typescript-eslint/consistent-type-imports */

export {};
