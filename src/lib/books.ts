import axios from 'axios';
import { Books } from './definitions';

type BookData = {
  data: Books[];
  size: number;
};

export async function getBooks(
  search: string,
  limit: number,
  page: number
): Promise<BookData> {
  const books = await axios
    .get(
      `${process.env.NEXT_PUBLIC_BOOKS_URL}?q=${
        search.length == 0 ? 'fantasy' : search
      }&fields=ratings_average,author_name,title,first_publish_year,subject&limit=${limit}&page=${page}`
    )
    .then((resp) => {
      const bookResponse = resp.data.docs;
      const booksTemp = bookResponse.map((book: any, _: any) => {
        return {
          ...book,
          ...(book.author_name && {
            author_name:
              book.author_name.length > 1
                ? book.author_name[0]
                : book.author_name,
          }),
          ...(book.subject && {
            subject: book.subject.length > 1 ? book.subject[0] : book.subject,
          }),
        };
      });
      return { data: booksTemp, size: resp.data.numFound };
    });

  return books;
}

export async function getAuthor(book: Books): Promise<Books> {
  const authorResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_AUTHOR_URL}?q=${book.author_name}&limit=1`
  );
  //   console.log(authorResponse);
  const authorData = {
    title: book.title,
    first_publish_year: book.first_publish_year,
    subject: book.subject,
    author_name: book.author_name,
    author_birth_date: String(authorResponse.data.docs[0].birth_date),
    author_top_work: String(authorResponse.data.docs[0].top_work),
    ratings_average: Number(book.ratings_average.toFixed(2)),
  };
  return authorData;
}
