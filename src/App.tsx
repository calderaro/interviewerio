import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import questions from "./questions.json";

type Option = {
  id: string;
  label: string;
};

type Question = {
  id: string;
  label: string;
  answer: string;
  explanation: string;
  options: Option[];
};

type QuizData = Question[];

// Mock quiz data - replace this with your actual data
const quizData: QuizData = questions;

function Question({
  question,
  onSubmit,
  onNext,
  showExplanation,
  isAnswerCorrect,
  selectedAnswer,
}: {
  question: Question;
  onSubmit: (answer: string) => void;
  onNext: () => void;
  showExplanation: boolean;
  isAnswerCorrect: boolean | null;
  selectedAnswer: string | null;
}) {
  const [localSelectedAnswer, setLocalSelectedAnswer] = useState<string | null>(
    selectedAnswer
  );

  const handleSubmit = () => {
    if (localSelectedAnswer) {
      onSubmit(localSelectedAnswer);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{question.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          onValueChange={(value) => setLocalSelectedAnswer(value)}
          value={localSelectedAnswer || undefined}
        >
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.id}
                id={option.id}
                disabled={showExplanation}
              />
              <Label htmlFor={option.id}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
        {showExplanation && (
          <div className="mt-4">
            <p
              className={`font-bold ${
                isAnswerCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isAnswerCorrect ? "Correct!" : "Incorrect"}
            </p>
            <p className="mt-2">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {showExplanation ? (
          <Button onClick={onNext}>Next Question</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!localSelectedAnswer}>
            Submit Answer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const handleSubmit = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === quizData[currentQuestionIndex].answer;
    setIsAnswerCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowExplanation(false);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
  };

  if (quizCompleted) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Quiz Completed!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold mb-4">
            Your Score: {score} / {quizData.length}
          </p>
          <Button onClick={handleRestart}>Restart Quiz</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Quiz App</h1>
      <Question
        question={quizData[currentQuestionIndex]}
        onSubmit={handleSubmit}
        onNext={handleNext}
        showExplanation={showExplanation}
        isAnswerCorrect={isAnswerCorrect}
        selectedAnswer={selectedAnswer}
      />
      <p className="mt-4">
        Question {currentQuestionIndex + 1} of {quizData.length}
      </p>
    </div>
  );
}
