import React from 'react';

function Question({ questionId, question, options, correctAnswer, selectedAnswer, handleOptionSelect, isChecked }) {

  const handleClick = (option) => {
    if (!isChecked) {
      handleOptionSelect(questionId, option);
    }
  };

  const optionElements = options.map(option => {
    let className = '';
    if (isChecked) {
      if (option === correctAnswer) {
        className = 'correct'; // Correct answer
      } else if (option === selectedAnswer) {
        className = 'incorrect'; // Selected wrong answer
      }
    }

    return (
      <span
        key={option}
        onClick={() => handleClick(option)}
        className={`${className} ${selectedAnswer === option ? 'selected' : ''}`}
      >
        {option}
      </span>
    );
  });

  return (
    <div className='Question--box'>
      <h2 className='question--text'>{question}</h2>
      <div className='answer'>
        {optionElements}
      </div>
    </div>
  );
}

export default Question;
