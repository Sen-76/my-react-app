import styles from './TaskDetail.module.scss';
import TaskInformation from './components/TaskInformation';
import { service } from '@/services/apis';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { EditOutlined, SnippetsOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { useLoading } from '@/common/context/useLoading';
import { Breadcrumb, Button, Col, Form, Input, Select, notification } from 'antd';
import Activities from './components/Activities';
import { BreadcrumbItemType, BreadcrumbSeparatorType } from 'antd/es/breadcrumb/Breadcrumb';
import Panel from '../list/components/Panel';

function TaskDetail() {
  const data = useParams();
  const { t } = useTranslation();
  const { setBreadcrumb } = useBreadcrumb();
  const { showLoading, closeLoading } = useLoading();
  const [editData, setEditData] = useState<A>({});
  const [statusList, setStatusList] = useState<A[]>([]);
  const [commentList, setCommentList] = useState<A[]>([]);
  const [historyList, setHistoryList] = useState<A[]>([]);
  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [currentHistoryPage, setCurrentHistoryPage] = useState<number>(1);
  const panelRef = useRef();

  const [form] = Form.useForm();

  const updateInfo = async () => {
    try {
      showLoading();
      setEditTitle(false);
      await service.taskService.update({
        ...editData,
        ...form.getFieldsValue(),
        taskLinkIds: editData.taskLinks.map((x: A) => x.tasklink.id),
        attachments: editData.fileAttachments
      });
      getDetail();
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    setBreadcrumb([{ icon: <SnippetsOutlined />, path: '/tasks', text: t('Common_Task') }, { text: data.name }]);
  }, [t, location.pathname]);

  useEffect(() => {
    const fetchApi = async () => {
      showLoading();
      await getStatusList();
      await getDetail();
      await getComment();
      closeLoading();
    };
    fetchApi();
  }, [location.pathname]);

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

  const getComment = async () => {
    try {
      const result = await service.commentService.get({
        maxResults: 10,
        orderBy: 'createdDate',
        page: 1,
        taskId: data.id ?? ''
      });
      setCommentList(result.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getHistory = async (nextPage?: number) => {
    try {
      const result = await service.taskService.history({
        maxResults: 10,
        orderBy: 'created',
        page: !nextPage ? currentHistoryPage : nextPage,
        taskId: data.id ?? ''
      });
      const test = result.data.map((x: A) => {
        return { ...x, actionBody: x.actionBody ? JSON.parse(x.actionBody ?? '') : {} };
      });
      setHistoryList(test);
    } catch (e) {
      console.log(e);
    }
  };

  const nextHistory = async () => {
    const newPage = currentHistoryPage + 1;
    setCurrentHistoryPage(newPage);
    getHistory(newPage);
  };

  const getDetail = async () => {
    try {
      const result = await service.taskService.getDetail(data.id ?? '');
      await getHistory();
      setEditData(result.data);
    } catch (e) {
      console.log(e);
    }
  };

  const breadcrumItem = () => {
    const project: Partial<BreadcrumbItemType & BreadcrumbSeparatorType> = {};
    const task: Partial<BreadcrumbItemType & BreadcrumbSeparatorType> = {};
    project.title = (
      <div>
        <span>{editData?.projectRelation?.title}</span>
      </div>
    );
    task.title = (
      <div>
        <span>{editData?.key}</span>
      </div>
    );
    return [project, task];
  };

  const onChangeStatus = async (val: string) => {
    try {
      showLoading();
      await service.taskService.updateStatus({
        ...editData,
        status: val
      });
      setEditData({ ...editData, statusId: val });
      getDetail();
      notification.open({
        message: t('Common_UpdateSuccess'),
        type: 'success'
      });
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const openPanel = () => {
    (panelRef.current as A).openDrawer(editData);
  };

  const requiredRule = [{ required: true, message: t('Common_Require_Field') }];

  return (
    <div className={styles.taskDetail}>
      <Breadcrumb style={{ fontSize: 15 }} items={breadcrumItem()} />
      <Form
        onFinish={updateInfo}
        style={{ margin: '10px 0', padding: '10px 0', display: 'flex', alignItems: 'center' }}
        form={form}
      >
        {!editTitle ? (
          <Button
            style={{ width: '100%', display: 'flex', alignItems: 'center' }}
            className={styles.title}
            type="text"
            onClick={() => {
              if (editData.status?.title === 'Open') {
                setEditTitle(true);
                form.setFieldsValue(editData);
              }
            }}
          >
            {editData?.summary}
          </Button>
        ) : (
          <Form.Item name="summary" rules={requiredRule} style={{ margin: 0, width: '100%' }}>
            <Input
              maxLength={250}
              showCount
              style={{ width: '100%', lineHeight: 2 }}
              onBlur={updateInfo}
              size="large"
            />
          </Form.Item>
        )}
      </Form>
      {/* <Button
        style={{ marginRight: 10 }}
        icon={<EditOutlined />}
        disabled={editData?.status?.title !== 'Open'}
        onClick={openPanel}
      >
        Edit
      </Button> */}
      <Select
        disabled={editData?.status?.title === 'Done'}
        onChange={onChangeStatus}
        value={editData.statusId}
        options={statusList}
        style={{ width: 200 }}
      />
      <Col style={{ marginTop: 10 }}>
        <TaskInformation data={editData} refreshData={getDetail} setEditTitle={setEditTitle} />
        <Activities
          commentList={commentList}
          refreshCommentList={getComment}
          nextHistory={nextHistory}
          historyList={historyList}
        />
      </Col>
      <Panel ref={panelRef} refreshList={() => console.log('cc')} />
    </div>
  );
}

export default TaskDetail;
