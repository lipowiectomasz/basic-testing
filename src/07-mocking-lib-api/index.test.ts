import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('lodash', () => {
  const actual = jest.requireActual('lodash');
  return {
    ...actual,
    throttle: (fn: unknown) => fn,
  };
});

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  let axiosInstance: jest.Mocked<AxiosInstance>;

  beforeEach(() => {
    axiosInstance = {
      get: jest.fn(),
      request: jest.fn(),
      delete: jest.fn(),
      head: jest.fn(),
      options: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      getUri: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn(),
          eject: jest.fn(),
          clear: function (): void {
            throw new Error('Function not implemented.');
          },
        },
        response: {
          use: jest.fn(),
          eject: jest.fn(),
          clear: function (): void {
            throw new Error('Function not implemented.');
          },
        },
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      defaults: null,
    };
    mockedAxios.create.mockReturnValue(axiosInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    axiosInstance.get.mockResolvedValue({ data: { foo: 'bar' } });
    await throttledGetDataFromApi('/path');
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    axiosInstance.get.mockResolvedValue({ data: { id: 1 } });
    await throttledGetDataFromApi('/posts/1');
    expect(axiosInstance.get).toHaveBeenCalledWith('/posts/1');
  });

  test('should return response data', async () => {
    const data = { id: 10, title: 'hello' };
    axiosInstance.get.mockResolvedValue({ data });
    const result = await throttledGetDataFromApi('/posts/10');
    expect(result).toEqual(data);
  });
});
