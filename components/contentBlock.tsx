import styles from "@/components/contentBlock.module.css"

export default function ContentBlock(props : any) {
  return (
    <div className={styles.paragraphContent}>
      <div className={styles.paragraphText}>{props.text}</div>
      <div className={styles.paragraphImg}>{props.img}</div>
      <div className={styles.paragraphQuiz}>{props.quiz}</div>
    </div>
  )
}
