'use client'

import { ChangeEvent, useState } from "react";
import styles from "@/components/quizQuestion.module.css"

const Quiz = (props : any) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const answers = ["a", "b", "c", "d"]

  const handleOptionChange = (index : number) => (_ : ChangeEvent<HTMLInputElement>) => {
    setSelectedOptionIndex(index);
  };

  const handleSubmit = () => {
    setIsCorrect(selectedOptionIndex === answers.indexOf(props.answer));
    setShowAnswer(true)
  };

  return (
    <div className={styles.quizItem}>
      <div className={styles.question}>{props.question}</div>
      {props.options.map((option : string, index : number) => (
        <div className={styles.option} key={`${props.quizKey}-${index}`}>
          <input
            type="radio"
            id={`option-${props.quizKey}-${index}`}
            name={props.quizKey}
            value={option}
            checked={selectedOptionIndex === index}
            onChange={handleOptionChange(index)}
          />
          <label htmlFor={`option-${props.quizKey}-${index}`}>{option}</label>
        </div>
      ))}
      <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
      {showAnswer && <p className={styles.correctText}>{isCorrect ? "Correct!" : "Incorrect, try again."}</p>}
    </div>
  );
};

export default Quiz;