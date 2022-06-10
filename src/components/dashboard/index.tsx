import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircleIcon from "@mui/icons-material/Circle";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilState } from "recoil";
import Config from "../../../config";
import CreateBookCategory, { CreateBookCategoryRequestErrors } from "../../api/book/category/create";
import useBooks from "../../api/book/list";
import { useBookCategories } from "../../store/book/categories";
import { useMe } from "../../store/me";
import { useBookCardStyle } from "../../store/styles/book_card_style";
import { useImageSize } from "../../store/styles/image_size";
import { bookStatusColor, bookStatusName } from "../../util/book";
import FormError from "../form_error";
import Spinner from "../spinner";
import BookInfo from "./book_info";
import BookApply from "./book_purchase_apply";
import BookRegister from "./book_register";
import StyleSetting from "./style_setting";

interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
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
  const [imageSize] = useRecoilState(useImageSize);
  const [bookCardStyle] = useRecoilState(useBookCardStyle);
  const [, setBookCategory] = useRecoilState(useBookCategories);
  const [me] = useRecoilState(useMe);
  const [tabList, setTabList] = React.useState<Array<{ label: string }>>([{ label: "ALL" }]);
  const [openTabValue, setOpenTabValue] = React.useState("ALL");
  const [creating, setCreating] = React.useState(false);
  const [applicationDialogOpen, setApplicationDialogOpen] = React.useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = React.useState(false);
  const [bookInfoDialogOpen, setBookInfoDialogOpen] = React.useState(false);
  const [bookCategoryFormOpen, setBookCategoryFormOpen] = React.useState(false);
  const [bookCategoryFormValue, setBookCategoryFormValue] = React.useState("");
  const [bookCategoryFormError, setBookCategoryFormError] = React.useState<Partial<CreateBookCategoryRequestErrors>>(
    {}
  );
  const [selectedBook, setSelectedBook] = React.useState<Book | null>(null);

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
  console.log(response);

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
    if (openTabValue === "ALL") {
      return response.books;
    }
    return response.books.filter((book: Book) => {
      return book.category === openTabValue;
    });
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
        enqueueSnackbar(`カテゴリの登録に失敗しました`, {
          variant: "error",
        });
        setCreating(false);
      });
  };

  const handleDetailBook = (book: Book) => {
    setSelectedBook(book);
    setBookInfoDialogOpen(true);
  };

  return (
    <>
      <StyleSetting />
      <BookInfo open={bookInfoDialogOpen} setClose={() => setBookInfoDialogOpen(false)} bookInfo={selectedBook} />
      <BookApply
        open={applicationDialogOpen}
        setClose={() => setApplicationDialogOpen(false)}
        success={() => mutate(`${Config.apiOrigin}/api/${me.clientId}/books`)}
      />
      <BookRegister
        open={registerDialogOpen}
        setClose={() => setRegisterDialogOpen(false)}
        success={() => mutate(`${Config.apiOrigin}/api/${me.clientId}/books`)}
      />

      <Button variant="contained" sx={{ float: "right" }} onClick={() => setApplicationDialogOpen(true)}>
        書籍申請
      </Button>
      <Button variant="contained" sx={{ float: "right", marginRight: 1 }} onClick={() => setRegisterDialogOpen(true)}>
        書籍登録
      </Button>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={openTabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          {tabList.map((tab, index) => (
            <Tab label={tab.label} key={index} value={tab.label} />
          ))}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={() => setBookCategoryFormOpen(!bookCategoryFormOpen)}>
              {bookCategoryFormOpen ? <RemoveCircleIcon /> : <AddCircleIcon />}
            </IconButton>
            {bookCategoryFormOpen && (
              <form onSubmit={handleSubmit}>
                <TextField
                  value={bookCategoryFormValue}
                  onChange={(e) => setBookCategoryFormValue(e.target.value)}
                  size="small"
                />
                <FormError errors={bookCategoryFormError["name"]} />
              </form>
            )}
          </Box>
        </Tabs>
      </Box>

      {tabList.map((tab, index) => (
        <TabPanel value={openTabValue} index={tab.label} key={index}>
          {bookCategoryFiltered().map((book: Book, index: number) => {
            return (
              <Card sx={{ width: imageSize.width, margin: 1 }} key={index}>
                <CardActionArea onClick={() => handleDetailBook(book)}>
                  {book.image ? (
                    <CardMedia
                      component="img"
                      height={imageSize.height}
                      src={book.image ? `data:image/png;base64, ${book.image}` : "../../no_image.png"}
                    />
                  ) : (
                    <Box
                      sx={{ height: imageSize.height, display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                      <ImageNotSupportedIcon fontSize="large" />
                    </Box>
                  )}
                  {bookCardStyle === "rich" && (
                    <CardContent>
                      <Typography gutterBottom variant="h6">
                        {book.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          display: "-webkit-box",
                          webkitBoxOrient: "vertical",
                          webkitLineClamp: "4",
                        }}
                      >
                        {book.description}
                      </Typography>
                    </CardContent>
                  )}
                </CardActionArea>
                <CardActions>
                  <Button size="small">{bookStatusName(book.status)}</Button>
                  <CircleIcon color={bookStatusColor(book.status)} fontSize={"small"} sx={{ marginLeft: "auto" }} />
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
