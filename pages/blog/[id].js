import { client } from "../../libs/client";
import styles from "../../styles/Home.module.scss";
import cheerio from "cheerio";
import hljs from "highlight.js";
import "highlight.js/styles/hybrid.css";

export default function BlogId({ blog }) {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{blog.title}</h1>
      <p className={styles.publishedAt}>{blog.publishedAt}</p>
      <p className="category">{blog.category && `${blog.category.name}`}</p>
      <div
        dangerouslySetInnerHTML={{ __html: `${blog.body}` }}
        className={styles.post}
      />
    </main>
  );
}

export const getStaticPaths = async () => {
  const data = await client.get({
    endpoint: "blog",
  });
  const paths = data.contents.map((content) => `/blog/${content.id}`);
  return { paths, fallback: false };
};

export const getStaticProps = async (context) => {
  const id = context.params.id;
  const data = await client.get({ endpoint: "blog", contentId: id });
  const $ = cheerio.load(data.body);
  $("pre code").each((_, elm) => {
    const result = hljs.highlightAuto($(elm).text());
    $(elm).html(result.value);
    $(elm).addClass("hljs");
  });
  return {
    props: {
      blog: { ...data, body: $.html() },
    },
  };
};
