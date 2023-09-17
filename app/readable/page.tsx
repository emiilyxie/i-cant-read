'use client'

import ContentBlock from "@/components/contentBlock"
import styles from "@/app/readable/readable.module.css"
import { useEffect, useState } from "react"
import Quiz from "@/components/quizQuestion"
import RegenerateButton from "@/components/regenerateButton"

export default function ReadableContent() {

  const [text, setText] = useState("")
  const [content, setContent] = useState([])
  const [summary, setSummary] = useState([])
  const [quiz, setQuiz] = useState([])

  const [loadingContent, setLoadingContent] = useState(true)
  const [loadingSummary, setLoadingSummary] = useState(true)
  const [quizStatus, setQuizStatus] = useState(0);

  const fetchText = () => {
    fetch('/api/get-text')
      .then(res => res.json())
      .then(data => {
        setText(data.data.join("\n"))
        setContent(data.data)
        setLoadingContent(false)
    }).catch(error => console.error(error));
  }

  const fetchSummary = () => {
    fetch('/api/summarize', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          text: text
      })
    })
      .then(res => res.json())
      .then(data => {
        setSummary(data.data)
        setLoadingSummary(false)
    })
  }
 
  const fetchQuiz = () => {
    setQuizStatus(0)
    fetch('/api/generate-quiz', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          text: text
      })
    })
      .then(res => {
        setQuizStatus(res.status);
        return res.json()
      })
      .then(data => {
        console.log(data)
        setQuiz(data.data.quiz)
    }).catch(error => console.error(error));
  }

  useEffect(() => {
    fetchText()
  }, [])

  useEffect(() => {
    fetchSummary()
    fetchQuiz()
  }, [text])

  let title = "Typescript is annoying"

  return (
    <div>
      <div className={styles.title}>
        {title}
      </div>
      <div className={styles.summary}>
        {!loadingSummary ? summary : "Loading summary..."}
      </div>
      <div className={styles.content}>
        {!loadingContent && content.map((c, i) => {
          return <ContentBlock key={i} text={c} />
        })}
      </div>
      <div className={styles.quiz}>
        {quizStatus == 200 ? 
          quiz.map((q : any, index) => {
            return <Quiz 
              quizKey={index} 
              question={q.question} 
              options={q.options} 
              answer={q.answer}
               />
          }) : (
          quizStatus == 0 ?
          "Loading quiz..." : 
          <RegenerateButton type="quiz" action={fetchQuiz} />)}
      </div>
      
    </div>
  )
}
