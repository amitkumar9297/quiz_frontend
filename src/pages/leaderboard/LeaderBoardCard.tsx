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

/**
 * A React component that displays a quiz's details in a card format. The card
 * displays the quiz title, description, duration, and number of questions. The
 * component also includes a button that allows the user to take the quiz.
 * 
 * @param {string} title - The title of the quiz.
 * @param {string} description - The description of the quiz.
 * @param {number} duration - The duration of the quiz in minutes.
 * @param {number} questionCount - The number of questions in the quiz.
 * @param {string} quizId - The id of the quiz.
 * @returns {ReactElement} - A React element representing the quiz card.
 */

const LeaderBoardCard: React.FC<QuizCardProps> = ({ title, description, duration, questionCount, quizId }) => {
    const navigate = useNavigate(); 
    // const handleTakeQuiz = () => {
    //     navigate(`/quiz/${quizId}`);
    // };
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
                <Button variant="contained" color="primary" >
                    See LeaderBoard
                </Button>
                </Box>
            </CardActions>
        </Card>
    );
};

export default LeaderBoardCard;
