const should    = require('should'),
    argsParser  = require('../index'),
    fn          = function(spec) { return function() { return argsParser(arguments, spec) }},
    fake_fn     = function fake_fn() {},
    fake_fn2    = function fake_fn2() {};

describe('parse and verify function arguments - specification 1', function () {
    let s1 = [
            { name: 'p1', type: 'string'          },
            { name: 'p2', type: ['object', Array] },
            { name: 'p3', type: 'object',         optional: true },
            { name: 'p4', type: 'function'        }
        ];
    it('should match standard params', function () {
        should.deepEqual(fn(s1)('abc', [], {}, fake_fn), { p1: "abc", p2: [], p3: {}, p4: fake_fn });
        should.deepEqual(fn(s1)('abc', [], fake_fn), { p1: "abc", p2: [], p3: null, p4: fake_fn });
        should.deepEqual(fn(s1)('abc', {}, fake_fn), { p1: "abc", p2: {}, p3: null, p4: fake_fn });
    });
    
    it('should match one object params', function () {
        should.deepEqual(fn(s1)({ p1: 'abc', p2: [], p3: {}, p4: fake_fn }), { p1: "abc", p2: [], p3: {}, p4: fake_fn });
        should.deepEqual(fn(s1)({ p1: 'abc', p2: [], p4: fake_fn }), { p1: "abc", p2: [], p3: null, p4: fake_fn });
        should.deepEqual(fn(s1)({ p1: 'abc', p2: {}, p4: fake_fn }), { p1: "abc", p2: {}, p3: null, p4: fake_fn });
    });

    it('should throw parameter mismatch', function () {
        (function() { fn(s1)('abc', {}) }).should.throw('No proper p4 parameter data type. Expected type is: function!');
        (function() { fn(s1)([1,2,3], fake_fn) }).should.throw('No proper p1 parameter data type. Expected type is: string!');
        (function() { fn(s1)('abc', fake_fn) }).should.throw('No proper p2 parameter data type. Expected type is: object|Array!');
        (function() { fn(s1)({ p1: 'abc', p4: fake_fn }) }).should.throw('Missing parameter p2!');
    });
});

describe('parse and verify function arguments - specification 2', function () {
    let s2 = [
            { name: 'p1', type: 'number',          default: 100 },
            { name: 'p2', type: ['object', Array], default: [1,2,3] },
            { name: 'p3', type: 'object',          optional: true },
            { name: 'p4', type: 'function',        default: fake_fn2 }
        ];
    it('should match standard params', function () {
        should.deepEqual(fn(s2)(1, [2], {}, fake_fn), { p1: 1, p2: [2], p3: {}, p4: fake_fn });
        should.deepEqual(fn(s2)(5, fake_fn), { p1: 5, p2: [1,2,3], p3: null, p4: fake_fn });
        should.deepEqual(fn(s2)({a:1}), { p1: 100, p2: {a:1}, p3: null, p4: fake_fn2 });
        should.deepEqual(fn(s2)(), { p1: 100, p2: [1,2,3], p3: null, p4: fake_fn2 });
    });

    it('should match one object params', function () {
        should.deepEqual(fn(s2)({ p1: 1, p2: [2], p3: {}, p4: fake_fn }), { p1: 1, p2: [2], p3: {}, p4: fake_fn });
        should.deepEqual(fn(s2)({ p1: 5, p4: fake_fn }), { p1: 5, p2: [1,2,3], p3: null, p4: fake_fn });
        should.deepEqual(fn(s2)({ p2: {a:1} }), { p1: 100, p2: {a:1}, p3: null, p4: fake_fn2 });
        should.deepEqual(fn(s2)(), { p1: 100, p2: [1,2,3], p3: null, p4: fake_fn2 });
        should.deepEqual(fn(s2)('abc'), { p1: 100, p2: [1,2,3], p3: null, p4: fake_fn2 });
    });

    it('should throw parameter mismatch', function () {
        (function() { fn(s2)({ p1: 'abc' }) }).should.throw('No proper p1 parameter data type. Expected type is: number!');
        (function() { fn(s2)({ p2: 'abc' }) }).should.throw('No proper p2 parameter data type. Expected type is: object|Array!');
        (function() { fn(s2)({ p3: 'abc' }) }).should.throw('No proper p3 parameter data type. Expected type is: object!');
        (function() { fn(s2)({ p4: 'abc' }) }).should.throw('No proper p4 parameter data type. Expected type is: function!');
    });
});
