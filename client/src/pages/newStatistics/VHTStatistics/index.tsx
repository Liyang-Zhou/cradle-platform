import React, { useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useEffect } from 'react';
import { getAllVHT } from '../utils';
import { Toast } from 'src/shared/components/toast';
import { StatisticDashboard } from '../utils/StatisticDashboard';
import { IVHT } from 'src/types';
import {
  getUserStatisticData,
  initialData,
  initialColorReading,
} from '../utils';

interface IProps {
  supervisedVHTs: number[] | undefined;
  from: Date;
  to: Date;
}

export const VHTStatistics: React.FC<IProps> = ({
  supervisedVHTs,
  from,
  to,
}) => {
  const [loading, setLoading] = useState(false);
  const [vhts, setVhts] = useState<IVHT[]>([]);
  const [errorLoading, setErrorLoading] = useState(false);
  const [vht, setVht] = useState();
  const [data, setData] = useState(initialData);
  const [colorReading, setColorReading] = useState(initialColorReading);
  const handleChange = (event: any) => {
    setVht(event.target.value);
  };

  useEffect(() => {
    getAllVHT()
      .then((response) => {
        setVhts(response);
      })
      .catch((err) => {
        setErrorLoading(true);
      });
  }, []);

  useEffect(() => {
    if (vht !== undefined) {
      getUserStatisticData(vht, from.getTime() / 1000, to.getTime() / 1000)
        .then((response) => {
          setData(response);
          setColorReading(response);
          setLoading(true);
        })
        .catch((err) => {
          setErrorLoading(true);
        });
    }
  }, [vht, from, to]);

  return (
    <div>
      {errorLoading && (
        <Toast
          status="error"
          message="Something went wrong loading the all VHT information. Please try again."
          clearMessage={() => setErrorLoading(false)}
        />
      )}
      {supervisedVHTs === undefined || supervisedVHTs.length === 0 ? (
        <h1>There is no VHT under your supervision.</h1>
      ) : (
        <div>
          <h3>Please select a VHT from the list:</h3>
          <Select value={vht} onChange={handleChange}>
            {supervisedVHTs.map((vhtId, idx) => (
              <MenuItem value={vhtId} key={idx}>
                {`${
                  vhts.find((v) => v.userId === vhtId)?.firstName ?? 'Unknown'
                } (id: ${vhtId})`}
              </MenuItem>
            ))}
          </Select>
          <br />
          <br />
          {vht !== undefined && loading && (
            <StatisticDashboard data={data} colorReading={colorReading} />
          )}
        </div>
      )}
    </div>
  );
};
