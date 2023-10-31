import React, { useState } from 'react';
import { EditOutlined, PlusOutlined, SmileOutlined } from '@ant-design/icons';
import { Button, Modal, Switch, Table, Tooltip, Typography, notification } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import styles from '../EmailConfiguation.module.scss';
import Search from 'antd/es/input/Search';
import dayjs from 'dayjs';
import { EState } from '../Email.model';
import { useLoading } from '@/common/context/useLoading';

interface IProps {
  data: A[];
  openPanel: (data?: A) => void;
}
function DataTable(props: IProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { showLoading, closeLoading } = useLoading();
  const { confirm } = Modal;
  const { t } = useTranslation();
  const columns: ColumnsType<A> = [
    {
      title: t('Common_Title'),
      dataIndex: 'title',
      width: 210,
      key: 'title',
      render: (_, record) => {
        return record.title;
      }
    },
    {
      title: t('Common_Description'),
      dataIndex: 'description',
      width: 210,
      key: 'description',
      render: (_, record) => {
        const { Paragraph } = Typography;
        return (
          <Tooltip
            placement="bottom"
            title={
              <div>
                {record.description
                  ? record.description.split('{/n}').map((line: A, index: number) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))
                  : ''}
              </div>
            }
            color="#ffffff"
            arrow={true}
          >
            <Paragraph ellipsis={{ rows: 1, expandable: false }}>
              {record.description
                ? record.description.split('{/n}').map((line: A, index: number) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))
                : ''}
            </Paragraph>
          </Tooltip>
        );
      }
    },
    {
      title: t('Common_ModifiedOn'),
      dataIndex: 'modifiedOn',
      key: 'modifiedOn',
      width: 150,
      render: (_, record) => {
        return <div style={{ minWidth: 90 }}>{dayjs(record.updatedDate).format('DD MMM YYYY HH:mm')}</div>;
      }
    },
    {
      title: t('Common_ModifiedBy'),
      dataIndex: 'modifiedBy',
      width: 120,
      key: 'modifiedBy',
      render: (_, record) => record.modifiedBy
    },
    {
      title: t('Common_Status'),
      dataIndex: 'status',
      width: 100,
      key: 'status',
      render: (_, record) => {
        const apiHandle = async (value: boolean) => {
          try {
            showLoading();
            notification.open({
              message: value ? 'Activated Successfully.' : 'Deactivated Successfully.',
              type: 'success'
            });
            closeLoading();
          } catch (e) {
            console.log(e);
          }
        };
        const activeChange = async (value: boolean) => {
          if (!value) {
            confirm({
              content: t('Common_DeActive_Confirm').replace('{0}', record.fullName),
              title: t('Common_Confirm'),
              okText: t('Common_Deactivate'),
              cancelText: t('Common_Cancel'),
              onOk: async () => {
                await apiHandle(value);
              }
            });
          } else {
            await apiHandle(value);
          }
        };
        return (
          <div>
            <Tooltip
              placement="bottom"
              title={record.status === EState.Activate.toString() ? t('Common_Activate') : t('Common_Inactivate')}
              color="#ffffff"
              arrow={true}
            >
              <Switch
                checked={record.status === EState.Activate.toString()}
                onChange={activeChange}
                style={{ marginRight: 5 }}
              />
            </Tooltip>
          </div>
        );
      }
    },
    {
      title: t('Common_Action'),
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      className: 'actionCollumn',
      width: 120,
      render: (_, record) => {
        const editClick = () => {
          props.openPanel(record);
        };
        return (
          <div>
            <Tooltip placement="bottom" title={t('Common_Edit')} color="#ffffff" arrow={true}>
              <Button type="text" onClick={editClick} icon={<EditOutlined />} />
            </Tooltip>
          </div>
        );
      }
    }
  ];

  const onSearch = (val: A) => {
    console.log(val);
  };

  const TableHeader = () => {
    return (
      <>
        <div className={styles.tableHeaderLeft}></div>
        <div className={styles.tableHeaderRight}>
          <Search placeholder={t('Common_SearchByTitle')} allowClear onSearch={onSearch} style={{ width: 250 }} />
        </div>
      </>
    );
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={props.data}
        pagination={false}
        scroll={{ x: 780 }}
        locale={{
          emptyText: (
            <>
              <SmileOutlined style={{ marginRight: 5 }} /> {t('Common_NoRecord')}
            </>
          )
        }}
        loading={loading}
        title={() => TableHeader()}
        rowKey={(record) => record.id}
      />
    </>
  );
}

export default DataTable;
