import { StatisticsDataset, YearGlobalStatistics } from '@types';

import { MonthEnum } from '../../../../enums';
import React from 'react';

interface IArgs {
  datasets: Array<StatisticsDataset<string, YearGlobalStatistics>>;
}

interface IUseChartData extends IArgs {
  labels: Array<MonthEnum>;
}

export const useChart = ({ datasets }: IArgs): IUseChartData => {
  return React.useMemo((): IUseChartData => {
    return {
      labels: Object.values(MonthEnum),
      datasets,
    };
  }, [datasets]);
};
