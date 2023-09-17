const RegenerateButton = (props : any) => {
  return (
    <button onClick={props.action}>Regenerate {props.type}</button>
  );
};

export default RegenerateButton;
