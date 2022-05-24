import AddCircleIcon from "@mui/icons-material/AddCircle";
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
import * as React from "react";
import { useRecoilState } from "recoil";
import Config from "../../../config";
import useBooks from "../../api/book/list";
import { useMe } from "../../store/me";
import { useBookCardStyle } from "../../store/styles/book_card_style";
import { useImageSize } from "../../store/styles/image_size";
import Spinner from "../spinner";
import BookApply from "./book_apply";
import BookInfo from "./book_info";
import BookRegister from "./book_register";
import StyleSetting from "./style_setting";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Dashboard = () => {
  const [imageSize] = useRecoilState(useImageSize);
  const [bookCardStyle] = useRecoilState(useBookCardStyle);
  const [me] = useRecoilState(useMe);
  const [value, setValue] = React.useState(0);
  const [applyDialogOpen, setApplyDialogOpen] = React.useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = React.useState(false);
  const [bookInfoDialogOpen, setBookInfoDialogOpen] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState("");
  const [tabList, setTabList] = React.useState([{ label: "ALL" }]);
  const [selectedBook, setSelectedBook] = React.useState<Book | null>(null);

  const { loading, error, response, mutate } = useBooks();
  if (loading) return <Spinner />;
  if (error) {
    return <Spinner />;
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue !== undefined) {
      setValue(newValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    tabList.push({ label: formValue });
    setTabList(tabList);
    setFormOpen(false);
    setFormValue("");
  };

  const handleClickBook = (book: Book) => {
    setSelectedBook(book);
    setBookInfoDialogOpen(true);
  };

  return (
    <>
      <StyleSetting />
      <BookInfo open={bookInfoDialogOpen} setClose={() => setBookInfoDialogOpen(false)} bookInfo={selectedBook} />
      <BookApply open={applyDialogOpen} setClose={() => setApplyDialogOpen(false)} />
      <BookRegister
        open={registerDialogOpen}
        setClose={() => setRegisterDialogOpen(false)}
        success={() => mutate(`${Config.apiOrigin}/api/${me.clientId}/books`)}
      />

      <Button variant="contained" sx={{ float: "right" }} onClick={() => setApplyDialogOpen(true)}>
        書籍申請
      </Button>
      <Button variant="contained" sx={{ float: "right", marginRight: 1 }} onClick={() => setRegisterDialogOpen(true)}>
        書籍登録
      </Button>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {tabList.map((tab, index) => (
            <Tab label={tab.label} {...a11yProps(index)} key={index} />
          ))}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={() => setFormOpen(!formOpen)}>
              {formOpen ? <RemoveCircleIcon /> : <AddCircleIcon />}
            </IconButton>
            {formOpen && (
              <form onSubmit={handleSubmit}>
                <TextField value={formValue} onChange={(e) => setFormValue(e.target.value)} size="small" />
              </form>
            )}
          </Box>
        </Tabs>
      </Box>

      {tabList.map((tab, index) => (
        <TabPanel value={value} index={index} key={index}>
          {response.books.map((book: Book, index: number) => {
            return (
              <Card sx={{ width: imageSize.width, margin: 1 }} key={index}>
                <CardActionArea onClick={() => handleClickBook(book)}>
                  <CardMedia
                    component="img"
                    height={imageSize.height}
                    src={book.image ? `data:image/png;base64, ${book.image}` : "../../no_image.png"}
                  />
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
                  <Button size="small">Share</Button>
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
