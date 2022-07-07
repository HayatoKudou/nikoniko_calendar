import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import * as React from "react";
import useBookHistories from "../../api/book/history";
import styles from "../../styles/components/book_history_timeline.module.scss";

interface Props {
  bookId: number;
}

function actionName(action: string): string {
  switch (action) {
    case "create book":
      return "登録";
    case "return book":
      return "返却";
    case "purchase book":
      return "購入申請";
    case "lend book":
      return "貸出";
    default:
      return "その他";
  }
}

function actionIcon(action: string) {
  switch (action) {
    case "create book":
      return <DeliveryDiningIcon />;
    case "return book":
      return <KeyboardReturnIcon />;
    case "purchase book":
      return <LocalPostOfficeIcon />;
    case "lend book":
      return <StopCircleIcon />;
    default:
      return "その他";
  }
}

const BookHistoryTimeline = (props: Props) => {
  const { loading, error, response } = useBookHistories(props.bookId);

  return (
    <>
      {loading || error ? (
        <Box className={styles.bookHistoryTimeline__spinner}>
          <CircularProgress size={70} />
        </Box>
      ) : (
        <Box className={styles.bookHistoryTimeline}>
          <Timeline>
            {response.histories.map((history: BookHistory, index: number) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent className={styles.bookHistoryTimeline__content} variant="body2" color="text.secondary">
                  {history.date}
                  <Box>{history.userName}</Box>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot>{actionIcon(history.action)}</TimelineDot>
                  {response.histories.length != index + 1 && response.histories.length > 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent className={styles.bookHistoryTimeline__content}>
                  <Typography variant="h6">{actionName(history.action)}</Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Box>
      )}
    </>
  );
};

export default BookHistoryTimeline;
