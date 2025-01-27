import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchResults } from "../../store/reducers/resultReducer";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Skeleton,
} from "@mui/material";
import AnimatedWrapper from "../../components/AnimatedWrapper";

  /**
   * This component displays the result of a user.
   * It fetches the result data using the fetchResults action creator.
   * It displays the result in a table format.
   * If the data is loading, it displays a skeleton.
   * If there is an error, it displays an error message.
   * If there are no results found, it displays a message.
   */
const Result: React.FC = () => {
  const dispatch = useDispatch();
  const { results, loading, error } = useSelector(
    (state: any) => state.results
  );

  // Fetch data on mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(fetchResults(userId));
    }
  }, [dispatch]);

  if(loading) {
    return (
      <div style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          <Skeleton width="50%" />
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {[...Array(6)].map((_, i) => (
                  <TableCell key={i}>
                    <Skeleton width="80%" />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(6)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton width="100%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
  if(error) {
    <Typography color="error">Error: {error}</Typography>
  }
  if(results && results.length <= 0) {
    <Typography>No Results Found</Typography>
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        User Quiz Results
      </Typography>
      
        <AnimatedWrapper key="result">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr. No.</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Duration (mins)</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>No. of Questions</TableCell>
                <TableCell>Submitted Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result: any, index: number) => (
                <TableRow key={result._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{result.quizId.title}</TableCell>
                  <TableCell>{result.quizId.duration}</TableCell>
                  <TableCell>{result.score}</TableCell>
                  <TableCell>{result.totalQuestions}</TableCell>
                  <TableCell>
                    {new Date(result.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </AnimatedWrapper>

    </div>
  );
};

export default Result;
