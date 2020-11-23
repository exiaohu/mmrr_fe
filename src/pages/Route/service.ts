import {request} from 'umi';
import {RoutingData, RoutingParams} from "./data";

export async function routing(params: RoutingParams) {
  return request('/api/routing', {
    params
  }).then(res => {
    if (res.data) {
      return res.data as RoutingData;
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject(res.errorMessage)
  });
}
