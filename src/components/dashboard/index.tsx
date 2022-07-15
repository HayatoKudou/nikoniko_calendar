import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircleIcon from "@mui/icons-material/Circle";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Rating from "@mui/material/Rating";
import Select from "@mui/material/Select";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Config from "../../../config";
import CreateBookCategory, { CreateBookCategoryRequestErrors } from "../../api/book/category/create";
import useBooks from "../../api/book/list";
import { useBookCategories } from "../../store/book/categories";
import { useMe } from "../../store/me";
import { useBookCardStyle } from "../../store/styles/book_card_style";
import { useImageSize } from "../../store/styles/image_size";
import styles from "../../styles/components/dashboards/index.module.scss";
import { bookStatusColor, bookStatusName } from "../../util/book";
import FormError from "../parts/form_error";
import Spinner from "../parts/spinner";
import BookInfo from "./book_info";
import BookPurchaseApply from "./book_purchase_apply";

interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
}

const sortOptions = ["新しい順", "古い順", "貸出順", "評価順"];

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div" sx={{ display: "flex", flexWrap: "wrap" }}>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

const Dashboard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const me = useRecoilValue(useMe);
  const imageSize = useRecoilValue(useImageSize);
  const bookCardStyle = useRecoilValue(useBookCardStyle);
  const [, setBookCategory] = useRecoilState(useBookCategories);
  const [tabList, setTabList] = React.useState<Array<{ label: string }>>([{ label: "ALL" }]);
  const [openTabValue, setOpenTabValue] = React.useState("ALL");
  const [creating, setCreating] = React.useState<boolean>(false);
  const [applicationDialogOpen, setApplicationDialogOpen] = React.useState<boolean>(false);
  const [bookInfoDialogOpen, setBookInfoDialogOpen] = React.useState<boolean>(false);
  const [bookCategoryFormOpen, setBookCategoryFormOpen] = React.useState<boolean>(false);
  const [bookCategoryFormValue, setBookCategoryFormValue] = React.useState("");
  const [bookCategoryFormError, setBookCategoryFormError] = React.useState<Partial<CreateBookCategoryRequestErrors>>({});
  const [selectedBook, setSelectedBook] = React.useState<Book | null>(null);
  const [bookSearchStringInput, setBookSearchStringInput] = React.useState<string>("");
  const [bookSearchString, setBookSearchString] = React.useState<string>("");
  const [bookSortedOption, setBookSortedOption] = React.useState<string>("新しい順");

  const { loading, error, response, mutate } = useBooks();
  React.useEffect(() => {
    if (response) {
      const bookCategories = response.bookCategories.map((bookCategory: BookCategory) => {
        return { label: bookCategory.name };
      });
      setBookCategory(response.bookCategories);
      setTabList(bookCategories);
    }
  }, [response]);

  if (loading || creating) return <Spinner />;
  if (error) {
    return <Spinner />;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue !== undefined) {
      setOpenTabValue(newValue);
    }
  };

  const bookCategoryFiltered = (): Array<any> => {
    let filtered = response.books;
    if (bookSearchString) {
      filtered = filtered.filter((book: Book) => {
        if (book.title.indexOf(bookSearchString) !== -1) {
          return book;
        }
      });
    }
    if (openTabValue === "ALL") {
      return filtered;
    }
    return filtered.filter((book: Book) => {
      return book.category === openTabValue;
    });
  };

  const bookSorted = (filtered: Array<any>): Array<any> => {
    switch (bookSortedOption) {
      case "新しい順":
        return filtered.sort((a: Book, b: Book) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "古い順":
        return filtered.sort((a: Book, b: Book) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case "評価順":
        return filtered.sort((a: Book, b: Book) => {
          let rateAverage_A = 0;
          let rateAverage_B = 0;
          if (a.reviews.length > 0) {
            const rateSum_A = a.reviews
              .map((review: Review) => review.rate)
              .reduce((a: number, b: number) => {
                return a + b;
              });
            rateAverage_A = rateSum_A / a.reviews.length;
          }
          if (b.reviews.length > 0) {
            const rateSum_B = b.reviews
              .map((review: Review) => review.rate)
              .reduce((a: number, b: number) => {
                return a + b;
              });
            rateAverage_B = rateSum_B / b.reviews.length;
          }
          return rateAverage_B - rateAverage_A;
        });
      case "貸出順":
        return filtered.sort((a: Book, b: Book) => b.rentalCount - a.rentalCount);
      default:
        return filtered;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    CreateBookCategory(me.clientId, {
      name: bookCategoryFormValue,
      apiToken: me.apiToken,
    })
      .then((res) => {
        if (res.succeeded) {
          setBookCategoryFormError({});
          enqueueSnackbar("カテゴリの登録に成功しました。", {
            variant: "success",
          });

          if (res.bookCategories) {
            const bookCategories = res.bookCategories.map((bookCategory: BookCategory) => {
              return { label: bookCategory.name };
            });
            setBookCategory(res.bookCategories);
            setTabList(bookCategories);
          }
          setBookCategoryFormOpen(false);
          setBookCategoryFormValue("");
        } else {
          setBookCategoryFormError(res.errors);
          enqueueSnackbar(`カテゴリの登録に失敗しました`, {
            variant: "error",
          });
        }
        setCreating(false);
      })
      .catch(() => {
        enqueueSnackbar(`カテゴリの登録に失敗しました`, { variant: "error" });
        setCreating(false);
      });
  };

  const handleDetailBook = (book: Book) => {
    setSelectedBook(book);
    setBookInfoDialogOpen(true);
  };

  const handleSuccess = () => {
    mutate(`${Config.apiOrigin}/api/${me.clientId}/books`);
    setBookInfoDialogOpen(false);
    setApplicationDialogOpen(false);
  };

  return (
    <>
      {selectedBook && (
        <BookInfo open={bookInfoDialogOpen} success={handleSuccess} setClose={() => setBookInfoDialogOpen(false)} bookInfo={selectedBook} />
      )}
      <BookPurchaseApply
        open={applicationDialogOpen}
        setClose={() => setApplicationDialogOpen(false)}
        success={handleSuccess}
        client={response.client}
      />

      <Box className={styles.dashboard__head}>
        <Tabs value={openTabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          {tabList.map((tab, index) => (
            <Tab label={tab.label} key={index} value={tab.label} />
          ))}
          {me.role.is_book_manager && (
            <Box className={styles.dashboard__bookCategoryForm}>
              <IconButton onClick={() => setBookCategoryFormOpen(!bookCategoryFormOpen)}>
                {bookCategoryFormOpen ? <RemoveCircleIcon /> : <AddCircleIcon />}
              </IconButton>
              {bookCategoryFormOpen && (
                <form onSubmit={handleSubmit}>
                  <TextField
                    value={bookCategoryFormValue}
                    onChange={(e) => setBookCategoryFormValue(e.target.value)}
                    size="small"
                    className={styles.dashboard__bookCategoryInput}
                  />
                  <FormError errors={bookCategoryFormError["name"]} />
                </form>
              )}
            </Box>
          )}
        </Tabs>

        <Box className={styles.dashboard__headRight}>
          <FormControl className={styles.dashboard__sortForm} size="small">
            <Select value={bookSortedOption}>
              {sortOptions.map((sortOption) => (
                <MenuItem key={sortOption} value={sortOption} onClick={() => setBookSortedOption(sortOption)}>
                  {sortOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            value={bookSearchStringInput}
            onChange={(e) => setBookSearchStringInput(e.target.value)}
            sx={{ marginRight: 1 }}
            label="書籍検索"
            size="small"
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setBookSearchString(bookSearchStringInput)}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
          <Button variant="contained" onClick={() => setApplicationDialogOpen(true)} className={styles.dashboard__purchaseApplyButton}>
            書籍購入申請
          </Button>
        </Box>
      </Box>

      {tabList.map((tab, index) => (
        <TabPanel value={openTabValue} index={tab.label} key={index}>
          {bookSorted(bookCategoryFiltered()).map((book: Book, index: number) => {
            let rateAverage = 0;
            if (book.reviews.length > 0) {
              const rateSum = book.reviews
                .map((review: Review) => review.rate)
                .reduce((a: number, b: number) => {
                  return a + b;
                });
              rateAverage = rateSum / book.reviews.length;
            }
            return (
              <Card
                sx={{
                  width: imageSize.width,
                  margin: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  border: book.rentalApplicant?.id === me.id ? "solid red" : "",
                }}
                key={index}
              >
                <CardActionArea onClick={() => handleDetailBook(book)}>
                  {book.image ? (
                    <CardMedia
                      component="img"
                      height={imageSize.height}
                      src={book.image ? `data:image/png;base64, ${book.image}` : "../../no_image.png"}
                    />
                  ) : (
                    <Box sx={{ height: imageSize.height, display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <ImageNotSupportedIcon fontSize="large" />
                    </Box>
                  )}
                  {bookCardStyle === "rich" && (
                    <CardContent sx={{ padding: "8px 8px 0px 8px" }}>
                      <Typography
                        sx={{
                          fontSize: imageSize.height / 15,
                          display: "-webkit-box",
                          overflow: "hidden",
                          WebkitLineClamp: "3",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {book.title}
                      </Typography>
                    </CardContent>
                  )}
                </CardActionArea>
                <CardActions sx={{ display: "block", paddingTop: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Rating name="rate" value={rateAverage} readOnly precision={0.5} sx={{ fontSize: imageSize.height / 12 }} />
                    <Button size="small" sx={{ minWidth: "20px" }}>
                      {book.reviews.length}
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", marginLeft: "0px !important" }}>
                    <Button size="small" sx={{ paddingLeft: 0 }}>
                      {bookStatusName(book.status)}
                    </Button>
                    <CircleIcon color={bookStatusColor(book.status)} fontSize={"small"} sx={{ marginLeft: "auto" }} />
                  </Box>
                </CardActions>
              </Card>
            );
          })}
        </TabPanel>
      ))}
    </>
  );
};

export default Dashboard;
