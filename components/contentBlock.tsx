'use client'

import styles from "@/components/contentBlock.module.css"
import { useState, useEffect } from "react";

export default function ContentBlock(props : any) {

  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/get-image', { 
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          text: props.text
      })
    })
      .then(res => res.blob())
      .then(blob => {
        console.log(blob)
        setImg(URL.createObjectURL(blob))
        setLoading(false)
    })
  }, [])

  return (
    <div className={styles.paragraphContent}>
      <div className={styles.paragraphImg}>{!loading ? <img src={img}></img> : "Loading image..."}</div>
      <div className={styles.paragraphText}>{props.text}</div>
    </div>
  )
}
