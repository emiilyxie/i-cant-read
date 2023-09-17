'use client'

import ContentBlock from "@/components/contentBlock"
import styles from "@/app/readable/readable.module.css"
import { useEffect, useState } from "react"

export default function ReadableContent() {

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/get-text', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setContent(data.data)
        setLoading(false)
    })
  }, [])

  let title = "Typescript is annoying"

  return (
    <div>
      <div className={styles.title}>
        {title}
      </div>
      <div className={styles.content}>
        {!loading && content.map((c, i) => {
          return <ContentBlock key={i} text={c} />
        })}
      </div>
    </div>
  )
}
