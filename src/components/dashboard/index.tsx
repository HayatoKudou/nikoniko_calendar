import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { ListItemIcon, Menu } from "@mui/material";
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
import { useRecoilValue, useRecoilState } from "recoil";
import { BookCategoryCreateValidateErrorResponse, BooksResponseBooksInner } from "../../../api_client";
import ApiClient from "../../lib/apiClient";
import { useBookCategories } from "../../store/book/categories";
import { useChoseWorkspace } from "../../store/choseWorkspace";
import { useFavoriteBooks } from "../../store/favoriteBooks";
import { useMe } from "../../store/me";
import { useBookCardStyle } from "../../store/styles/book_card_style";
import { useImageSize } from "../../store/styles/image_size";
import styles from "../../styles/components/dashboards/index.module.scss";
import { bookStatusColor, bookStatusName } from "../../util/book";
import ConfirmDialog from "../parts/confirm_dialog";
import Spinner from "../parts/spinner";
import BookInfo from "./book_info";
import BookPurchaseApply from "./book_purchase_apply";
import { TabPanel } from "./tab_panel";

const Dashboard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const me = useRecoilValue(useMe);
  const choseWorkspace = useRecoilValue(useChoseWorkspace);
  const [favoriteBooks, setFavoriteBooks] = useRecoilState(useFavoriteBooks);
  const imageSize = useRecoilValue(useImageSize);
  const bookCardStyle = useRecoilValue(useBookCardStyle);
  const [, setBookCategory] = useRecoilState(useBookCategories);
  const [tabList, setTabList] = React.useState<Array<{ label: string }>>([{ label: "ALL" }]);
  const [openTabValue, setOpenTabValue] = React.useState("ALL");
  const [loading, setLoading] = React.useState(false);
  const [applicationDialogOpen, setApplicationDialogOpen] = React.useState<boolean>(false);
  const [bookInfoDialogOpen, setBookInfoDialogOpen] = React.useState<boolean>(false);
  const [bookCategoryFormOpen, setBookCategoryFormOpen] = React.useState<boolean>(false);
  const [bookCategoryFormValue, setBookCategoryFormValue] = React.useState("");
  const [createBookCategoryRequestErrors, setCreateBookCategoryRequestErrors] = React.useState<BookCategoryCreateValidateErrorResponse>({});
  const [selectedBook, setSelectedBook] = React.useState<BooksResponseBooksInner | null>(null);
  const [bookSearchStringInput, setBookSearchStringInput] = React.useState<string>("");
  const [bookSearchString, setBookSearchString] = React.useState<string>("");
  const [bookSortedOption, setBookSortedOption] = React.useState<string>("新しい順");
  const [books, setBooks] = React.useState<Array<BooksResponseBooksInner>>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectTagContext, setSelectTagContext] = React.useState(null);
  const [openDeleteTagConfirm, setOpenDeleteTagConfirm] = React.useState<boolean>(false);
  const [canEditBookCategory, setCanEditBookCategory] = React.useState<boolean>(false);

  const sortOptions = ["新しい順", "古い順", "貸出順", "評価順"];

  React.useEffect(() => {
    fetchBooks();
    setCanEditBookCategory(Boolean(me.role.isBookManager));
  }, [choseWorkspace]);

  if (loading) return <Spinner />;

  const fetchBooks = () => {
    setLoading(true);
    ApiClient(me.apiToken)
      .apiWorkspaceIdBooksGet(choseWorkspace.workspaceId)
      .then((res) => {
        setBooks(res.data.books);
        setBookCategory(res.data.bookCategories);
        const bookCategories = res.data.bookCategories.map((bookCategory) => {
          return { label: bookCategory.name };
        });
        setTabList(bookCategories);
        setLoading(false);
      })
      .catch(() => {
        enqueueSnackbar("エラーが発生しました", { variant: "error" });
        setLoading(false);
      });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue !== undefined) {
      setOpenTabValue(newValue);
    }
  };

  const bookCategoryFiltered = (): Array<BooksResponseBooksInner> => {
    let filtered = Object.create(books) as Array<BooksResponseBooksInner>;
    // 検索文字列フィルタ
    filtered = filtered.filter((book) => {
      if (book.title.indexOf(bookSearchString) !== -1) {
        return book;
      }
    });
    if (openTabValue === "ALL") return filtered;
    // タブフィルタ
    return filtered.filter((book) => {
      return book.category === openTabValue;
    });
  };

  const bookSorted = (filtered: Array<BooksResponseBooksInner>): Array<BooksResponseBooksInner> => {
    switch (bookSortedOption) {
      case "新しい順":
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "古い順":
        return filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case "評価順":
        return filtered.sort((a, b) => {
          let rateAverage_A = 0;
          let rateAverage_B = 0;
          if (a.reviews.length > 0) {
            const rateSum_A = a.reviews
              .map((review) => review.rate)
              .reduce((a: number, b: number) => {
                return a + b;
              });
            rateAverage_A = rateSum_A / a.reviews.length;
          }
          if (b.reviews.length > 0) {
            const rateSum_B = b.reviews
              .map((review) => review.rate)
              .reduce((a: number, b: number) => {
                return a + b;
              });
            rateAverage_B = rateSum_B / b.reviews.length;
          }
          return rateAverage_B - rateAverage_A;
        });
      case "貸出順":
        return filtered.sort((a, b) => b.rentalCount - a.rentalCount);
      default:
        return filtered;
    }
  };

  const sortFavorite = (sorted: Array<BooksResponseBooksInner>): Array<BooksResponseBooksInner> => {
    return [...sorted.filter((item) => favoriteBooks.includes(item.id)), ...sorted.filter((item) => !favoriteBooks.includes(item.id))];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    ApiClient(me.apiToken)
      .apiWorkspaceIdBookCategoryPost(choseWorkspace.workspaceId, {
        name: bookCategoryFormValue,
      })
      .then(() => {
        setLoading(false);
        setCreateBookCategoryRequestErrors({});
        setBookCategoryFormOpen(false);
        setBookCategoryFormValue("");
        enqueueSnackbar("カテゴリの登録に成功しました。", { variant: "success" });
        fetchBooks();
      })
      .catch((res) => {
        setLoading(false);
        setCreateBookCategoryRequestErrors(res.response.data.errors);
        enqueueSnackbar("エラーが発生しました", { variant: "error" });
      });
  };

  const handleDetailBook = (book: BooksResponseBooksInner) => {
    setSelectedBook(book);
    setBookInfoDialogOpen(true);
  };

  const handleSuccess = () => {
    fetchBooks();
    setBookInfoDialogOpen(false);
    setApplicationDialogOpen(false);
  };

  const handleTabContextMenu = (e: any) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
    setSelectTagContext(e.target.innerText);
  };

  const handleTabContextMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteTag = () => {
    setLoading(true);
    ApiClient(me.apiToken)
      .apiWorkspaceIdBookCategoryDelete(choseWorkspace.workspaceId, {
        name: selectTagContext!,
      })
      .then(() => {
        setLoading(false);
        setSelectTagContext(null);
        setOpenTabValue("ALL");
        setOpenDeleteTagConfirm(false);
        enqueueSnackbar("カテゴリの削除に成功しました。", { variant: "success" });
        fetchBooks();
        handleTabContextMenuClose();
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar("エラーが発生しました", { variant: "error" });
      });
  };

  const handleFavoriteBook = (bookId: number) => {
    if (favoriteBooks.includes(bookId)) {
      setFavoriteBooks(favoriteBooks.filter((storedBookId: number) => storedBookId !== bookId));
    } else {
      setFavoriteBooks([...favoriteBooks, bookId]);
    }
  };

  return (
    <>
      <Box className={styles.dashboard__head}>
        <Tabs value={openTabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          {tabList.map((tab, index) => (
            <Tab label={tab.label} key={index} value={tab.label} onContextMenu={handleTabContextMenu} />
          ))}
          {canEditBookCategory && (
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
                    helperText={createBookCategoryRequestErrors?.name}
                    error={createBookCategoryRequestErrors?.name !== undefined}
                  />
                </form>
              )}
            </Box>
          )}
        </Tabs>

        {canEditBookCategory && (
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleTabContextMenuClose} onClick={handleTabContextMenuClose}>
            <MenuItem onClick={() => setOpenDeleteTagConfirm(true)}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              削除
            </MenuItem>
          </Menu>
        )}

        <ConfirmDialog
          message={"本当に削除しますか？"}
          open={openDeleteTagConfirm}
          onClose={() => setOpenDeleteTagConfirm(false)}
          handleSubmit={handleDeleteTag}
        />

        <Box className={styles.dashboard__headRight}>
          <FormControl className={styles.dashboard__sortForm} size="small">
            <Select value={bookSortedOption} sx={{ color: "text.secondary" }}>
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
            className={styles.dashboard__headRightBookSearchForm}
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
          {sortFavorite(bookSorted(bookCategoryFiltered())).map((book, index: number) => {
            let rateAverage = 0;
            if (book.reviews.length > 0) {
              const rateSum = book.reviews
                .map((review) => review.rate)
                .reduce((a: number, b: number) => {
                  return a + b;
                });
              rateAverage = rateSum / book.reviews.length;
            }
            return (
              <Card key={index} className={styles.dashboard__bookCard} sx={{ width: imageSize.width }}>
                <IconButton className={styles.dashboard__bookCardFavorite} onClick={() => handleFavoriteBook(book.id)}>
                  {favoriteBooks.includes(book.id) ? (
                    <StarIcon fontSize={"medium"} stroke={"gray"} />
                  ) : (
                    <StarOutlineIcon fontSize={"medium"} stroke={"gray"} />
                  )}
                </IconButton>
                <CardActionArea onClick={() => handleDetailBook(book)}>
                  {book.image ? (
                    <CardMedia
                      component="img"
                      height={imageSize.height}
                      src={book.image ? `data:image/png;base64, ${book.image}` : "../../no_image.png"}
                    />
                  ) : (
                    <Box className={styles.dashboard__bookCardNonImage} sx={{ height: imageSize.height }}>
                      <ImageNotSupportedIcon fontSize="large" />
                    </Box>
                  )}
                  {bookCardStyle === "rich" && (
                    <CardContent className={styles.dashboard__bookCardContent}>
                      <Typography className={styles.dashboard__bookCardContentText} sx={{ fontSize: imageSize.height / 15 }}>
                        {book.title}
                      </Typography>
                    </CardContent>
                  )}
                </CardActionArea>
                <CardActions className={styles.dashboard__bookCardAction}>
                  <Box className={styles.dashboard__bookCardActionDetail}>
                    <Rating name="rate" value={rateAverage} readOnly precision={0.5} sx={{ fontSize: imageSize.height / 12 }} />
                    <Button size="small" className={styles.dashboard__bookCardActionDetailButton}>
                      {book.reviews.length}
                    </Button>
                  </Box>
                  <Box className={styles.dashboard__bookCardActionForm}>
                    <Button size="small" className={styles.dashboard__bookCardActionFormButton}>
                      {bookStatusName(book.status)}
                    </Button>
                    <CircleIcon color={bookStatusColor(book.status)} fontSize={"small"} className={styles.dashboard__bookCardActionFormCircle} />
                  </Box>
                </CardActions>
              </Card>
            );
          })}
        </TabPanel>
      ))}
      {selectedBook && (
        <BookInfo open={bookInfoDialogOpen} success={handleSuccess} setClose={() => setBookInfoDialogOpen(false)} bookInfo={selectedBook} />
      )}
      <BookPurchaseApply open={applicationDialogOpen} setClose={() => setApplicationDialogOpen(false)} success={handleSuccess} />
    </>
  );
};

export default Dashboard;
