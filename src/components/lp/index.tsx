import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import LocalPostOfficeOutlinedIcon from "@mui/icons-material/LocalPostOfficeOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useRouter } from "next/router";
import * as React from "react";
import { Totals } from "../../../api_client";
import ApiClient from "../../lib/apiClient";
import DashboardSampleImage from "./dashboard-sample.png";
import styles from "./style.module.scss";

const OverviewPaper = (props: { icon: any; title: string; description: string }) => {
  return (
    <Paper variant="outlined" className={styles.lp__overviewPaperContent}>
      {props.icon}
      <Typography variant={"h3"} className={styles.lp__overviewPaperTitle}>
        {props.title}
      </Typography>
      <Typography variant={"h4"} className={styles.lp__overviewPaperDescription}>
        {props.description}
      </Typography>
    </Paper>
  );
};

const Lp = () => {
  const router = useRouter();
  const [data, setData] = React.useState<Totals>();
  React.useEffect(() => {
    ApiClient("")
      .apiTotalsGet()
      .then((res) => {
        setData(res.data);
      });
  }, []);

  return (
    <Box>
      <Box className={styles.lp__image}>
        <Box className={styles.lp__imageContainer}>
          <Image src={DashboardSampleImage} sizes="33vw" />
        </Box>
        <Box className={styles.lp__content}>
          <Box className={styles.lp__contentTitle}>
            <Box className={styles.lp__contentTitle__main}>書籍の貸出返却・購入申請もできる！</Box>
            <Typography variant={"h1"} className={styles.lp__contentTitle__main}>
              書籍管理サービス「Read Worth」
            </Typography>
            <Box className={styles.lp__contentTitle__sub}>Read Worthで、読書の価値を見つけよう</Box>
          </Box>
          <Button variant={"contained"} className={styles.lp__contentButton} size={"large"} onClick={() => router.push(`/sign-in`)}>
            無料ではじめる
          </Button>
        </Box>
      </Box>

      <Paper variant="outlined" className={styles.lp__totals}>
        <Box className={styles.lp__totalsContent}>
          【累計アカウント登録数：<Box className={styles.lp__totalsContentUnit}>{data?.userCount}</Box> 人】
        </Box>
        <Box className={styles.lp__totalsContent}>
          【累計書籍登録数：<Box className={styles.lp__totalsContentUnit}>{data?.bookCount}</Box> 冊】
        </Box>
      </Paper>

      <Box>
        <Typography variant={"h2"} className={styles.lp__overviewTitle}>
          Read Worth にできること
        </Typography>
        <Typography variant={"h3"} className={styles.lp__overviewTitle__sub}>
          Read Worthは企業向けのスマートな書籍管理サービス。<br></br>
          書籍の購入・貸出を効率的に管理し、従業員の読書環境を充実させます。
        </Typography>
        <Box className={styles.lp__overviewPaper}>
          <OverviewPaper
            icon={<LibraryBooksOutlinedIcon className={styles.lp__overviewPaperIcon} />}
            title={"書籍の管理"}
            description={
              "書籍を簡単に登録・管理することができます。貸出状態や評価数など一目で確認でき、また自分好みのデザインに設定することもできます。"
            }
          />
          <OverviewPaper
            icon={<LocalPostOfficeOutlinedIcon className={styles.lp__overviewPaperIcon} />}
            title={"書籍の購入申請"}
            description={"読みたい書籍を簡単に購入申請ができ、管理者はスムーズに申請を承認できます。書籍の申請状態を確認することも可能です。"}
          />
          <OverviewPaper
            icon={<BookmarkAddOutlinedIcon className={styles.lp__overviewPaperIcon} />}
            title={"書籍の貸出"}
            description={"読みたい書籍を簡単に貸出・返却することができます。面倒な貸出申請を省略でき、また書籍の返却忘れを防ぐことができます。"}
          />
        </Box>
        <Box className={styles.lp__overviewPaper}>
          <OverviewPaper
            icon={<RateReviewOutlinedIcon className={styles.lp__overviewPaperIcon} />}
            title={"書籍の評価とレビューの管理"}
            description={"書籍の評価やレビューを簡単に登録・管理することができます。書籍がどのような評価をされているのか確認することができます。"}
          />
          <OverviewPaper
            icon={<HistoryOutlinedIcon className={styles.lp__overviewPaperIcon} />}
            title={"書籍の履歴"}
            description={"誰がいつ、貸出・返却をしたか等が簡単に確認できます。どのような人がその書籍を呼んでいるのか参考にすることができます。"}
          />
          <OverviewPaper
            icon={<NotificationsActiveOutlinedIcon className={styles.lp__overviewPaperIcon} />}
            title={"通知"}
            description={"書籍の貸出・返却等の通知設定をすることができます。これにより書籍の貸出がスムーズになります。"}
          />
        </Box>
      </Box>
      <Box className={styles.lp__copyright}>Copyright © 2023 Hayato Kudo</Box>
    </Box>
  );
};

export default Lp;
