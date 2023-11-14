import { OKRStatus } from '@/common/enum/okr.enum';
import { useTriggerLoading } from '@/common/helpers/use-trigger-loading';
import { service } from '@/services/apis';
import { IOKRModel } from '@/services/models/OKR';
import { notification } from 'antd';
import { useEffect, useState } from 'react';

export const useOKRsData = ({ userId, range }: { userId: string; range: Date }) => {
  const triggerLoading = useTriggerLoading();

  const [params, setParams] = useState({
    userId,
    range
  });
  const [okrsData, setOKRsData] = useState<IOKRModel[]>([]);

  const statusCounts = okrsData.reduce((counts, okr) => {
    if (okr.status) counts[okr.status] = (counts[okr.status] ?? 0) + 1;
    return counts;
  }, {} as Record<OKRStatus, number>);

  useEffect(() => {
    fetchOKRsData();
  }, [params]);

  const fetchOKRsData = () =>
    triggerLoading(async () => {
      const response = await service.okrService.get(params);

      setOKRsData(response.data);
    });

  const createOKR = async (newOKR: IOKRModel) => {
    const [, hasError] = await triggerLoading(async () => {
      await service.okrService.create(newOKR);
      await fetchOKRsData();
    });

    if (!hasError) {
      notification.success({
        message: 'Objective created successfully'
      });
    } else {
      notification.error({
        message: 'Failed to create objective'
      });
    }

    return { hasError };
  };

  const updateOKR = async (updatedOKR: IOKRModel) => {
    const [, hasError] = await triggerLoading(async () => {
      await service.okrService.update(updatedOKR);
      await fetchOKRsData();
    });

    if (!hasError) {
      notification.success({
        message: 'Objective updated successfully'
      });
    } else {
      notification.error({
        message: 'Failed to update objective'
      });
    }

    return { hasError };
  };

  return {
    okrsData,
    statusCounts,
    params,
    setParams,
    createOKR,
    updateOKR
  };
};
