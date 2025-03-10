const reverse = string => string.split('').reverse().join('');

const average = array => {
	const reducer = (sum, item) => sum + item;

	return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length;
};

module.exports = { reverse, average };
