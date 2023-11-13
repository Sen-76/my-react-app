import { useTranslation } from 'react-i18next';
import Record from './Record';
import styles from '../../../GiveStar.module.scss';
import { DatePicker, Divider, Skeleton, Space } from 'antd';
import dayjs from 'dayjs';
import { cookie } from '@/common/helpers/cookie/cookie';
import { useEffect, useState } from 'react';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SmileOutlined } from '@ant-design/icons';
import { forwardRef, useImperativeHandle } from 'react';

function Give(props: A, ref: A) {
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
    filter: [{ key: 'userId', value: [JSON.parse(user)?.user.id] }],
    orderInfor: {
      orderBy: ['createdDate'],
      isAssending: [false]
    }
  };
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);
  const [data, setData] = useState<A[]>([]);
  useEffect(() => {
    getUserGiveList();
  }, []);

  useImperativeHandle(ref, () => ({
    addPost
  }));

  const getUserGiveList = async (draftParam?: Common.IDataGrid) => {
    try {
      showLoading();
      const result = await service.postService.get(draftParam ?? param);
      const newData = [...data, ...result.data];
      setParam({
        ...param,
        pageInfor: {
          pageSize: result.prameter.pageSize,
          pageNumber: result.prameter.pageNumber,
          totalItems: result.prameter.totalItems
        }
      });
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

  const addPost = () => {
    getUserGiveList();
  };

  const handleScroll = async () => {
    const draftParam = { ...param };
    draftParam.pageInfor!.pageNumber = (param.pageInfor!.pageNumber ?? 0) + 1;
    setParam(draftParam);
    getUserGiveList(draftParam);
  };

  return (
    <div className={styles.contentLibary}>
      <div className={styles.overFollow} id="scrollableDivGive">
        {data.length > 0 ? (
          <InfiniteScroll
            dataLength={data.length}
            next={handleScroll}
            hasMore={data.length < (param.pageInfor!.totalItems ?? 0)}
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

export default forwardRef(Give);
