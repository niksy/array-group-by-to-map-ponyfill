import assert from 'assert';
import groupByToMap from '../index';

it('handles simple array', function () {
	const array = [1];
	const context = {};
	groupByToMap.call(context, array, function (...arguments_) {
		const [value, key, that] = arguments_;
		assert.equal(
			arguments_.length,
			3,
			'Correct number of callback arguments'
		);
		assert.equal(value, 1, 'Correct value in callback');
		assert.equal(key, 0, 'Correct index in callback');
		assert.equal(that, array, 'Correct link to array in callback');
		// @ts-ignore
		assert.equal(this, context, 'Correct callback context');
		return '';
	});
});

it('handles complex arrays', function () {
	/* eslint-disable no-undefined, unicorn/prefer-spread */
	assert.deepEqual(
		Array.from(groupByToMap([1, 2, 3], (value) => value % 2)),
		[
			[1, [1, 3]],
			[0, [2]]
		],
		'#1'
	);
	assert.deepEqual(
		Array.from(
			groupByToMap(
				[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
				(value) => `i${value % 5}`
			)
		),
		[
			['i1', [1, 6, 11]],
			['i2', [2, 7, 12]],
			['i3', [3, 8]],
			['i4', [4, 9]],
			['i0', [5, 10]]
		],
		'#2'
	);
	assert.deepEqual(
		Array.from(groupByToMap(Array.from({ length: 3 }), (value) => value)),
		[[undefined, [undefined, undefined, undefined]]],
		'#3'
	);
});

it('handles invalid arguments', function () {
	// @ts-ignore
	assert.throws(() => groupByToMap(null, () => {}), TypeError);
	// @ts-ignore
	assert.throws(() => groupByToMap([], null), TypeError);
});
