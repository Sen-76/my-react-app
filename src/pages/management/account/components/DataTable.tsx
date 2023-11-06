/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Input,
  Modal,
  Radio,
  RadioChangeEvent,
  Switch,
  Table,
  Tooltip,
  Upload,
  UploadProps,
  notification
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TablePaginationConfig } from 'antd/es/table/interface';
import styles from '../AccountManagement.module.scss';
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  ExportOutlined,
  FilterOutlined,
  ImportOutlined,
  ManOutlined,
  PlusOutlined,
  SmileOutlined,
  SolutionOutlined,
  UndoOutlined,
  WomanOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { EDeleteState, EGender, EState } from '../AccountManagement.Model';
import { useLoading } from '@/common/context/useLoading';
import { Link } from 'react-router-dom';
import Paragraph from 'antd/es/typography/Paragraph';
import { useTranslation } from 'react-i18next';
import { util } from '@/common/helpers/util';
import { service } from '@/services/apis';

interface IProps {
  data: A[];
  openPanel: (data?: A) => void;
  openFilterPanel: (data?: A) => void;
  openDetailPanel: (data?: A) => void;
  onSearch: (value: string) => void;
  setPage: (paging: number) => void;
  refreshList: () => void;
  param: Common.IDataGrid;
  tabStatus: number;
  loading: boolean;
  defaultselected: Account.IAccountModel[];
}
function DataTable(props: Readonly<IProps>) {
  const { loading, param, tabStatus } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [choosenUser, setChoosenUser] = useState<Account.IAccountModel | null>();
  const { showLoading, closeLoading } = useLoading();
  const [value, setValue] = useState<EDeleteState>(EDeleteState.None);
  const { t } = useTranslation();
  const { Search } = Input;

  const columns: ColumnsType<A> = [
    {
      title: t('name'),
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
      render: (_, record) => {
        return (
          <Tooltip placement="bottom" title={record.fullName} color="#ffffff" arrow={true}>
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 200 }}>
              <Avatar
                size={40}
                src={record.photoUrl}
                style={{ marginRight: 10, minWidth: 40, backgroundColor: util.randomColor() }}
              >
                {record.fullName?.charAt(0)}
              </Avatar>
              <Paragraph
                ellipsis={{ rows: 1, expandable: false }}
                style={{ maxWidth: 200, minWidth: 50, overflow: 'hidden' }}
              >
                {record.fullName}
              </Paragraph>
            </div>
          </Tooltip>
        );
      }
    },
    {
      title: t('email'),
      dataIndex: 'email',
      key: 'email',
      render: (_, record) => {
        return (
          <Tooltip placement="bottom" title={record.userEmail} color="#ffffff" arrow={true}>
            <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ minWidth: 100 }}>
              <Link to={`mailto:${record.userEmail}`}>{record.userEmail}</Link>
            </Paragraph>
          </Tooltip>
        );
      }
    },
    {
      title: t('phone'),
      dataIndex: 'phone',
      key: 'phone',
      render: (_, record) => {
        return record.userPhone;
      }
    },
    {
      title: t('date of birth'),
      dataIndex: 'dob',
      key: 'dob',
      render: (_, record) => {
        return <div style={{ width: 115 }}>{dayjs(record.dob).format('DD MMM YYYY')}</div>;
      }
    },
    {
      title: t('gender'),
      dataIndex: 'gender',
      key: 'gender',
      render: (_, record) => {
        return record.gender === EGender.Male ? (
          <Tooltip placement="bottom" title={t('man')} color="#ffffff" arrow={true}>
            <ManOutlined />
          </Tooltip>
        ) : (
          <Tooltip placement="bottom" title={t('woman')} color="#ffffff" arrow={true}>
            <WomanOutlined />
          </Tooltip>
        );
      }
    },
    {
      title: t('job'),
      dataIndex: 'job_title',
      key: 'job_title',
      render: (_, record) => {
        return (
          <Tooltip placement="bottom" title={record.jobTitle} color="#ffffff" arrow={true}>
            <Paragraph ellipsis={{ rows: 1, expandable: false }}>{record.jobTitle}</Paragraph>
          </Tooltip>
        );
      }
    },
    {
      title: t('department'),
      dataIndex: 'department',
      key: 'department',
      render: (_, record) => {
        return (
          <Tooltip placement="bottom" title={record?.userDepartment2?.title} color="#ffffff" arrow={true}>
            <Paragraph ellipsis={{ rows: 1, expandable: false }}>
              {record.userDepartment2 === null ? 'N/A' : record.userDepartment2.title}
            </Paragraph>
          </Tooltip>
        );
      }
    },
    {
      title: t('Common_Action'),
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 180,
      className: 'actionCollumn',
      render: (_, record) => {
        return (
          <div>
            <Tooltip placement="bottom" title={t('Common_ViewDetail')} color="#ffffff" arrow={true}>
              <Button type="text" onClick={() => props.openDetailPanel(record)} icon={<SolutionOutlined />} />
            </Tooltip>
            {tabStatus == EState.Activate ? (
              <>
                <Tooltip placement="bottom" title={t('Common_Edit')} color="#ffffff" arrow={true}>
                  <Button type="text" onClick={() => props.openPanel(record)} icon={<EditOutlined />} />
                </Tooltip>
                <Tooltip
                  placement="bottom"
                  title={
                    record.userRole2.isDefault !== true ? t('Common_ToolTip_CannotDeleteUser') : t('Common_Delete')
                  }
                  color="#ffffff"
                  arrow={true}
                >
                  <Button
                    disabled={record.userRole2.isDefault !== true}
                    type="text"
                    onClick={() => {
                      setIsModalOpen(true);
                      setChoosenUser(record);
                      setSelectedRowKeys([record.id]);
                    }}
                    icon={<DeleteOutlined />}
                  />
                </Tooltip>
              </>
            ) : (
              <Tooltip placement="bottom" title={t('Common_Restore')} color="#ffffff" arrow={true}>
                <Button type="text" onClick={() => restoreUser(record)} icon={<UndoOutlined />} />
              </Tooltip>
            )}
          </div>
        );
      }
    }
  ];

  useEffect(() => {
    setSelectedRowKeys([]);
  }, [tabStatus]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    props.setPage(pagination.current ?? 1);
  };

  const onSearch = (val: A) => {
    props.onSearch(val);
  };

  // const onRadioChange = (e: RadioChangeEvent) => {
  //   setValue(Number(e.target.value));
  // };

  const onCancelModal = () => {
    setIsModalOpen(false);
    setChoosenUser(null);
    setValue(EDeleteState.None);
  };

  const confirmDelete = async () => {
    try {
      setIsModalOpen(false);
      await service.accountService.deleteAccount({
        // isHardDelete: value === EDeleteState.HardDelete,
        isHardDelete: false,
        id: selectedRowKeys as string[]
      });
      setValue(EDeleteState.None);
      props.refreshList();
      setSelectedRowKeys([]);
      notification.open({
        message: t('Common_DeleteSuccess'),
        type: 'success'
      });
    } catch (e) {
      console.log(e);
    }
  };

  const restoreUser = async (user?: A) => {
    try {
      showLoading();
      const ids = selectedRowKeys as string[];
      await service.accountService.restoreAccount(user.id ? [user.id] : ids);
      notification.open({
        message: t('Common_RestoreSuccess'),
        type: 'success'
      });
      setSelectedRowKeys([]);
      props.refreshList();
      closeLoading();
    } catch (e) {
      console.log(e);
    }
  };

  const exportExcel = () => {
    notification.open({
      message: t('Common_ExportSuccess'),
      type: 'success'
    });
  };

  const fileProps: UploadProps = {
    beforeUpload: async (file: A) => {
      try {
        showLoading();
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('outletId', 'outletId');
        formData.append('comment', 'comment');
        await service.accountService.importExcel(formData);
        props.refreshList();
        notification.open({
          message: t('Common_ImportSuccess'),
          type: 'success'
        });
      } catch (e) {
        notification.open({
          message: t('Common_ImportFailed'),
          type: 'error'
        });
      } finally {
        closeLoading();
      }
    },
    showUploadList: false
  };

  const downloadTemplate = async () => {
    try {
      showLoading();
      const result = await service.downloadService.downloadTemplate('Create_User_Teamplate');
      const blob = new Blob([result], { type: 'application/octet-stream' });
      if (blob instanceof Blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Create_User_Teamplate.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
      notification.open({
        message: t('Common_DownloadSuccess'),
        type: 'success'
      });
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const TableHeader = () => {
    return (
      <>
        <div className={styles.tableHeaderLeft}>
          {tabStatus == EState.Activate && (
            <>
              <Button type="text" onClick={() => props.openPanel()} icon={<PlusOutlined />}>
                {t('Common_AddNew')}
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                loading={loading}
                type="text"
                icon={<DeleteOutlined />}
                disabled={selectedRowKeys.length === 0}
              >
                {t('Common_DeleteSelected')}
              </Button>
              <Button type="text" onClick={downloadTemplate} icon={<DownloadOutlined />}>
                {t('Common_Download_Template')}
              </Button>
              <Button type="text" onClick={exportExcel} icon={<ExportOutlined />}>
                {t('Common_ExportExcel')}
              </Button>
              <Upload {...fileProps}>
                <Button type="text" icon={<ImportOutlined />}>
                  {t('Common_ImportExcel')}
                </Button>
              </Upload>
            </>
          )}
          {tabStatus == EState.Deleted && (
            <Button
              onClick={restoreUser}
              loading={loading}
              type="text"
              icon={<UndoOutlined />}
              disabled={selectedRowKeys.length === 0}
            >
              {t('Common_RestoreSelected')}
            </Button>
          )}
        </div>
        <div className={styles.tableHeaderRight}>
          <Tooltip placement="bottom" title={t('Common_Filter')} color="#ffffff" arrow={true}>
            <Button type="text" onClick={() => props.openFilterPanel(param.filter)} icon={<FilterOutlined />} />
          </Tooltip>
          <Search placeholder={t('Common_SearchByName')} allowClear onSearch={onSearch} style={{ width: 250 }} />
        </div>
      </>
    );
  };

  return (
    <>
      <Table
        columns={columns}
        rowSelection={rowSelection}
        dataSource={props.data}
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
        loading={loading}
        onChange={handleTableChange}
        title={() => TableHeader()}
        rowKey={(record) => record.id}
      />
      <Modal
        title={
          <>
            <ExclamationCircleFilled style={{ marginRight: 10, color: '#d0cf23', fontSize: 20 }} />
            <span>{t('Common_ConfirmDelete')}</span>
          </>
        }
        open={isModalOpen}
        footer={<></>}
        onCancel={onCancelModal}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 50 }}>
          <div style={{ fontSize: 16, margin: '10px 0' }}>
            {choosenUser
              ? t('Manage_Account_DeleteSingleUser_Text').replaceAll('{0}', choosenUser.fullName)
              : t('Manage_Account_DeleteUser_Text')}
          </div>
          {/* {tabStatus == EState.Activate ? (
            <Radio.Group
              onChange={onRadioChange}
              style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 60, marginLeft: 20 }}
              value={value}
            >
              <Radio value={EDeleteState.HardDelete}>{t('Common_HardDelete')}</Radio>
              <Radio value={EDeleteState.SoftDelete}>{t('Common_SoftDelete')}</Radio>
            </Radio.Group>
          ) : (
            <div style={{ marginBottom: 30 }}></div>
          )} */}
          <div className="actionBtnBottom">
            <Button onClick={onCancelModal}>{t('Common_Cancel')}</Button>
            <Button
              type="primary"
              // disabled={value === EDeleteState.None && tabStatus == EState.Activate}
              onClick={confirmDelete}
            >
              {t('Common_Delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DataTable;
