/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('AsyncStorage', () => {
	describe('AsyncStorage class', () => {
		const AsyncStorage = Jodit.modules.AsyncStorage;
		const async = new Jodit.modules.Async();

		beforeEach(() => {
			localStorage.clear();
			sessionStorage.clear();
			unmockPromise();
		});

		afterEach(() => {
			localStorage.clear();
			sessionStorage.clear();
		});

		describe('With IndexedDBProvider (default persistent)', () => {
			let storage;

			beforeEach(async () => {
				// Clean up any existing databases
				try {
					indexedDB.deleteDatabase('Jodit_testAsync');
				} catch (e) {
					// Ignore errors
				}

				storage = AsyncStorage.makeStorage(true, 'testAsync');
			});

			afterEach(async () => {
				if (!storage) {
					return;
				}

				try {
					await storage.clear();
					await storage.close();
					indexedDB.deleteDatabase('Jodit_testAsync');
				} catch (e) {
					// Ignore errors
				}
			});

			it('Should create storage with persistent provider (boolean true)', async () => {
				await storage.set('key1', 'value1');
				const value = await storage.get('key1');
				expect(value).equals('value1');
			});

			it('Should store and retrieve complex objects', async () => {
				const testObj = { a: 1, b: 'test', c: [1, 2, 3] };
				await storage.set('objKey', testObj);
				const value = await storage.get('objKey');
				expect(value).deep.equals(testObj);
			});

			it('Should check if key exists', async () => {
				await storage.set('key1', 'value1');
				const exists = await storage.exists('key1');
				const notExists = await storage.exists('nonExistent');

				expect(exists).is.true;
				expect(notExists).is.false;
			});

			it('Should delete keys', async () => {
				await storage.set('key1', 'value1');
				let exists = await storage.exists('key1');
				expect(exists).is.true;

				await storage.delete('key1');
				exists = await storage.exists('key1');
				expect(exists).is.false;
			});

			it('Should clear all data', async () => {
				await storage.set('key1', 'value1');
				await storage.set('key2', 'value2');
				await storage.clear();

				const exists1 = await storage.exists('key1');
				const exists2 = await storage.exists('key2');

				expect(exists1).is.false;
				expect(exists2).is.false;
			});

			it('Should return undefined for non-existent key', async () => {
				const value = await storage.get('nonExistent');
				expect(value).equals(undefined);
			});

			it('Should handle multiple keys independently', async () => {
				await storage.set('key1', 'value1');
				await storage.set('key2', 'value2');
				await storage.set('key3', 'value3');

				const value1 = await storage.get('key1');
				const value2 = await storage.get('key2');
				const value3 = await storage.get('key3');

				expect(value1).equals('value1');
				expect(value2).equals('value2');
				expect(value3).equals('value3');
			});
		});

		describe('With IndexedDBProvider (explicit)', () => {
			let storage;

			beforeEach(async () => {
				// Clean up any existing databases
				try {
					indexedDB.deleteDatabase('Jodit_testIndexedDB');
				} catch (e) {
					// Ignore errors
				}

				storage = AsyncStorage.makeStorage(
					'indexedDB',
					'testIndexedDB'
				);
			});

			afterEach(async () => {
				if (!storage) {
					return;
				}

				try {
					await storage.clear();
					await storage.close();
					indexedDB.deleteDatabase('Jodit_testIndexedDB');
				} catch (e) {
					// Ignore errors
				}
			});

			it('Should create storage with indexedDB strategy', async () => {
				await storage.set('key1', 'value1');
				await async.requestIdlePromise();
				const value = await storage.get('key1');
				expect(value).equals('value1');
			});

			it('Should handle large objects', async () => {
				const largeObj = {
					data: new Array(1000).fill(0).map((_, i) => ({
						id: i,
						value: `item-${i}`
					}))
				};

				await storage.set('largeKey', largeObj);
				await async.requestIdlePromise();
				const value = await storage.get('largeKey');
				expect(value).deep.equals(largeObj);
			});
		});

		describe('With LocalStorageProvider (localStorage strategy)', () => {
			let storage;

			beforeEach(async () => {
				localStorage.clear();
				storage = AsyncStorage.makeStorage('localStorage', 'testLS');
			});

			afterEach(async () => {
				if (storage) {
					await storage.clear();
					await storage.close();
				}
				localStorage.clear();
			});

			it('Should create storage with localStorage strategy', async () => {
				await storage.set('key1', 'value1');
				const value = await storage.get('key1');
				expect(value).equals('value1');
			});

			it('Should store and retrieve complex objects', async () => {
				const testObj = { x: 10, y: 'test', z: [4, 5, 6] };
				await storage.set('objKey', testObj);
				const value = await storage.get('objKey');
				expect(value).deep.equals(testObj);
			});

			it('Should check if key exists', async () => {
				await storage.set('key1', 'value1');
				const exists = await storage.exists('key1');
				const notExists = await storage.exists('nonExistent');

				expect(exists).is.true;
				expect(notExists).is.false;
			});

			it('Should delete keys', async () => {
				await storage.set('key1', 'value1');
				let exists = await storage.exists('key1');
				expect(exists).is.true;

				await storage.delete('key1');
				exists = await storage.exists('key1');
				expect(exists).is.false;
			});

			it('Should clear all data', async () => {
				await storage.set('key1', 'value1');
				await storage.set('key2', 'value2');
				await storage.clear();

				const exists1 = await storage.exists('key1');
				const exists2 = await storage.exists('key2');

				expect(exists1).is.false;
				expect(exists2).is.false;
			});
		});

		describe('With LocalStorageProvider (sessionStorage strategy)', () => {
			let storage;

			beforeEach(async () => {
				sessionStorage.clear();
				storage = AsyncStorage.makeStorage('sessionStorage', 'testSS');
			});

			afterEach(async () => {
				if (storage) {
					await storage.clear();
					await storage.close();
				}
				sessionStorage.clear();
			});

			it('Should create storage with sessionStorage strategy', async () => {
				await storage.set('sessionKey', 'sessionValue');
				const value = await storage.get('sessionKey');
				expect(value).equals('sessionValue');
			});

			it('Should store and retrieve complex objects', async () => {
				const testObj = { x: 10, y: 'session', z: [4, 5, 6] };
				await storage.set('sessionObj', testObj);
				const value = await storage.get('sessionObj');
				expect(value).deep.equals(testObj);
			});
		});

		describe('With MemoryStorageProvider (fallback)', () => {
			let storage;

			beforeEach(async () => {
				// Use false to force memory storage
				storage = AsyncStorage.makeStorage(false, 'testMemory');
			});

			it('Should create storage with memory provider', async () => {
				await storage.set('key1', 'value1');
				const value = await storage.get('key1');
				expect(value).equals('value1');
			});

			it('Should not persist data to localStorage', async () => {
				await storage.set('key1', 'value1');

				// Check that localStorage is empty
				expect(localStorage.length).equals(0);
			});

			it('Should work independently from persistent storage', async () => {
				const persistentStorage = AsyncStorage.makeStorage(
					'localStorage',
					'testPersist'
				);
				const memoryStorage = AsyncStorage.makeStorage(
					false,
					'testMem'
				);

				await persistentStorage.set('key1', 'persistent');
				await memoryStorage.set('key1', 'memory');

				const persistentValue = await persistentStorage.get('key1');
				const memoryValue = await memoryStorage.get('key1');

				expect(persistentValue).equals('persistent');
				expect(memoryValue).equals('memory');

				await persistentStorage.clear();
			});

			it('Should fallback to memory when IndexedDB is not available', async () => {
				// Temporarily override canUseIndexedDB to return false
				const originalIndexedDb = window.indexedDB;

				try {
					Object.defineProperty(window, 'indexedDB', {
						value: undefined,
						configurable: true
					});
					// Mock canUseIndexedDB to return false
					Jodit.modules.clearUseIndexedDBCache();

					const storage = AsyncStorage.makeStorage(
						true,
						'testFallback'
					);

					// Should still work with memory provider
					await storage.set('key1', 'value1');
					const value = await storage.get('key1');
					expect(value).equals('value1');

					expect(await storage.provider).instanceof(
						Jodit.modules.MemoryStorageProvider
					);

					// Should not persist to IndexedDB
					await storage.clear();
				} finally {
					Object.defineProperty(window, 'indexedDB', {
						value: originalIndexedDb,
						configurable: true
					});
				}
			});
		});

		describe('Storage strategies isolation', () => {
			afterEach(() => {
				localStorage.clear();
				sessionStorage.clear();
			});

			it('localStorage and sessionStorage strategies should be independent', async () => {
				const localStorageAsync = AsyncStorage.makeStorage(
					'localStorage',
					'strategyTest'
				);
				const sessionStorageAsync = AsyncStorage.makeStorage(
					'sessionStorage',
					'strategyTest'
				);

				await localStorageAsync.set('key', 'from localStorage');
				await sessionStorageAsync.set('key', 'from sessionStorage');

				const localValue = await localStorageAsync.get('key');
				const sessionValue = await sessionStorageAsync.get('key');

				expect(localValue).equals('from localStorage');
				expect(sessionValue).equals('from sessionStorage');

				await localStorageAsync.clear();
				const localValueAfterClear = await localStorageAsync.get('key');
				const sessionValueAfterClear =
					await sessionStorageAsync.get('key');

				expect(localValueAfterClear).equals(undefined);
				expect(sessionValueAfterClear).equals('from sessionStorage');

				await sessionStorageAsync.clear();
			});
		});

		describe('Multiple storage instances', () => {
			afterEach(async () => {
				localStorage.clear();
				sessionStorage.clear();

				try {
					indexedDB.deleteDatabase('Jodit_app1');
					indexedDB.deleteDatabase('Jodit_app2');
				} catch (e) {
					// Ignore errors
				}
			});

			it('Should isolate data by suffix (localStorage)', async () => {
				const storage1 = AsyncStorage.makeStorage(
					'localStorage',
					'app1'
				);
				const storage2 = AsyncStorage.makeStorage(
					'localStorage',
					'app2'
				);

				await storage1.set('key', 'value1');
				await storage2.set('key', 'value2');

				const value1 = await storage1.get('key');
				const value2 = await storage2.get('key');

				expect(value1).equals('value1');
				expect(value2).equals('value2');

				await storage1.clear();
				await storage2.clear();
			});

			it('Should isolate data by suffix (indexedDB)', async () => {
				const storage1 = AsyncStorage.makeStorage('indexedDB', 'app1');
				const storage2 = AsyncStorage.makeStorage('indexedDB', 'app2');

				await storage1.set('key', 'value1');
				await storage2.set('key', 'value2');
				await async.requestIdlePromise();

				const value1 = await storage1.get('key');
				const value2 = await storage2.get('key');

				expect(value1).equals('value1');
				expect(value2).equals('value2');

				await storage1.clear();
				await storage2.clear();

				if (storage1.provider && storage1.provider.close) {
					await storage1.provider.close();
				}
				if (storage2.provider && storage2.provider.close) {
					await storage2.provider.close();
				}
			});

			it('Should clear only own data', async () => {
				const storage1 = AsyncStorage.makeStorage(
					'localStorage',
					'app1'
				);
				const storage2 = AsyncStorage.makeStorage(
					'localStorage',
					'app2'
				);

				await storage1.set('key', 'value1');
				await storage2.set('key', 'value2');

				await storage1.clear();

				const value1 = await storage1.get('key');
				const value2 = await storage2.get('key');

				expect(value1).equals(undefined);
				expect(value2).equals('value2');

				await storage2.clear();
			});
		});

		describe('Data type handling', () => {
			let storage;

			beforeEach(async () => {
				localStorage.clear();
				storage = AsyncStorage.makeStorage('localStorage', 'typeTest');
			});

			afterEach(async () => {
				if (storage) {
					await storage.clear();
				}
				localStorage.clear();
			});

			it('Should handle string values', async () => {
				await storage.set('str', 'test string');
				const value = await storage.get('str');
				expect(value).equals('test string');
			});

			it('Should handle number values', async () => {
				await storage.set('num', 42);
				const value = await storage.get('num');
				expect(value).equals(42);
			});

			it('Should handle boolean values', async () => {
				await storage.set('bool', true);
				const value = await storage.get('bool');
				expect(value).equals(true);
			});

			it('Should handle object values', async () => {
				const obj = { a: 1, b: 2 };
				await storage.set('obj', obj);
				const value = await storage.get('obj');
				expect(value).deep.equals(obj);
			});

			it('Should handle array values', async () => {
				const arr = [1, 2, 3, 'test'];
				await storage.set('arr', arr);
				const value = await storage.get('arr');
				expect(value).deep.equals(arr);
			});

			it('Should handle null values', async () => {
				await storage.set('null', null);
				const value = await storage.get('null');
				expect(value).equals(null);
			});
		});
	});

	describe('Integration with Jodit editor', () => {
		it('Should have AsyncStorage module available', () => {
			expect(Jodit.modules.AsyncStorage).is.not.undefined;
		});

		it('Should have canUseIndexedDB utility function available', () => {
			expect(Jodit.modules.canUseIndexedDB).is.not.undefined;
		});

		describe('canUseIndexedDB', () => {
			it('Should return a promise that resolves to boolean', async () => {
				const result = await Jodit.modules.canUseIndexedDB();
				expect(typeof result).equals('boolean');
			});

			it('Should return true for available IndexedDB', async () => {
				Jodit.modules.clearUseIndexedDBCache();
				const result = await Jodit.modules.canUseIndexedDB();
				expect(result).is.true;
			});

			it('Should cache results', async () => {
				const result1 = await Jodit.modules.canUseIndexedDB();
				const result2 = await Jodit.modules.canUseIndexedDB();
				expect(result1).equals(result2);
			});
		});
	});
});
