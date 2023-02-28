const sharedConfig = require('../../jest.config');

module.exports = {
    ...sharedConfig,
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
}