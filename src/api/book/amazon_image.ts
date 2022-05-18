const AmazonImage = async (asin: string): Promise<Blob> => {
  const type = "LZZZZZZZ";
  const endpoint = `https://images-na.ssl-images-amazon.com/images/P/${asin}.09.${type}`;

  return fetch(endpoint, {
    method: "GET",
  }).then((res) => res.blob());
};

export default AmazonImage;
