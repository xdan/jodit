let resolveChai;
window.waitChai = new Promise(resolve => {
	resolveChai = resolve;
});

import('https://cdn.jsdelivr.net/npm/chai@5.1.2/+esm').then(chai =>
	resolveChai(chai)
);
