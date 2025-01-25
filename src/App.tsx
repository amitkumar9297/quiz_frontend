import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Basic from "./layouts/Basic";
import ErrorBoundary from "./components/ErrorBoundary";
import LeaderBoard from "./pages/leaderboard/LeaderBoard";
const Login = React.lazy(() => import("./pages/Auth/Login"));
const Signup = React.lazy(() => import("./pages/Auth/Signup"));
const Home = React.lazy(() => import("./pages/homepage"));
const QuizList = React.lazy(() => import("./pages/quiz/QuizList"));
const Quiz = React.lazy(() => import("./pages/quiz/Quiz"));
const Result = React.lazy(() => import("./pages/result/result"));
// const LeaderBoard= React.lazy(() => import("./pages/leaderboard/LeaderBoard"));



const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<Basic />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/quiz" element={<QuizList />} />
            <Route path="/quiz/:quizId" element={<Quiz />} />
            <Route path="/result" element={<Result />} />
            <Route path="/leaderboard" element={<LeaderBoard />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
