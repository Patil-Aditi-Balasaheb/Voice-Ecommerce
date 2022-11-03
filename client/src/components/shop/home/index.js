import React, { Fragment, createContext, useReducer } from "react";
import Layout from "../layout";
import Slider from "./Slider";
import ProductCategory from "./ProductCategory";
import { homeState, homeReducer } from "./HomeContext";
import SingleProduct from "./SingleProduct";
import alanBtn from '@alan-ai/alan-sdk-web';
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { CartModal } from "../partials";

export const HomeContext = createContext();

const HomeComponent = () => {

  const history = useHistory();

  useEffect(() => {
    var alanBtnInstance = alanBtn({
      //key: 'd22e60a51299e6155cfe9d61365910e42e956eca572e1d8b807a3e2338fdd0dc/stage',
      key: '8a0d8107f8d57720e65cb7dbd8f921da2e956eca572e1d8b807a3e2338fdd0dc/stage',
      onCommand: (commandData) => {
        if (commandData.command === 'gohomePage') {
          // Call the client code that will react to the received command1
          // Navber.cartModalOpen();
        }
        else if (commandData.command === "Wishlist") {
          history.push("/wish-list");
        }
        else if (commandData.command === "UserProfile") {
          history.push("/user/profile");
        }
        else if (commandData.command === "UserOrders") {
          history.push("/user/orders");
        }
        else if (commandData.command === "SettingUser") {
          history.push("/user/setting");
        }
        else if (commandData.command === "Home") {
          history.push("/");
        }
        else if (commandData.command === "ContactUs") {
          history.push("/contact-us");
        }
        else if (commandData.command === 'Cart') {
          // cartModalOpen();
        }
        else if (commandData.command === 'DashboardAdmin') {
          history.push("/admin/dashboard");
        }
      }
    });
  }, [history]);

  return (
    <Fragment>
      <Slider />
      {/* Category, Search & Filter Section */}
      <section className="m-4 md:mx-8 md:my-6">
        <ProductCategory />
      </section>
      {/* Product Section */}
      <section className="m-4 md:mx-8 md:my-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <SingleProduct />
      </section>
    </Fragment>
  );
};

const Home = (props) => {
  const [data, dispatch] = useReducer(homeReducer, homeState);
  return (
    <Fragment>
      <HomeContext.Provider value={{ data, dispatch }}>
        <Layout children={<HomeComponent />} />
      </HomeContext.Provider>
    </Fragment>
  );
};

export default Home;
