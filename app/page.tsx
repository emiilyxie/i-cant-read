'use client'

import styles from "@/app/Page.module.css"
import Link from "next/link"
import { useState, ChangeEvent, MouseEvent } from "react"

export default function Home() {
  
  const [textAreaText, setTextAreaText] = useState('');

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e : ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null)

    if (!file) {
      console.log("no file selected")
      return
    }

    const formData = new FormData();
    formData.append('file', file)

    fetch("/api/parse-pdf", {
      method: 'POST',
      body: formData
    })
      .then(resp => resp.json())
      .then(data => {
        setTextAreaText(data.data)
      });
  };


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
      <div className={styles.homeHeader}>ICANTREAD</div>

      <div className={styles.homeContent}>
        <div className={styles.textInputContent}>
          <textarea className={styles.textArea} placeholder={"Your text here"} value={textAreaText} onChange={handleTextAreaChange}></textarea>
          <input className={styles.inputFile} type="file" accept=".pdf" name="file" onChange={handleFileChange}></input>
          <Link href={"/readable"}><button onClick={handleProcessText}>Process Text</button></Link>
        </div>

        <div className={styles.imgContent}>
          {/* <img src="/character.jpeg" alt="character holding a book"></img> */}
        </div>
      </div>
      
    </div>
  )
}
