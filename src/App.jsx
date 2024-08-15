import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Question from './Component/Question';

function App() {
  // function to remove HTML Entities
  function decodeHTMLEntities(text) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
  }
//initialization
  const [data, setData] = useState([]);
  const [results, setResults] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = () => {
    const URL = 'https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple';
    fetch(URL)
      .then(response => response.json())
      .then(res => {
        // Decode HTML entities in each question
        const decodedData = res.results.map(item => ({
          ...item,
          question: decodeHTMLEntities(item.question),
          correct_answer: decodeHTMLEntities(item.correct_answer),
          incorrect_answers: item.incorrect_answers.map(answer => decodeHTMLEntities(answer)),
          options: [item.correct_answer, ...item.incorrect_answers].sort(() => Math.random() - 0.5)
        }));
        setData(decodedData);

        // Initialize results array with unselected options
        setResults(decodedData.map(question => ({
          questionId: nanoid(),
          correctAnswer: question.correct_answer,
          selectedAnswer: null
        })));

        // Reset score and checked state
        setScore(null);
        setIsChecked(false);
      });
  };

  const handleOptionSelect = (questionId, selectedAnswer) => {
    setResults(prevResults => 
      prevResults.map(result =>
        result.questionId === questionId
          ? { ...result, selectedAnswer }
          : result
      )
    );
  };

  const checkAnswers = () => {
    if (!isChecked) {
      const calculatedScore = results.reduce((total, result) => {
        return total + (result.selectedAnswer === result.correctAnswer ? 1 : 0);
      }, 0);
      setScore(calculatedScore);
      setIsChecked(true);
    } else {
      // Restart quiz
      fetchQuizData();
    }
  };

  const questionElements = data.map((res, index) => (
    <Question 
      key={results[index].questionId}
      questionId={results[index].questionId}
      question={res.question}
      options={res.options}
      correctAnswer={res.correct_answer}
      selectedAnswer={results[index].selectedAnswer}
      handleOptionSelect={handleOptionSelect}
      isChecked={isChecked}
    />
  ));

  return (
    <div className='container'>
      {questionElements}
      {isChecked && (
        <div className='score'>
          You scored {score} out of {results.length}
        </div>
      )}
      <button className='btn' onClick={checkAnswers}>
        {isChecked ? 'Restart Quiz' : 'Check Answer'}
      </button>
    </div>
  );
}

export default App;
