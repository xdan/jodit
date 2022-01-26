/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/file-browser
 */

import type { IFileBrowser, IFileBrowserItem } from 'jodit/types';
import { Dom } from 'jodit/core/dom';
import { normalizePath } from 'jodit/core/helpers/normalize';
import { Button } from 'jodit/core/ui';
import { elementsMap } from '../builders/elements-map';
import { loadTree } from '../fetch/load-tree';

const DEFAULT_SOURCE_NAME = 'default';

/**
 * Convert state to view
 */
export function stateListeners(this: IFileBrowser): void {
	const elmMap = elementsMap(this);

	const { state, files, create, options } = this,
		getDomElement = (item: IFileBrowserItem): HTMLElement => {
			const key = item.uniqueHashKey;

			if (elmMap[key]) {
				return elmMap[key].elm;
			}

			const elm = create.fromHTML(
				options.getThumbTemplate.call(
					this,
					item,
					item.source,
					item.sourceName.toString()
				)
			);

			elm.dataset.key = key;

			elmMap[key] = {
				item,
				elm
			};

			return elmMap[key].elm;
		};

	state
		.on(
			['change.currentPath', 'change.currentSource'],
			this.async.debounce(() => {
				if (
					this.o.saveStateInStorage &&
					this.o.saveStateInStorage.storeLastOpenedFolder
				) {
					this.storage
						.set('currentPath', this.state.currentPath)
						.set('currentSource', this.state.currentSource);
				}

				loadTree(this).catch(this.status);
			}, this.defaultTimeout)
		)
		.on('beforeChange.activeElements', () => {
			state.activeElements.forEach(item => {
				const key = item.uniqueHashKey,
					{ elm } = elmMap[key];

				elm &&
					elm.classList.remove(
						files.getFullElName('item', 'active', true)
					);
			});
		})

		.on('change.activeElements', () => {
			this.e.fire('changeSelection');

			state.activeElements.forEach(item => {
				const key = item.uniqueHashKey,
					{ elm } = elmMap[key];

				elm &&
					elm.classList.add(
						files.getFullElName('item', 'active', true)
					);
			});
		})

		.on('change.view', () => {
			files.setMod('view', state.view);

			if (
				this.o.saveStateInStorage &&
				this.o.saveStateInStorage.storeView
			) {
				this.storage.set('view', state.view);
			}
		})

		.on('change.sortBy', () => {
			if (
				this.o.saveStateInStorage &&
				this.o.saveStateInStorage.storeSortBy
			) {
				this.storage.set('sortBy', state.sortBy);
			}
		})

		.on(
			'change.elements',
			this.async.debounce(() => {
				Dom.detach(files.container);

				if (state.elements.length) {
					state.elements.forEach(item => {
						this.files.container.appendChild(getDomElement(item));
					});
				} else {
					files.container.appendChild(
						create.div(
							this.componentName + '_no-files_true',
							this.i18n('There are no files')
						)
					);
				}
			}, this.defaultTimeout)
		)

		.on(
			'change.sources',
			this.async.debounce(() => {
				Dom.detach(this.tree.container);

				state.sources.forEach(source => {
					const sourceName = source.name;

					if (sourceName && sourceName !== DEFAULT_SOURCE_NAME) {
						this.tree.container.appendChild(
							create.div(
								this.tree.getFullElName('source-title'),
								sourceName
							)
						);
					}

					source.folders.forEach((name: string) => {
						const folderElm = create.a(
							this.tree.getFullElName('item'),
							{
								draggable: 'draggable',
								href: '#',
								'data-path': normalizePath(
									source.path,
									name + '/'
								),
								'data-name': name,
								'data-source': sourceName,
								'data-source-path': source.path
							},
							create.span(
								this.tree.getFullElName('item-title'),
								name
							)
						);

						const action =
							(actionName: string) => (e: MouseEvent) => {
								this.e.fire(`${actionName}.filebrowser`, {
									name,
									path: normalizePath(source.path + '/'),
									source: sourceName
								});

								e.stopPropagation();
								e.preventDefault();
							};

						this.e.on(folderElm, 'click', action('openFolder'));

						this.tree.container.appendChild(folderElm);

						if (name === '..' || name === '.') {
							return;
						}

						if (
							options.renameFolder &&
							this.dataProvider.canI('FolderRename')
						) {
							const btn = Button(this, {
								icon: { name: 'pencil' },
								name: 'rename',
								tooltip: 'Rename',
								size: 'tiny'
							});

							btn.onAction(action('renameFolder'));

							folderElm.appendChild(btn.container);
						}

						if (
							options.deleteFolder &&
							this.dataProvider.canI('FolderRemove')
						) {
							const btn = Button(this, {
								icon: { name: 'cancel' },
								name: 'remove',
								tooltip: 'Delete',
								size: 'tiny'
							});

							btn.onAction(action('removeFolder'));

							folderElm.appendChild(btn.container);
						}
					});

					if (
						options.createNewFolder &&
						this.dataProvider.canI('FolderCreate')
					) {
						const button = Button(
							this,
							'plus',
							'Add folder',
							'secondary'
						);

						button.onAction(() => {
							this.e.fire('addFolder', {
								path: normalizePath(source.path + '/'),
								source: sourceName
							});
						});

						this.tree.append(button);
					}
				});
			}, this.defaultTimeout)
		);
}
