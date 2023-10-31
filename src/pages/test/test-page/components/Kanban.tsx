import { ReactSortable } from 'react-sortablejs';
import { useState } from 'react';

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
  return (
    <div style={{ display: 'flex', gap: 20 }}>
      {projectList.map((project: A) => {
        return (
          <div key={project.id}>
            <ReactSortable
              list={project.tasks}
              setList={(newState: A, sortable: A) => {
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
              }}
              animation={200}
              group={{ name: 'shared', pull: true, put: true }}
              ghostClass="sortable-ghost"
              dragClass="sortable-drag"
              style={{
                width: 250,
                border: '1px solid black',
                padding: 10,
                borderRadius: 8,
                minHeight: 500,
                transition: 'all 0.5s',
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}
            >
              {project.tasks.map((task: A) => {
                return (
                  <div
                    style={{
                      border: '1px solid black',
                      padding: 10,
                      borderRadius: 4
                    }}
                    key={project.id + '' + task.id}
                  >
                    <div className="shadow bg-[#f4f4f4] dark:bg-white-dark/20 p-3 pb-5 rounded-md mb-5 space-y-3 cursor-move">
                      {task.image ? (
                        <img
                          src="/assets/images/carousel1.jpeg"
                          alt="images"
                          className="h-32 w-full object-cover rounded-md"
                        />
                      ) : (
                        ''
                      )}
                      <div className="text-base font-medium">{task.title}</div>
                      <p className="break-all">{task.description}</p>
                      <div className="flex gap-2 items-center flex-wrap">
                        {task.tags?.length ? (
                          task.tags.map((tag: A, i: A) => {
                            return (
                              <div key={i} className="btn px-2 py-1 flex btn-outline-primary">
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="shrink-0"
                                >
                                  <path
                                    d="M4.72848 16.1369C3.18295 14.5914 2.41018 13.8186 2.12264 12.816C1.83509 11.8134 2.08083 10.7485 2.57231 8.61875L2.85574 7.39057C3.26922 5.59881 3.47597 4.70292 4.08944 4.08944C4.70292 3.47597 5.59881 3.26922 7.39057 2.85574L8.61875 2.57231C10.7485 2.08083 11.8134 1.83509 12.816 2.12264C13.8186 2.41018 14.5914 3.18295 16.1369 4.72848L17.9665 6.55812C20.6555 9.24711 22 10.5916 22 12.2623C22 13.933 20.6555 15.2775 17.9665 17.9665C15.2775 20.6555 13.933 22 12.2623 22C10.5916 22 9.24711 20.6555 6.55812 17.9665L4.72848 16.1369Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <circle
                                    opacity="0.5"
                                    cx="8.60699"
                                    cy="8.87891"
                                    r="2"
                                    transform="rotate(-45 8.60699 8.87891)"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <path
                                    opacity="0.5"
                                    d="M11.5417 18.5L18.5208 11.5208"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <span className="ltr:ml-2 rtl:mr-2">{tag}</span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="btn px-2 py-1 flex text-white-dark dark:border-white-dark/50 shadow-none">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="shrink-0"
                            >
                              <path
                                d="M4.72848 16.1369C3.18295 14.5914 2.41018 13.8186 2.12264 12.816C1.83509 11.8134 2.08083 10.7485 2.57231 8.61875L2.85574 7.39057C3.26922 5.59881 3.47597 4.70292 4.08944 4.08944C4.70292 3.47597 5.59881 3.26922 7.39057 2.85574L8.61875 2.57231C10.7485 2.08083 11.8134 1.83509 12.816 2.12264C13.8186 2.41018 14.5914 3.18295 16.1369 4.72848L17.9665 6.55812C20.6555 9.24711 22 10.5916 22 12.2623C22 13.933 20.6555 15.2775 17.9665 17.9665C15.2775 20.6555 13.933 22 12.2623 22C10.5916 22 9.24711 20.6555 6.55812 17.9665L4.72848 16.1369Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                              <circle
                                opacity="0.5"
                                cx="8.60699"
                                cy="8.87891"
                                r="2"
                                transform="rotate(-45 8.60699 8.87891)"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                              <path
                                opacity="0.5"
                                d="M11.5417 18.5L18.5208 11.5208"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                            <span className="ltr:ml-2 rtl:mr-2">No Tags</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-medium flex items-center hover:text-primary">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 ltr:mr-3 rtl:ml-3 shrink-0"
                          >
                            <path
                              d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <path
                              opacity="0.5"
                              d="M7 4V2.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              opacity="0.5"
                              d="M17 4V2.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              opacity="0.5"
                              d="M2 9H22"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span>{task.date}</span>
                        </div>
                        <div className="flex items-center">
                          <button
                            // onClick={() => addEditTask(project.id, task)}
                            type="button"
                            className="hover:text-info"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 ltr:mr-3 rtl:ml-3"
                            >
                              <path
                                opacity="0.5"
                                d="M22 10.5V12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2H13.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              <path
                                d="M17.3009 2.80624L16.652 3.45506L10.6872 9.41993C10.2832 9.82394 10.0812 10.0259 9.90743 10.2487C9.70249 10.5114 9.52679 10.7957 9.38344 11.0965C9.26191 11.3515 9.17157 11.6225 8.99089 12.1646L8.41242 13.9L8.03811 15.0229C7.9492 15.2897 8.01862 15.5837 8.21744 15.7826C8.41626 15.9814 8.71035 16.0508 8.97709 15.9619L10.1 15.5876L11.8354 15.0091C12.3775 14.8284 12.6485 14.7381 12.9035 14.6166C13.2043 14.4732 13.4886 14.2975 13.7513 14.0926C13.9741 13.9188 14.1761 13.7168 14.5801 13.3128L20.5449 7.34795L21.1938 6.69914C22.2687 5.62415 22.2687 3.88124 21.1938 2.80624C20.1188 1.73125 18.3759 1.73125 17.3009 2.80624Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                              <path
                                opacity="0.5"
                                d="M16.6522 3.45508C16.6522 3.45508 16.7333 4.83381 17.9499 6.05034C19.1664 7.26687 20.5451 7.34797 20.5451 7.34797M10.1002 15.5876L8.4126 13.9"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                            </svg>
                          </button>
                          <button
                            // onClick={() => deleteConfirmModal(project.id, task)}
                            type="button"
                            className="hover:text-danger"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                            >
                              <path
                                opacity="0.5"
                                d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              ></path>
                              <path
                                d="M20.5001 6H3.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              ></path>
                              <path
                                d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              ></path>
                              <path
                                opacity="0.5"
                                d="M9.5 11L10 16"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              ></path>
                              <path
                                opacity="0.5"
                                d="M14.5 11L14 16"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              ></path>
                            </svg>
                          </button>
                        </div>
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
