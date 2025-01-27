import React  from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import {  toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import LeaderBoardCard from "./LeaderBoardCard"; // Import the LeaderBoardCard component
import { useGetQuizzesQuery } from "../../services/quizzesApi";


/**
 * A component that displays a list of quizzes, with a skeleton loading state and
 * an error state.
 *
 * @returns A JSX element that displays a list of quizzes.
 */

const LeaderBoard: React.FC = () => {

  const { data: quizzes = [], isLoading, isError } = useGetQuizzesQuery();

  if (isLoading) {
    return (
      <div>
        <Box
          margin={4}
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          gap={2}
        >
          {Array.from(new Array(6)).map((_, index) => (
            <Box key={index}>
              <Skeleton variant="rectangular" height={150} />
              <Skeleton variant="text" sx={{ mt: 1, mb: 0.5 }} />
              <Skeleton variant="text" width="60%" />
            </Box>
          ))}
        </Box>
      </div>
    );
  }
  if (isError) return toast.error("Something went wrong");
  if(quizzes.length === 0){
    return  <Typography>No quizzes available.</Typography>
  }

  return (
    <>
    <Box margin={2}>
      
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          gap={2}
        >
          {quizzes.map((quiz) => (
            <LeaderBoardCard
              key={quiz._id}
              title={quiz.title}
              description={quiz.description}
              duration={quiz.duration}
              questionCount={quiz.questions.length}
              quizId={quiz._id}
            />
          ))}
        </Box>
    </Box>
    </>
  );
};

export default LeaderBoard;
