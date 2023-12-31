'use client'

import styles from "@/components/contentBlock.module.css"
import { useState, useEffect } from "react";
import RegenerateButton from "./regenerateButton";
import LoadingSpinner from "./loadingSpinner";

export default function ContentBlock(props : any) {

  const [img, setImg] = useState("");
  const [imgStatus, setImgStatus] = useState(0);

  const getImage = () => {
    fetch('/api/get-image', { 
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          text: props.text
      })
    })
      .then(res => {
        setImgStatus(res.status)
        return res.blob()
      })
      .then(blob => {
        console.log(blob)
        setImg(URL.createObjectURL(blob))
    })
  }

  useEffect(() => {
    getImage()
  }, [])

  return (
    <div className={styles.paragraphContent}>
      <div className={styles.paragraphText}>{props.text}</div>
      <div className={styles.paragraphImg}>{imgStatus != 0 ? 
      <> 
        {imgStatus == 200 && <div><img src={img}></img></div>}
        <RegenerateButton type="image" action={getImage} />
      </> : 
      <LoadingSpinner description="Loading image" />}</div>
    </div>
  )
}
