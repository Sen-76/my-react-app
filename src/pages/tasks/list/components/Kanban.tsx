import { ReactSortable } from 'react-sortablejs';
import { useState, useEffect } from 'react';
import { Image, Tag } from 'antd';
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
  }, [taskList]);

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
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  return (
    <div className={styles.kanban}>
      {kanBanTaskList?.map((project: A) => {
        return (
          <div key={project.id} data-group={project.id}>
            <div className={styles.title}>{project?.title}</div>
            <ReactSortable
              list={project.tasks}
              setList={(newState: A, sortable: A) => sortList(newState, sortable)}
              animation={200}
              group={{ name: 'shared', pull: true, put: true }}
              ghostClass="sortable-ghost"
              dragClass="sortable-drag"
              className={styles.reactSortable}
            >
              {project.tasks?.map((task: A) => {
                return (
                  <div className={styles.task} key={project.id + '' + task.id}>
                    <Link to={`/tasks/task-detail/${task.key}/${task.id}`}>
                      <div>
                        <Image src="https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645.jpg" />
                        <div>{task.summary}</div>
                        <div dangerouslySetInnerHTML={{ __html: task?.description }} />
                        <Tag color={task.status?.color}>{task.status?.title}</Tag>
                        <Tag>{task.taskPrioty?.pname}</Tag>
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
