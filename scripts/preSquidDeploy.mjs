import fs from 'fs';
import path from 'path';

const squidTSConfig = `{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es2020",
        "outDir": "lib",
        "rootDir": "src",
        "strict": true,
        "declaration": false,
        "sourceMap": true,
        "esModuleInterop": true,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        "skipLibCheck": true,
        "resolveJsonModule": true
    },
    "include": ["src"],
    "exclude": ["node_modules"]
}`;

const fileName = 'tsconfig.json';
const filePath = process.cwd();

try {
    fs.writeFileSync(path.join(filePath, fileName), squidTSConfig);
} catch (error) {
    process.exitCode = 1;
    throw error;
}
