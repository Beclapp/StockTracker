const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

let stocks = [
              {id: 0, name: "stockone"},
              {id: 1, name: "stocktwo"},
              {id: 2, name: "stockthree"},
              ];

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
