import { ReactSortable } from 'react-sortablejs';
import { useState } from 'react';
import { Image, Tag } from 'antd';
import styles from '../Task.module.scss';

function Kanban() {
  const [projectList, setProjectList] = useState<A[]>([
    {
      id: 1,
      title: 'In Progress',
      tasks: [
        {
          projectId: 1,
          id: 1,
          title: 'Creating a new Portfolio on Dribble',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
          image: true,
          date: ' 08 Aug, 2020',
          tags: ['designing']
        },
        {
          projectId: 1,
          id: 2,
          title: 'Singapore Team Meet',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
          date: ' 09 Aug, 2020',
          tags: ['meeting']
        }
      ]
    },
    {
      id: 2,
      title: 'Pending',
      tasks: [
        {
          projectId: 2,
          id: 3,
          title: 'Plan a trip to another country',
          description: '',
          date: ' 10 Sep, 2020'
        }
      ]
    },
    {
      id: 3,
      title: 'Complete',
      tasks: [
        {
          projectId: 3,
          id: 4,
          title: 'Dinner with Kelly Young',
          description: '',
          date: ' 08 Aug, 2020'
        },
        {
          projectId: 3,
          id: 5,
          title: 'Launch New SEO Wordpress Theme ',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          date: ' 09 Aug, 2020'
        }
      ]
    },
    {
      id: 4,
      title: 'Working',
      tasks: []
    }
  ]);

  const sortList = (newState: A, sortable: A) => {
    if (sortable) {
      const groupId: A = sortable.el.closest('[data-group]')?.getAttribute('data-group') || 0;
      const newList = projectList.map((task: A) => {
        if (parseInt(task.id) === parseInt(groupId)) {
          task.tasks = newState;
        }
        return task;
      });
      setProjectList(newList);
    }
  };

  return (
    <div className={styles.kanban}>
      {projectList.map((project: A) => {
        return (
          <div key={project.id} data-group={project.id}>
            <div className={styles.title}>{project.title}</div>
            <ReactSortable
              list={project.tasks}
              setList={(newState: A, sortable: A) => sortList(newState, sortable)}
              animation={200}
              group={{ name: 'shared', pull: true, put: true }}
              ghostClass="sortable-ghost"
              dragClass="sortable-drag"
              className={styles.reactSortable}
            >
              {project.tasks.map((task: A) => {
                return (
                  <div className={styles.task} key={project.id + '' + task.id}>
                    <div>
                      <Image src="https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645.jpg" />
                      <div>{task.title}</div>
                      <p>{task.description}</p>
                      <div>
                        {task.tags?.length ? (
                          task.tags.map((tag: A, i: A) => {
                            return (
                              <div key={i}>
                                <Tag>{tag}</Tag>
                              </div>
                            );
                          })
                        ) : (
                          <div>
                            <span>No Tags</span>
                          </div>
                        )}
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
