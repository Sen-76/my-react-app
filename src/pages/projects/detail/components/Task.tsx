/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EditOutlined, SmileOutlined, SolutionOutlined } from '@ant-design/icons';
import { Button, Table, Tag, Tooltip } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import Paragraph from 'antd/es/typography/Paragraph';
import { Link, useParams } from 'react-router-dom';
import icons from '@/assets/icons';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { service } from '@/services/apis';

function Task() {
  const initDataGrid: Common.IDataGrid = {
    pageInfor: {
      pageSize: 10,
      pageNumber: 1,
      totalItems: 0
    },
    searchInfor: {
      searchValue: '',
      searchColumn: ['summary']
    },
    filter: [{ key: 'projectId', value: [useParams().id ?? ''] }]
  };
  const projectId = useParams().id;
  console.log(projectId);
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [taskList, setTaskList] = useState<A[]>([]);
  const { t } = useTranslation();
  const columns: ColumnsType<A> = [
    {
      title: t('Task_Key'),
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => {
        return (
          <Tooltip placement="bottom" title={record?.key} color="#ffffff" arrow={true}>
            <Paragraph ellipsis={{ rows: 1, expandable: false }}>{record.key}</Paragraph>
          </Tooltip>
        );
      }
    },
    {
      title: t('Common_Title'),
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => {
        return (
          <Tooltip placement="bottom" title={record?.title} color="#ffffff" arrow={true}>
            <Paragraph ellipsis={{ rows: 1, expandable: false }}>{record.summary}</Paragraph>
          </Tooltip>
        );
      }
    },
    {
      title: t('Task_Priority'),
      dataIndex: 'description',
      key: 'description',
      render: (_, record) => {
        return (
          <Tag>
            <Paragraph ellipsis={{ rows: 1, expandable: false }}>
              <IconShow value={record?.taskPrioty?.iconUrl} disabled style={{ marginRight: 10 }} />
              {record.taskPrioty?.pname}
            </Paragraph>
          </Tag>
        );
      }
    },
    {
      title: t('Task_Assignee'),
      dataIndex: 'modifiedOn',
      key: 'modifiedOn',
      render: (_, record) => {
        return <Paragraph ellipsis={{ rows: 1, expandable: false }}>{record.assignee2?.fullName}</Paragraph>;
      }
    },
    {
      title: t('Task_ReportTo'),
      dataIndex: 'modifiedBy',
      key: 'modifiedBy',
      render: (_, record) => (
        <Paragraph ellipsis={{ rows: 1, expandable: false }}>{record.reportToRelation?.fullName}</Paragraph>
      )
    },
    {
      title: t('Task_Status'),
      dataIndex: 'description',
      key: 'description',
      render: (_, record) => {
        return (
          <Tag color={record.status?.color}>
            <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ color: 'white' }}>
              {record.status?.title}
            </Paragraph>
          </Tag>
        );
      }
    },
    {
      title: t('Common_Action'),
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      className: 'actionCollumn',
      width: 180,
      render: (_, record) => {
        return (
          <div>
            <Tooltip placement="bottom" title={t('Common_ViewDetail')} color="#ffffff" arrow={true}>
              <Link to={`/tasks/task-detail/${record.key}/${record.id}`}>
                <Button type="text" icon={<SolutionOutlined />} />
              </Link>
            </Tooltip>
          </div>
        );
      }
    }
  ];

  const IconShow = ({ value, ...props }: A) => {
    const iconItem = icons.find((icon) => icon.value === value);
    return iconItem ? React.cloneElement(iconItem.component, props) : null;
  };

  useEffect(() => {
    getTaskList();
  }, []);

  const getTaskList = async (drafParam?: Common.IDataGrid) => {
    try {
      setLoadingTable(true);
      const result = await service.taskService.get(drafParam ?? param);
      setParam({
        ...param,
        pageInfor: {
          pageSize: result.prameter.pageSize,
          pageNumber: result.prameter.pageNumber,
          totalItems: result.prameter.totalItems
        }
      });
      setTaskList(result.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingTable(false);
    }
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage(pagination.current ?? 1);
  };

  const setPage = (val: number) => {
    const draftGrid = { ...param };
    if (draftGrid.pageInfor) {
      draftGrid.pageInfor.pageNumber = val;
    }
    setParam(draftGrid);
    getTaskList(draftGrid);
  };

  return (
    <Table
      columns={columns}
      dataSource={taskList}
      pagination={{
        current: param.pageInfor!.pageNumber,
        pageSize: param.pageInfor!.pageSize,
        total: param.pageInfor!.totalItems,
        simple: false
      }}
      scroll={{ x: 1230 }}
      locale={{
        emptyText: (
          <>
            <SmileOutlined style={{ marginRight: 5 }} /> {t('Common_NoRecord')}
          </>
        )
      }}
      onChange={handleTableChange}
      loading={loadingTable}
      rowKey={(record) => record.id}
    />
  );
}

export default Task;
