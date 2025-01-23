import axios from "axios";
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import QuizCard from "./QuizCard"; // Import the QuizCard component

interface Quiz {
  _id: string;
  title: string;
  description: string;
  duration: number;
  questions: any[]; // You can define a more specific interface if needed
}

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/quizzes/`
        );
        setQuizzes(res.data);
      } catch (err) {
        setError("Failed to fetch quizzes");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={2}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h1" component="h1" gutterBottom>
        Quiz List
      </Typography>
      {quizzes.length === 0 ? (
        <Typography>No quizzes available.</Typography>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          gap={2}
        >
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              title={quiz.title}
              description={quiz.description}
              duration={quiz.duration}
              questionCount={quiz.questions.length}
              quizId={quiz._id}
            />
          ))}
        </Box>
      )}
    </div>
  );
};

export default QuizList;
