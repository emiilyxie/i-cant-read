import ContentBlock from "./contentBlock"
import styles from "@/components/readableContent.module.css"

export default function ReadableContent() {

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
        {title}
      </div>
      <div className={styles.content}>
        {content.map((c) => {
          return <ContentBlock text={c.text} img={c.img} quiz={c.quiz} />
        })}
      </div>
    </div>
  )
}
