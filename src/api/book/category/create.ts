import Config from "../../../../config";

export interface CreateBookCategoryRequestErrors {
  name: Array<string>;
}

interface CreateBookCategoryResult {
  succeeded: boolean;
  errors: Partial<CreateBookCategoryRequestErrors>;
}

interface CreateBookCategoryRequestPayload {
  name: string;
  apiToken: string;
}

const CreateBookCategory = async (
  clientId: string,
  payload: CreateBookCategoryRequestPayload
): Promise<CreateBookCategoryResult> => {
  const endpoint = `${Config.apiOrigin}/api/${clientId}/bookCategory`;
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

export default CreateBookCategory;
