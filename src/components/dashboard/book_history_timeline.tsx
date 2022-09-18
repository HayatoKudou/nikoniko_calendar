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
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import { BookHistoriesListResponseInner } from "../../../api_client";
import ApiClient from "../../lib/apiClient";
import { useChoseClient } from "../../store/choseClient";
import { useMe } from "../../store/me";
import styles from "../../styles/components/book_history_timeline.module.scss";
import { historyActionName, historyActionIcon } from "../../util/bookHistory";

const BookHistoryTimeline = (props: { bookId: number }) => {
  const me = useRecoilValue(useMe);
  const { enqueueSnackbar } = useSnackbar();
  const choseClient = useRecoilValue(useChoseClient);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [bookHistories, setBookHistories] = React.useState<Array<BookHistoriesListResponseInner> | null>(null);

  React.useEffect(() => {
    fetchBookHistories();
  }, []);

  const fetchBookHistories = () => {
    setLoading(true);
    ApiClient(me.apiToken)
      .apiWorkspaceIdBookIdHistoriesGet(choseClient.clientId, props.bookId)
      .then((res) => {
        setLoading(false);
        setBookHistories(res.data);
      })
      .catch(() => {
        enqueueSnackbar("エラーが発生しました", { variant: "error" });
        setLoading(false);
      });
  };

  const sorted = (bookHistories: Array<BookHistoriesListResponseInner>) => {
    return bookHistories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  return (
    <>
      {loading ? (
        <Box className={styles.bookHistoryTimeline__spinner}>
          <CircularProgress size={70} />
        </Box>
      ) : (
        <Box className={styles.bookHistoryTimeline}>
          <Timeline>
            {bookHistories &&
              sorted(bookHistories).map((history, index: number) => (
                <TimelineItem key={index}>
                  <TimelineOppositeContent className={styles.bookHistoryTimeline__content} variant="body2" color="text.secondary">
                    {history.createdAt}
                    <Box>{history.userName}</Box>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot>{historyActionIcon(history.actionName)}</TimelineDot>
                    {bookHistories?.length != index + 1 && bookHistories?.length > 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent className={styles.bookHistoryTimeline__content}>
                    <Typography>{historyActionName(history.actionName)}</Typography>
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
