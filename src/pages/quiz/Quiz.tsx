import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  Card,
  CardContent,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom"; // Ensure you import from react-router-dom
import { useGetQuizByIdQuery, useStartQuizMutation } from "../../services/quizzesApi";
import AnimatedWrapper from "../../components/AnimatedWrapper";

interface Question {
  _id: string; 
  quizId: string; 
  questionText: string; 
  options: string[]; 
  correctAnswer: string; 
  questionType: "MCQ" | "TRUE_FALSE"; 
  createdAt: string; 
  updatedAt: string;
}

interface Quiz {
  _id: string; 
  title: string; 
  description: string; 
  duration: number; 
  questions: Question[]; 
  createdBy?: string | null; 
  isActive: boolean; 
  createdAt: string; 
  updatedAt: string; 
}

/**
 * A React functional component that represents a quiz page. It fetches quiz
 * details and allows users to take a quiz. The component handles quiz initiation,
 * manages the timer for the quiz, and submits quiz answers. It displays a loading
 * state while fetching quiz data and an error state if the quiz fails to load.
 * 
 * Utilizes React Hook Form for form management and MUI components for UI design.
 * 
 * @returns {JSX.Element} - A JSX element representing the quiz page.
 */

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const { quizId } = useParams<{ quizId: string }>();
  const token = localStorage.getItem("accessToken");
  const { control, handleSubmit } = useForm();

  const [startQuiz, { isLoading: isStartingQuiz }] = useStartQuizMutation();
  const { data: quiz, isLoading: isQuizLoading, isError: isQuizError } = quizId 
    ? useGetQuizByIdQuery(quizId) 
    : { data: null, isLoading: false, isError: false };
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizAttemptId, setQuizAttemptId] = useState<string | null>(null); // State to store quizAttemptId
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timeoutOpen, setTimeoutOpen] = useState(false);
  let intervalId: NodeJS.Timeout | undefined;

  useEffect(() => {
    const initiateQuiz = async () => {
      if (!quizId) return;

      try {
        // Start the quiz attempt
        const response = await startQuiz({ userId, quizId, token }).unwrap();

        // Assuming response contains savedQuizAttempt and questions
        setQuizAttemptId(response.savedQuizAttempt._id); // Set quizAttemptId

        // Set the questions and time remaining from the response
        setQuestions(response.questions);
        setTimeRemaining(response.savedQuizAttempt.duration * 60); // Set time remaining in seconds
      } catch (error) {
        console.error("Error starting the quiz:", error);
      }
    };

    initiateQuiz();
  }, [startQuiz, userId, quizId, token]);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    intervalId = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [timeRemaining]);

  const handleTimeout = () => {
    setTimeoutOpen(true);
  };

  const handleCloseTimeout = () => {
    setTimeoutOpen(false);
    navigate("/quiz");
  };

  const onSubmit = async (data: any) => {
    const answers = Object.entries(data).map(
      ([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      })
    );

    const payload = {
      userId,
      quizId,
      quizAttemptId, // Include quizAttemptId in the payload
      answers,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/quiz-attempts/submit`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Quiz submitted successfully");
      if (res.status === 200) {
        navigate("/quiz");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (isQuizLoading || isStartingQuiz) return <div>Loading quiz...</div>;
  if (isQuizError) return <div>Error loading quiz!</div>;

  return (
    <AnimatedWrapper key="quiz">
    <div>
      <Typography variant="h4">Quiz: {quiz?.title}</Typography>
      <Typography variant="h6">
        Time Remaining: {Math.floor(timeRemaining / 60)}:
        {("0" + (timeRemaining % 60)).slice(-2)}
      </Typography>
      {questions.map((question) => (
        <Card
          key={question._id}
          variant="outlined"
          style={{ margin: "10px 0" }}
        >
          <CardContent>
            <Typography variant="body1">{question.questionText}</Typography>
            {question.options.map((option) => (
              <Controller
                key={option}
                name={question._id} 
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <div>
                    <input
                      type="radio"
                      value={option}
                      onChange={() => field.onChange(option)} 
                      checked={field.value === option} 
                      style={{ margin: "5px" }}
                    />
                    <label>{option}</label>
                  </div>
                )}
              />
            ))}
          </CardContent>
        </Card>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit(onSubmit)}
      >
        Submit Quiz
      </Button>
      <Dialog open={timeoutOpen} onClose={handleCloseTimeout}>
        <DialogTitle>Time's Up!</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseTimeout} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </AnimatedWrapper>
  );
};

export default Quiz;
