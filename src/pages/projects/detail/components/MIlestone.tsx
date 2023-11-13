/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Button, Col, Dropdown, Empty, Modal, Progress, Row, Tree } from 'antd';
import { DataNode } from 'antd/es/tree';
import { useTranslation } from 'react-i18next';
import styles from '../ProjectDetail.module.scss';
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
import Panel from './Panel';
import Search from 'antd/es/input/Search';
import { useParams } from 'react-router';

import PermissionBlock from '@/common/helpers/permission/PermissionBlock';

function Milestone() {
  const dataLocation = useParams();
  const initDataGrid: Common.IDataGrid = {
    pageInfor: {
      pageSize: 100,
      pageNumber: 1,
      totalItems: 0
    },
    searchInfor: {
      searchValue: '',
      searchColumn: ['title']
    },
    filter: [{ key: 'projectId', value: [dataLocation.id] }]
  };
  const { t } = useTranslation();
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const { showLoading, closeLoading } = useLoading();
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);
  const allPermission = JSON.parse(sessionStorage.getItem('allPermissions') ?? '{}');
  const panelRef = useRef();
  const { confirm } = Modal;

  useEffect(() => {
    getMilestoneList();
  }, []);

  const openPanel = (data?: A) => {
    (panelRef.current as A).openDrawer(data);
  };

  const getMilestoneList = async (draftParam?: Common.IDataGrid) => {
    try {
      showLoading();
      const result = await service.milestoneService.get(draftParam ?? param);
      genMilestoneElement(result.data);
      closeLoading();
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const genMilestoneElement = (data: Milestone.IMilestoneModel[]) => {
    setTreeData(
      data?.map((item) => ({
        title: (
          <Row className={styles.milestoneItem}>
            <Col>
              <Row className={styles.title}>{item.title}</Row>
              <Row>
                {dayjs(item.startDate).format('DD MMM YYYY')} - {dayjs(item.dueDate).format('DD MMM YYYY')}
              </Row>
            </Col>
            <Row>
              <Col className={styles.progressCol}>
                <Progress percent={item.percentDone} />
              </Col>
              <Col>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: '1',
                        label: (
                          <PermissionBlock module={allPermission?.Project?.Permission_Update_Milestone}>
                            <div className={styles.menuitem} onClick={() => openPanel(item)}>
                              <EditOutlined /> <div>{t('Common_Edit')}</div>
                            </div>
                          </PermissionBlock>
                        )
                      },
                      {
                        key: '2',
                        label: (
                          <PermissionBlock module={allPermission?.Project?.Permission_Delete_Milestone}>
                            <div className={styles.menuitem} onClick={() => deleteMilestone(item)}>
                              <DeleteOutlined /> <div>{t('Common_Delete')}</div>
                            </div>
                          </PermissionBlock>
                        )
                      }
                    ]
                  }}
                  arrow={true}
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              </Col>
            </Row>
          </Row>
        ),
        key: item.id
      }))
    );
  };

  const onSearch = (value: string) => {
    const draftGrid = { ...param };
    if (draftGrid.searchInfor) {
      draftGrid.searchInfor.searchValue = value;
    }
    draftGrid.pageInfor!.pageNumber = 1;
    setParam(draftGrid);
    getMilestoneList(draftGrid);
  };

  const deleteMilestone = (data?: A) => {
    confirm({
      content: t('Milestone_Delete_Remind_Text').replace(`{0}`, data.title),
      title: t('Common_Delete'),
      okText: t('Common_Delete'),
      cancelText: t('Common_Cancel'),
      onOk() {
        console.log(data);
        confirmDelete(data.id);
      }
    });
  };

  const confirmDelete = async (id: string) => {
    try {
      showLoading();
      await service.milestoneService.delete({ isHardDelete: true, id: [id] });
      getMilestoneList();
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  return (
    <>
      <Row className={styles.header}>
        <Col className={styles.tableHeaderLeft}>
          <PermissionBlock module={allPermission?.Project?.Permission_Create_Milestone}>
            <Button type="text" onClick={openPanel} icon={<PlusOutlined />}>
              {t('Common_AddNew')}
            </Button>
          </PermissionBlock>
        </Col>
        <Col className={styles.tableHeaderRight}>
          <Search placeholder={t('Common_SearchByTitle')} allowClear onSearch={onSearch} style={{ width: 250 }} />
        </Col>
      </Row>
      {treeData?.length === 0 ? <Empty /> : <Tree treeData={treeData} />}
      <Panel refreshList={getMilestoneList} ref={panelRef} />
    </>
  );
}

export default Milestone;
