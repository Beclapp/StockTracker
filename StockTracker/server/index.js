const express = require("express");
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3001;

const app = express();

var jsonParser = bodyParser.json();



let stocks = [
              {id: 0, name: "stockone"},
              {id: 1, name: "stocktwo"},
              {id: 2, name: "stockthree"},
              ];

const generateID = () => {
	const maxId = stocks.length > 0 ? Math.max(...stocks.map(s => s.id)) : 0;
	return maxId + 1;
}
app.get("/api", (req, res) => {
	res.json({ message: "Hello from server!" });
});

app.get("/api/stocks/", (req, res) => {
	console.log(stocks);
	res.json(stocks[0]);
});

app.get('/api/stocks/:id', (req, res) => {
	const id = Number(req.params.id);
	const stock = stocks.find(stock => stock.id === id);
	res.json(stock);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(jsonParser);
app.post('/api/stocks', (req, res) => {
	const body = req.body;
	const item = {
			id: generateID(),
			name: body.content
	}
	stocks = stocks.concat(item)
	res.json(item)
})
