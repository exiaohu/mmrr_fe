import {Moment} from "moment";

type ModelType = 'public' | 'car' | 'walk' | 'taxi';

type RoutingPath = {
  type: ModelType,
  path: {
    coordinates: [number, number][]
  }
};

type RoutingSummary = {
  descriptions: string,
  costs: {
    distance: number,  // 单位：公里
    time: number,  // 单位：分钟
    price: number,  // 单位：元
    transfer_time: number,  // 单位：次
  }
};

export type RoutingPlan = {
  summary: RoutingSummary,
  path: RoutingPath[]
};

export interface RoutingData {
  plans: RoutingPlan[]
}

export interface RoutingParams {
  origin_location: { lat: number, lng: number },
  dest_location: { lat: number, lng: number },
  timestamp?: Moment | number,
  modals?: ModelType[],
  preference?: 'default' | 'distance' | 'time' | 'price' | 'transfer_time',
  total?: number
}

