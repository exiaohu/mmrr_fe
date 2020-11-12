// export type DatasetName = 'speed' | 'available';
export enum DatasetName {
  speed = 'speed',
  available = 'available'
}

export enum ModelName {
  dcrnn = 'dcrnn',
  fclstm = 'fclstm',
  gwnet = 'gwnet',
  stgcn = 'stgcn',
  ha = 'ha',
  var = 'var',
  sp = 'sp',
  ap = 'ap',
}

export enum MetricName {
  mae = 'mae',
  rmse = 'rmse',
  mape = 'mape',
}

export enum TimeStep {
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
}


type ExperimentRecord = Map<TimeStep, number>;
type MetricRecord = Map<MetricName, ExperimentRecord>;
type ModelRecord = Map<ModelName, MetricRecord>;
export type DataItem = {
  timestep: TimeStep,
  value: number,
  model: ModelName
};

export type Data = Map<DatasetName, Map<MetricName, DataItem[]>>;


export const parseData = (res: any): Data => {
  const r: Data = new Map();
  // eslint-disable-next-line no-restricted-syntax
  for (const dn of ['speed', 'available']) {
    const mr = res[dn];
    // eslint-disable-next-line no-restricted-syntax
    for (const mon of ['dcrnn', 'fclstm', 'gwnet', 'stgcn', 'ha', 'var', `${dn.substr(0, 1)}p`]) {
      const mmr = mr[mon];
      // eslint-disable-next-line no-restricted-syntax
      for (const men of ['mae', 'rmse', 'mape']) {
        const er = mmr[men];
        // eslint-disable-next-line no-restricted-syntax
        for (const ts of ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']) {
          const v = er[ts];
          if (!r.has(dn)) {
            r.set(dn, new Map());
          }
          if (!r.get(dn).has(men)) {
            r.get(dn).set(men, []);
          }
          r.get(dn).get(men).push({
            timestep: ts,
            value: v,
            model: mon
          });
        }
      }
    }
  }
  return r;
}
