import { CloseOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Collapse, CollapseProps, Drawer, Form, Row, Typography } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import styles from '../Project.module.scss';
import { useTranslation } from 'react-i18next';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
import { EStatus, StatusOptions } from '../Project.model';

interface IProps {
  filterProject: (val: A) => void;
  tabStatus: number;
}

function FilterPanel(props: IProps, ref: A) {
  const [open, setOpen] = useState<boolean>(false);
  const [items, setItems] = useState<CollapseProps['items']>([]);
  const { showLoading, closeLoading } = useLoading();
  const [departmentList, setDepartmentList] = useState<A>();
  const [teamList, setTeamList] = useState<A>([]);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { Paragraph } = Typography;

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

  const getTeam = async () => {
    try {
      const department = await form.getFieldValue('department');
      showLoading();
      const result = await service.teamService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        },
        filter: [{ key: 'DepartmentId', value: department }]
      });
      setTeamList([
        ...result.data.map((team: A) => ({
          label: team.title,
          value: team.id
        }))
      ]);
      closeLoading();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getFilterValue();
  }, [teamList, departmentList]);

  const getFilterValue = () => {
    const DepartmentElement = (
      <Form.Item name="department">
        <Checkbox.Group onChange={getTeam}>
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
    const TeamElement = (
      <Form.Item name="team">
        <Checkbox.Group>
          <Row>
            {teamList?.map((item: A) => (
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
    const StatusElement = (
      <Form.Item name="status">
        <Checkbox.Group>
          <Row>
            {StatusOptions?.filter((x) => x.value !== EStatus.Inactive).map((item: A) => (
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
      { key: 'team', label: t('team'), children: TeamElement }
    ];
    if (props.tabStatus == EStatus.Active)
      item.push({ key: 'status', label: t('Common_Status'), children: StatusElement });
    setItems(item);
  };

  useImperativeHandle(ref, () => ({
    openDrawer
  }));

  const openDrawer = async (data?: A) => {
    try {
      showLoading();
      await getDepartmentList();
      const dataTable: A = {
        department: data?.find((x: A) => x.key == 'DepartmentId')?.value,
        team: data?.find((x: A) => x.key == 'TeamId')?.value,
        status: data?.find((x: A) => x.key == 'Status')?.value
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
    props.filterProject(val);
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
            defaultActiveKey={['department', 'team', 'status']}
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
