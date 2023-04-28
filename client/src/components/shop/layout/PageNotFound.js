import React from "react";
import Faq from "react-faq-component";
import Layout from "./index";
import "./faqstyle.css";

const data = {
  title: "FAQ (How it works)",
  rows: [
    {
      title: "How to initiate conversation?",
      content: `You can simply say "Hii" or "Hello"<br><br>
      You can also ask questions like:<br>
      1. "What do you do?"<br>
      2. "How can you help?"<br>
      3. "How do you do?"`,
    },
    {
      title: "Want to know what does this app do?",
      content: `You can speak in various ways:<br>
      1. "What does this app/website do?"<br>
      2. "What is this website about?"`,
    },
    {
      title: "Wish to login?",
      content: `Open login page by saying any one of the following given below:<br>
      1. "Open login/login page"<br>
      2. "Go to login/login page"<br>
      3. "Login"<br><br>
      Enter the username and password by saying:<br>
      1. "Username is [user-name]"<br>
      2. "Password is [password]"<br>
      3. No need to click login button or say "click login button" or "login" again, after filling in the details login button gets automatically activated.<br><br>
      Close login page by simply saying: 
      "Close Login/login page"`,
    },
    {
      title: "Wish to signup?",
      content: `Open login page first then you can go to signup page by saying:
      "Switch Login"<br><br>
      Enter the name, email, password and confirm password by saying:<br>
      1. "Signup name is [name]"<br>
      2. "Signup email is [email-id]"<br>
      3. "Signup password is [password]"<br>
      4. No need to speak confirm password it gets automatically filled after telling password.<br>
      5. No need to click create an account button or say "click create an account button" or "register" or "signup" again, after filling in the details create an account button gets automatically activated.`,
    },
    {
      title: "Want to know the categories available for shopping?",
      content: `You can speak in various ways:<br>
      1. "What categories/products do you have?"<br>
      2. "What can I buy/get here?"<br>
      3. "List all products/categories"<br>
      4. "Show all products/categories"`,
    },
    {
      title: "Want to search products by category?",
      content: `You could speak in few ways:<br>
      1. "Show some [category-name] products"<br>
      2. "Show [category-name]"<br><br>
      Eg. "Show Electronics" or "Show Health and Beauty products" etc.`,
    },
    {
      title: "Wish to Scroll Down/Scroll Up",
      content: `Simply say "Scroll down" for scrolling down & "Scroll up" for scrolling up.`,
    },
    {
      title: "Intend to view a product details page",
      content: `You can say "Open [product-name]" or "Show [product-name].<br>
      After product details page get opened you can ask the app to read the products details by saying any of the following:<br>
      1. "Tell me about this product"<br>
      2. "Give description" or "Give description of product"<br>
      3. "Describe this product" or "Describe it"<br>`,
    },
    {
      title: "Wish to increase or decrease quantity of product?",
      content: `Simply say "Increase quantity" or "Increase product quantity" for increasing the quantity by one <br>
      and say "Decrease quantity" or "Decrease product quantity" for decreasing the quantity by one.`,
    },
    {
      title:
        "Wish to increase or decrease quantity of product by specific number?",
      content: `Simply say "Increase product quantity by [number]" <br>
      and say "Decrease product quantity by [number]"`,
    },
    {
      title: "Wish to add a product to cart?",
      content: `You could say any one of the following:<br>
      1. "Add to cart"<br>
      2. "Add this product to cart" or "Add product to cart"<br>
      3. "Add this in cart" or "Add in cart"`,
    },
    {
      title: "Want to open cart?",
      content: `Say "Open cart" or "Go to cart" or "Show cart"`,
    },
    {
      title: "Wish to remove products from cart? or empty cart.",
      content: `You can say following to remove a single product:<br>
      1. "Remove [product-name]" or "Remove [product-name] from cart"<br>
      2. "I don't want to buy [product-name]"<br><br>
      And for removing all the products or emptying cart say:<br>
      1. "Remove all" or "Remove all products"<br>
      2. "Empty Cart"`,
    },
    {
      title: "Want to checkout?",
      content: `Simply say "Checkout" or "Proceed to payment" or "Place order"<br><br>
      After going to the checkout page fill in the contact details by saying:<br>
      1. "Delivery address is [address]"<br>
      2. "Phone number is [phone number]"<br>
      3. Select the payment method by saying "Pay using/by card"<br>
      4. Enter the card number and expiry date manually for security purpose we don't provide voice input here.
      5. Click on Pay now button or say "Pay Now"`,
    },
    {
      title: "Wish to add product to your wishlist?",
      content: `You could say any one of the following:<br>
      1. "Add to Wishlist"<br>
      2. "Add this product/item to wishlist" or "Add product/item to wishlist"<br>
      3. "Add this in wishlist" or "Add in wishlits"`,
    },
    {
      title: "Want to check your wishlist?",
      content: `Say "Go to my Wishlist" or "Open Wishlist" or just "Wishlist"`,
    },
    {
      title: "Want to check your Order Status/Order History?",
      content: `Say "Show order status" or "Go to my orders" or "Open/Show orders" or "Show/Open Order History"`,
    },
    {
      title: "Want to manage your account?",
      content: `Say "Go to my Account/Dashboard" or "Open Account/Dashboard" or "Show Account/Dashboard"`,
    },
    {
      title: "Want to go to settings?",
      content: `Say "Go to settings" or "Open settings" or "Show settings"`,
    },
    {
      title: "Want to go to home page/shop page?",
      content: `You could say any one of the following:<br>
      1. "Go to home page/shop page" or "Go to home/shop"<br>
      2. "Go back to home page/shop page" or "Go back to home/shop"<br>
      3. "Open/Show home page/shop page" or "Open/Show home/shop"`,
    },
    {
      title: "Wish to logout?",
      content: `Simply say "Logout" or "Signout"`,
    },
  ],
};

const styles = {
  // bgColor: 'white',
  // arrowColor: "red",
  // titleTextColor: 'blue',
  // titleTextSize: '48px',
  // rowTitleColor: 'blue',
  // rowTitleTextSize: 'medium',
  rowContentColor: "grey",
  rowContentTextSize: "16px",
  // rowContentPaddingTop: '10px',
  rowContentPaddingBottom: "10px",
  rowContentPaddingLeft: "30px",
  // rowContentPaddingRight: '150px',
  // arrowColor: "red",
  transitionDuration: "1s",
  timingFunc: "ease",
};

const config = {
  tabFocus: true,
  animate: true,
  // arrowIcon: "V",
  openOnload: 0,
  // expandIcon: "+",
  // collapseIcon: "-",
};

const PageNotFoundComponent = (props) => {
  return (
    // <div className="flex flex-col items-center justify-center my-32">
    <div className="main">
      <div className="faq">
        <Faq data={data} styles={styles} config={config} />
      </div>
    </div>
  );
};

const PageNotFound = (props) => {
  return <Layout children={<PageNotFoundComponent />} />;
};

export default PageNotFound;
