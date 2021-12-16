/**
 * @template T
 * @typedef {[string|number|null|undefined, T[]]} Mapping
 */

/**
 * @template T
 * @typedef {Mapping<T>[]} MappedGroup
 */

/**
 * @template T
 * @typedef {{[key: string|number]: T[]}} Group
 */

/**
 * @template T
 * @callback Callback
 * @param   {T}             value Current iteration value.
 * @param   {number}        index Current iteration index.
 * @param   {T[]}           array Original array reference.
 * @returns {string|number}
 */

/**
 * Group array items to map.
 *
 * @template T
 * @callback Ponyfill
 * @param   {T[]}                                             array    Array to group.
 * @param   {Callback<T>}                                     callback Callback which should return key with which to group array.
 * @returns {Map<MappedGroup<T>[0][0], MappedGroup<T>[0][1]>}
 */

/**
 * @template T
 * @type {Ponyfill<T>}
 * @this {T[]}
 */
function ponyfill(array, callback) {
	if (!Array.isArray(array)) {
		throw new TypeError(`Can’t call method on ${array}`);
	}

	if (typeof callback !== 'function') {
		throw new TypeError(`${callback} is not a function`);
	}

	/**
	 * @template T
	 * @type {Group<T>}
	 */
	const result = {};

	let count = -1;
	/** @type {{[key: string|number]: number}} */
	const indices = {};

	array.forEach((value, index, array) => {
		const key = callback.call(this, value, index, array);
		indices[key] ??= ++count;
		result[key] ??= [];
		result[key].push(value);
	});

	/**
	 * @template T
	 * @type {MappedGroup<T>}
	 */
	const mappedResult = [];

	for (const key in result) {
		// @ts-ignore
		if (Object.hasOwn(result, key)) {
			// eslint-disable-next-line no-undefined
			const resolvedKey = key === 'undefined' ? undefined : key;
			/**
			 * @template T
			 * @type {Mapping<T>}
			 */
			const value = [resolvedKey, result[key]];
			mappedResult[indices[key]] = value;
		}
	}

	return new Map(mappedResult);
}

/* istanbul ignore next */

/**
 * @template T
 * @type {Ponyfill<T>}
 */
function preferNative(array, callback) {
	// @ts-ignore
	if (typeof Array.prototype.groupByToMap !== 'undefined') {
		// @ts-ignore
		return array.groupByToMap(callback);
	}
	return ponyfill(array, callback);
}

export default ponyfill;

export { preferNative };
