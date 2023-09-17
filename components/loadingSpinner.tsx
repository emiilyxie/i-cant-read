import { CircularProgress } from "@mui/material";

const LoadingSpinner = (props : any) => {
  return (
    <div>
      <CircularProgress />
      <div>{props.description}</div>
    </div>
  );
};

export default LoadingSpinner;
