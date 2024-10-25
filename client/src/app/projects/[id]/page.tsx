"use client";
import { use, useState } from "react";
import ProjectHeader from "@/app/projects/ProjectHeader";
import Board from "@/app/projects/BoardView";

type Params = Promise<{ id: string }>;

function Project({ params }: { params: Params; }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  return (
    <div>
      {/*<ModalNewTask*/}
      {/*  isOpen={isModalNewTaskOpen}*/}
      {/*  onClose={() => setIsModalNewTaskOpen(false)}*/}
      {/*  id={id}*/}
      {/*/>*/}
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "Board" && (
        <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {/*{activeTab === "List" && (*/}
      {/*  <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />*/}
      {/*)}*/}
      {/*{activeTab === "Timeline" && (*/}
      {/*  <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />*/}
      {/*)}*/}
      {/*{activeTab === "Table" && (*/}
      {/*  <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />*/}
      {/*)}*/}
    </div>
  );
}

export default Project;