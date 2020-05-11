var PORT = process.env['PORT'] || 5000;

var app = require('./lib/graphQL_api.js')();
var app_rest = require('./lib/app.js')();


console.log("Running @ http://localhost:" + PORT + ". Press ^C to Terminate.");
app.listen(PORT, () => {
    console.log('application is running in port ', PORT);
});
app_rest.listen(PORT + 1, () => {
    console.log('application is running in port ', PORT + 1);
})