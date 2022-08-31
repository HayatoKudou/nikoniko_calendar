/* tslint:disable */
/* eslint-disable */
/**
 * Read Worth API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Configuration } from "./configuration";
import globalAxios, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from "axios";
// Some imports not used depending on template conditions
// @ts-ignore
import {
  DUMMY_BASE_URL,
  assertParamExists,
  setApiKeyToObject,
  setBasicAuthToObject,
  setBearerAuthToObject,
  setOAuthToObject,
  setSearchParams,
  serializeDataIfNeeded,
  toPathString,
  createRequestFunction,
} from "./common";
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from "./base";

/**
 *
 * @export
 * @interface ApiClientIdBookPurchaseAppliesGet200Response
 */
export interface ApiClientIdBookPurchaseAppliesGet200Response {
  /**
   *
   * @type {boolean}
   * @memberof ApiClientIdBookPurchaseAppliesGet200Response
   */
  slackCredentialExists: boolean;
  /**
   *
   * @type {Array<ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInner>}
   * @memberof ApiClientIdBookPurchaseAppliesGet200Response
   */
  bookPurchaseApplies: Array<ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInner>;
}
/**
 *
 * @export
 * @interface ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInner
 */
export interface ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInner {
  /**
   *
   * @type {string}
   * @memberof ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInner
   */
  reason: string;
  /**
   *
   * @type {number}
   * @memberof ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInner
   */
  price: number;
  /**
   *
   * @type {number}
   * @memberof ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInner
   */
  step: number;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInner
   */
  location: string;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInner
   */
  createdAt: string;
  /**
   *
   * @type {ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerUser}
   * @memberof ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInner
   */
  user: ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerUser;
  /**
   *
   * @type {ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerBook}
   * @memberof ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInner
   */
  book: ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerBook;
}
/**
 *
 * @export
 * @interface ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerBook
 */
export interface ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerBook {
  /**
   *
   * @type {number}
   * @memberof ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerBook
   */
  id: number;
  /**
   *
   * @type {number}
   * @memberof ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerBook
   */
  status: number;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerBook
   */
  category: string;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerBook
   */
  title: string;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerBook
   */
  description: string;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerBook
   */
  image?: string;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerBook
   */
  url: string;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerBook
   */
  createdAt: string;
}
/**
 *
 * @export
 * @interface ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerUser
 */
export interface ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerUser {
  /**
   *
   * @type {number}
   * @memberof ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerUser
   */
  id: number;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerUser
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdBookPurchaseAppliesGet200ResponseBookPurchaseAppliesInnerUser
   */
  email: string;
}
/**
 *
 * @export
 * @interface ApiClientIdClientGet200Response
 */
export interface ApiClientIdClientGet200Response {
  /**
   *
   * @type {number}
   * @memberof ApiClientIdClientGet200Response
   */
  id: number;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdClientGet200Response
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdClientGet200Response
   */
  plan: string;
}
/**
 *
 * @export
 * @interface ApiClientIdMeGet200Response
 */
export interface ApiClientIdMeGet200Response {
  /**
   *
   * @type {number}
   * @memberof ApiClientIdMeGet200Response
   */
  id: number;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdMeGet200Response
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdMeGet200Response
   */
  email: string;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdMeGet200Response
   */
  apiToken: string;
  /**
   *
   * @type {ApiClientIdMeGet200ResponseRole}
   * @memberof ApiClientIdMeGet200Response
   */
  role: ApiClientIdMeGet200ResponseRole;
  /**
   *
   * @type {Array<ApiClientIdMeGet200ResponseClientsInner>}
   * @memberof ApiClientIdMeGet200Response
   */
  clients: Array<ApiClientIdMeGet200ResponseClientsInner>;
}
/**
 *
 * @export
 * @interface ApiClientIdMeGet200ResponseClientsInner
 */
export interface ApiClientIdMeGet200ResponseClientsInner {
  /**
   *
   * @type {number}
   * @memberof ApiClientIdMeGet200ResponseClientsInner
   */
  id: number;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdMeGet200ResponseClientsInner
   */
  name: string;
}
/**
 *
 * @export
 * @interface ApiClientIdMeGet200ResponseRole
 */
export interface ApiClientIdMeGet200ResponseRole {
  /**
   *
   * @type {boolean}
   * @memberof ApiClientIdMeGet200ResponseRole
   */
  isAccountManager: boolean;
  /**
   *
   * @type {boolean}
   * @memberof ApiClientIdMeGet200ResponseRole
   */
  isBookManager: boolean;
  /**
   *
   * @type {boolean}
   * @memberof ApiClientIdMeGet200ResponseRole
   */
  isClientManager: boolean;
}
/**
 *
 * @export
 * @interface ApiClientIdUserPost422Response
 */
export interface ApiClientIdUserPost422Response {
  /**
   *
   * @type {Array<string>}
   * @memberof ApiClientIdUserPost422Response
   */
  id?: Array<string>;
  /**
   *
   * @type {Array<string>}
   * @memberof ApiClientIdUserPost422Response
   */
  name?: Array<string>;
  /**
   *
   * @type {Array<string>}
   * @memberof ApiClientIdUserPost422Response
   */
  email?: Array<string>;
  /**
   *
   * @type {Array<string>}
   * @memberof ApiClientIdUserPost422Response
   */
  roles?: Array<string>;
}
/**
 *
 * @export
 * @interface ApiClientIdUserPost422Response1
 */
export interface ApiClientIdUserPost422Response1 {
  /**
   *
   * @type {Array<string>}
   * @memberof ApiClientIdUserPost422Response1
   */
  name?: Array<string>;
  /**
   *
   * @type {Array<string>}
   * @memberof ApiClientIdUserPost422Response1
   */
  email?: Array<string>;
  /**
   *
   * @type {Array<string>}
   * @memberof ApiClientIdUserPost422Response1
   */
  roles?: Array<string>;
}
/**
 *
 * @export
 * @interface ApiClientIdUserPostRequest
 */
export interface ApiClientIdUserPostRequest {
  /**
   *
   * @type {number}
   * @memberof ApiClientIdUserPostRequest
   */
  id: number;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdUserPostRequest
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdUserPostRequest
   */
  email: string;
  /**
   *
   * @type {Array<string>}
   * @memberof ApiClientIdUserPostRequest
   */
  roles: Array<string>;
}
/**
 *
 * @export
 * @interface ApiClientIdUserPostRequest1
 */
export interface ApiClientIdUserPostRequest1 {
  /**
   *
   * @type {string}
   * @memberof ApiClientIdUserPostRequest1
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdUserPostRequest1
   */
  email: string;
  /**
   *
   * @type {Array<string>}
   * @memberof ApiClientIdUserPostRequest1
   */
  roles: Array<string>;
}
/**
 *
 * @export
 * @interface ApiClientIdUsersGet200Response
 */
export interface ApiClientIdUsersGet200Response {
  /**
   *
   * @type {Array<ApiClientIdUsersGet200ResponseUsersInner>}
   * @memberof ApiClientIdUsersGet200Response
   */
  users: Array<ApiClientIdUsersGet200ResponseUsersInner>;
}
/**
 *
 * @export
 * @interface ApiClientIdUsersGet200ResponseUsersInner
 */
export interface ApiClientIdUsersGet200ResponseUsersInner {
  /**
   *
   * @type {number}
   * @memberof ApiClientIdUsersGet200ResponseUsersInner
   */
  id: number;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdUsersGet200ResponseUsersInner
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdUsersGet200ResponseUsersInner
   */
  email: string;
  /**
   *
   * @type {string}
   * @memberof ApiClientIdUsersGet200ResponseUsersInner
   */
  apiToken: string;
  /**
   *
   * @type {ApiClientIdMeGet200ResponseRole}
   * @memberof ApiClientIdUsersGet200ResponseUsersInner
   */
  role: ApiClientIdMeGet200ResponseRole;
}

/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     *
     * @summary 書籍購入申請一覧
     * @param {number} clientId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    apiClientIdBookPurchaseAppliesGet: async (clientId: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
      // verify required parameter 'clientId' is not null or undefined
      assertParamExists("apiClientIdBookPurchaseAppliesGet", "clientId", clientId);
      const localVarPath = `/api/{clientId}/bookPurchaseApplies`.replace(`{${"clientId"}}`, encodeURIComponent(String(clientId)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: "GET", ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication Bearer required

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @summary 組織情報
     * @param {number} clientId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    apiClientIdClientGet: async (clientId: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
      // verify required parameter 'clientId' is not null or undefined
      assertParamExists("apiClientIdClientGet", "clientId", clientId);
      const localVarPath = `/api/{clientId}/client`.replace(`{${"clientId"}}`, encodeURIComponent(String(clientId)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: "GET", ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication Bearer required

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @summary 組織一覧
     * @param {number} clientId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    apiClientIdClientsGet: async (clientId: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
      // verify required parameter 'clientId' is not null or undefined
      assertParamExists("apiClientIdClientsGet", "clientId", clientId);
      const localVarPath = `/api/{clientId}/clients`.replace(`{${"clientId"}}`, encodeURIComponent(String(clientId)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: "GET", ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication Bearer required

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @summary 自分の情報
     * @param {number} clientId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    apiClientIdMeGet: async (clientId: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
      // verify required parameter 'clientId' is not null or undefined
      assertParamExists("apiClientIdMeGet", "clientId", clientId);
      const localVarPath = `/api/{clientId}/me`.replace(`{${"clientId"}}`, encodeURIComponent(String(clientId)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: "GET", ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication Bearer required

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @summary ユーザー追加
     * @param {number} clientId
     * @param {ApiClientIdUserPostRequest1} [apiClientIdUserPostRequest1]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    apiClientIdUserPost: async (
      clientId: number,
      apiClientIdUserPostRequest1?: ApiClientIdUserPostRequest1,
      options: AxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'clientId' is not null or undefined
      assertParamExists("apiClientIdUserPost", "clientId", clientId);
      const localVarPath = `/api/{clientId}/user`.replace(`{${"clientId"}}`, encodeURIComponent(String(clientId)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: "POST", ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication Bearer required

      localVarHeaderParameter["Content-Type"] = "application/json";

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
      localVarRequestOptions.data = serializeDataIfNeeded(apiClientIdUserPostRequest1, localVarRequestOptions, configuration);

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @summary ユーザー更新
     * @param {number} clientId
     * @param {ApiClientIdUserPostRequest} [apiClientIdUserPostRequest]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    apiClientIdUserPut: async (
      clientId: number,
      apiClientIdUserPostRequest?: ApiClientIdUserPostRequest,
      options: AxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'clientId' is not null or undefined
      assertParamExists("apiClientIdUserPut", "clientId", clientId);
      const localVarPath = `/api/{clientId}/user`.replace(`{${"clientId"}}`, encodeURIComponent(String(clientId)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: "PUT", ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication Bearer required

      localVarHeaderParameter["Content-Type"] = "application/json";

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
      localVarRequestOptions.data = serializeDataIfNeeded(apiClientIdUserPostRequest, localVarRequestOptions, configuration);

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @summary 組織に所属しているユーザー情報
     * @param {number} clientId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    apiClientIdUsersGet: async (clientId: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
      // verify required parameter 'clientId' is not null or undefined
      assertParamExists("apiClientIdUsersGet", "clientId", clientId);
      const localVarPath = `/api/{clientId}/users`.replace(`{${"clientId"}}`, encodeURIComponent(String(clientId)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: "GET", ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication Bearer required

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = DefaultApiAxiosParamCreator(configuration);
  return {
    /**
     *
     * @summary 書籍購入申請一覧
     * @param {number} clientId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async apiClientIdBookPurchaseAppliesGet(
      clientId: number,
      options?: AxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ApiClientIdBookPurchaseAppliesGet200Response>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.apiClientIdBookPurchaseAppliesGet(clientId, options);
      return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
    },
    /**
     *
     * @summary 組織情報
     * @param {number} clientId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async apiClientIdClientGet(
      clientId: number,
      options?: AxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ApiClientIdClientGet200Response>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.apiClientIdClientGet(clientId, options);
      return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
    },
    /**
     *
     * @summary 組織一覧
     * @param {number} clientId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async apiClientIdClientsGet(
      clientId: number,
      options?: AxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<ApiClientIdClientGet200Response>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.apiClientIdClientsGet(clientId, options);
      return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
    },
    /**
     *
     * @summary 自分の情報
     * @param {number} clientId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async apiClientIdMeGet(
      clientId: number,
      options?: AxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ApiClientIdMeGet200Response>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.apiClientIdMeGet(clientId, options);
      return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
    },
    /**
     *
     * @summary ユーザー追加
     * @param {number} clientId
     * @param {ApiClientIdUserPostRequest1} [apiClientIdUserPostRequest1]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async apiClientIdUserPost(
      clientId: number,
      apiClientIdUserPostRequest1?: ApiClientIdUserPostRequest1,
      options?: AxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.apiClientIdUserPost(clientId, apiClientIdUserPostRequest1, options);
      return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
    },
    /**
     *
     * @summary ユーザー更新
     * @param {number} clientId
     * @param {ApiClientIdUserPostRequest} [apiClientIdUserPostRequest]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async apiClientIdUserPut(
      clientId: number,
      apiClientIdUserPostRequest?: ApiClientIdUserPostRequest,
      options?: AxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.apiClientIdUserPut(clientId, apiClientIdUserPostRequest, options);
      return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
    },
    /**
     *
     * @summary 組織に所属しているユーザー情報
     * @param {number} clientId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async apiClientIdUsersGet(
      clientId: number,
      options?: AxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ApiClientIdUsersGet200Response>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.apiClientIdUsersGet(clientId, options);
      return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
    },
  };
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
  const localVarFp = DefaultApiFp(configuration);
  return {
    /**
     *
     * @summary 書籍購入申請一覧
     * @param {number} clientId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    apiClientIdBookPurchaseAppliesGet(clientId: number, options?: any): AxiosPromise<ApiClientIdBookPurchaseAppliesGet200Response> {
      return localVarFp.apiClientIdBookPurchaseAppliesGet(clientId, options).then((request) => request(axios, basePath));
    },
    /**
     *
     * @summary 組織情報
     * @param {number} clientId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    apiClientIdClientGet(clientId: number, options?: any): AxiosPromise<ApiClientIdClientGet200Response> {
      return localVarFp.apiClientIdClientGet(clientId, options).then((request) => request(axios, basePath));
    },
    /**
     *
     * @summary 組織一覧
     * @param {number} clientId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    apiClientIdClientsGet(clientId: number, options?: any): AxiosPromise<Array<ApiClientIdClientGet200Response>> {
      return localVarFp.apiClientIdClientsGet(clientId, options).then((request) => request(axios, basePath));
    },
    /**
     *
     * @summary 自分の情報
     * @param {number} clientId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    apiClientIdMeGet(clientId: number, options?: any): AxiosPromise<ApiClientIdMeGet200Response> {
      return localVarFp.apiClientIdMeGet(clientId, options).then((request) => request(axios, basePath));
    },
    /**
     *
     * @summary ユーザー追加
     * @param {number} clientId
     * @param {ApiClientIdUserPostRequest1} [apiClientIdUserPostRequest1]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    apiClientIdUserPost(clientId: number, apiClientIdUserPostRequest1?: ApiClientIdUserPostRequest1, options?: any): AxiosPromise<void> {
      return localVarFp.apiClientIdUserPost(clientId, apiClientIdUserPostRequest1, options).then((request) => request(axios, basePath));
    },
    /**
     *
     * @summary ユーザー更新
     * @param {number} clientId
     * @param {ApiClientIdUserPostRequest} [apiClientIdUserPostRequest]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    apiClientIdUserPut(clientId: number, apiClientIdUserPostRequest?: ApiClientIdUserPostRequest, options?: any): AxiosPromise<void> {
      return localVarFp.apiClientIdUserPut(clientId, apiClientIdUserPostRequest, options).then((request) => request(axios, basePath));
    },
    /**
     *
     * @summary 組織に所属しているユーザー情報
     * @param {number} clientId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    apiClientIdUsersGet(clientId: number, options?: any): AxiosPromise<ApiClientIdUsersGet200Response> {
      return localVarFp.apiClientIdUsersGet(clientId, options).then((request) => request(axios, basePath));
    },
  };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
  /**
   *
   * @summary 書籍購入申請一覧
   * @param {number} clientId
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public apiClientIdBookPurchaseAppliesGet(clientId: number, options?: AxiosRequestConfig) {
    return DefaultApiFp(this.configuration)
      .apiClientIdBookPurchaseAppliesGet(clientId, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @summary 組織情報
   * @param {number} clientId
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public apiClientIdClientGet(clientId: number, options?: AxiosRequestConfig) {
    return DefaultApiFp(this.configuration)
      .apiClientIdClientGet(clientId, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @summary 組織一覧
   * @param {number} clientId
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public apiClientIdClientsGet(clientId: number, options?: AxiosRequestConfig) {
    return DefaultApiFp(this.configuration)
      .apiClientIdClientsGet(clientId, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @summary 自分の情報
   * @param {number} clientId
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public apiClientIdMeGet(clientId: number, options?: AxiosRequestConfig) {
    return DefaultApiFp(this.configuration)
      .apiClientIdMeGet(clientId, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @summary ユーザー追加
   * @param {number} clientId
   * @param {ApiClientIdUserPostRequest1} [apiClientIdUserPostRequest1]
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public apiClientIdUserPost(clientId: number, apiClientIdUserPostRequest1?: ApiClientIdUserPostRequest1, options?: AxiosRequestConfig) {
    return DefaultApiFp(this.configuration)
      .apiClientIdUserPost(clientId, apiClientIdUserPostRequest1, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @summary ユーザー更新
   * @param {number} clientId
   * @param {ApiClientIdUserPostRequest} [apiClientIdUserPostRequest]
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public apiClientIdUserPut(clientId: number, apiClientIdUserPostRequest?: ApiClientIdUserPostRequest, options?: AxiosRequestConfig) {
    return DefaultApiFp(this.configuration)
      .apiClientIdUserPut(clientId, apiClientIdUserPostRequest, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @summary 組織に所属しているユーザー情報
   * @param {number} clientId
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public apiClientIdUsersGet(clientId: number, options?: AxiosRequestConfig) {
    return DefaultApiFp(this.configuration)
      .apiClientIdUsersGet(clientId, options)
      .then((request) => request(this.axios, this.basePath));
  }
}
