import { CircularProgress } from "@mui/material";
import styles from "@/components/loadingSpinner.module.css"

const LoadingSpinner = (props : any) => {
  // let dots = window.setInterval( function() {
  // let wait = document.getElementById("wait");
  //   if (wait != null) {
  //     if ( wait.innerHTML.length > 3 ) 
  //       wait.innerHTML = "";
  //     else 
  //         wait.innerHTML += ".";
  //   }
  // }, 1000)
    

  return (
    <div>
      <CircularProgress />
      <div>{props.description}
        <span id="wait">...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
