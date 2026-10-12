import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';

const root = resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const theme = resolve(root, 'wordpress/eyvan-kheshti-theme');
const themeApp = resolve(theme, 'app');
const release = resolve(root, 'release/wordpress');

function run(command, args, env = process.env) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, { cwd: root, env, stdio: 'inherit', shell: false });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolveRun() : reject(new Error(`${command} exited with ${code}`)));
  });
}

await run(process.execPath, ['scripts/restore-media.mjs']);
await run(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--configLoader', 'runner'], {
  ...process.env,
  VITE_PUBLIC_BASE: '/wp-content/themes/eyvan-kheshti/app/',
  VITE_DATA_MODE: 'remote',
  VITE_API_BASE_URL: '/wp-json/eyvan',
  VITE_ENABLE_LOCAL_ADMIN: 'false',
});

await rm(themeApp, { recursive: true, force: true });
await cp(resolve(root, 'dist'), themeApp, { recursive: true });
await rm(release, { recursive: true, force: true });
await mkdir(release, { recursive: true });
await cp(theme, resolve(release, 'eyvan-kheshti-theme'), { recursive: true });
await cp(resolve(root, 'wordpress/eyvan-kheshti-core'), resolve(release, 'eyvan-kheshti-core'), { recursive: true });

await run(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--configLoader', 'runner'], {
  ...process.env,
  VITE_PUBLIC_BASE: '/',
  VITE_DATA_MODE: 'local',
  VITE_ENABLE_LOCAL_ADMIN: 'false',
});

console.log('WordPress release folders created in release/wordpress and the normal Netlify preview build was restored.');
