import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// FE
import Navbar from "./components/layouts/Navbar";
import SearchBar from "./components/layouts/SearchBar";
import About from "./components/about/About";
import Items from "./components/items/Items";
import ShowItem from "./components/items/ShowItem";
import Category from "./components/category/Category";

// BE
import Login from "./components/BE/Auth/Login";

// import styles
import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css/dist/js/materialize.min.js";
import "./App.css";
import "./bootstrap.css";
import Axios from "axios";

const App = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  // const [itemDetails, setItemDetails] = useState({});
  const [SearchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    getCategories();
    getItems();
    M.AutoInit();
  }, []);

  const getCategories = async () => {
    const res = await Axios.get("http://127.0.0.1:8001/api/categories");
    const data = res.data.apidata;
    setCategories(data);
  };

  const getItems = async () => {
    const res = await Axios.get("http://127.0.0.1:8001/api/items");
    const data = res.data.apidata;
    // console.log(data);
    setItems(data);
  };

  const resetItems = () => {
    setSearchKeyword("");
  };

  const itemDetails = {
    id: 201,
    item_name: "Tuna fish",
    quantity: 1,
    price: 120,
    keywords: "lorem20lorem20lorem20lorem20lorem20 lorem20lorem20 lorem20"
  };

  return (
    <Router>
      <div className="App">
        <Navbar></Navbar>

        <div className="container">
          <Switch>
            <Route exact path="/">
              {/* search items */}
              <SearchBar setSearchKeyword={setSearchKeyword} />
              <Items
                items={items}
                SearchKeyword={SearchKeyword}
                resetItems={resetItems}
              />
            </Route>

            <Route exact path="/about" component={About}></Route>
            <Route
              exact
              path="/categories"
              render={props => <Category categories={categories} />}
            ></Route>

            <Route
              path="/show-item/:id"
              render={props => (
                <ShowItem {...props} itemDetails={itemDetails} />
              )}
            ></Route>

            {/* BE */}
            <Route exact path="/be-login" component={Login}></Route>
            {/* <Route exact path="/be/dashboard" component={Dashboard}></Route> */}
          </Switch>

          {/* crud item */}
        </div>
      </div>
    </Router>
  );
};

export default App;
