import Config from "../../../config";

interface PasswordSettingRequestPayload {
  password: string;
  password_confirmation: string;
}

export interface PasswordSettingRequestErrors {
  password: Array<string>;
  password_confirmation: Array<string>;
}

interface PasswordSettingResult {
  succeeded: boolean;
  errors: Partial<PasswordSettingRequestErrors>;
}

const PasswordSetting = async (payload: PasswordSettingRequestPayload): Promise<PasswordSettingResult> => {
  const endpoint = `${Config.apiOrigin}/api/password-setting`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
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

export default PasswordSetting;
