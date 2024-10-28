"use client";
import { use, useState } from "react";
import ProjectHeader from "@/app/projects/ProjectHeader";
import Board from "@/app/projects/BoardView";
import List from "@/app/projects/ListView";
import Timeline from "@/app/projects/TimelineView";
import Table from "@/app/projects/TableView";
import ModalNewTask from "@/components/ModalNewTask";

// type Params = Promise<{ id: string }>; this is for Next.js 15
type Props = {
  params: { id: string };
};

// function Project({ params }: { params: Params; }) { this is for Next.js 15
const Project = ({ params }: Props) => {
  // const { id } = use(params); this is for Next.js 15
  const { id } = params;
  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  return (
    <div>
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        id={id}
      />
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "Board" && (
        <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {activeTab === "List" && (
        <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {activeTab === "Timeline" && (
        <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {activeTab === "Table" && (
        <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
    </div>
  );
}

export default Project;