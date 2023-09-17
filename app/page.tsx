'use client'

import { generateQuiz, generateContent, saveText } from "@/lib/generateContent"
import styles from "@/app/Page.module.css"
import Link from "next/link"
import { useState, ChangeEvent, MouseEvent } from "react"

export default function Home() {
  
  const [textAreaText, setTextAreaText] = useState('');

  const handleTextAreaChange = (e : ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaText(e.target.value)
  }

  const handleProcessText = (_ : MouseEvent<HTMLButtonElement>) => {
    saveText(textAreaText)
  }

  return (
    <div>
      <div className={styles.homeHeader}>I Can't Read</div>
      <div className={styles.homeContent}>

        <div className={styles.textInputContent}>
          <textarea className={"block"} onChange={handleTextAreaChange} id="inputText" rows={20} cols={50}></textarea>
          <Link href={"/readable"}><button onClick={handleProcessText}>Process Text</button></Link>
        </div>

        <div className={styles.uploadPDFContent}>
          <Link href={"/readable"}><button onClick={() => { alert('pdf clicked') }}>Upload PDF</button></Link>
        </div>

        <div>
      </div>

      </div>

      {/* <div>
          <div>
              <textarea id="inputText" rows={20} cols={50}></textarea>
              <button onClick={generateImages}>Generate Images</button>
              <button onClick={generateQuiz}>Generate Quiz</button>
          </div>
          <div id="content"></div>
          <div id="quiz"></div>
      </div> */}
    </div>
  )
}
