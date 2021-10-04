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
	getData = () => {
		console.log("here");
	    fetch("/api")
	      .then(res => res.text())
	      .then(
	        (result) => {
	          data = JSON.parse(result).message;
	          //result = JSON.parse(result);
	          //console.log(result.message)
	          this.setState({display: true})
	        }
	      )
	  }
  render() {
    return (
      <div>
        <h1>{data}</h1>
        <button onClick={this.getData}>get data</button>
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
