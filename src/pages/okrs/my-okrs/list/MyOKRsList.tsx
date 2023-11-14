import { OKRStatus } from '@/common/enum/okr.enum';
import { useLoginManager } from '@/common/helpers/login-manager';
import { util } from '@/common/helpers/util';
import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { IOKRModel } from '@/services/models/OKR';
import { BulbOutlined, EditOutlined, PlusOutlined, SolutionOutlined } from '@ant-design/icons';
import { useDisclosure } from '@mantine/hooks';
import { Button, DatePicker, Flex, Form, Progress, Select, Table, Tooltip } from 'antd';
import { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { OKRFormDrawer } from '../../shared/components/OKRFormDrawer';
import { useOKRsData } from '../../shared/hooks/use-okrs-data';
import { OkrStatusColors, getOkrProgress, okrStatusOptions } from '../../shared/okrs.util';
import styles from './MyOKRs.module.scss';

const { formatDate } = util;

export default function MyOkrsList() {
  const { setBreadcrumb } = useBreadcrumb();
  const { t } = useTranslation();

  useEffect(() => {
    setBreadcrumb([{ icon: <BulbOutlined />, text: `OKRs` }, { text: 'My OKRs' }]);
  }, [t]);

  const { getLoginUser } = useLoginManager();

  const {
    okrsData,
    statusCounts,
    params: { range },
    setParams,
    createOKR,
    updateOKR
  } = useOKRsData({
    userId: getLoginUser()?.user?.id,
    range: dayjs(new Date()).startOf('month').toDate()
  });

  const [form] = Form.useForm();
  const [isFormDrawerOpen, { open, close }] = useDisclosure();
  const [isEditFormDrawerOpen, { open: openEdit, close: closeEdit }] = useDisclosure();

  const columns: ColumnType<IOKRModel>[] = [
    {
      title: t('Common_Title'),
      dataIndex: 'title'
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      render: formatDate
    },
    {
      title: 'Due Date',
      dataIndex: 'endDate',
      render: (_) => _ && formatDate(_)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_, record) => (
        <Select
          style={{ width: '100%' }}
          options={okrStatusOptions}
          defaultValue={_}
          onChange={async (value) => {
            await updateOKR({ id: record.id, status: value });
          }}
        />
      )
    },
    {
      title: 'Progress',
      dataIndex: 'keyResults',
      render: (_) => <Progress percent={getOkrProgress(_)} />
    },
    {
      title: t('Common_Action'),
      render: (_, record) => {
        return (
          <>
            <Tooltip placement="bottom" title={t('Common_ViewDetail')} color="#ffffff" arrow={true}>
              <Link to={`/okrs/my-okrs/${record.id}`}>
                <Button type="text" icon={<SolutionOutlined />} />
              </Link>
            </Tooltip>

            <Tooltip placement="bottom" title={t('Common_Edit')} color="#ffffff" arrow={true}>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => {
                  form.setFieldsValue({
                    ...record,
                    startDate: dayjs(record.startDate),
                    endDate: record.endDate ? dayjs(record.endDate) : undefined
                  });
                  openEdit();
                }}
              />
            </Tooltip>
          </>
        );
      }
    }
  ];

  return (
    <>
      <OKRFormDrawer
        title="Create Objective"
        open={isFormDrawerOpen}
        form={form}
        onClose={() => {
          close();
          form.resetFields();
        }}
        onFinish={async (values) => {
          const { hasError } = await createOKR(values);

          if (!hasError) {
            close();
            form.resetFields();
          }
        }}
      />

      <OKRFormDrawer
        title="Edit Objective"
        open={isEditFormDrawerOpen}
        form={form}
        onClose={() => {
          closeEdit();
          form.resetFields();
        }}
        onFinish={async (values) => {
          const { hasError } = await updateOKR(values);

          if (!hasError) {
            closeEdit();
            form.resetFields();
          }
        }}
      />

      <div className={styles.myOKRs}>
        <DatePicker
          className="month-picker"
          format="MM/YYYY"
          picker="month"
          value={dayjs(range)}
          onChange={(date) => setParams((prev) => ({ ...prev, range: date?.toDate() ?? new Date() }))}
        />

        <Flex justify="space-between" style={{ width: '100%', margin: '1rem 0' }}>
          <Button icon={<PlusOutlined />} style={{ alignSelf: 'end' }} type="text" onClick={open}>
            Create new
          </Button>

          <Flex justify="flex-end" gap="middle">
            {Object.values(OKRStatus).map((value) => (
              <Flex key={value} vertical align="center" className="status-count-box">
                <span>
                  {value} ({statusCounts[value] ?? 0})
                </span>

                <div className="color-dot" style={{ backgroundColor: OkrStatusColors[value] }} />
              </Flex>
            ))}
          </Flex>
        </Flex>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={okrsData}
          pagination={{
            total: okrsData.length,
            defaultPageSize: 10
          }}
        />
      </div>
    </>
  );
}
