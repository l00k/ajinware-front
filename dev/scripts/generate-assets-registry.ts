import * as fs from 'fs';
import path from 'node:path';

const assetExtensions : string[] = [
    'png', 'jpg', 'svg',
    'ttf', 'woff', 'woff2',
];


(async() => {
    const plainUrls : string[] = [];
    const assetsUrls : string[] = [];

    // collect from public
    const publicDirs = [
        'imgs',
        'sounds',
    ];

    for (const publicDir of publicDirs) {
        const dirPath = path.join(
            'public',
            publicDir
        );

        const files = fs.readdirSync(dirPath, { recursive: true, encoding: 'utf-8' });
        for (const file of files) {
            const fileExt = file.split('.').pop();
            if (!assetExtensions.includes(fileExt)) {
                continue;
            }

            const assetPath = path.join(
                publicDir,
                file
            );
            plainUrls.push('/' + assetPath);
        }
    }

    // collect from src/assets
    const srcDirs = [
        'assets/fonts',
        'assets/imgs',
    ];

    for (const srcDir of srcDirs) {
        const dirPath = path.join(
            'src',
            srcDir
        );

        const files = fs.readdirSync(dirPath, { recursive: true, encoding: 'utf-8' });
        for (const file of files) {
            const fileExt = file.split('.').pop();
            if (!assetExtensions.includes(fileExt)) {
                continue;
            }

            const assetPath = path.join(
                srcDir,
                file
            );
            assetsUrls.push('@/' + assetPath);
        }
    }

    // write assets file
    const imports = [];
    const exports = [];

    for (const [ assetIdx, assetPath ] of assetsUrls.entries()) {
        const assetImportKey = 'Asset' + assetIdx;
        imports.push(`import ${assetImportKey} from '${assetPath}?url';`);
        exports.push(assetImportKey);
    }

    const content = imports.join('\n')
        + '\n\n'
        + `export const AssetsRegistry = [\n`
        + '...' + JSON.stringify(plainUrls, undefined, 4) + ',\n'
        + exports.join(',\n')
        + '\n];\n';

    const assetsFilePath = path.join('src/assets/assets-registry.ts');
    fs.writeFileSync(
        assetsFilePath,
        content,
        { encoding: 'utf-8' }
    );
})();
