import React, {useState, useEffect} from "react";
import "./styles.css";

let data = "";
export default class page2 extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      display: false
	    };
	  }
	getData = (id) => {
	    fetch("/api/stocks/" + id)
	      .then(res => res.text())
	      .then(
	        (result) => {
	          data = JSON.parse(JSON.stringify(result));
	          //result = JSON.parse(result);
	          console.log(data);
	          this.setState({display: true})
	        }
	      )
	  }
	sendData = (id) => {
		fetch("/api/stocks", {
			method: 'POST',
			body: JSON.stringify({ content: "stockfour" }),
			headers: {"Content-Type": "application/json"}
		}).then(res => res.json())
		.then(json => {
			console.log(json);
			this.getData(3);
		});
	}
  render() {
    return (
      <div>
        <h1>{data}</h1>
        <button onClick={() => this.getData(0)}>get data</button>
        <button onClick={() =>this.getData(1)}>get second</button>
        <button onClick={()=>this.getData(2)}>get third</button>
        <button onClick={() => this.sendData(4)}>create four</button>
      </div>
    );
  }
}
//function page2() {
//	const [data, setData] = React.useState(null);
//	
//	React.useEffect(() => {
//		fetch("/api")
//			.then((res) => res.json())
//			.then((data) => setData(data.message));
//	})
//	return (
//			<div>
//				<h1>{!data ? "Loading..." : data}</h1>
//			</div>
//			);
//}
//
//export default page2;
