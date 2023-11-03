import { ReactSortable } from 'react-sortablejs';
import { useState, useEffect } from 'react';
import { Image, Modal, Tag } from 'antd';
import styles from '../Task.module.scss';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
import { Link } from 'react-router-dom';

interface IProps {
  taskList: A[];
}
function Kanban(props: IProps) {
  const { taskList } = props;
  const [kanBanTaskList, setKanbanTaskList] = useState<A[]>([]);
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
    const track = statusList?.map((x) => ({ ...x, tasks: taskList.filter((y) => x.id === y.statusId) }));
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
            console.log('Sorted item:', { ...sortedItem, status: groupId });
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
      console.log(e);
      Modal.error({
        title: 'This is an error message',
        content: e.message()
      });
    } finally {
      closeLoading();
    }
  };

  return (
    <div className={styles.kanban}>
      {kanBanTaskList?.map((status: A) => {
        return (
          <div key={status.id} data-group={status.id}>
            <div className={styles.title}>{status?.title}</div>
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
                    <Link to={`/tasks/task-detail/${task.key}/${task.id}`} style={{ color: '#222' }}>
                      <div>
                        <Image src="https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645.jpg" />
                        <div style={{ fontWeight: 500, fontSize: 16, lineHeight: '32px' }}>{task.summary}</div>
                        <div style={{ padding: '5px 0' }} dangerouslySetInnerHTML={{ __html: task?.description }} />
                        <div style={{ padding: '5px 0' }}>
                          <Tag color={task.status?.color}>{task.status?.title}</Tag>
                          <Tag>{task.taskPrioty?.pname}</Tag>
                        </div>
                        <div>
                          <span>{task.date}</span>
                        </div>
                      </div>
                    </Link>
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
