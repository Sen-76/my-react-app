import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, ColorPicker, List, Modal, Row, Tag, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from '../TaskStatusConfiguration.module.scss';
import Paragraph from 'antd/es/typography/Paragraph';
import { service } from '@/services/apis';
import { useEffect, useState } from 'react';
import Search from 'antd/es/input/Search';
import { ReactSortable } from 'react-sortablejs';
import { useLoading } from '@/common/context/useLoading';

interface IProps {
  data: TaskStatus.ITaskStatusModel[];
  openPanel: (data?: TaskStatus.ITaskStatusModel) => void;
  refreshList: () => void;
  onSearch: (value: string) => void;
  listLoading: boolean;
}
function DataList(props: IProps) {
  const { t } = useTranslation();
  const { confirm } = Modal;
  const [sortedData, setSortedData] = useState<TaskStatus.ITaskStatusModel[]>(props.data);
  const { showLoading, closeLoading } = useLoading();

  useEffect(() => {
    props.listLoading ? showLoading() : closeLoading();
  }, [props.listLoading]);

  useEffect(() => {
    setSortedData(props.data);
  }, [props.data]);

  const deleteTaskStatus = async (item: TaskStatus.ITaskStatusModel) => {
    confirm({
      content: t('Task_Status_Delete_Remind_Text').replace('{0}', item.title),
      title: t('Common_Confirm'),
      okText: t('Common_Delete'),
      cancelText: t('Common_Cancel'),
      onOk() {
        confirmDelete(item.id);
      }
    });
  };

  const confirmDelete = async (id: string) => {
    try {
      showLoading();
      await service.taskStatusService.delete({ isHardDelete: true, id: [id] });
      props.refreshList();
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const onSearch = (val: A) => {
    props.onSearch(val);
  };

  const onSort = (sortedList: TaskStatus.ITaskStatusModel[]) => {
    setSortedData(sortedList);
    const newList = sortedData.map((taskGroup: A) => {
      console.log(taskGroup);
    });
  };

  return (
    <>
      <div className={styles.listheader}>
        <Button type="text" onClick={() => props.openPanel()} icon={<PlusOutlined />}>
          {t('Common_AddNew')}
        </Button>
        <div>
          <Search placeholder={t('Common_SearchByTitle')} allowClear onSearch={onSearch} style={{ width: 250 }} />
        </div>
      </div>
      <ReactSortable
        filter=".addImageButtonContainer"
        dragClass="sortableDrag"
        list={sortedData}
        setList={onSort}
        animation={200}
        easing="ease-out"
        className={styles.list}
      >
        {sortedData.map((item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              title={
                <Row>
                  <Col style={{ width: '80%' }}>
                    <div className={styles.itemContent}>
                      <Col>
                        <ColorPicker value={item?.color} disabled size="small" style={{ marginRight: 20 }} />
                      </Col>
                      <Col style={{ width: '80%' }}>
                        {item?.isDefault ? (
                          <Paragraph
                            ellipsis={{ rows: 1, expandable: false }}
                            style={{ width: 'auto', maxWidth: '100%' }}
                          >
                            {item?.title}{' '}
                            <Tag style={{ marginLeft: 5 }} color="red">
                              {t('default')}
                            </Tag>
                          </Paragraph>
                        ) : (
                          <Paragraph
                            ellipsis={{ rows: 1, expandable: false }}
                            style={{ width: 'auto', maxWidth: '100%' }}
                          >
                            {item?.title}
                          </Paragraph>
                        )}
                        <Tooltip placement="bottom" title={item?.description} color="#ffffff" arrow={true}>
                          <Paragraph
                            ellipsis={{ rows: 1, expandable: false }}
                            style={{ width: 'auto', maxWidth: '100%', fontWeight: 400 }}
                          >
                            {item?.description}
                          </Paragraph>
                        </Tooltip>
                      </Col>
                    </div>
                  </Col>
                  <Col>
                    <Tooltip placement="bottom" title={t('Common_Edit')} color="#ffffff" arrow={true}>
                      <Button
                        // disabled={!!item?.isDefault}
                        type="text"
                        onClick={() => props.openPanel(item)}
                        icon={<EditOutlined />}
                      />
                    </Tooltip>
                    <Tooltip
                      placement="bottom"
                      title={item.isDefault ? t('Status_ToolTip_CannotDeleteStatus_Default') : t('Common_Delete')}
                      color="#ffffff"
                      arrow={true}
                    >
                      <Button
                        disabled={!!item?.isDefault}
                        type="text"
                        onClick={() => deleteTaskStatus(item)}
                        icon={<DeleteOutlined />}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              }
            />
          </List.Item>
        ))}
      </ReactSortable>
    </>
  );
}

export default DataList;
