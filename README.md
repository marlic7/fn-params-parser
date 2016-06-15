# fn-params-parser
Function arguments parse and verify compiliance with specification

If You want to perform some type checks on function arguments but not interested
in TypeScript or Flow this small lib could be helpfull.


## Instalation

```bash
npm install --save fn-params-parser
```

## Usage

```js
const parser = require('fn-params-parser');

function myCoolFunction() {
    const argsSpec = [
            { name: 'p1', type: 'string' },
            { name: 'p2', type: ['object', Array], default: [] },
            { name: 'p3', type: 'object',          optional: true },
            { name: 'p4', type: 'function' }
        ],
        args = parser(arguments, argsSpec);

    // now arguments are clean and confirm with spec
    console.log(args.p1, args.p2, args.p3, args.p4);
}

```

Now You can invoke function with two methods:
 * position parameters
 * one object parameter with keys as param name from spec

Examples of function invocation:

```js
    myCoolFunction('abc', [1,2,3], function() {});
    // output: abc [ 1, 2, 3 ] null function () {}

    myCoolFunction({ p1: 'abc', p4: function() {} });
    // output: abc [] null function () {}

    myCoolFunction('abc');
    // output: Error: No proper p4 parameter data type. Expected type is: function!
```

