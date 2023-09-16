'use client'

import { generateQuiz, generateImages } from "@/lib/generateContent"

export default function Home() {
  return (
    <>
      <div>DeepX</div>
      <div>
          <div>
              <textarea id="inputText" rows={20} cols={50}></textarea>
              <button onClick={generateImages}>Generate Images</button>
              <button onClick={generateQuiz}>Generate Quiz</button>
          </div>
          <div id="content"></div>
          <div id="quiz"></div>
      </div>
    </>
  )
}
