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

export type Preference = {  // 对不同代价的倾向，默认无倾向
  distance: number,
  time: number,
  price: number,
  transfer_time: number
};

export type RoutingPlan = {
  summary: RoutingSummary,
  path: RoutingPath[]
};

export interface RoutingData {
  success: bool,
  data: {
    plans: RoutingPlan[]
  }
}

export interface RoutingParams {
  origin_location: Coordinate,
  dest_location: Coordinate,
  timestamp?: number,
  modals?: ModelType[],
  preference?: Preference,
  total?: number
}

