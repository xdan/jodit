/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Storage', () => {
	describe('LocalStorageProvider', () => {
		const LocalStorageProvider = Jodit.modules.LocalStorageProvider;
		let provider;

		beforeEach(() => {
			localStorage.clear();
		});

		afterEach(() => {
			localStorage.clear();
		});

		describe('localStorage strategy (default)', () => {
			beforeEach(() => {
				unmockPromise();
				provider = new LocalStorageProvider('TestApp');
			});

			it('Should store and retrieve values', () => {
				provider.set('key1', 'value1');
				expect(provider.get('key1')).equals('value1');
			});

			it('Should store and retrieve complex objects', () => {
				const testObj = { a: 1, b: 'test', c: [1, 2, 3] };
				provider.set('objKey', testObj);
				expect(provider.get('objKey')).deep.equals(testObj);
			});

			it('Should check if key exists', () => {
				provider.set('key1', 'value1');
				expect(provider.exists('key1')).is.true;
				expect(provider.exists('nonExistent')).is.false;
			});

			it('Should delete key', () => {
				provider.set('key1', 'value1');
				expect(provider.exists('key1')).is.true;
				provider.delete('key1');
				expect(provider.exists('key1')).is.false;
			});

			it('Should clear all data', () => {
				provider.set('key1', 'value1');
				provider.set('key2', 'value2');
				provider.clear();
				expect(provider.exists('key1')).is.false;
				expect(provider.exists('key2')).is.false;
			});

			it('Should return undefined for non-existent key', () => {
				expect(provider.get('nonExistent')).equals(undefined);
			});

			it('Should handle multiple keys independently', () => {
				provider.set('key1', 'value1');
				provider.set('key2', 'value2');
				provider.set('key3', 'value3');

				expect(provider.get('key1')).equals('value1');
				expect(provider.get('key2')).equals('value2');
				expect(provider.get('key3')).equals('value3');
			});
		});

		describe('sessionStorage strategy', () => {
			beforeEach(() => {
				unmockPromise();
				sessionStorage.clear();
				provider = new LocalStorageProvider(
					'TestApp',
					'sessionStorage'
				);
			});

			afterEach(() => {
				sessionStorage.clear();
			});

			it('Should store and retrieve values in sessionStorage', () => {
				provider.set('sessionKey', 'sessionValue');
				expect(provider.get('sessionKey')).equals('sessionValue');
			});

			it('Should store and retrieve complex objects in sessionStorage', () => {
				const testObj = { x: 10, y: 'session', z: [4, 5, 6] };
				provider.set('sessionObj', testObj);
				expect(provider.get('sessionObj')).deep.equals(testObj);
			});

			it('Should check if key exists in sessionStorage', () => {
				provider.set('sessionKey', 'sessionValue');
				expect(provider.exists('sessionKey')).is.true;
				expect(provider.exists('nonExistent')).is.false;
			});

			it('Should clear sessionStorage data', () => {
				provider.set('key1', 'value1');
				provider.set('key2', 'value2');
				provider.clear();
				expect(provider.exists('key1')).is.false;
				expect(provider.exists('key2')).is.false;
			});
		});

		describe('Strategy isolation', () => {
			it('localStorage and sessionStorage should be independent', () => {
				const localProvider = new LocalStorageProvider(
					'TestApp',
					'localStorage'
				);
				const sessionProvider = new LocalStorageProvider(
					'TestApp',
					'sessionStorage'
				);

				localProvider.set('key1', 'localStorage value');
				sessionProvider.set('key1', 'sessionStorage value');

				expect(localProvider.get('key1')).equals('localStorage value');
				expect(sessionProvider.get('key1')).equals(
					'sessionStorage value'
				);

				localProvider.clear();
				expect(localProvider.get('key1')).equals(undefined);
				expect(sessionProvider.get('key1')).equals(
					'sessionStorage value'
				);
			});
		});
	});

	describe('MemoryStorageProvider', () => {
		const MemoryStorageProvider = Jodit.modules.MemoryStorageProvider;
		let provider;

		beforeEach(() => {
			provider = new MemoryStorageProvider();
		});

		it('Should store and retrieve values', () => {
			provider.set('key1', 'value1');
			expect(provider.get('key1')).equals('value1');
		});

		it('Should store and retrieve complex objects', () => {
			const testObj = { a: 1, b: 'test', c: [1, 2, 3] };
			provider.set('objKey', testObj);
			expect(provider.get('objKey')).deep.equals(testObj);
		});

		it('Should check if key exists', () => {
			provider.set('key1', 'value1');
			expect(provider.exists('key1')).is.true;
			expect(provider.exists('nonExistent')).is.false;
		});

		it('Should delete key', () => {
			provider.set('key1', 'value1');
			expect(provider.exists('key1')).is.true;
			provider.delete('key1');
			expect(provider.exists('key1')).is.false;
		});

		it('Should clear all data', () => {
			provider.set('key1', 'value1');
			provider.set('key2', 'value2');
			provider.clear();
			expect(provider.exists('key1')).is.false;
			expect(provider.exists('key2')).is.false;
		});
	});

	describe('IndexedDBProvider', () => {
		const IndexedDBProvider = Jodit.modules.IndexedDBProvider;
		let provider;

		beforeEach(async () => {
			unmockPromise();
			// Clean up any existing databases
			try {
				indexedDB.deleteDatabase('TestDB');
			} catch (e) {
				// Ignore errors
			}

			await delay(50);
			provider = new IndexedDBProvider('TestDB', 'testStore');
		});

		afterEach(async () => {
			if (!provider) {
				return;
			}

			try {
				await provider.clear();
				await provider.close();
				indexedDB.deleteDatabase('TestDB');
			} catch (e) {
				// Ignore errors
			}
		});

		describe('Basic operations', () => {
			it('Should store and retrieve values', async () => {
				await provider.set('key1', 'value1');
				const value = await provider.get('key1');
				expect(value).equals('value1');
			});

			it('Should store and retrieve complex objects', async () => {
				const testObj = { a: 1, b: 'test', c: [1, 2, 3] };
				await provider.set('objKey', testObj);
				const value = await provider.get('objKey');
				expect(value).deep.equals(testObj);
			});

			it('Should check if key exists', async () => {
				await provider.set('key1', 'value1');
				const exists = await provider.exists('key1');
				const notExists = await provider.exists('nonExistent');

				expect(exists).is.true;
				expect(notExists).is.false;
			});

			it('Should delete key', async () => {
				await provider.set('key1', 'value1');
				let exists = await provider.exists('key1');
				expect(exists).is.true;

				await provider.delete('key1');
				exists = await provider.exists('key1');
				expect(exists).is.false;
			});

			it('Should clear all data', async () => {
				await provider.set('key1', 'value1');
				await provider.set('key2', 'value2');
				await provider.clear();

				const exists1 = await provider.exists('key1');
				const exists2 = await provider.exists('key2');

				expect(exists1).is.false;
				expect(exists2).is.false;
			});

			it('Should return undefined for non-existent key', async () => {
				const value = await provider.get('nonExistent');
				expect(value).equals(undefined);
			});
		});

		describe('Advanced operations', () => {
			it('Should get all keys', async () => {
				await provider.set('key1', 'value1');
				await provider.set('key2', 'value2');
				await provider.set('key3', 'value3');

				const keys = await provider.keys();
				expect(keys.sort()).deep.equals(['key1', 'key2', 'key3']);
			});

			it('Should get all values', async () => {
				await provider.set('key1', 'value1');
				await provider.set('key2', 'value2');
				await provider.set('key3', 'value3');

				const values = await provider.values();
				expect(values.sort()).deep.equals([
					'value1',
					'value2',
					'value3'
				]);
			});

			it('Should get all entries', async () => {
				await provider.set('key1', 'value1');
				await provider.set('key2', 'value2');

				const entries = await provider.entries();
				const sorted = entries.sort((a, b) => a[0].localeCompare(b[0]));

				expect(sorted).deep.equals([
					['key1', 'value1'],
					['key2', 'value2']
				]);
			});

			it('Should handle large objects', async () => {
				const largeObj = {
					data: new Array(1000).fill(0).map((_, i) => ({
						id: i,
						value: `item-${i}`
					}))
				};

				await provider.set('largeKey', largeObj);
				const value = await provider.get('largeKey');
				expect(value).deep.equals(largeObj);
			});
		});
	});

	describe('Storage class', () => {
		const Storage = Jodit.modules.Storage;

		beforeEach(() => {
			localStorage.clear();
			sessionStorage.clear();
		});

		afterEach(() => {
			localStorage.clear();
			sessionStorage.clear();
		});

		describe('With LocalStorageProvider (persistent)', () => {
			it('Should create storage with persistent provider (boolean true)', () => {
				const storage = Storage.makeStorage(true, 'test');
				storage.set('key1', 'value1');
				expect(storage.get('key1')).equals('value1');
			});

			it('Should create storage with localStorage strategy', () => {
				const storage = Storage.makeStorage('localStorage', 'testLS');
				storage.set('key1', 'value1');
				expect(storage.get('key1')).equals('value1');
			});

			it('Should create storage with sessionStorage strategy', () => {
				const storage = Storage.makeStorage('sessionStorage', 'testSS');
				storage.set('sessionKey', 'sessionValue');
				expect(storage.get('sessionKey')).equals('sessionValue');
			});

			it('Should use prefix for keys', () => {
				const storage = Storage.makeStorage(true, 'MyApp');
				storage.set('setting', 'value');
				expect(storage.get('setting')).equals('value');
			});

			it('Should work with exists method', () => {
				const storage = Storage.makeStorage(true, 'test');
				storage.set('key1', 'value1');
				expect(storage.exists('key1')).is.true;
				expect(storage.exists('nonExistent')).is.false;
			});

			it('Should delete keys', () => {
				const storage = Storage.makeStorage(true, 'test');
				storage.set('key1', 'value1');
				expect(storage.exists('key1')).is.true;
				storage.delete('key1');
				expect(storage.exists('key1')).is.false;
			});

			it('Should clear all data', () => {
				const storage = Storage.makeStorage(true, 'test');
				storage.set('key1', 'value1');
				storage.set('key2', 'value2');
				storage.clear();
				expect(storage.exists('key1')).is.false;
				expect(storage.exists('key2')).is.false;
			});
		});

		describe('Storage strategies isolation', () => {
			it('localStorage and sessionStorage strategies should be independent', () => {
				const localStorage = Storage.makeStorage(
					'localStorage',
					'strategyTest'
				);
				const sessionStorage = Storage.makeStorage(
					'sessionStorage',
					'strategyTest'
				);

				localStorage.set('key', 'from localStorage');
				sessionStorage.set('key', 'from sessionStorage');

				expect(localStorage.get('key')).equals('from localStorage');
				expect(sessionStorage.get('key')).equals('from sessionStorage');

				localStorage.clear();
				expect(localStorage.get('key')).equals(undefined);
				expect(sessionStorage.get('key')).equals('from sessionStorage');
			});

			it('Different strategy types should be independent', () => {
				const persistentStorage = Storage.makeStorage(true, 'mixed');
				const localStorageStrategy = Storage.makeStorage(
					'localStorage',
					'mixed'
				);

				persistentStorage.set('test', 'persistent');
				localStorageStrategy.set('test', 'strategy');

				// Both should use localStorage, so values should be the same
				expect(persistentStorage.get('test')).equals('strategy');
				expect(localStorageStrategy.get('test')).equals('strategy');
			});
		});

		describe('With MemoryStorageProvider (non-persistent)', () => {
			it('Should create storage with memory provider', () => {
				const storage = Storage.makeStorage(false, 'test');
				storage.set('key1', 'value1');
				expect(storage.get('key1')).equals('value1');
			});

			it('Should not persist data to localStorage', () => {
				const storage = Storage.makeStorage(false, 'test');
				storage.set('key1', 'value1');

				// Check that localStorage is empty
				expect(localStorage.length).equals(0);
			});

			it('Should work independently from persistent storage', () => {
				const persistentStorage = Storage.makeStorage(true, 'test');
				const memoryStorage = Storage.makeStorage(false, 'test');

				persistentStorage.set('key1', 'persistent');
				memoryStorage.set('key1', 'memory');

				expect(persistentStorage.get('key1')).equals('persistent');
				expect(memoryStorage.get('key1')).equals('memory');
			});
		});

		describe('Multiple storage instances', () => {
			it('Should isolate data by suffix', () => {
				const storage1 = Storage.makeStorage(true, 'app1');
				const storage2 = Storage.makeStorage(true, 'app2');

				storage1.set('key', 'value1');
				storage2.set('key', 'value2');

				expect(storage1.get('key')).equals('value1');
				expect(storage2.get('key')).equals('value2');
			});

			it('Should clear only own data', () => {
				const storage1 = Storage.makeStorage(true, 'app1');
				const storage2 = Storage.makeStorage(true, 'app2');

				storage1.set('key', 'value1');
				storage2.set('key', 'value2');

				storage1.clear();

				expect(storage1.get('key')).equals(undefined);
				expect(storage2.get('key')).equals('value2');
			});
		});

		describe('Data type handling', () => {
			let storage;

			beforeEach(() => {
				storage = Storage.makeStorage(true, 'typeTest');
			});

			it('Should handle string values', () => {
				storage.set('str', 'test string');
				expect(storage.get('str')).equals('test string');
			});

			it('Should handle number values', () => {
				storage.set('num', 42);
				expect(storage.get('num')).equals(42);
			});

			it('Should handle boolean values', () => {
				storage.set('bool', true);
				expect(storage.get('bool')).equals(true);
			});

			it('Should handle object values', () => {
				const obj = { a: 1, b: 2 };
				storage.set('obj', obj);
				expect(storage.get('obj')).deep.equals(obj);
			});

			it('Should handle array values', () => {
				const arr = [1, 2, 3, 'test'];
				storage.set('arr', arr);
				expect(storage.get('arr')).deep.equals(arr);
			});

			it('Should handle null values', () => {
				storage.set('null', null);
				expect(storage.get('null')).equals(null);
			});
		});
	});

	describe('Integration with Jodit editor', () => {
		it('Should have Storage module available', () => {
			expect(Jodit.modules.Storage).is.not.undefined;
			expect(Jodit.modules.LocalStorageProvider).is.not.undefined;
			expect(Jodit.modules.MemoryStorageProvider).is.not.undefined;
			expect(Jodit.modules.IndexedDBProvider).is.not.undefined;
		});

		it('Should have utility functions available', () => {
			expect(Jodit.modules.canUsePersistentStorage).is.not.undefined;
		});

		describe('canUsePersistentStorage', () => {
			it('Should return boolean for default (localStorage)', () => {
				const result = Jodit.modules.canUsePersistentStorage();
				expect(typeof result).equals('boolean');
			});

			it('Should return boolean for localStorage strategy', () => {
				const result =
					Jodit.modules.canUsePersistentStorage('localStorage');
				expect(typeof result).equals('boolean');
			});

			it('Should return boolean for sessionStorage strategy', () => {
				const result =
					Jodit.modules.canUsePersistentStorage('sessionStorage');
				expect(typeof result).equals('boolean');
			});

			it('Should return true for available storages', () => {
				expect(Jodit.modules.canUsePersistentStorage('localStorage')).is
					.true;
				expect(Jodit.modules.canUsePersistentStorage('sessionStorage'))
					.is.true;
			});

			it('Should cache results', () => {
				const result1 =
					Jodit.modules.canUsePersistentStorage('localStorage');
				const result2 =
					Jodit.modules.canUsePersistentStorage('localStorage');
				expect(result1).equals(result2);
			});

			it('Should handle different strategies independently', () => {
				const localResult =
					Jodit.modules.canUsePersistentStorage('localStorage');
				const sessionResult =
					Jodit.modules.canUsePersistentStorage('sessionStorage');

				expect(typeof localResult).equals('boolean');
				expect(typeof sessionResult).equals('boolean');
			});
		});
	});
});
