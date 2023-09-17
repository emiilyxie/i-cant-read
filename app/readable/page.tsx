'use client'

import ContentBlock from "@/components/contentBlock"
import styles from "@/app/readable/readable.module.css"
import { useEffect, useState } from "react"
import Quiz from "@/components/quizQuestion"
import RegenerateButton from "@/components/regenerateButton"
import LoadingSpinner from "@/components/loadingSpinner"

export default function ReadableContent() {

  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [content, setContent] = useState([])
  const [summary, setSummary] = useState([])
  const [quiz, setQuiz] = useState([])

  const [loadingTitle, setLoadingTitle] = useState(true)
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
        console.log(data.data.answers)
        setQuiz(data.data.quiz)
    }).catch(error => console.error(error));
  }

  const fetchTitle = () => {
    fetch('/api/generate-title', {
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
        setTitle(data.data)
        setLoadingTitle(false)
    })
  }

  const startTTS = () => {
    fetch('/api/tts', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          text: text
      })
    })
  }

  const stopTTS = () => {
    fetch('/api/stoptts', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          text: ""
      })
    })
  }

  useEffect(() => {
    fetchText()
  }, [])

  useEffect(() => {
    if (text != "") {
      fetchSummary()
      fetchQuiz()
      fetchTitle()
    }
  }, [text])

  return (
    <div className={styles.content}>
      <div className={styles.title}>
        {!loadingTitle ? title : <LoadingSpinner description="Loading title" />}
      </div>
      <div className={styles.summary}>
        {!loadingSummary ? summary : <LoadingSpinner description="Loading summary" />}
      </div>
      <div className={styles.soundButtons}>
        <button onClick={startTTS}>Start TTS</button>
        <button onClick={stopTTS}>Stop TTS</button>
      </div>
      <div>
        {!loadingContent && content.map((c, i) => {
          return <ContentBlock key={i} text={c} />
        })}
      </div>
      <div className={styles.quiz}>
        {quizStatus == 200 ? 
          quiz.map((q : any, index) => {
            return <Quiz 
              key={`quiz-${index}`} 
              quizKey={index} 
              question={q.question} 
              options={q.options} 
              answer={q.answer}
               />
          }) : (
          quizStatus == 0 ?
          <LoadingSpinner description="Loading quiz" /> : 
          <RegenerateButton type="quiz" action={fetchQuiz} />)}
      </div>
      
    </div>
  )
}
