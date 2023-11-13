/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { util } from '@/common/helpers/util';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Avatar, Divider, List, Skeleton, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { EActionType } from '../Task.model';
import { useTranslation } from 'react-i18next';
import icons from '@/assets/icons';
import InfiniteScroll from 'react-infinite-scroll-component';

interface IProps {
  historyList: A[];
  nextHistory: () => void;
}
function History(props: Readonly<IProps>) {
  const { historyList, nextHistory } = props;
  const { t } = useTranslation();

  const IconShow = ({ value, ...props }: A) => {
    const iconItem = icons.find((icon) => icon.value === value);
    return iconItem ? React.cloneElement(iconItem.component, props) : null;
  };

  const handleScroll = () => {
    nextHistory();
  };

  return (
    <InfiniteScroll
      dataLength={historyList.length}
      next={handleScroll}
      hasMore={historyList.length < 0}
      loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
      endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
      scrollableTarget="scrollableDivGive"
    >
      <List
        dataSource={historyList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              avatar={
                <Avatar
                  size={44}
                  src={item.author?.avatarUrl?.url}
                  style={{ marginRight: 10, backgroundColor: util.randomColor() }}
                >
                  {item.author?.fullName.charAt(0)}
                </Avatar>
              }
              title={
                item.actionType == EActionType.Create ? (
                  <div style={{ display: 'flex' }}>
                    <div>{item.title}</div>
                    <div style={{ fontWeight: 400, marginLeft: 5, marginRight: 20 }}>
                      {item.author?.fullName} {t('created task')}
                    </div>
                    -
                    <div style={{ fontWeight: 400, opacity: 0.8, fontSize: 14, marginLeft: 20 }}>
                      {dayjs(item.updateDate).format('DD MMM YYYY HH:mm')}
                    </div>
                  </div>
                ) : item.actionBody.field === 'taskPrioty' ? (
                  <div style={{ display: 'flex' }}>
                    <div>{item.title}</div>
                    <div style={{ fontWeight: 400, marginLeft: 5, marginRight: 20, display: 'flex' }}>
                      <div style={{ marginRight: 5, color: '#3b73af' }}>{item.author?.fullName}</div>
                      <div style={{ marginRight: 5 }}> {t('made changes')} </div>
                      {t('task prioty')}
                    </div>
                    -
                    <div style={{ fontWeight: 400, opacity: 0.8, fontSize: 14, marginLeft: 20 }}>
                      {dayjs(item.updateDate).format('DD MMM YYYY HH:mm')}
                    </div>
                  </div>
                ) : item.actionBody.field === 'status' ? (
                  <div style={{ display: 'flex' }}>
                    <div>{item.title}</div>
                    <div style={{ fontWeight: 400, marginLeft: 5, marginRight: 20, display: 'flex' }}>
                      <div style={{ marginRight: 5, color: '#3b73af' }}>{item.author?.fullName}</div>
                      <div style={{ marginRight: 5 }}> {t('made changes')} </div>
                      {t('status')}
                    </div>
                    -
                    <div style={{ fontWeight: 400, opacity: 0.8, fontSize: 14, marginLeft: 20 }}>
                      {dayjs(item.updateDate).format('DD MMM YYYY HH:mm')}
                    </div>
                  </div>
                ) : item.actionBody.field === 'dueDate' ? (
                  <div style={{ display: 'flex' }}>
                    <div>{item.title}</div>
                    <div style={{ fontWeight: 400, marginLeft: 5, marginRight: 20, display: 'flex' }}>
                      <div style={{ marginRight: 5, color: '#3b73af' }}>{item.author?.fullName}</div>
                      <div style={{ marginRight: 5 }}> {t('made changes')} </div>
                      {t('due date')}
                    </div>
                    -
                    <div style={{ fontWeight: 400, opacity: 0.8, fontSize: 14, marginLeft: 20 }}>
                      {dayjs(item.updateDate).format('DD MMM YYYY HH:mm')}
                    </div>
                  </div>
                ) : item.actionBody.field === 'assignee' ? (
                  <div style={{ display: 'flex' }}>
                    <div>{item.title}</div>
                    <div style={{ fontWeight: 400, marginLeft: 5, marginRight: 20, display: 'flex' }}>
                      <div style={{ marginRight: 5, color: '#3b73af' }}>{item.author?.fullName}</div>
                      <div style={{ marginRight: 5 }}> {t('made changes')} </div>
                      {t('assignee')}
                    </div>
                    -
                    <div style={{ fontWeight: 400, opacity: 0.8, fontSize: 14, marginLeft: 20 }}>
                      {dayjs(item.updateDate).format('DD MMM YYYY HH:mm')}
                    </div>
                  </div>
                ) : item.actionBody.field === 'description' ? (
                  <div style={{ display: 'flex' }}>
                    <div>{item.title}</div>
                    <div style={{ fontWeight: 400, marginLeft: 5, marginRight: 20, display: 'flex' }}>
                      <div style={{ marginRight: 5, color: '#3b73af' }}>{item.author?.fullName}</div>
                      <div style={{ marginRight: 5 }}> {t('made changes')} </div>
                      {t('description')}
                    </div>
                    -
                    <div style={{ fontWeight: 400, opacity: 0.8, fontSize: 14, marginLeft: 20 }}>
                      {dayjs(item.updateDate).format('DD MMM YYYY HH:mm')}
                    </div>
                  </div>
                ) : (
                  item.actionBody.field === 'reportToRelation' && (
                    <div style={{ display: 'flex' }}>
                      <div>{item.title}</div>
                      <div style={{ fontWeight: 400, marginLeft: 5, marginRight: 20, display: 'flex' }}>
                        <div style={{ marginRight: 5, color: '#3b73af' }}>{item.author?.fullName}</div>
                        <div style={{ marginRight: 5 }}> {t('made changes')} </div>
                        {t('task relation link')}
                      </div>
                      -
                      <div style={{ fontWeight: 400, opacity: 0.8, fontSize: 14, marginLeft: 20 }}>
                        {dayjs(item.updateDate).format('DD MMM YYYY HH:mm')}
                      </div>
                    </div>
                  )
                )
              }
              description={
                item.actionType == EActionType.Create ? (
                  <></>
                ) : item.actionBody.field === 'taskPrioty' ? (
                  <div style={{ display: 'flex', gap: 20 }}>
                    <Tag>
                      <IconShow value={item.actionBody.from?.iconUrl} disabled style={{ marginRight: 10 }} />
                      {item.actionBody.from.pname}
                    </Tag>
                    <ArrowRightOutlined />
                    <Tag>
                      <IconShow value={item.actionBody.to?.iconUrl} disabled style={{ marginRight: 10 }} />
                      {item.actionBody.to.pname}
                    </Tag>
                  </div>
                ) : item.actionBody.field === 'status' ? (
                  <div style={{ display: 'flex', gap: 20 }}>
                    <Tag color={item.actionBody.from.color}>{item.actionBody.from.title}</Tag>
                    <ArrowRightOutlined />
                    <Tag color={item.actionBody.to.color}>{item.actionBody.to.title}</Tag>
                  </div>
                ) : item.actionBody.field === 'dueDate' ? (
                  <div style={{ display: 'flex', gap: 20 }}>
                    {dayjs(item.actionBody.from).format('DD MMM YYYY')}
                    <ArrowRightOutlined />
                    {dayjs(item.actionBody.to).format('DD MMM YYYY')}
                  </div>
                ) : item.actionBody.field === 'assignee' ? (
                  <div style={{ display: 'flex', gap: 20 }}>
                    {item.actionBody.from.fullName}
                    <ArrowRightOutlined />
                    {item.actionBody.to.fullName}
                  </div>
                ) : (
                  item.actionBody.field === 'reportToRelation' && (
                    <div style={{ display: 'flex', gap: 20 }}>
                      {item.actionBody.from.fullName}
                      <ArrowRightOutlined />
                      {item.actionBody.to.fullName}
                    </div>
                  )
                )
              }
            />
          </List.Item>
        )}
      />
    </InfiniteScroll>
  );
}

export default History;
