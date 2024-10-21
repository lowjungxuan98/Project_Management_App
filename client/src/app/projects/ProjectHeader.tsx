import React, { useState } from "react";

type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
};

const ProjectHeader = ({ activeTab, setActiveTab }: Props) => {
  const [isModalNewProject, setIsModalNewProject] = useState(false);
  return (
    <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
      ProjectHeader
    </div>
  );
};

export default ProjectHeader;
