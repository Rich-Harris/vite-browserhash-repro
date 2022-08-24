import fs from 'fs';

fs.rmSync('node_modules/test', { recursive: true, force: true });

fs.mkdirSync('node_modules/test');
fs.writeFileSync(
	'node_modules/test/index.js',
	`document.body.innerHTML += '<p>loaded test from ' + import.meta.url + '</p>';`
);

fs.writeFileSync(
	'node_modules/test/package.json',
	JSON.stringify({ main: 'index.js' })
);
