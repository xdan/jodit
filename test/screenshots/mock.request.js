/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const nock = require('nock');
const useNock = require('nock-puppeteer');

const base64Image =
	'iVBORw0KGgoAAAANSUhEUgAAAUAAAADwBAMAAACDA6BYAAAAMFBMVEUAAACHh4fExMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACKW9M+AAAACXBIWXMAAAsTAAALEwEAmpwYAAADM0lEQVR4AezOgQAAAAjAsFK5P2QgbQQbAAAAAAAAAAAAAN7bSlBQUFDw2LXDnLdBGADDgRMYnwB8/0Nurb1XUKVaNg2CtPjHlzjxlEekAaedh5rJz00xK3GkmFmTSJKyH9VlHfD1V81ewuybMLwiSs2iSjjXVgLTG9ASKKc6g6wFMM7VhcAYrtiIH0RL5sDEqXXAMWqHYMhIyawuBDa/bHsfa46QI4VC31kJoJq1+LsIyKa7PLLqpxrOw7jRq4CB8Sw7pqgATN2dFmRxcCmwAYzIAKPehAJdCZRzYLIBeHwC60IgF0wAiz+qbgYILN8JhDcC1YHEnUC1C8B2HzDZ3sBYLUreFqisaucPCXEPkGMA+2lmB2AKkn6ZqHcDni91Re4E0hB8Ngv9ObkLGKSkQ7ul5pVGdudDQtTvDWu7Eag2KAZg6ux3ryQlgNlBSiXvJPeuxfXo35oaLSCDeRvQ0xLn4sW961EL7/R7xd8O2wO0Int/2cRKsi2QaHsCFWDdE5gAHpuGstDtGklts7n5iSeeeOKJJ554Yvfes1z82f3CF4KJin8JtLY70OruQNseKLsD66ZAdtquQF4ltwbmT2DSmBzJmpwBk5/gN9syCZgAGnlciMw6YO6eKt+Lg1aXANP47YtaeAFaKAw6/6jMusWNA4jM4mSEeKHXVep8n2TWQ1LHgTy7cg0gXw5SRzIJWMaJOsd/6wkuWXMgA5jGn8OwT1/qlBvudxV1AH3XE4Y/45zfLEQa29xxPenufcWpAdNJQA7A9GvBOKyIYzjPB4OyicB2AszDlTkEof/kMqx5frPAJbiydMCT7pGyqUC7DmS8CcpmdTPKI3gNaJ9AmQpkabgOlKVAnr3rwLo1sF+5CR6SycDv04wWcWD9VdABKVsKVICsK5k5j0H7AOocoAE8X+qC0y9rmHIrHWxau2X1W7PABmA26thMaxYI+dpu0UcxnJhpviibB/x9w9oAxs2lTrpkFvAPWn42Q12eDJTrL00UjnVRNbvd+v7aKd0sR9rVJd+fAOTl+/KLO7PeUJfe+wD/5/jRHhwTAAAAAAzp33oldmIGAAAAAAAAAAAAAAAAATWgPUYJ011oAAAAAElFTkSuQmCC';
const buffer = Buffer.from(base64Image, 'base64');

before(async () => {
	nock('https://xdsoft.net')
		.persist(true)
		.post('/jodit/finder/', body => body.action === 'permissions')
		.reply(200, {
			success: true,
			time: '2022-08-31 16:30:47',
			data: {
				permissions: {
					allowFiles: true,
					allowFileMove: true,
					allowFileUpload: true,
					allowFileUploadRemote: true,
					allowFileRemove: true,
					allowFileRename: true,
					allowFileDownload: true,
					allowFolders: false,
					allowFolderMove: true,
					allowFolderCreate: true,
					allowFolderRemove: true,
					allowFolderRename: true,
					allowFolderTree: true,
					allowImageResize: true,
					allowImageCrop: true,
					allowGeneratePdf: true
				},
				code: 220
			},
			elapsedTime: null
		});

	nock('https://xdsoft.net')
		.persist(true)
		.post('/jodit/finder/', body => body.action === 'folders')
		.reply(200, () => {
			console.log('fix');
			return {
				success: true,
				time: '2022-08-31 16:30:47',
				data: {
					sources: [
						{
							name: 'default',
							title: 'Images',
							baseurl: 'https://xdsoft.net/jodit/finder/files/',
							path: 'subfolder/',
							folders: ['..', 'pexels', 'docs', 'next']
						}
					],
					code: 220
				},
				elapsedTime: null
			};
		});

	nock('https://xdsoft.net')
		.persist(true)
		.post('/jodit/finder/', body => body.action === 'files')
		.reply(200, {
			success: true,
			time: '2022-08-31 16:12:45',
			data: {
				sources: [
					{
						baseurl: 'https://xdsoft.net/jodit/finder/files/',
						path: 'subfolder/',
						files: [
							{
								file: 'pexels-brandon-2867826.jpg',
								name: 'pexels-brandon-2867826.jpg',
								type: 'image',
								thumb: '_thumbs/pexels-brandon-2867826.jpg',
								changed: '08/31/2022 4:00 PM',
								size: '2.74MB',
								isImage: true
							},
							{
								file: 'pexels-burst-374825.jpg',
								name: 'pexels-burst-374825.jpg',
								type: 'image',
								thumb: '_thumbs/pexels-burst-374825.jpg',
								changed: '08/31/2022 4:00 PM',
								size: '4.08MB',
								isImage: true
							},
							{
								file: 'pexels-cottonbro-4431055.jpg',
								name: 'pexels-cottonbro-4431055.jpg',
								type: 'image',
								thumb: '_thumbs/pexels-cottonbro-4431055.jpg',
								changed: '08/31/2022 4:00 PM',
								size: '3.45MB',
								isImage: true
							}
						],
						name: 'default'
					}
				],
				code: 220
			},
			elapsedTime: null
		});

	nock.disableNetConnect();
	nock.enableNetConnect(/(127.0.0.1|localhost|xdsoft.net)/);
	useNock(global.page, ['https://xdsoft.net']);
	await global.page.setRequestInterception(true);
	global.page.on('request', request => {
		if (request.resourceType() === 'image') {
			request.respond({
				status: 200,
				contentType: 'image/png',
				body: buffer
			});
		} else {
			request.continue();
		}
	});
});

after(() => {
	nock.cleanAll();
	nock.enableNetConnect();
});
