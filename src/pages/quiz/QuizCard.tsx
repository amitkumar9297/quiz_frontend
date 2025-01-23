// QuizCard.tsx
import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router';

interface QuizCardProps {
    title: string;
    description: string;
    duration: number;
    questionCount: number;
    quizId: string;
}

const QuizCard: React.FC<QuizCardProps> = ({ title, description, duration, questionCount, quizId }) => {
    const navigate = useNavigate(); 
    // const userId = localStorage.getItem("userId");
    const handleTakeQuiz = () => {
        // console.log(quizId)
        // Navigate to the QuizPage and pass userId and quizId
        navigate(`/quiz/${quizId}`);
    };
    return (
        <Card variant="outlined" sx={{ borderRadius: '0.8rem' }}>
            <CardContent>
                <Typography variant="h5" component="div">{title}</Typography>
                <Typography variant="body2" color="text.secondary">{description}</Typography>
                <Typography variant="body2">Duration: {duration} minutes</Typography>
                <Typography variant="body2">Number of Questions: {questionCount}</Typography>
            </CardContent>
            <CardActions>
                <Box display="flex" justifyContent="center" width="100%">
                <Button variant="contained" color="primary" onClick={handleTakeQuiz}>
                    Take Quiz
                </Button>
                </Box>
            </CardActions>
        </Card>
    );
};

export default QuizCard;
