import { useEffect } from "react";

const SEO = ({
  title,
  description,
}) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const descriptionTag =
      document.querySelector(
        'meta[name="description"]'
      );

    if (descriptionTag && description) {
      descriptionTag.setAttribute(
        "content",
        description
      );
    }
  }, [title, description]);

  return null;
};

export default SEO;