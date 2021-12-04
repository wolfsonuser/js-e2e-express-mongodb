## 12.04.2021

### npm test
wolfsonuser52nv53c@DESKTOP-52NV53C MINGW64 ~/GITHUB/js-e2e-express-mongodb (main)
$ npm test

> js-e2e-express-mongo@1.0.0 test
> jest --detectOpenHandles

  console.log
    DB:mongodb://localhost:27017

      at Object.<anonymous> (src/data.js:19:9)

  console.log
    DB connected = true

      at Object.connectToDatabase (src/data.js:85:17)

 PASS  test/data-integration.test.js (7.124 s)
  mongoDB native API
    √ integration with DB (177 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        20.699 s
Ran all test suites.

### npm