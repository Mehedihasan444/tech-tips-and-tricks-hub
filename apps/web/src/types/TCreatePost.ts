type TData = {
  title: string;
  categories: string;
  tags: string[];
  content: string;
};

export type TCreatePost = {
  data: TData;
  images: File[];
};
