import {request} from 'umi';
import {RoutingData, RoutingParams} from "./data";

export async function routing(params: RoutingParams) {
  return request<RoutingData>('/api/routing', {
    params
  }).then(res => {
    if (res.success) {
      return res.data;
    }
    return Promise.reject(Error("规划路线失败。"))
  });
}
