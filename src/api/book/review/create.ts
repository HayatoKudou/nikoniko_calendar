import Config from "../../../../config";

export interface CreateBookReviewRequestErrors {
  review: Array<string>;
}

interface CreateBookReviewResult {
  succeeded: boolean;
  errors: Partial<CreateBookReviewRequestErrors>;
}

interface CreateBookReviewRequestPayload {
  review: string;
  apiToken: string;
}

const CreateBookReview = async (clientId: string, payload: CreateBookReviewRequestPayload): Promise<CreateBookReviewResult> => {
  const endpoint = `${Config.apiOrigin}/api/${clientId}/bookReview`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${payload.apiToken}`,
    },
    body: JSON.stringify(payload),
  });
  const response = await res.json();

  if (!res.ok) {
    return {
      succeeded: false,
      errors: response.errors,
    };
  }

  return {
    succeeded: true,
    errors: {},
  };
};

export default CreateBookReview;
