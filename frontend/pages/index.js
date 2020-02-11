import React from "react";
import Link from "next/link";

const Home = props => (
  <div>
    <p>Home!</p>
    <Link href='/sell'>
      <a>sell</a>
    </Link>
  </div>
);

export default Home;
