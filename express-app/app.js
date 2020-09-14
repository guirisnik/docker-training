const express = require('express');

const app = express();
const port = 3000;

app.get('/', function root(req, res) {
	res.send({ message: 'Hello, Product Hacking!' });
});

app.get('/secret', function secret(req, res) {
	res.send({ message: "You're all awesome ;)" });
});

app.listen(port, function onSuccess() {
	console.log(`Server running at http://localhost:${port}`);
});
