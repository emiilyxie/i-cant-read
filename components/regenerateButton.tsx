import styles from "@/components/regenerateButton.module.css"

const RegenerateButton = (props : any) => {
  return (
    <button className={styles.regenerateButton} onClick={props.action}>Regenerate {props.type}</button>
  );
};

export default RegenerateButton;
