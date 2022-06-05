interface User {
  clientId: number;
  name: string;
  email: string;
  apiToken: string;
  role: {
    is_account_manager: number;
    is_book_manager: number;
    is_client_manager: number;
  };
}

interface Client {
  id: number;
  name: string;
}

interface Book {
  id: number;
  category: string;
  status: number;
  title: string;
  description: string;
  image: any | null;
}

interface BookCategory {
  name: string;
}
