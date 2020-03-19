webpackHotUpdate("static/development/pages/_app.js",{

/***/ "./components/RemoveFromCart.js":
/*!**************************************!*\
  !*** ./components/RemoveFromCart.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_apollo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-apollo */ "./node_modules/react-apollo/react-apollo.browser.umd.js");
/* harmony import */ var react_apollo__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_apollo__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! graphql-tag */ "./node_modules/graphql-tag/src/index.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(graphql_tag__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _User__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./User */ "./components/User.js");
var _jsxFileName = "/Users/connermatson/Projects/Advanced-React/sick-fits/frontend/components/RemoveFromCart.js";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  mutation removeFromCart($id: ID!) {\n    removeFromCart(id: $id) {\n      id\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }







var REMOVE_FROM_CART_MUTATION = graphql_tag__WEBPACK_IMPORTED_MODULE_4___default()(_templateObject());
var BigButton = styled_components__WEBPACK_IMPORTED_MODULE_2__["default"].button.withConfig({
  displayName: "RemoveFromCart__BigButton",
  componentId: "emvtd6-0"
})(["font-size:3rem;background:none;border:0;&:hover{color:", ";cursor:pointer;}"], function (props) {
  return props.theme.red;
});

var update = function update(cache, payload) {
  //1. read cache
  var data = cache.readQuery({
    query: _User__WEBPACK_IMPORTED_MODULE_5__["CURRENT_USER_QUERY"]
  });
  console.log(data); //2. remove that item from cart
  //3. write it back to cache
};

var RemoveFromCart = function RemoveFromCart(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_apollo__WEBPACK_IMPORTED_MODULE_1__["Mutation"], {
    mutation: REMOVE_FROM_CART_MUTATION,
    variables: {
      id: props.id
    },
    update: update,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: this
  }, function (removeFromCart, _ref) {
    var loading = _ref.loading,
        error = _ref.error;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(BigButton, {
      disabled: loading,
      onClick: function onClick() {
        removeFromCart().catch(function (err) {
          return alert(err.message);
        });
      },
      title: "Delete Item",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 41
      },
      __self: this
    }, "\xD7");
  });
};

RemoveFromCart.propTypes = {
  id: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.string.isRequired
};
/* harmony default export */ __webpack_exports__["default"] = (RemoveFromCart);

/***/ })

})
//# sourceMappingURL=_app.js.58c552a43f8cd3b2aa7d.hot-update.js.map