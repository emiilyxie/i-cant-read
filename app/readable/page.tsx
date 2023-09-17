'use client'

import ContentBlock from "@/components/contentBlock"
import styles from "@/app/readable/readable.module.css"
import { useEffect, useState } from "react"
import Quiz from "@/components/quizQuestion"

export default function ReadableContent() {

  const [content, setContent] = useState([])
  const [summary, setSummary] = useState([])
  const [quiz, setQuiz] = useState([])

  const [loadingContent, setLoadingContent] = useState(true)
  const [loadingSummary, setLoadingSummary] = useState(true)
  const [loadingQuiz, setLoadingQuiz] = useState(true);
 

  useEffect(() => {
    fetch('/api/get-text')
      .then(res => res.json())
      .then(data => {
        setContent(data.data)
        setLoadingContent(false)

        fetch('/api/summarize', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              text: data.data.join("\n")
          })
        })
          .then(res => res.json())
          .then(data => {
            setSummary(data.data)
            setLoadingSummary(false)
        })

        fetch('/api/generate-quiz', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              text: data.data.join("\n")
          })
        })
          .then(res => res.json())
          .then(data => {
            console.log(data)
            setQuiz(data.data.quiz)
            setLoadingQuiz(false)
        })
    })
  }, [])

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
        {!loadingQuiz ? 
          quiz.map((q : any, index) => {
            return <Quiz 
              quizKey={index} 
              question={q.question} 
              options={q.options} 
              answer={q.answer}
               />
          })
          :
          "Loading quiz..."}
      </div>
      
    </div>
  )
}
