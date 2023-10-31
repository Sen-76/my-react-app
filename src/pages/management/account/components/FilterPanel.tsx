import { CloseOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Collapse, CollapseProps, Drawer, Form, Row, Typography } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import styles from '../AccountManagement.module.scss';
import { GenderOptions } from '../AccountManagement.Model';
import { useTranslation } from 'react-i18next';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';

interface IProps {
  onFilter: (val: A) => void;
}

function FilterPanel(props: IProps, ref: A) {
  const [open, setOpen] = useState<boolean>(false);
  const [items, setItems] = useState<CollapseProps['items']>([]);
  const { showLoading, closeLoading } = useLoading();
  const [roleList, setRoleList] = useState<A>();
  const [departmentList, setDepartmentList] = useState<A>();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { Paragraph } = Typography;

  const getRoleList = async () => {
    try {
      const result = await service.rolesService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        }
      });
      setRoleList(
        result.data.map((role: A) => ({
          label: role.title,
          value: role.id
        }))
      );
    } catch (e) {
      console.log(e);
    }
  };

  const getDepartmentList = async () => {
    try {
      const result = await service.departmentService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        }
      });
      setDepartmentList(
        result.data.map((department: A) => ({
          label: department.title,
          value: department.id
        }))
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getFilterValue();
  }, [roleList, departmentList]);

  const getFilterValue = () => {
    const DepartmentElement = (
      <Form.Item name="department">
        <Checkbox.Group>
          <Row>
            {departmentList?.map((item: A) => (
              <Col span={12} key={item.value} className={styles.col}>
                <Checkbox value={item.value}>
                  <Paragraph ellipsis={{ rows: 4, expandable: false }}>{item.label}</Paragraph>
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Form.Item>
    );
    const GenderElement = (
      <Form.Item name="gender">
        <Checkbox.Group>
          <Row>
            {GenderOptions.map((item: A) => (
              <Col span={12} key={item.value} className={styles.col}>
                <Checkbox value={item.value}>
                  <Paragraph ellipsis={{ rows: 4, expandable: false }}>{item.label}</Paragraph>
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Form.Item>
    );
    const RoleElement = (
      <Form.Item name="role">
        <Checkbox.Group>
          <Row>
            {roleList?.map((item: A) => (
              <Col span={12} key={item.value} className={styles.col}>
                <Checkbox value={item.value}>
                  <Paragraph ellipsis={{ rows: 4, expandable: false }}>{item.label}</Paragraph>
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Form.Item>
    );
    const item = [
      { key: 'department', label: t('department'), children: DepartmentElement },
      { key: 'gender', label: t('gender'), children: GenderElement },
      { key: 'role', label: t('role'), children: RoleElement }
    ];
    setItems(item);
  };

  useImperativeHandle(ref, () => ({
    openDrawer
  }));

  const openDrawer = async (data?: A) => {
    try {
      showLoading();
      await getRoleList();
      await getDepartmentList();
      const dataTable: A = {
        gender: data?.find((x: A) => x.key == 'Gender')?.value,
        department: data?.find((x: A) => x.key == 'UserDepartment')?.value,
        role: data?.find((x: A) => x.key == 'UserRole')?.value
      };
      form.setFieldsValue(dataTable);
      setOpen(true);
      getFilterValue();
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
        width={420}
        destroyOnClose={true}
      >
        <Form form={form} onFinish={onFinish} layout="vertical" className={styles.panelform}>
          <Collapse
            items={items}
            bordered={false}
            defaultActiveKey={['department', 'gender', 'status', 'role']}
            ghost
            size="large"
            expandIconPosition="end"
            collapsible="icon"
          />
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
