import Config from "../../../config";

interface CsvBulkCreateBookResult {
  succeeded: boolean;
  errors: any;
}

interface CsvBulkCreateBookRequestPayload {
  books: Array<any>;
  apiToken: string;
}

const BulkCreate = async (workspaceId: string, payload: CsvBulkCreateBookRequestPayload): Promise<CsvBulkCreateBookResult> => {
  const endpoint = `${Config.apiOrigin}/api/${workspaceId}/book/csvBulk`;
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

export default BulkCreate;
