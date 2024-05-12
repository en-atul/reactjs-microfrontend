import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";

import "./index.scss";

const Header = lazy(() => import("app1/header"));
const App = () => (
  <div className="mt-10 text-3xl mx-auto max-w-6xl">
    <div>App2</div>

    <Suspense fallback={<div>Loading...</div>}>
      <Header />
    </Suspense>
  </div>
);
ReactDOM.render(<App />, document.getElementById("app"));
