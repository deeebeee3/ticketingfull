import Link from "next/link";

export default ({ currentUser }) => {
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GetTickets</a>
      </Link>

      <div className="d-fles justify-content-end">
        <ul className="nav d-flex align-items-center">
          {currentUser ? "Sign out" : "Sign In / Up"}
        </ul>
      </div>
    </nav>
  );
};
