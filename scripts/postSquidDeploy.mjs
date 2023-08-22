import fs from 'fs';
import path from 'path';

const usualTSConfig = `{
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
    "resolveJsonModule": true,
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "noEmit": true,
    "incremental": true,
    "moduleResolution": "node",
    "isolatedModules": true,
    "jsx": "preserve",
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "src",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}`;

const fileName = 'tsconfig.json';
const filePath = process.cwd();

try {
    fs.writeFileSync(path.join(filePath, fileName), usualTSConfig);
} catch (error) {
    process.exitCode = 1;
    throw error;
}
