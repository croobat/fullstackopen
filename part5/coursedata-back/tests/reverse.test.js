const { test, describe } = require('node:test');
const assert = require('node:assert');

const { reverse } = require('../utils/for_testing');

describe('reverse', () => {
	test('reverse of a', () => {
		const result = reverse('a');

		assert.strictEqual(result, 'a');
	});

	test('reverse of react', () => {
		const result = reverse('react');

		assert.strictEqual(result, 'tcaer');
	});

	test('reverse of releveler', () => {
		const result = reverse('releveler');

		assert.strictEqual(result, 'releveler');
	});
});
