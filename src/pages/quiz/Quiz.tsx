import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  Card,
  CardContent,
} from "@mui/material";
import { useForm, Controller, set } from "react-hook-form";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router";

// Define the Question interface
interface Question {
  _id: string; // Unique ID for the question
  quizId: string; // ID of the quiz this question belongs to
  questionText: string; // The text of the question
  options: string[]; // An array of answer options for the question
  correctAnswer: string; // The correct answer for the question
  questionType: "MCQ" | "TRUE_FALSE"; // Type of the question (Multiple Choice or True/False)
  createdAt: string; // Timestamp when the question was created
  updatedAt: string; // Timestamp when the question was last updated
}

interface Quiz {
  _id: string; // Unique ID for the quiz
  title: string; // Title of the quiz
  description: string; // Description of the quiz
  duration: number; // Duration of the quiz in minutes
  questions: Question[]; // Array of questions in this quiz
  createdBy?: string | null; // ID of the user who created the quiz, optional
  isActive: boolean; // Indicates if the quiz is active
  createdAt: string; // Timestamp when the quiz was created
  updatedAt: string; // Timestamp when the quiz was last updated
}

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  const [questions, setQuestions] = useState([]);
  const { quizId } = useParams<{ quizId: string }>();
  const token = localStorage.getItem("accessToken");
  const { control, handleSubmit } = useForm();
  const [timeoutOpen, setTimeoutOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // 5 minutes

  let intervalId: NodeJS.Timeout | undefined;

  useEffect(() => {
    const startQuiz = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/quiz-attempts/`,
          { userId: userId, quizId: quizId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("startQuiz", res.data);
      } catch (err) {
        console.log(err);
      }
    };
    startQuiz();
  }, []);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/quizzes/${quizId}`
        );
        const filteredQuestions = res.data.questions;
        setQuestions(filteredQuestions);
        setTimeRemaining(res.data.duration * 60 - 1);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchQuiz();
  }, []);

  useEffect(() => {
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
  }, []);

  const handleTimeout = () => {
    setTimeoutOpen(true);
  };

  const handleCloseTimeout = () => {
    setTimeoutOpen(false);
    window.location.href = "/quiz"; // Redirect to the quiz page
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

  return (
    <div>
      <Typography variant="h4">Quiz</Typography>
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
                name={question._id} // Use question ID as the name for form handling
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <div>
                    <input
                      type="radio"
                      value={option}
                      onChange={() => field.onChange(option)} // Handle selection
                      checked={field.value === option} // Check if this option is selected
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
  );
};

export default Quiz;
