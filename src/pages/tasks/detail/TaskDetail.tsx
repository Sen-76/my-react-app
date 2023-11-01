import styles from './TaskDetail.module.scss';
import TaskInformation from './components/TaskInformation';
import { service } from '@/services/apis';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { EditOutlined, SnippetsOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { useLoading } from '@/common/context/useLoading';
import { Breadcrumb, Button, Col, Select, notification } from 'antd';
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
  const panelRef = useRef();

  useEffect(() => {
    setBreadcrumb([{ icon: <SnippetsOutlined />, path: '/tasks', text: t('Common_Task') }, { text: data.name }]);
  }, [t]);

  useEffect(() => {
    const fetchApi = async () => {
      showLoading();
      await getStatusList();
      await getDetail();
      closeLoading();
    };
    fetchApi();
  }, []);

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

  const getDetail = async () => {
    try {
      const result = await service.taskService.getDetail(data.id ?? '');
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

  return (
    <div className={styles.taskDetail}>
      <Breadcrumb items={breadcrumItem()} />
      <div className={styles.title}>{editData?.summary}</div>
      <Button
        style={{ marginRight: 10 }}
        icon={<EditOutlined />}
        disabled={editData?.status?.title !== 'Open'}
        onClick={openPanel}
      >
        Edit
      </Button>
      <Select onChange={onChangeStatus} value={editData.statusId} options={statusList} style={{ width: 200 }} />
      <Col style={{ marginTop: 10 }}>
        <TaskInformation data={editData} />
        <Activities />
      </Col>
      <Panel ref={panelRef} refreshList={() => console.log('cc')} />
    </div>
  );
}

export default TaskDetail;
