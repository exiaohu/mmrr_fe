import {request} from 'umi';


export async function queryExperimentResults() {
  return request<any>('/experiments/results.json');
}
