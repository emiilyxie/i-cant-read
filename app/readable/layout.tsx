import NavBar from "@/components/navbar"
import styles from "@/app/Page.module.css"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <NavBar />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}