import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LayoutSkeleton from "./LayoutSkeleton";
const LayoutPage = lazy(() => import("../components/LayoutPage"));
const HomePage = lazy(() => import("../pages/homePage/HomePage"));
const MonthlyRewardsv2 = lazy(() =>
  import("../pages/monthlyRewards/MonthlyRewardsv2")
);
const TotalRewards = lazy(() => import("../pages/totalRewards/TotalRewards"));
const TransactionPage = lazy(() =>
  import("../pages/transactions/TransactionPage")
);
const NotFoundPage = lazy(() => import("../components/NotFoundPage"));
// const MonthlyRewards = lazy(() =>
//   import("../pages/monthlyRewards/MonthlyRewards")
// );

const RouterComponent = () => {
  return (
    <Router>
      <Suspense fallback={<LayoutSkeleton />}>
        <Routes>
          <Route path="/" element={<LayoutPage />}>
            <Route index element={<HomePage />} />
            {/* <Route path="/monthly-rewards" element={<MonthlyRewards />} /> */}
            <Route path="/monthly-rewards" element={<MonthlyRewardsv2 />} />
            <Route path="/total-rewards" element={<TotalRewards />} />
            <Route path="/transaction" element={<TransactionPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default RouterComponent;
