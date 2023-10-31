import icons from '@/assets/icons';
import { service } from '@/services/apis';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, List, Modal, Row, Tag, Tooltip } from 'antd';
import Search from 'antd/es/input/Search';
import Paragraph from 'antd/es/typography/Paragraph';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../TaskTypeConfiguration.module.scss';

interface IProps {
  data: TaskPrioty.ITaskPriotyModel[];
  openPanel: (data?: TaskPrioty.ITaskPriotyModel) => void;
  refreshList: () => void;
  onSearch: (value: string) => void;
  listLoading: boolean;
}

const IconShow = ({ value, ...props }: A) => {
  const iconItem = icons.find((icon) => icon.value === value);
  return iconItem ? React.cloneElement(iconItem.component, props) : null;
};

function DataList(props: IProps) {
  const { t } = useTranslation();
  const { confirm } = Modal;
  const [loading, setLoading] = useState<boolean>(props.listLoading);

  useEffect(() => {
    setLoading(props.listLoading);
  }, [props.listLoading]);

  const deleteTaskStatus = async (item: TaskPrioty.ITaskPriotyModel) => {
    confirm({
      content: t('Task_Status_Delete_Remind_Text').replace('{0}', item.pname),
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
      setLoading(true);
      await service.taskPriotyService.delete({ isHardDelete: true, id: [id] });
      props.refreshList();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (val: A) => {
    props.onSearch(val);
  };
  const TableHeader = (
    <div className={styles.listheader}>
      <Button type="text" onClick={() => props.openPanel()} icon={<PlusOutlined />}>
        {t('Common_AddNew')}
      </Button>
      <Search placeholder={t('Common_SearchByTitle')} allowClear onSearch={onSearch} style={{ width: 250 }} />
    </div>
  );
  const item = (item: TaskPrioty.ITaskPriotyModel) => (
    <List.Item>
      <List.Item.Meta
        title={
          <Row>
            <Col style={{ width: '80%' }}>
              <div className={styles.itemContent}>
                <Col>
                  <IconShow value={item?.iconUrl} disabled style={{ marginRight: 20 }} />
                </Col>
                <Col style={{ width: '80%' }}>
                  {item?.isDefault ? (
                    <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ width: 'auto', maxWidth: '100%' }}>
                      {item?.pname}{' '}
                      <Tag style={{ marginLeft: 5 }} color="red">
                        {t('default')}
                      </Tag>
                    </Paragraph>
                  ) : (
                    <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ width: 'auto', maxWidth: '100%' }}>
                      {item?.pname}
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
                  disabled={!!item?.isDefault}
                  type="text"
                  onClick={() => props.openPanel(item)}
                  icon={<EditOutlined />}
                />
              </Tooltip>
              <Tooltip placement="bottom" title={t('Common_Delete')} color="#ffffff" arrow={true}>
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
  );

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={props.data}
        className={styles.list}
        bordered
        renderItem={item}
        header={TableHeader}
        loading={loading}
      />
    </>
  );
}

export default DataList;
