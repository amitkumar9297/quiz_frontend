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
} from "@mui/material";

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

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        User Quiz Results
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">Error: {error}</Typography>
      ) : results && results.length > 0 ? (
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
      ) : (
        <Typography>No Results Found</Typography>
      )}
    </div>
  );
};

export default Result;
