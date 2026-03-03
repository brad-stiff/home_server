import { useState } from "react";
import reactLogo from "../../assets/react.svg";
import viteLogo from "../../../public/vite.svg";

import scoped_style from "./HomePage.module.css";

export function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <div className={scoped_style["home-container"]}>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className={scoped_style["logo"]} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className={`${scoped_style["logo"]} ${scoped_style["react"]}`} alt="React logo" />
        </a>
      </div>

      <h1>Vite + React</h1>

      <div className={scoped_style["card"]}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/pages/HomePage/HomePage.tsx</code> and save to test HMR
        </p>
      </div>

      <p className={scoped_style["read-the-docs"]}>
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}
