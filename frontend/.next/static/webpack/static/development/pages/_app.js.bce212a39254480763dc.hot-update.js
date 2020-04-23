webpackHotUpdate("static/development/pages/_app.js",{

/***/ "./components/TakeMyMoney.js":
/*!***********************************!*\
  !*** ./components/TakeMyMoney.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_stripe_checkout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-stripe-checkout */ "./node_modules/react-stripe-checkout/dist/main.js");
/* harmony import */ var react_stripe_checkout__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_stripe_checkout__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_apollo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-apollo */ "./node_modules/react-apollo/react-apollo.browser.umd.js");
/* harmony import */ var react_apollo__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_apollo__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ "./node_modules/next/router.js");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var nprogress__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! nprogress */ "./node_modules/nprogress/nprogress.js");
/* harmony import */ var nprogress__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(nprogress__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! graphql-tag */ "./node_modules/graphql-tag/src/index.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(graphql_tag__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _lib_calcTotalPrice__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lib/calcTotalPrice */ "./lib/calcTotalPrice.js");
/* harmony import */ var _ErrorMessage__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ErrorMessage */ "./components/ErrorMessage.js");
/* harmony import */ var _User__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./User */ "./components/User.js");
var _jsxFileName = "/Users/connermatson/Projects/Advanced-React/sick-fits/frontend/components/TakeMyMoney.js";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    mutation createOrder($token: String!) {\n      createOrder(token: $token) {\n        id\n        charge\n        total\n        items {\n          id\n          title\n        }\n      }\n    }\n  "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }












var TakeMyMoney = function TakeMyMoney(props) {
  function totalItems(cart) {
    return cart.reduce(function (tally, cartItem) {
      return tally + cartItem.quantity;
    }, 0);
  }

  var onToken = function onToken(res, createOrder) {
    console.log("on token called"); //manually call the mutation once we have the stripe token

    createOrder({
      variables: {
        token: res.id
      }
    }).catch(function (err) {
      alert(err.message);
    });
  };

  var CREATE_ORDER_MUTATION = graphql_tag__WEBPACK_IMPORTED_MODULE_6___default()(_templateObject());
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_User__WEBPACK_IMPORTED_MODULE_9__["default"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42
    },
    __self: this
  }, function (_ref) {
    var me = _ref.data.me;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_apollo__WEBPACK_IMPORTED_MODULE_2__["Mutation"], {
      mutation: CREATE_ORDER_MUTATION,
      refetchQueries: [{
        query: _User__WEBPACK_IMPORTED_MODULE_9__["CURRENT_USER_QUERY"]
      }],
      __source: {
        fileName: _jsxFileName,
        lineNumber: 44
      },
      __self: this
    }, function (createOrder) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_stripe_checkout__WEBPACK_IMPORTED_MODULE_1___default.a, {
        amount: Object(_lib_calcTotalPrice__WEBPACK_IMPORTED_MODULE_7__["default"])(me.cart),
        email: me.email,
        name: "Sick Fits",
        description: "Order of ".concat(totalItems(me.cart), " items!"),
        image: me.cart.length && me.cart[0].item && me.cart[0].item.image,
        stripeKey: "pk_test_hG3XcYfyWOuDzEInEtMaCJyD00D57m2eiz",
        currency: "USD",
        token: function token(res) {
          return onToken(res, createOrder);
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 49
        },
        __self: this
      }, props.children);
    });
  });
};

/* harmony default export */ __webpack_exports__["default"] = (TakeMyMoney);

/***/ })

})
//# sourceMappingURL=_app.js.bce212a39254480763dc.hot-update.js.map