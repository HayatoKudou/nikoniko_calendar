interface User {
  id: number;
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
  purchaseLimit: number;
  purchaseLimitUnit: string;
  privateOwnershipAllow: boolean;
}

interface Book {
  id: number;
  category: string;
  status: number;
  title: string;
  description: string;
  createdAt: string;
  image: any | null;
  url: string | null;
  purchaseApplicant: User;
  rentalApplicant: User;
  reviews: any;
  rentalCount: number;
}

interface BookCategory {
  name: string;
}

interface Review {
  rate: number;
  review: string;
  reviewedAt: string;
  reviewer: string;
}

interface BookHistory {
  userName: string;
  action: string;
  createdAt: string;
}

interface TableHeadCell {
  id: string;
  label: string;
}

interface PurchaseApply {
  price: number;
  reason: string;
  step: number;
  createdAt: string;
  user: User;
  book: Book;
}
