import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Basic from "./layouts/Basic";
import ErrorBoundary from "./components/ErrorBoundary";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/homepage";
import QuizList from "./pages/quiz/QuizList";
import Quiz from "./pages/quiz/Quiz";
// import Quiz from "./pages/quiz/Quiz";

// const Home = React.lazy(() => import("./pages/homepage"));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<Basic />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/quiz" element={<QuizList />} />
            <Route path="/quiz/:quizId" element={<Quiz />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
