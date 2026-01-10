import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-black text-white">
      <h1 className="text-xl font-bold">🍽 Cloud Kitchen</h1>
      <div className="flex gap-6">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/admin">Admin</Link>
      </div>
    </nav>
  );
}
