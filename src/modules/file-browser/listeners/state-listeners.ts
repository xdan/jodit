/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IFileBrowser, IFileBrowserItem } from '../../../types';
import { F_CLASS, ITEM_CLASS } from '../consts';
import { Dom } from '../../../core/dom';
import { normalizePath } from '../../../core/helpers/normalize';
import { Button } from '../../../core/ui';

const DEFAULT_SOURCE_NAME = 'default',
	ITEM_ACTIVE_CLASS = ITEM_CLASS + '_active_true';

/**
 * Convert state to view
 */
export function stateListeners(this: IFileBrowser): void {
	const { state, files, create, options } = this,
		getDomElement = (item: IFileBrowserItem): HTMLElement => {
			const key = item.uniqueHashKey;

			if (this.elementsMap[key]) {
				return this.elementsMap[key].elm;
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

			this.elementsMap[key] = {
				item,
				elm
			};

			return this.elementsMap[key].elm;
		};

	state
		.on(
			['change.currentPath', 'change.currentSource'],
			this.async.debounce(() => {
				this.loadTree();
			}, this.defaultTimeout)
		)
		.on('beforeChange.activeElements', () => {
			state.activeElements.forEach(item => {
				const key = item.uniqueHashKey,
					{ elm } = this.elementsMap[key];

				elm && elm.classList.remove(ITEM_ACTIVE_CLASS);
			});
		})

		.on('change.activeElements', () => {
			this.e.fire('changeSelection');

			state.activeElements.forEach(item => {
				const key = item.uniqueHashKey,
					{ elm } = this.elementsMap[key];

				elm && elm.classList.add(ITEM_ACTIVE_CLASS);
			});
		})

		.on('change.view', () => {
			files.classList.remove(F_CLASS + '__files_view_tiles');
			files.classList.remove(F_CLASS + '__files_view_list');
			files.classList.add(F_CLASS + '__files_view_' + state.view);

			this.storage.set(F_CLASS + '_view', state.view);
		})

		.on('change.sortBy', () => {
			this.storage.set(F_CLASS + '_sortby', state.sortBy);
		})

		.on(
			'change.elements',
			this.async.debounce(() => {
				Dom.detach(files);

				if (state.elements.length) {
					state.elements.forEach(item => {
						this.files.appendChild(getDomElement(item));
					});
				} else {
					files.appendChild(
						create.div(
							F_CLASS + '_no_files',
							this.i18n('There are no files')
						)
					);
				}
			}, this.defaultTimeout)
		)

		.on(
			'change.sources',
			this.async.debounce(() => {
				Dom.detach(this.tree);

				Object.keys(state.sources).forEach((sourceName: string) => {
					const source = state.sources[sourceName];

					if (sourceName && sourceName !== DEFAULT_SOURCE_NAME) {
						this.tree.appendChild(
							create.div(F_CLASS + '__source-title', sourceName)
						);
					}

					source.folders.forEach(name => {
						const folderElm = create.a(
							F_CLASS + '__tree-item',
							{
								draggable: 'draggable',
								href: 'javascript:void(0)',
								'data-path': normalizePath(
									source.path,
									name + '/'
								),
								'data-name': name,
								'data-source': sourceName,
								'data-source-path': source.path
							},
							create.span(F_CLASS + '__tree-item-title', name)
						);

						const action = (actionName: string) => (
							e: MouseEvent
						) => {
							this.e.fire(`${actionName}.filebrowser`, {
								name,
								path: normalizePath(source.path + '/'),
								source: sourceName
							});

							e.stopPropagation();
						};

						this.e.on(folderElm, 'click', action('openFolder'));

						this.tree.appendChild(folderElm);

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

						this.tree.appendChild(button.container);
					}
				});
			}, this.defaultTimeout)
		);
}
