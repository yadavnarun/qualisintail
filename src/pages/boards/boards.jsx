import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./boards.scss";

import { MdOutlineAddCircle, MdRemoveCircle, MdNoteAdd } from "react-icons/md";

const Boards = ({ user }) => {
  let id = user._id;
  const token = user.token;

  let link = useLocation();

  if (link.state) {
    id = link.state.user;
  }

  useEffect(() => {
    if (link.state) {
      document.getElementById("diff-user").classList.add("remove");
    }
  }, [link.state]);

  const [todo, setTodo] = useState({});
  const [editing, setEditing] = useState({});
  const [input, setInput] = useState("");
  const [updateInput, setUpdateInput] = useState("");

  let fromPosition = [];
  let toPosition = [];

  const add = (key) => {
    setEditing({
      [key]: true,
    });
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleUpdateChange = (e, key, index) => {
    setUpdateInput(e.target.innerText);

    if (e.key || e.type === "blur") {
      const newState = todo;
      newState[key][index] = updateInput;
      const updates = {
        id: id,
        key: key,
        remove: index,
        update: updateInput,
        token: token,
      };
      setTodo({ ...newState });
      setUpdateInput("");

      e.target.setAttribute("contentEditable", "false");

      axios
        .patch("/api/todo", updates)
        .catch((err) => console.log(JSON.stringify(err.message)));
    }
  };

  const handleAdd = (key) => {
    if (input === "") {
      alert("type something");
    } else {
      const newState = todo;
      newState[key].push(input);
      setEditing({});

      setTodo({ ...newState });

      const updates = {
        id: id,
        key: key,
        add: input,
        token: token,
      };

      axios
        .patch("/api/todo", updates)
        .catch((err) => console.log(JSON.stringify(err.message)));

      setInput("");
    }
  };

  const handelDelete = (key, index) => {
    const newState = todo;
    const updates = {
      id: id,
      key: key,
      remove: todo[key][index],
      token: token,
    };
    newState[key].splice(index, 1);
    setTodo({ ...newState });

    axios
      .patch("/api/todo", updates)
      .catch((err) => console.log(JSON.stringify(err.message)));
  };

  const handleBoardAdd = () => {
    if (input === "") alert("type something");
    else {
      const updates = {
        id: id,
        add: input,
        token: token,
      };
      axios
        .patch("/api/todo", updates)
        .then((res) => {
          if (res.data.message === "taken") {
            alert("taken");
          } else {
            let newState = todo;
            newState = { ...todo, [input]: [] };
            setEditing({});

            setTodo({ ...newState });

            setInput("");
          }
        })
        .catch((err) => console.log(JSON.stringify(err.message)));
    }
  };

  const handelBoardDelete = (key) => {
    const newState = todo;
    const updates = {
      id: id,
      remove: key,
      token: token,
    };

    axios
      .patch("/api/todo", updates)
      .catch((err) => console.log(JSON.stringify(err.message)));

    delete newState[key];

    setTodo({ ...newState });
  };

  useEffect(() => {
    axios
      .get("/api/todo", { params: { id: id } })
      .then((res) => {
        if (res.data) {
          setTodo(res.data);
        } else {
          console.log("error");
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  const drag = (key, index) => {
    fromPosition = [key, index];
  };

  const drop = (e) => {
    e.preventDefault();

    const newState = todo;

    if (toPosition[0] !== fromPosition[0]) {
      newState[toPosition[0]].splice(
        toPosition[1],
        0,
        newState[fromPosition[0]][fromPosition[1]]
      );
      newState[fromPosition[0]].splice(fromPosition[1], 1);
    } else {
      if (fromPosition[1] === toPosition[1]) {
        return false;
      } else if (fromPosition[1] < toPosition[1]) {
        newState[toPosition[0]].splice(
          toPosition[1],
          0,
          newState[fromPosition[0]][fromPosition[1]]
        );
        newState[fromPosition[0]].splice(fromPosition[1], 1);
      } else if (fromPosition[1] > toPosition[1]) {
        newState[toPosition[0]].splice(
          toPosition[1],
          0,
          newState[fromPosition[0]][fromPosition[1]]
        );
        newState[fromPosition[0]].splice(fromPosition[1] + 1, 1);
      }
    }

    const updates = {
      id: id,
      from: [fromPosition[0], newState[fromPosition[0]]],
      to: [toPosition[0], newState[toPosition[0]]],
      token: token,
    };

    axios
      .patch("/api/todo", updates)
      .catch((err) => console.log(JSON.stringify(err.message)));

    setTodo({ ...newState });
  };

  const allowDrop = (e, key, index) => {
    toPosition = [key, index];
    e.preventDefault();
  };

  return (
    <>
      <div className="boards-page">
        <div className="boards" id="diff-user">
          {Object.keys(todo).map((key) => {
            return (
              <div className="board" key={key}>
                <h3>
                  {key}
                  <span onClick={() => handelBoardDelete(key)}>
                    <MdRemoveCircle />
                  </span>
                </h3>
                <div className="content">
                  {todo[key].map((elem, index) => {
                    return (
                      <>
                        <div
                          key={index}
                          onDragStart={(e) => drag(key, index)}
                          onDrop={(e) => drop(e)}
                          onDragOver={(e) => allowDrop(e, key, index)}
                        >
                          <span
                            onMouseDown={(e) =>
                              e.target.parentElement.setAttribute(
                                "draggable",
                                "true"
                              )
                            }
                          >
                            ::
                          </span>
                          <div
                            suppressContentEditableWarning
                            spellCheck="false"
                            onClick={(e) => {
                              if (!link.state)
                                e.target.setAttribute(
                                  "contentEditable",
                                  "true"
                                );
                            }}
                            onFocus={(e) => handleUpdateChange(e, key, index)}
                            onInput={(e) => handleUpdateChange(e, key, index)}
                            onBlur={(e) => handleUpdateChange(e, key, index)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter")
                                handleUpdateChange(e, key, index);
                            }}
                          >
                            {elem}
                          </div>
                          <span onClick={() => handelDelete(key, index)}>
                            X
                          </span>
                        </div>
                      </>
                    );
                  })}

                  <br />
                  <br />

                  {editing[key] !== undefined ? (
                    <div>
                      <input
                        type="text"
                        placeholder="enter"
                        value={input}
                        onChange={handleChange}
                        autoComplete="off"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleAdd(key);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="addBtn" onClick={() => add(key)}>
                      <MdOutlineAddCircle />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div>
            {editing["addnewBoard"] !== undefined ? (
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="enter"
                  value={input}
                  onChange={handleChange}
                  autocomplete="off"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleBoardAdd();
                  }}
                />
              </div>
            ) : (
              <div className="addBoardBtn" onClick={() => add("addnewBoard")}>
                <MdNoteAdd /> add new board
              </div>
            )}
          </div>
        </div>
      </div>

      <br />
      <br />
      <br />
    </>
  );
};
export default Boards;
