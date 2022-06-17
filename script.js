import parse from "https://cdn.skypack.dev/html-react-parser@1.4.13";

const buttons = [
{
  id: "seven",
  strValue: "7" },

{
  id: "eight",
  strValue: "8" },

{
  id: "nine",
  strValue: "9" },

{
  id: "del",
  strValue: "DEL" },

{
  id: "clear",
  strValue: "AC" },

{
  id: "four",
  strValue: "4" },

{
  id: "five",
  strValue: "5" },

{
  id: "six",
  strValue: "6" },

{
  id: "multiply",
  strValue: "x" },

{
  id: "divide",
  strValue: "/" },

{
  id: "one",
  strValue: "1" },

{
  id: "two",
  strValue: "2" },

{
  id: "three",
  strValue: "3" },

{
  id: "add",
  strValue: "+" },

{
  id: "subtract",
  strValue: "-" },

{
  id: "zero",
  strValue: "0" },

{
  id: "decimal",
  strValue: "." },

{
  id: "ans",
  strValue: "Ans" },

{
  id: "equals",
  strValue: "=" }];



function parseArray(arr) {
  let result = 0;
  let operator = "+";

  for (let i = 0; i < arr.length; i++) {
    if (Number.isNaN(Number(arr[i]))) {
      operator = arr[i];
    } else {
      switch (operator) {
        case "+":
          result += Number(arr[i]);
          break;
        case "-":
          result -= Number(arr[i]);
          break;
        case "x":
        case "x+":
          result *= Number(arr[i]);
          break;
        case "x-":
          result = -result * Number(arr[i]);
          break;
        case "/":
        case "/+":
          result /= Number(arr[i]);
          break;
        case "/-":
          result = -result / Number(arr[i]);
          break;}

    }
  }
  return result;
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ans: "0",
      expression: "",
      result: "0",
      op: false,
      evaluated: false };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {

    switch (e.target.value) {
      case "9":
      case "8":
      case "7":
      case "6":
      case "5":
      case "4":
      case "3":
      case "2":
      case "1":
      case "0":
        if (this.state.expression[this.state.expression.length - 1] != "s") {
          if (this.state.evaluated) {
            this.setState(state => ({ expression: e.target.value,
              result: e.target.value,
              evaluated: false }));
          } else if (this.state.result == "0" || this.state.op || this.state.result == "Ans") {
            this.setState(state => ({ expression: state.expression + e.target.value,
              result: e.target.value,
              op: false }));
          } else {
            this.setState(state => ({ expression: state.expression + e.target.value,
              result: state.result + e.target.value }));
          }
        }
        break;
      case ".":
        if (this.state.expression[this.state.expression.length - 1] != "s") {
          if (this.state.result.match(/\./g) == null || this.state.result.match(/\./g).length < 1) {
            if (this.state.result == "0" || this.state.op || this.state.evaluated || this.state.result == "Ans") {
              this.setState(state => ({ expression: state.expression + e.target.value,
                result: e.target.value,
                op: false }));
            } else {
              this.setState(state => ({ expression: state.expression + e.target.value,
                result: state.result + e.target.value }));
            }
          }
        }
        break;
      case "+":
      case "x":
      case "-":
      case "/":
        if (this.state.evaluated) {
          this.setState(state => ({ expression: "Ans" + e.target.value,
            result: e.target.value,
            op: true,
            evaluated: false }));
        } else {
          this.setState(state => ({ expression: state.expression + e.target.value,
            result: e.target.value,
            op: true }));
        }
        break;
      case "DEL":
        if (!this.state.evaluated) {
          if (this.state.expression[this.state.expression.length - 1] == "s") {
            this.setState(state => ({ expression: state.expression.slice(0, -3),
              result: state.result.slice(0, -3),
              op: state.expression.length > 4 ? state.expression[state.expression.length - 4].match(/([x\-\/\+])/g) : this.state.op }));
          } else {
            this.setState(state => ({ expression: state.expression.slice(0, -1),
              result: state.result.slice(0, -1),
              op: state.expression.length > 2 ? state.expression[state.expression.length - 2].match(/([x\-\/\+])/g) : this.state.op }));
          }
        }
        break;
      case "AC":
        this.setState({ expression: "", result: "0", evaluated: true });
        break;
      case "=":
        let reOp2 = /(x\-|\/\-|[x\/])/g;
        let reOp1 = /((?<![x\+\-\/])\-|\+)/g;
        let reMultiple = /[\+\-x\/]{2,}/g;

        let expression = this.state.expression;
        expression = expression.replace(/Ans/g, this.state.ans);
        let arr = expression.match(reMultiple);

        if (arr != null) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i][arr[i].length - 1] == "-") {
              let startPos = expression.indexOf(arr[i]);
              expression = expression.split("");
              expression.splice(startPos, arr[i].length - 2);
              expression = expression.join("");
            } else {
              let startPos = expression.indexOf(arr[i]);
              expression = expression.split("");
              expression.splice(startPos, arr[i].length - 1);
              expression = expression.join("");
            }
          }
        }

        expression = expression.split(reOp1).map(x => x.split(reOp2).length > 1 ? x.split(reOp2) : x);

        let res = parseArray(expression.map(x => Array.isArray(x) ? parseArray(x) : x));
        this.setState({ result: res, ans: res, evaluated: true });

        break;

      case "Ans":
        if (this.state.expression == "" || this.state.op) {
          this.setState(state => ({ expression: state.expression + e.target.value,
            result: e.target.value,
            op: false }));
        }
        break;}

  }

  render() {
    let btns = buttons.map((x) => /*#__PURE__*/
    React.createElement("button", { id: x.id, class: "btn btn-outline-dark", onClick: this.handleClick, value: x.strValue }, parse(x.strValue)));

    return /*#__PURE__*/(
      React.createElement("div", { id: "background", className: "d-flex flex-column justify-content-center align-items-center h-100 w-100" }, /*#__PURE__*/
      React.createElement("div", { id: "dis" }, /*#__PURE__*/
      React.createElement("p", { id: "input" },
      this.state.expression), /*#__PURE__*/

      React.createElement("div", { id: "display" },
      this.state.result)), /*#__PURE__*/


      React.createElement("div", { id: "buttons" },
      btns)));



  }}



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render( /*#__PURE__*/React.createElement(Calculator, null));