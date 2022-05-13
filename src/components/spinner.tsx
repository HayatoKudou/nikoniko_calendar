import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Spinner = () => (
  <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
    <CircularProgress size={100} />
  </Backdrop>
);

export default Spinner;
