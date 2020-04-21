import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import Router from "next/router";
import NProgress from "nprogress";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import calcTotalPrice from "../lib/calcTotalPrice";
import Error from "./ErrorMessage";
import User, { CURRENT_USER_QUERY } from "./User";

const TakeMyMoney = props => {
  function totalItems(cart) {
    return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
  }
  const onToken = res => {
    console.log("on token called");
  };
  return (
    <User>
      {({ data: { me } }) => (
        <StripeCheckout
          amount={calcTotalPrice(me.cart)}
          email={me.email}
          name='Sick Fits'
          description={`Order of ${totalItems(me.cart)} items!`}
          image={me.cart[0].item && me.cart[0].item.image}
          stripeKey='pk_test_hG3XcYfyWOuDzEInEtMaCJyD00D57m2eiz'
          currency='USD'
          token={res => onToken(res)}
        >
          {props.children}
        </StripeCheckout>
      )}
    </User>
  );
};

export default TakeMyMoney;
