import { ReactSortable } from 'react-sortablejs';
import React, { useState, useEffect } from 'react';
import { Modal, Tag } from 'antd';
import styles from '../Task.module.scss';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
import { Link } from 'react-router-dom';
import icons from '@/assets/icons';
import Paragraph from 'antd/es/typography/Paragraph';

interface IProps {
  taskList: A[];
}
function Kanban(props: IProps) {
  const { taskList } = props;
  const [kanBanTaskList, setKanbanTaskList] = useState<A[]>([]);
  const [count, setCount] = useState<number>(0);
  const { showLoading, closeLoading } = useLoading();

  const getStatusList = async () => {
    try {
      const result = await service.taskStatusService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        }
      });
      return result.data;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    showLoading();
    const fetchData = async () => {
      try {
        const statusList = await getStatusList();
        mapTaskList(taskList, statusList);
      } catch (error) {
        console.log(error);
      } finally {
        closeLoading();
      }
    };
    fetchData();
  }, []);

  const mapTaskList = (taskList: A[], statusList: A[]) => {
    const track = statusList?.map((x) => {
      setCount(count + 1);
      return {
        ...x,
        tasks: taskList.filter((y) => x.id === y.statusId),
        count: taskList.filter((y) => x.id === y.statusId).length
      };
    });
    setKanbanTaskList(track);
  };

  const sortList = (newState: A, sortable: A) => {
    if (sortable) {
      const groupId: A = sortable.el.closest('[data-group]')?.getAttribute('data-group') || 0;
      const newList = kanBanTaskList.map((taskGroup: A) => {
        if (taskGroup.id === groupId) {
          const oldState = taskGroup.tasks;
          taskGroup.tasks = newState;
          const sortedItem = newState.find((item: A, index: A) => item.id !== oldState[index]?.id);
          if (sortedItem) {
            onChangeStatus(sortedItem.id, groupId);
          }
        }
        return taskGroup;
      });
      setKanbanTaskList(newList);
    }
  };

  const onChangeStatus = async (id: string, val: string) => {
    try {
      showLoading();
      await service.taskService.updateStatus({
        id: id,
        status: val
      });
    } catch (e: A) {
      Modal.error({
        title: 'This is an error message',
        content: e.message()
      });
    } finally {
      closeLoading();
    }
  };

  const IconShow = ({ value, ...props }: A) => {
    const iconItem = icons.find((icon) => icon.value === value);
    return iconItem ? React.cloneElement(iconItem.component, props) : null;
  };

  return (
    <div className={styles.kanban}>
      {kanBanTaskList?.map((status: A) => {
        return (
          <div
            key={status.id}
            data-group={status.id}
            style={{ height: '100%', minWidth: 250, width: `calc(100% / ${count})` }}
          >
            <div className={styles.title}>
              {status?.title} <span style={{ opacity: 0.8 }}> ( {status.count} )</span>
            </div>
            <ReactSortable
              list={status.tasks}
              setList={(newState: A, sortable: A) => sortList(newState, sortable)}
              animation={200}
              group={{ name: 'shared', pull: status.title !== 'Done' ? true : false, put: true }}
              ghostClass="sortable-ghost"
              dragClass="sortable-drag"
              className={styles.reactSortable}
              style={{ height: '100%' }}
            >
              {status.tasks?.map((task: A) => {
                return (
                  <div className={styles.task} key={status.id + '' + task.id}>
                    <div>
                      <Link to={`/tasks/task-detail/${task.key}/${task.id}`} style={{ color: '#000000' }}>
                        <div style={{ fontWeight: 500, fontSize: 16, lineHeight: '32px' }}>
                          [{task?.key}] {task.summary}
                        </div>
                      </Link>
                      <div className="ql-editor" style={{ width: '100%' }}>
                        <div style={{ padding: '5px 0' }} dangerouslySetInnerHTML={{ __html: task?.description }} />
                      </div>
                      <div style={{ padding: '5px 0 0 0' }}>
                        <Tag>
                          <Paragraph ellipsis={{ rows: 1, expandable: false }}>
                            <IconShow value={task?.taskPrioty?.iconUrl} disabled style={{ marginRight: 10 }} />
                            {task.taskPrioty?.pname}
                          </Paragraph>
                        </Tag>
                      </div>
                      <div>
                        <span>{task.date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </ReactSortable>
          </div>
        );
      })}
    </div>
  );
}

export default Kanban;
