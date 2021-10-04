import React from "react";
import StockItem from "./StockItem";

const finnhub = require("finnhub");
const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "bvue7g748v6pkq83cj3g";
const finnhubClient = new finnhub.DefaultApi();

//Boolean on whether the current stock is displayed, enables portfolio info,
//refresh button, and list to appear once at least a single stock is displayed.
let stockdisplayed = false;

//The list that keeps track of all stock entries in the list.
let staticlist = [];

//Sum of the total portfolio price
let sum = 0;

//Lets each stock item keep track of its place on the list.
let index = 0;

//Rounds Numbers up to two digits.
function roundTwo(num) {
  return Math.round(num * 100) / 100;
}

//Determines if the current price is higher than at the beginning of the day.
function determinePrice(current, open) {
  if (current >= open) {
    return "green";
  } else {
    return "red";
  }
}

export default class StockList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currDisplay: "",
      stock: "",
      display: false
    };
  }
  //Retrieves the symbol from the api using a search function.
  lookupSymbol = () => {
    //Prevents the screen from automatically refreshing.
    //I don't know exactly what it does but my program breaks without it.
    //event.preventDefault();
    try {
      fetch(
        "https://finnhub.io/api/v1/search?q=" +
          this.state.currDisplay +
          "&token=" +
          api_key.apiKey
      )
        .then((data) => data.json())
        .then((res) => {
          if (res.count === 0) {
            alert("Error: Stock not found");
            this.setState({ currDisplay: "" });
          } else {
            this.displayInfo(
              res.result[0].displaySymbol,
              res.result[0].description
            );
          }
        });
    } catch (err) {
      alert("HTTP Error");
      this.setState({ currDisplay: "" });
    }
  };

  //Displays the Info using the symbol and the name, adds it to the list.
  displayInfo = (symbol, name) => {
    finnhubClient.quote(symbol, (error, data, response) => {
      if (data === null) {
        alert("Error finding stock");
        this.setState({ currDisplay: "" });
        return;
      }
      stockdisplayed = true;
      sum += data.c;
      staticlist.push({
        name: name,
        symbol: symbol,
        color: determinePrice(data.c, data.o),
        curr: data.c,
        shares: 1
      });
      index++;
      this.setState({ currDisplay: "" });
    });
  };
  //Updates the search box as the user types in a query.
  handleChange = (event) => {
	event.preventDefault();
    this.setState({ currDisplay: event.target.value });
  };

  //Clears the list of all entries.
  clearList = () => {
    //event.preventDefault();
    staticlist = [];
    this.setState({ display: false });
    sum = 0;
    stockdisplayed = false;
  };

  //Adds a share to the list item.
  addShare = (name) => {
    let item = staticlist.find((share) => name === share.name);
    sum += item.curr;
    item.shares += 1;
    this.setState({ currDisplay: "" });
  };

  //Removes a share from the list item.
  removeShare = (name) => {
    let item = staticlist.find((share) => name === share.name);
    sum -= item.curr;
    item.shares -= 1;
    this.setState({ currDisplay: "" });
  };

  deleteShare = (name) => {
    let item = staticlist.find((share) => name === share.name);
    sum -= item.curr * item.shares;
    staticlist.splice(staticlist.indexOf(item), 1);
    this.setState({ currDisplay: "" });
  };

  //Updates every list item with the current price and color.
  refreshList = () => {
    sum = 0;
    staticlist.forEach((item) => {
      finnhubClient.quote(item.symbol, (error, data, response) => {
        if (data !== null) {
          let newPrice = roundTwo(data.c);
          sum += newPrice * item.shares;
          item.color = determinePrice(newPrice, data.o);
          item.curr = newPrice;
          this.setState({ currDisplay: "" });
        }
      });
    });
  };
  render() {
    return (
      <div>
        <h2>Enter Stocks Below (Use Name):</h2>
        <form>
          <label>
            <input
              type="text"
              name="name"
              value={this.state.currDisplay}
              onChange={this.handleChange}
              index={index}
            />
          </label>
          <button onClick={this.lookupSymbol}>Submit</button>
          <button onClick={this.clearList}>Clear</button>
        </form>
        <p>{stockdisplayed && "Portfolio Value: $" + roundTwo(sum)}</p>
        <ul>
          {staticlist.map((item) => (
            <StockItem
              data={item.name}
              color={item.color}
              currentPrice={item.curr}
              addShare={this.addShare}
              decreaseShare={this.removeShare}
              deleteShare={this.deleteShare}
            />
          ))}
        </ul>
        {stockdisplayed && <button onClick={this.refreshList}>Refresh</button>}
      </div>
    );
  }
}
