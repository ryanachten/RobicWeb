import * as React from "react";
import { Link } from "react-router-dom";

export default () => (
  <nav>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/test/">Test</Link>
      </li>
    </ul>
  </nav>
);
