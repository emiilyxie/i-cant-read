'use client'

import ContentBlock from "@/components/contentBlock"
import styles from "@/app/readable/readable.module.css"
import { useEffect, useState } from "react"

export default function ReadableContent() {

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/get-text', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setText(data.data)
        setLoading(false)
    })
  }, [])

  let title = "Typescript is annoying"

  let content = [
    {
      "text": "We will soon recommend incrementally adopting the App Router and using Server Actions for handling form submissions and data mutations. Server Actions allow you to define asynchronous server functions that can be called directly from your components, without needing to manually create an API Route.",
      "img": "",
      "quiz": "",
    },
    {
      "text": "We will soon recommend incrementally adopting the App Router and using Server Actions for handling form submissions and data mutations. Server Actions allow you to define asynchronous server functions that can be called directly from your components, without needing to manually create an API Route.",
      "img": "",
      "quiz": "",
    }
  ]

  return (
    <div>
      <div className={styles.title}>
        {!loading ? text : "Loading.."}
      </div>
      <div className={styles.content}>
        {content.map((c, i) => {
          return <ContentBlock key={i} text={c.text} img={c.img} quiz={c.quiz} />
        })}
      </div>
    </div>
  )
}
