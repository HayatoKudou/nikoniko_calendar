interface PurchaseApplicantName {
  id: number;
  name: string;
}

interface RentalApplicant {
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
  purchaseApplicant: PurchaseApplicantName;
  rentalApplicant: RentalApplicant;
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
