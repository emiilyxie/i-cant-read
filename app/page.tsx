'use client'

import styles from "@/app/Page.module.css"
import Link from "next/link"
import { useState, ChangeEvent, MouseEvent } from "react"

export default function Home() {
  
  const [textAreaText, setTextAreaText] = useState('');

  const handleTextAreaChange = (e : ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaText(e.target.value)
  }

  const handleProcessText = (_ : MouseEvent<HTMLButtonElement>) => {
    fetch("/api/save-text", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: textAreaText
        })
    });
  }

  return (
    <div>
      <div className={styles.homeHeader}>I Can't Read</div>

      <div className={styles.homeContent}>
        <div className={styles.textInputContent}>
          <textarea className={styles.textArea} placeholder={"Paste text here"} onChange={handleTextAreaChange}></textarea>
          <Link href={"/readable"}><button onClick={handleProcessText}>Process Text</button></Link>
        </div>

        <div>
          or
        </div>

        <div className={styles.uploadPDFContent}>
          <Link href={"/readable"}><button onClick={() => { alert('pdf clicked') }}>Upload PDF</button></Link>
        </div>
      </div>
      
    </div>
  )
}
