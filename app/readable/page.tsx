'use client'

import ContentBlock from "@/components/contentBlock"
import styles from "@/app/readable/readable.module.css"
import { useEffect, useState } from "react"

export default function ReadableContent() {

  const [content, setContent] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [summary, setSummary] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);

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
            console.log(data)
            setSummary(data.data)
            setLoadingSummary(false)
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
    </div>
  )
}
