'use client'

import { generateQuiz, generateImages, testHandle } from "@/lib/generateContent"
import styles from "@/app/Page.module.css"
import Link from "next/link"

export default function Home() {
  return (
    <div>
      <div className={styles.homeHeader}>I Can't Read</div>
      <div className={styles.homeContent}>
        <div className={styles.homeCol}>
          <textarea className={"block"} id="inputText" rows={20} cols={50}></textarea>
          <Link href={"/readable"}><button onClick={testHandle}>Process Text</button></Link>
        </div>
        <div className={styles.homeCol}>
          <button onClick={() => { alert('pdf clicked') }}>Upload PDF</button>
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
