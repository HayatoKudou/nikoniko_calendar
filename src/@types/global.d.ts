interface User {
  clientId: number;
  name: string;
  email: string;
  apiToken: string;
  role: ?string;
  password: ?string;
}

interface Client {
  id: number;
  name: string;
}

interface Book {
  title: string;
  description: string;
  image: any | null;
}

interface RegisterBook {
  categoryId: number | null;
  title: string;
  description: string;
  image: any | null;
  apiToken: string;
}

interface ApplyBook {
  category: string;
  url: string;
  reason: string;
}
