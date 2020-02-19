import Link from "next/link";
import NavStyles from "../components/styles/NavStyles";

const Nav = () => (
  <NavStyles>
    <Link href='/'>
      <a>shop</a>
    </Link>
    <Link href='/sell'>
      <a>sell</a>
    </Link>
    <Link href='/signup'>
      <a>signup</a>
    </Link>
    <Link href='/orders'>
      <a>orders</a>
    </Link>
    <Link href='/account'>
      <a>account</a>
    </Link>
  </NavStyles>
);

export default Nav;
