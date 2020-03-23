// import { IControlTypeStrong } from '../../types';
// import { PopupList } from '../popup/list';
// import { Popup } from '../popup/popup';
// import { camelCase } from '../helpers/string';
// import { isJoditObject } from '../helpers/checker';
//
// const control: IControlTypeStrong = this.control,
// 	getTarget = (): Node | false =>
// 		(this.parentToolbar && this.parentToolbar.getTarget(this)) ||
// 		this.target ||
// 		false;
//
// if (control.list) {
// 	const list = new PopupList(this.jodit, this.container, this.target);
//
// 	list.open(control);
//
// 	this.jodit.events.fire('closeAllPopups', list.container);
//
// 	this.anchor.setAttribute('aria-expanded', 'true');
//
// 	this.jodit.events.on(list, 'afterClose', () => {
// 		this.anchor.setAttribute('aria-expanded', 'false');
// 	});
// } else if (
// 	control.exec !== undefined &&
// 	typeof control.exec === 'function'
// ) {
// 	control.exec(
// 		this.jodit,
// 		getTarget(),
// 		control,
// 		originalEvent,
// 		this.container as HTMLLIElement
// 	);
//
// 	this.jodit?.events.fire('synchro');
//
// 	if (this.parentToolbar) {
// 		this.parentToolbar.immediateCheckActiveButtons();
// 	}
//
// 	/**
// 	 * Fired after calling `button.exec` function
// 	 * @event afterExec
// 	 */
// 	this.jodit?.events.fire('closeAllPopups afterExec');
// } else if (
// 	control.popup !== undefined &&
// 	typeof control.popup === 'function'
// ) {
// 	const popup: Popup = new Popup(
// 		this.jodit,
// 		this.container,
// 		this.target
// 	);
//
// 	if (
// 		this.jodit.events.fire(
// 			camelCase(`before-${control.name}-OpenPopup`),
// 			getTarget(),
// 			control,
// 			popup
// 		) !== false
// 	) {
// 		const popupElm = control.popup(
// 			this.jodit,
// 			getTarget(),
// 			control,
// 			popup.close,
// 			this
// 		);
//
// 		if (popupElm) {
// 			popup.open(popupElm);
// 		}
// 	}
//
// 	/**
// 	 * Fired after popup was opened for some control button
// 	 * @event after{CONTROLNAME}OpenPopup
// 	 */
//
// 	/**
// 	 * Close all opened popups
// 	 *
// 	 * @event closeAllPopups
// 	 */
// 	this.jodit.events.fire(
// 		camelCase(`after-${control.name}-OpenPopup`) +
// 		' closeAllPopups',
// 		popup.container
// 	);
// } else {
// 	if (control.command || control.name) {
// 		if (isJoditObject(this.jodit)) {
// 			this.jodit.execCommand(
// 				control.command || control.name,
// 				(control.args && control.args[0]) || false,
// 				(control.args && control.args[1]) || null
// 			);
// 		} else {
// 			this.jodit.ownerDocument.execCommand(
// 				control.command || control.name,
// 				(control.args && control.args[0]) || false,
// 				(control.args && control.args[1]) || null
// 			);
// 		}
//
// 		this.jodit.events.fire('closeAllPopups');
// 	}
// }
