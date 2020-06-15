/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IFileBrowser, IFileBrowserItem, ISource } from '../../../types';
import { F_CLASS, ITEM_CLASS } from '../consts';
import { Dom } from '../../../core/dom';
import { normalizePath } from '../../../core/helpers/normalize';
import { Icon } from '../../../core/ui';

const DEFAULT_SOURCE_NAME = 'default',
	ITEM_ACTIVE_CLASS = ITEM_CLASS + '_active_true';

/**
 * Convert state to view
 */
export function stateListeners(this: IFileBrowser) {
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
			'change.folders',
			this.async.debounce(() => {
				Dom.detach(this.tree);

				let lastSource = DEFAULT_SOURCE_NAME,
					lastSource2: ISource | null = null;

				const appendCreateButton = (
					source: ISource | null,
					sourceName: string,
					force: boolean = false
				) => {
					if (
						source &&
						lastSource2 &&
						(source !== lastSource2 || force) &&
						options.createNewFolder &&
						this.dataProvider.canI('FolderCreate')
					) {
						this.tree.appendChild(
							create.a(
								'jodit-button jodit-filebrowser__addfolder',
								{
									href: 'javascript:void(0)',
									'data-path': normalizePath(
										source.path + '/'
									),
									'data-source': sourceName
								},
								Icon.get('plus') + ' ' + this.i18n('Add folder')
							)
						);

						lastSource2 = source;
					}
				};

				state.folders.forEach(folder => {
					const { name, source, sourceName } = folder;

					if (sourceName && sourceName !== lastSource) {
						this.tree.appendChild(
							create.div(F_CLASS + '__source-title', sourceName)
						);
						lastSource = sourceName;
					}

					const folderElm = create.a(
						F_CLASS + '__tree-item',
						{
							draggable: 'draggable',
							href: 'javascript:void(0)',
							'data-path': normalizePath(source.path, name + '/'),
							'data-name': name,
							'data-source': sourceName,
							'data-source-path': source.path
						},
						create.span(F_CLASS + '__tree-item-title', name)
					);

					appendCreateButton(source, sourceName);

					lastSource2 = source;

					this.tree.appendChild(folderElm);

					if (name === '..' || name === '.') {
						return;
					}

					if (
						options.deleteFolder &&
						this.dataProvider.canI('FolderRename')
					) {
						folderElm.appendChild(
							create.element(
								'i',
								{
									class:
										'jodit-icon_folder jodit-icon_folder_rename',
									title: this.i18n('Rename')
								},
								Icon.get('pencil')
							)
						);
					}

					if (
						options.deleteFolder &&
						this.dataProvider.canI('FolderRemove')
					) {
						folderElm.appendChild(
							create.element(
								'i',
								{
									class:
										'jodit-icon_folder jodit-icon_folder_remove',
									title: this.i18n('Delete')
								},
								Icon.get('cancel')
							)
						);
					}
				});

				appendCreateButton(lastSource2, lastSource, true);
			}, this.defaultTimeout)
		);
}
