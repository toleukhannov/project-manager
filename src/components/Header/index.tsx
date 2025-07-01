// libraries
import { type FC } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { Link } from 'react-router-dom';
// static

const Header: FC = () => (
  <div className="header">
    <div>
      <Link className="app-name" to="/projects">Project Manager</Link>
    </div>

    <Link to="/profile">
      <AiOutlineUser />
      Profile
    </Link>
  </div>
);

export default Header;
