import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  Drawer,
  Empty,
  Button,
  Row,
  Timeline,
  Form,
  Input,
  DatePicker,
  Col,
  Collapse,
  CollapseProps,
  Modal,
  notification,
  Select,
  Typography
} from 'antd';
import {
  ClockCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  PlusOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import styles from '../TestPage.module.scss';
import { EWorkType, IDataTable, WorkType } from '../TestPage.model';
import { util } from '../../../../common/helpers/util';
import { useTranslation } from 'react-i18next';

dayjs.extend(dayLocaleData);

interface IProps {
  refreshList: () => void;
}

function CalendarPanel(props: IProps, ref: React.ForwardedRef<A>) {
  const [open, setOpen] = useState<boolean>(false);
  const [open2nd, setOpen2nd] = useState<boolean>(false);
  const [dataHehe, setDataHehe] = useState<IDataTable | undefined>();
  const { t } = useTranslation();
  const { confirm } = Modal;
  const { RangePicker } = DatePicker;
  const { TextArea } = Input;
  const { Paragraph } = Typography;
  const [form] = Form.useForm();
  const initCollapseItem = [
    {
      key: util.newGuid(),
      label: 'New work',
      children: (
        <Col className={styles.workItem}>
          <Form layout="vertical">
            <Form.Item label="Title">
              <Input size="large" maxLength={100} showCount />
            </Form.Item>
            <Form.Item label="Hour">
              <RangePicker picker="time" size="large" format={'HH:mm'} />
            </Form.Item>
            <Form.Item label="Type">
              <Select options={WorkType} />
            </Form.Item>
            <Form.Item label="Work">
              <TextArea size="large" maxLength={500} style={{ height: 120, resize: 'none' }} showCount />
            </Form.Item>
            <Button type="primary">{t('Common_Save')}</Button>
          </Form>
        </Col>
      ),
      extra: <DeleteOutlined style={{ padding: '0 10px' }} onClick={(event) => removeItem(event, '1')} />
    }
  ];
  const [collapseItem, setCollapseItem] = useState<CollapseProps['items']>(initCollapseItem);

  useImperativeHandle(ref, () => ({
    openDrawer
  }));
  const removeItem = (event: A, id: string) => {
    event.stopPropagation();
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleFilled />,
      content: 'Some descriptions',
      onOk() {
        setDataHehe({ ...dataHehe, listData: dataHehe?.listData?.filter((x) => x.id !== id) });
        notification.open({
          message: 'Delete thử thôi chứ k xóa đc đâu :")',
          type: 'success'
        });
        open2ndDrawer();
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };
  const openDrawer = (data: IDataTable) => {
    setDataHehe(data);
    setOpen(true);
  };
  const open2ndDrawer = () => {
    const formRule = {
      title: [{ require: true, message: 'This field is required!' }]
    };
    const onFinish = () => {
      console.log('ok');
    };
    const workData: CollapseProps['items'] = dataHehe?.listData
      ? dataHehe?.listData!.map((x) => ({
          key: x.id,
          label: x.title,
          children: (
            <Col className={styles.workItem}>
              <Form layout="vertical">
                <Form.Item label="Title" rules={formRule.title} shouldUpdate>
                  <Input
                    size="large"
                    maxLength={100}
                    showCount
                    value={x.title}
                    disabled={dayjs().isAfter(dayjs(x.startTime, 'HH:mm'))}
                  />
                </Form.Item>
                <Form.Item label="Hour">
                  <RangePicker
                    picker="time"
                    size="large"
                    format={'HH:mm'}
                    defaultValue={[
                      dayjs(dayjs(x.startTime, 'HH:mm').toDate()),
                      dayjs(dayjs(x.endTime, 'HH:mm').toDate())
                    ]}
                    disabled={dayjs().isAfter(dayjs(x.startTime, 'HH:mm'))}
                  />
                </Form.Item>
                <Form.Item label="Type">
                  <Select
                    options={WorkType}
                    value={x.type}
                    size="large"
                    disabled={dayjs().isAfter(dayjs(x.startTime, 'HH:mm'))}
                  />
                </Form.Item>
                <Form.Item label="Work">
                  <TextArea
                    size="large"
                    maxLength={500}
                    style={{ height: 120, resize: 'none' }}
                    showCount
                    value={x.content}
                    disabled={dayjs().isAfter(dayjs(x.startTime, 'HH:mm'))}
                  />
                </Form.Item>
                {!dayjs().isAfter(dayjs(x.startTime, 'HH:mm')) && <Button type="primary">{t('Common_Save')}</Button>}
              </Form>
            </Col>
          ),
          extra: !dayjs().isAfter(dayjs(x.startTime, 'HH:mm')) && (
            <DeleteOutlined style={{ padding: '0 10px' }} onClick={(event) => removeItem(event, x.id)} />
          )
        }))
      : [];
    setCollapseItem([...(workData ?? []), ...initCollapseItem]);
    form.setFieldsValue({ ...dataHehe, day: dataHehe?.date ? dayjs(dataHehe.date) : null });
    setOpen2nd(true);
  };
  const closeDrawer = () => {
    setOpen(false);
  };
  const close2ndDrawer = () => {
    setOpen2nd(false);
  };
  const onCollapseChange = (key: string | string[]) => {
    console.log(key);
  };
  const addMoreWork = () => {
    setCollapseItem([...(collapseItem ?? []), ...initCollapseItem]);
  };
  const saveSchedule = (val: A) => {
    console.log(dataHehe);
    console.log(val);
  };
  return (
    <Drawer
      width={500}
      placement="right"
      title={dayjs(dataHehe?.date).format('DD MMM YYYY') + ' Schedule'}
      open={open}
      maskClosable={false}
      onClose={closeDrawer}
      className={styles.drawer}
      closable={false}
      extra={<CloseOutlined onClick={closeDrawer} />}
      footer={
        <Row className={styles.btmDrawer}>
          <Button onClick={closeDrawer}>{t('Common_Cancel')}</Button>
          <Button
            type="primary"
            onClick={open2ndDrawer}
            disabled={!(dataHehe?.date && dayjs().format('YYYY-MM-DD') <= dataHehe.date)}
          >
            {dataHehe?.listData ? 'Edit' : 'Create'}
          </Button>
        </Row>
      }
    >
      {dataHehe?.listData ? (
        <Timeline
          mode="left"
          items={dataHehe?.listData.map((x) => ({
            label: `${x.startTime} - ${x.endTime}`,
            children: (
              <div>
                {x.title}
                <Paragraph ellipsis={{ rows: 1, expandable: false }}>{x.content}</Paragraph>
              </div>
            ),
            color:
              x.type === EWorkType.Success
                ? 'green'
                : x.type === EWorkType.Warning
                ? '#c4c404'
                : x.type === EWorkType.Alert
                ? 'red'
                : 'blue',
            dot: dayjs().format('YYYY-MM-DD') === dataHehe.date &&
              dayjs().isAfter(dayjs(x.startTime, 'HH:mm')) &&
              dayjs().isBefore(dayjs(x.endTime, 'HH:mm')) && <ClockCircleOutlined style={{ fontSize: '16px' }} />
          }))}
        />
      ) : (
        <Empty />
      )}
      <Drawer
        title={dataHehe?.listData ? 'Edit Schedule' : 'Create Schedule'}
        width={500}
        closable={false}
        onClose={close2ndDrawer}
        maskClosable={false}
        open={open2nd}
        className={styles.drawer}
        extra={<CloseOutlined onClick={close2ndDrawer} />}
      >
        <Form layout="vertical" form={form} onFinish={saveSchedule} className={styles.form}>
          <Form.Item name="day" label="Day of schedule">
            <DatePicker disabled size="large" />
          </Form.Item>
          <Collapse
            ghost
            size="large"
            items={collapseItem}
            onChange={onCollapseChange}
            expandIconPosition="end"
            collapsible="icon"
          />
          <Button style={{ marginTop: 10 }} onClick={addMoreWork} icon={<PlusOutlined />}>
            Add more
          </Button>
          <Row className={styles.btmDrawer}>
            <Button onClick={close2ndDrawer}>{t('Common_Cancel')}</Button>
            <Button type="primary" htmlType="submit">
              {t('Common_Save')}
            </Button>
          </Row>
        </Form>
      </Drawer>
    </Drawer>
  );
}

export default forwardRef(CalendarPanel);
