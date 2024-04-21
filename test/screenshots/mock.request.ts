/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { args } from './args.screenshot';

import { expect, type Page } from '@playwright/test';
import fs from 'fs';
import mime from 'mime-types';
import path from 'path';

const base64Image =
	'iVBORw0KGgoAAAANSUhEUgAAAUAAAADwBAMAAACDA6BYAAAAMFBMVEUAAACHh4fExMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACKW9M+AAAACXBIWXMAAAsTAAALEwEAmpwYAAADM0lEQVR4AezOgQAAAAjAsFK5P2QgbQQbAAAAAAAAAAAAAN7bSlBQUFDw2LXDnLdBGADDgRMYnwB8/0Nurb1XUKVaNg2CtPjHlzjxlEekAaedh5rJz00xK3GkmFmTSJKyH9VlHfD1V81ewuybMLwiSs2iSjjXVgLTG9ASKKc6g6wFMM7VhcAYrtiIH0RL5sDEqXXAMWqHYMhIyawuBDa/bHsfa46QI4VC31kJoJq1+LsIyKa7PLLqpxrOw7jRq4CB8Sw7pqgATN2dFmRxcCmwAYzIAKPehAJdCZRzYLIBeHwC60IgF0wAiz+qbgYILN8JhDcC1YHEnUC1C8B2HzDZ3sBYLUreFqisaucPCXEPkGMA+2lmB2AKkn6ZqHcDni91Re4E0hB8Ngv9ObkLGKSkQ7ul5pVGdudDQtTvDWu7Eag2KAZg6ux3ryQlgNlBSiXvJPeuxfXo35oaLSCDeRvQ0xLn4sW961EL7/R7xd8O2wO0Int/2cRKsi2QaHsCFWDdE5gAHpuGstDtGklts7n5iSeeeOKJJ554Yvfes1z82f3CF4KJin8JtLY70OruQNseKLsD66ZAdtquQF4ltwbmT2DSmBzJmpwBk5/gN9syCZgAGnlciMw6YO6eKt+Lg1aXANP47YtaeAFaKAw6/6jMusWNA4jM4mSEeKHXVep8n2TWQ1LHgTy7cg0gXw5SRzIJWMaJOsd/6wkuWXMgA5jGn8OwT1/qlBvudxV1AH3XE4Y/45zfLEQa29xxPenufcWpAdNJQA7A9GvBOKyIYzjPB4OyicB2AszDlTkEof/kMqx5frPAJbiydMCT7pGyqUC7DmS8CcpmdTPKI3gNaJ9AmQpkabgOlKVAnr3rwLo1sF+5CR6SycDv04wWcWD9VdABKVsKVICsK5k5j0H7AOocoAE8X+qC0y9rmHIrHWxau2X1W7PABmA26thMaxYI+dpu0UcxnJhpviibB/x9w9oAxs2lTrpkFvAPWn42Q12eDJTrL00UjnVRNbvd+v7aKd0sR9rVJd+fAOTl+/KLO7PeUJfe+wD/5/jRHhwTAAAAAAzp33oldmIGAAAAAAAAAAAAAAAAATWgPUYJ011oAAAAAElFTkSuQmCC';
const buffer = Buffer.from(base64Image, 'base64');

type MockResponse = {
	filter: (params: {
		url: string;
		method: string;
		body: Record<string, string>;
	}) => boolean;
	status?: number;
	data: Record<string, any>;
};

const mockData: Record<string, Record<string, Array<MockResponse>>> = {
	'xdsoft.net': {
		'/jodit/finder/': [
			{
				filter: ({ body }) => body.action === 'files',
				data: {
					success: true,
					time: '2022-08-31 16:12:45',
					data: {
						sources: [
							{
								baseurl:
									'https://xdsoft.net/jodit/finder/files/',
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
				}
			},
			{
				filter: ({ method, body }): boolean => {
					return method === 'post' && body.action === 'folders';
				},
				data: {
					success: true,
					time: '2022-08-31 16:30:47',
					data: {
						sources: [
							{
								name: 'default',
								title: 'Images',
								baseurl:
									'https://xdsoft.net/jodit/finder/files/',
								path: 'subfolder/',
								folders: ['..', 'pexels', 'docs', 'next']
							}
						],
						code: 220
					},
					elapsedTime: null
				}
			},
			{
				filter: ({ method, body }) =>
					method === 'post' && body.action === 'permissions',
				status: 200,
				data: {
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
				}
			}
		]
	}
};

export const mockRequest = async (page: Page): Promise<void> => {
	await page.route('https://xdsoft.net/**', route => {
		if (route.request().resourceType() === 'image') {
			return route.fulfill({
				status: 200,
				contentType: 'image/png',
				body: buffer
			});
		}

		for (const host in mockData) {
			for (const pathname in mockData[host]) {
				const process = mockData[host][pathname];
				for (const item of process) {
					const { filter, data } = item;

					if (
						filter({
							url: route.request().url(),
							method: route.request().method().toLowerCase(),
							body: route.request().postDataJSON()
						})
					) {
						return route.fulfill({
							status: 200,
							contentType: 'application/json',
							body: JSON.stringify(data)
						});
					}
				}
			}
		}

		throw new Error(
			'Not found mock data: ' +
				JSON.stringify({
					url: route.request().url(),
					method: route.request().method().toLowerCase(),
					body: route.request().postDataJSON()
				})
		);
	});

	await page.route('/**/*', route => {
		const url = new URL(route.request().url());
		let filePath = path.join(__dirname, '../../', url.pathname);
		switch (url.pathname) {
			case '/custom.css':
			case '/normalize.css':
				filePath = path.join(__dirname, '.', url.pathname);
				break;
			case '/bootstrap.js':
				filePath = path.join(__dirname, '..', url.pathname);
				break;
			case '/':
				filePath = path.resolve(__dirname, './index.html');
				break;
		}

		let fileContents = fs.readFileSync(filePath, 'utf8');

		if (url.pathname === '/') {
			fileContents = fileContents
				.replace(/es2015/g, args.build!)
				.replace(
					/jodit\.min/g,
					`jodit${args.fat ? '.fat' : ''}${args.min ? '.min' : ''}`
				);
		}

		route.fulfill({
			status: 200,
			contentType: mime.lookup(filePath) || 'application/octet-stream',
			body: fileContents
		});
	});

	await page.route('**/*.{png,jpg,jpeg}', route => {
		route.fulfill({
			status: 200,
			contentType: 'image/png',
			body: buffer
		});
	});
};

export async function makeCeptJodit(page: Page, config = {}): Promise<void> {
	await page.evaluate((config: Record<string, any>) => {
		// @ts-ignore
		window.editor = Jodit.make('#editor-area', config);
	}, config);
}

export async function checkScreenshot(
	page: Page,
	selector: string
): Promise<void> {
	await page.waitForSelector(selector);
	await expect(page.locator(selector)).toHaveScreenshot();
}
