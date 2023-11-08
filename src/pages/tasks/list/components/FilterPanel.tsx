/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Drawer, Empty, Form, Select, Spin, Typography } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import styles from '../Task.module.scss';
import { useTranslation } from 'react-i18next';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
import useDebounce from '@/common/helpers/useDebounce';
import { util } from '@/common/helpers/util';
import icons from '@/assets/icons';

interface IProps {
  onFilter: (val: A) => void;
}

function FilterPanel(props: IProps, ref: A) {
  const [open, setOpen] = useState<boolean>(false);
  const { showLoading, closeLoading } = useLoading();
  const [projectList, setProjectList] = useState<Project.IProjectModel[]>();
  const [statusList, setStatusList] = useState<Project.IProjectModel[]>();
  const [selectLoading, setSelectLoading] = useState<boolean>();
  const [userMemberList, setUserMemberList] = useState<Account.IAccountModel[]>([]);
  const [mileStoneList, setMilestoneList] = useState<Account.IAccountModel[]>([]);
  const [priotyList, setPriotyList] = useState<Account.IAccountModel[]>([]);
  const [searchAssigneeValue, setSearchAssigneeValue] = useState<string>('');
  const userDebouncedAssignee = useDebounce(searchAssigneeValue, 300);

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { Paragraph } = Typography;
  const initDataGrid: Common.IDataGrid = {
    pageInfor: {
      pageSize: 10,
      pageNumber: 1,
      totalItems: 0
    },
    searchInfor: {
      searchValue: '',
      searchColumn: ['FullName', 'UserEmail']
    },
    filter: []
  };

  useEffect(() => {
    getUsers();
  }, [userDebouncedAssignee]);

  const getUsers = async () => {
    try {
      const draftParam: Common.IDataGrid = { ...initDataGrid };
      draftParam.searchInfor!.searchValue = userDebouncedAssignee ?? '';
      const result = await service.accountService.getAccount(draftParam);
      const optionsValue = result.data?.map((x: A) => ({
        label: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size={25} src={x?.photoUrl} style={{ marginRight: 10, backgroundColor: util.randomColor() }}>
              {x?.fullName?.charAt(0)}
            </Avatar>
            <div>
              <Paragraph
                ellipsis={{ rows: 1, expandable: false }}
                style={{ maxWidth: 350, minWidth: 30, fontWeight: 600, fontSize: 16, lineHeight: '20px' }}
              >
                {x?.fullName}
              </Paragraph>
              <Paragraph
                ellipsis={{ rows: 1, expandable: false }}
                style={{ maxWidth: 350, minWidth: 30, lineHeight: '16px', fontSize: 12 }}
              >
                {x.userEmail}
              </Paragraph>
            </div>
          </div>
        ),
        value: x.id
      }));
      setUserMemberList(optionsValue);
      setSelectLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const getProjectList = async () => {
    try {
      const result = await service.projectService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        }
      });
      setProjectList(result.data.map((x: A) => ({ label: x?.title, value: x.id })));
    } catch (e) {
      console.log(e);
    }
  };

  const getStatusList = async () => {
    try {
      const result = await service.taskStatusService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        }
      });
      setStatusList(
        result.data.map((x: A) => ({
          label: <div style={{ color: x?.color, fontWeight: 600 }}>{x.title}</div>,
          value: x.id
        }))
      );
    } catch (e) {
      console.log(e);
    }
  };

  const getMilestoneList = async () => {
    try {
      const result = await service.milestoneService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        }
      });
      setMilestoneList(result.data.map((x: A) => ({ label: x?.title, value: x.id })));
    } catch (e) {
      console.log(e);
    }
  };

  const IconShow = ({ value, ...props }: A) => {
    const iconItem = icons.find((icon) => icon.value === value);
    return iconItem ? React.cloneElement(iconItem.component, props) : null;
  };

  const getPriotyList = async () => {
    try {
      const result = await service.taskPriotyService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        }
      });
      setPriotyList(
        result.data.map((x: A) => ({
          label: (
            <>
              <IconShow value={x?.iconUrl} disabled style={{ marginRight: 10 }} />
              {x?.pname}
            </>
          ),
          value: x.id
        }))
      );
    } catch (e) {
      console.log(e);
    }
  };

  useImperativeHandle(ref, () => ({
    openDrawer
  }));

  const openDrawer = async (data?: A) => {
    try {
      showLoading();
      const promises = [getProjectList(), getStatusList(), getMilestoneList(), getPriotyList()];
      await Promise.all(promises);
      if (data) {
        data = data.reduce((obj: A, item: A) => {
          obj[item.key] = item.value;
          return obj;
        }, {});
        console.log(data);
        form.setFieldsValue(data);
      }
      setOpen(true);
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const closeDrawer = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    form.resetFields();
  };

  const onFinish = (val: A) => {
    props.onFilter(val);
    closeDrawer();
  };

  return (
    <>
      <Drawer
        title={t('Common_Filter')}
        placement="right"
        open={open}
        extra={<CloseOutlined onClick={closeDrawer} />}
        onClose={closeDrawer}
        maskClosable={false}
        closable={false}
        width={720}
        destroyOnClose={true}
      >
        <Form form={form} onFinish={onFinish} layout="vertical" className={styles.panelform}>
          <Form.Item name="projectId" label={t('Task_Project')}>
            <Select options={projectList} mode="multiple" />
          </Form.Item>
          <Form.Item name="milestoneId" label={t('Task_Milestone')}>
            <Select options={mileStoneList} mode="multiple" />
          </Form.Item>
          <Form.Item name="statusId" label={t('Task_Status')}>
            <Select options={statusList} mode="multiple" />
          </Form.Item>
          <Form.Item name="taskPriotyId" label={t('Task_Priority')}>
            <Select options={priotyList} mode="multiple" />
          </Form.Item>
          <Form.Item name="assignee" label={t('Task_Assignee')}>
            <Select
              labelInValue
              showSearch
              mode="multiple"
              placeholder={t('Common_SearchNameAndEmail')}
              onBlur={() => {
                setSearchAssigneeValue('');
              }}
              onSearch={(value) => {
                setSelectLoading(true);
                setUserMemberList([]);
                setSearchAssigneeValue(value);
              }}
              notFoundContent={
                selectLoading ? (
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 100
                    }}
                  >
                    <Spin />
                  </div>
                ) : (
                  <Empty />
                )
              }
              dropdownRender={(menu) => <>{menu}</>}
              filterOption={() => true}
              options={userMemberList}
              suffixIcon={<SearchOutlined />}
            />
          </Form.Item>
          <Form.Item name="reportTo" label={t('Task_Reporter')}>
            <Select
              labelInValue
              showSearch
              mode="multiple"
              placeholder={t('Common_SearchNameAndEmail')}
              onBlur={() => {
                setSearchAssigneeValue('');
              }}
              onSearch={(value) => {
                setSelectLoading(true);
                setUserMemberList([]);
                setSearchAssigneeValue(value);
              }}
              notFoundContent={
                selectLoading ? (
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 100
                    }}
                  >
                    <Spin />
                  </div>
                ) : (
                  <Empty />
                )
              }
              dropdownRender={(menu) => <>{menu}</>}
              filterOption={() => true}
              options={userMemberList}
              suffixIcon={<SearchOutlined />}
            />
          </Form.Item>
          <div className="actionBtnBottom">
            <Button onClick={closeDrawer}>{t('Common_Cancel')}</Button>
            <Button onClick={resetForm}>{t('Common_Reset')}</Button>
            <Button type="primary" htmlType="submit">
              {t('Common_Confirm')}
            </Button>
          </div>
        </Form>
      </Drawer>
    </>
  );
}

export default forwardRef(FilterPanel);
