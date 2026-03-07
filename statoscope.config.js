module.exports = {
	validate: {
		plugins: ['@statoscope/webpack'],
		reporters: [
			'@statoscope/console',
			['@statoscope/stats-report', { open: false }]
		],
		rules: {
			'@statoscope/webpack/build-time-limits': ['warn', 30000],
			'@statoscope/webpack/no-packages-dups': ['warn'],
			'@statoscope/webpack/entry-download-size-limits': [
				'error',
				{ global: { maxSize: 1 * 1024 * 1024 } }
			],
			'@statoscope/webpack/diff-entry-download-size-limits': [
				'error',
				{ global: { maxSizeDiff: 5 * 1024 } }
			]
		}
	}
};
