import { useTriggerLoading } from '@/common/helpers/use-trigger-loading';
import { service } from '@/services/apis';
import { IOKRModel } from '@/services/models/OKR';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const useOKRDetailData = () => {
  const params = useParams();
  const triggerLoading = useTriggerLoading();

  const [okrDetail, setOKRDetail] = useState<IOKRModel>({});

  useEffect(() => {
    fetchOKRDetailData();
  }, [params]);

  const fetchOKRDetailData = () =>
    triggerLoading(async () => {
      const response = await service.okrService.getDetails(params?.id ?? '');

      setOKRDetail(response.data ?? {});
    });

  return {
    okrDetail
  };
};
