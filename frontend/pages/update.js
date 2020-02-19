import React from "react";
import Link from "next/link";
import UpdateItem from "../components/UpdateItem";

const update = ({ query }) => (
  <div>
    <UpdateItem id={query.id}></UpdateItem>
  </div>
);

export default update;
