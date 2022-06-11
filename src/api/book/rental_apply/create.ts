import Config from "../../../../config";

export interface BookRentalApplyRequestErrors {
  reason: Array<string>;
  expected_return_date: Array<string>;
}

interface BookRentalApplyResult {
  succeeded: boolean;
  errors: Partial<BookRentalApplyRequestErrors>;
}

interface BookRentalApplyRequestPayload {
  reason: string;
  expected_return_date: Date;
  apiToken: string;
}

const CreateBookRentalApply = async (
  clientId: string,
  bookId: number,
  payload: BookRentalApplyRequestPayload
): Promise<BookRentalApplyResult> => {
  const endpoint = `${Config.apiOrigin}/api/${clientId}/${bookId}/rentalApply`;
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

export default CreateBookRentalApply;
