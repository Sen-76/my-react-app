import { useTranslation } from 'react-i18next';
import Record from './Record';
import styles from '../../../GiveStar.module.scss';
import { DatePicker, Divider, Skeleton, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
import { cookie } from '@/common/helpers/cookie/cookie';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SmileOutlined } from '@ant-design/icons';

function Receive() {
  const { t } = useTranslation();
  const { showLoading, closeLoading } = useLoading();
  const user: A = cookie.getCookie('userLogin') ?? '{}';
  const initDataGrid: Common.IDataGrid = {
    pageInfor: {
      pageSize: 10,
      pageNumber: 1,
      totalItems: 0
    },
    searchInfor: {
      searchValue: '',
      searchColumn: ['Title']
    },
    filter: [{ key: 'userGive', value: [JSON.parse(user)?.user.id] }],
    orderInfor: {
      orderBy: ['createdDate'],
      isAssending: [false]
    }
  };
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);
  const [data, setData] = useState<A[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    getUserGiveList();
  }, []);

  const getUserGiveList = async (page?: number) => {
    try {
      showLoading();
      if (page && param.pageInfor) param.pageInfor.pageNumber = page;
      const result = await service.postService.get(param);
      const newData = [...data, ...result.data];
      setTotal(result.prameter.totalItems);
      setPage(result.prameter.pageNumber);
      const uniqueData = newData.reduce((acc, current) => {
        const x = acc.find((item: A) => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      setData(uniqueData);
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const handleScroll = async () => {
    getUserGiveList(page + 1);
  };

  return (
    <div className={styles.contentLibary}>
      <div className={styles.overFollow} id="scrollableDivGive">
        {data.length > 0 ? (
          <InfiniteScroll
            dataLength={data.length}
            next={handleScroll}
            hasMore={data.length < total}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget="scrollableDivGive"
          >
            {data.map((item, index) => {
              return <Record key={index} record={item} />;
            })}
          </InfiniteScroll>
        ) : (
          <>
            <SmileOutlined style={{ marginRight: 5, alignItems: 'center' }} /> {t('Common_NoRecord')}
          </>
        )}
      </div>
    </div>
  );
}

export default Receive;
