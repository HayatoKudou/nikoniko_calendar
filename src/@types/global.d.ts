interface User {
  id: number;
  name: string;
  email: string;
  apiToken?: string;
  role: {
    isAccountManager: boolean;
    isBookManager: boolean;
    isClientManager: boolean;
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
  location: string;
  createdAt: string;
  user: User;
  book: Book;
}
